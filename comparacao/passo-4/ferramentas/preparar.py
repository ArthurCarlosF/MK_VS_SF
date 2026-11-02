from pathlib import Path
import json,sys,struct,hashlib,statistics
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-4';sys.path.insert(0,str(P/'engenharia-reversa/ferramentas'))
import decodificar_mk_sprites as mk
import decodificar_sf_sprites as sf
original=(H/'backup-antes/assets.js').read_text(encoding='utf-8');BANK=json.loads(original[original.index('=')+1:].rstrip(';'))
PACK={'schema':4,'characters':{},'limits':['Timing refinement, complete MK rectangles, RNG, combos and crossover reactions require later calibration.','Near clips observed in contact can include native hit pause.','Unmeasured damage is explicitly identified per move.']}
PROOFS=[];UNMAPPED=[]
def readcases(root):
 return {f.parent.name:json.loads(f.read_text(encoding='utf-8')) for f in root.glob('*/trace.json')}
for game,name,maxhp,scale in [('umk3','scorpion',166,1),('ssf2tu','ryu',144,1.25)]:
 root=H/f'execucao-01/original/{game}/rep-1';index=json.loads((root/'index.json').read_text());fps=index['fps'];cases=readcases(root)
 aux={}
 for label in ['contatos-01','tardios-01','vitimas-01','agarrar-01','revisao-sf-01','mp-forward-01']:
  for id,c in readcases(H/f'{label}/original/{game}/rep-1').items():aux[label+'/'+id]=c
 cbank=BANK['characters'][name];known={}
 for clip in cbank['clips'].values():
  for f in clip['frames']:
   if f.get('native_pose_pointer'):known.setdefault(f['native_pose_pointer'],f)
 mk.use_runtime_palette((H/'execucao-01/original/umk3/rep-1/baseline-duplo.state').read_bytes())
 neutral={r['after']['players'][0]['pose'] for id,c in cases.items() if id.startswith('reference_') for r in c['samples']}
 for state in ['idle','forward','backward','crouch','jump','jumpForward','jumpBackward','jumpRunForward']:
  neutral.update(f.get('native_pose_pointer') for f in cbank['clips'].get(state,{}).get('frames',[]))
 def observe_signature(c):
  out=[]
  for r in c['samples']:
   ptr=r['after']['players'][0]['pose']
   if ptr not in neutral and (not out or ptr!=out[-1]):out.append(ptr)
  return tuple(out[:2])
 def hits(c):return [r['sample'] for r in c['samples'] if r['after']['players'][1]['health']<r['before']['players'][1]['health']]
 def damage(c):return c['initial']['players'][1]['health']-c['samples'][-1]['after']['players'][1]['health']
 def sprite(case,sample,port=0):
  obs=sample['after'];pl=obs['players'][port];ptr=pl['pose']
  if ptr in known:return dict(known[ptr])
  try:
   if game=='umk3':
    im,meta=mk.decode_frame(int(ptr,16));ox,oy=meta['origin_in_png'];x=-ox;y=-134-oy;sourceFacing=1
   else:
    visual=sample['render'][port]
    if not visual or not visual['p1_objects']:raise ValueError('No native object records for '+ptr)
    visual=dict(visual)
    if port:
     # Both Ryu players in our bank share one costume. Preserve geometry while
     # remapping the captured second costume to the bank's first palette.
     words=list(visual['object_palette_words']);words[16*16:17*16]=words[16:32];visual['object_palette_words']=words
    im,meta=sf.decode(visual)
    left,top,_,_=meta['hardware_bounds'];x=left-64-(pl['x']-obs['camera']);y=top-16-205+(pl['y']-40)
    sourceFacing=pl['facing']
   key='normal-'+ptr[2:];dest=P/f'arena/assets/{name}/{key}.png';im.save(dest)
   cbank['assets'][key]={'file':f'assets/{name}/{key}.png','width':im.width,'height':im.height,'sha256_pixels':hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest(),'metadata':meta}
   result={'asset':key,'x':x,'y':y,'sourceFacing':sourceFacing,'native_pose_pointer':ptr}
   known[ptr]=result;PROOFS.append({'character':name,'pose':ptr,'case':case['id'],'sample':sample['sample'],'port':port,'method':'native ROM/palette' if game=='umk3' else 'native CPS2 object bank and captured palette'})
   return dict(result)
  except Exception as e:
   UNMAPPED.append({'character':name,'pose':ptr,'case':case['id'],'sample':sample['sample'],'port':port,'error':str(e)})
   return {**cbank['clips']['idle']['frames'][0],'native_pose_pointer':ptr,'unmapped':True}
 # Register actor poses using a later observation inside each pose run when
 # available, reducing the hardware bank latch discrepancy at transitions.
 for case in [*cases.values(),*aux.values()]:
  rows=case['samples']
  for i,r in enumerate(rows):
   for port in [0,1]:
    if port==1 and not ('throw' in case['id'] or case['id']=='stand_lp_near'):continue
    ptr=r['after']['players'][port]['pose']
    if ptr in known:continue
    pick=r
    for follow in rows[i+1:i+3]:
     if follow['after']['players'][port]['pose']!=ptr:break
     if follow.get('render') and (game=='umk3' or follow['render'][port]['p1_objects']):pick=follow
    sprite(case,pick,port)
 allcases=[*cases.values(),*aux.values()];moves={};mapping={};throwmap={}
 def make_move(case,key=None,throw=False):
  id=case['id'];meta=case['meta'];posture=meta.get('posture','stand');air=posture.startswith('air');rows=case['samples'];signature=observe_signature(case)
  poses=[i for i,r in enumerate(rows) if r['after']['players'][0]['pose'] not in neutral]
  end=max(poses)+1 if poses else 1;end=min(end,len(rows))
  if throw:end=min(len(rows),max(end,80))
  matched=[z for z in allcases if z['meta'].get('button')==meta.get('button') and z['meta'].get('posture')==posture and observe_signature(z)==signature]
  contacts=[z for z in matched if hits(z) and not z['meta'].get('guard')]
  damages=sorted(set(damage(z) for z in contacts if damage(z)>0));measured=bool(damages)
  # If early airborne attacks whiff, later landing contacts identify the same
  # normal family independently of the startup phase of the jump.
  if not damages and air:
   candidates=[z for z in allcases if z['meta'].get('button')==meta.get('button') and z['meta'].get('posture', '').startswith('air') and hits(z)]
   damages=sorted(set(damage(z) for z in candidates if damage(z)>0));measured=bool(damages)
  value=statistics.median_low(damages) if damages else (16 if game=='umk3' and air else 12 if air else 8)
  chips=[damage(z) for z in matched if z['meta'].get('guard') in ['high','low'] and damage(z)<value]
  chip=statistics.median_low(chips) if chips else 0
  active=[];timeline=[];hurt=[]
  for i,r in enumerate(rows[:end]):
   boxes=r['after']['players'][0]['boxes'];attack=[{'x':-(q['x']+q['w'])*scale,'y':q['y']*scale,'w':q['w']*scale,'h':q['h']*scale} for q in boxes if q['kind']=='attack']
   timeline.append(attack);hurt.append([{'x':-(q['x']+q['w'])*scale,'y':q['y']*scale,'w':q['w']*scale,'h':q['h']*scale} for q in boxes if q['kind']=='hurt'])
   if attack:active.append(i)
  contact_indices=[j for z in contacts for j in hits(z)]
  if game=='ssf2tu' and active:first,last=min(active),max(active)
  elif contact_indices:first,last=min(contact_indices),min(end-1,max(contact_indices))
  else:first=max(2,min(end-2,end//3));last=min(end-1,first+3)
  label=id.replace('stand_','').replace('_',' ')
  level='overhead' if air else 'low' if posture=='crouch' and meta.get('button') in ([8,9] if game=='umk3' else [9,10,11]) or id.startswith('back_lk') else 'mid'
  low=[z for z in matched if z['meta'].get('guard')=='low'];high=[z for z in matched if z['meta'].get('guard')=='high']
  if low and high and any(damage(z)>=value for z in high) and all(damage(z)<value for z in low):level='low'
  key=key or 'normal_'+id
  clip=key;cbank['clips'][clip]={'frames':[sprite(case,r,0) for r in rows[:end]],'loop':False,'steps':[0],'sampleAligned':True,'source_case':id,'nativePoseTimeline':[r['after']['players'][0]['pose'] for r in rows[:end]]}
  box={'x':10,'y':20 if air else 18 if posture=='crouch' else 50,'w':65,'h':40 if air else 45 if posture=='crouch' else 60}
  if id.startswith('back_lk'):box={'x':5,'y':0,'w':90,'h':32}
  if game=='umk3' and id=='crouch_hp':box={'x':10,'y':20,'w':62,'h':110}
  m={'clip':clip,'label':label,'kind':'throw' if throw else 'strike','level':'throw' if throw else level,'air':air,'damage':value/maxhp*100,'chip':chip/maxhp*100,'startup':first/fps,'active':max(1,last-first+1)/fps,'recovery':max(0,end-last-1)/fps,'box':box,'hitstun':.32,'blockstun':.16,'push':90 if not air else 110,'hitstop':0,
   'sampleRate':fps,'sourceSamples':end,'nativePoseTimeline':[r['after']['players'][0]['pose'] for r in rows[:end]],'nativeDamageObserved':damages,'damageMeasured':measured,'source_case':id,'source_initial_gap':abs(case['initial']['players'][1]['x']-case['initial']['players'][0]['x'])*scale,
   'timingEvidence':'Native source-video observations, including any contact pause; detailed phase/cancel calibration remains step 5/6.','geometryEvidence':'Native SF rectangles' if game=='ssf2tu' else 'MK rectangle is provisional; contact timing/damage observed.'}
  if game=='ssf2tu' and not throw:m.update(attackTimeline=timeline,calibration={'hurtTimeline':hurt,'sampleRate':fps})
  if game=='umk3' and (id=='crouch_hp' or id.startswith('back_')):m['knockdown']=True
  if throw:
   # Victim-specific visuals are a second clip, never an attacker sprite reused
   # for the other universe. Position curves are relative to each source origin.
   victimClip='victim_'+key;cbank['clips'][victimClip]={'frames':[sprite(case,r,1) for r in rows[:end]],'loop':False,'steps':[0],'sampleAligned':True,'source_case':id}
   initial=case['initial']['players'];sign=-1 if game=='umk3' else 1
   curve=[]
   for r in rows[:end]:
    pl=r['after']['players'];curve.append({'ownerX':(pl[0]['x']-initial[0]['x'])*scale,'ownerY':max(0,sign*(pl[0]['y']-initial[0]['y'])*scale),'targetX':(pl[1]['x']-initial[0]['x'])*scale,'targetY':max(0,sign*(pl[1]['y']-initial[1]['y'])*scale),'ownerFacing':pl[0]['facing'],'targetFacing':pl[1]['facing']})
   h=hits(case);damageSample=h[0] if h else min(12,end-1)
   m['grapple']={'timeline':curve,'damageSample':damageSample,'grabSample':2,'victimClip':victimClip,'range':(64 if game=='umk3' else 48*scale),'escapeByBack':game=='umk3'};m['knockdown']=True;m['damage']=damage(case)/maxhp*100;m['nativeDamageObserved']=[damage(case)];m['damageMeasured']=bool(h);m['push']=0
  moves[key]=m;return key
 primaries=[c for id,c in cases.items() if id.startswith('stand_') or (id.startswith('crouch_') and '_contact_' not in id) or id.startswith('airVertical_') or id.startswith('airForward_') or id.startswith('back_')]
 for case in primaries:
  case=aux.get('mp-forward-01/'+case['id'],aux.get('revisao-sf-01/'+case['id'],case))
  isthrow=game=='umk3' and case['id']=='stand_lp_near';mapping[case['id']]=make_move(case,throw=isthrow)
 if game=='umk3':
  # MK has a forward/neutral LP throw; back+LP explicitly remains a punch.
  throwmap['default']=mapping['stand_lp_near']
 else:
  for id,case in cases.items():
   if not id.startswith('throw_'):continue
   # Re-capture contains the victim's actual palette-16 sprite records.
   case=aux.get('vitimas-01/'+id,case);throwmap[id]=make_move(case,throw=True)
  throwmap['default']=throwmap['throw_mp_1']
 # Range brackets are observed per button; choose the highest gap producing
 # the near signature, and preserve the first observed far gap for auditing.
 buttons={'punch':'lp','punch2':'hp','kick':'hk','kick2':'lk'} if game=='umk3' else {'punch':'lp','punch2':'mp','punch3':'hp','kick':'lk','kick2':'mk','kick3':'hk'}
 if game=='ssf2tu':
  rom=sf.DATA
  def parameters(case):
   return {rom[int(b['address'],16)+4:int(b['address'],16)+16] for r in case['samples'] for b in r['after']['players'][0]['boxes'] if b['kind']=='attack'}
  far=moves['normal_stand_hk_far'];near=moves['normal_stand_hk_near']
  farParameters=parameters(cases['stand_hk_far']);equivalent=[]
  for c in allcases:
   if c['meta'].get('guard'):continue
   for r in c['samples']:
    loss=r['before']['players'][1]['health']-r['after']['players'][1]['health']
    if loss>0 and any(rom[int(b['address'],16)+4:int(b['address'],16)+16] in farParameters for b in r['after']['players'][0]['boxes'] if b['kind']=='attack'):equivalent.append(loss)
  if not far['damageMeasured'] and equivalent:
   far['damage']=statistics.median_low(equivalent)/maxhp*100;far['nativeDamageInferred']=sorted(set(equivalent));far['damageEvidence']='Inferred from observed hits with identical ROM attack-parameter bytes +4..+15; direct far HK contact not isolated.'
 controls={};brackets={}
 for button,label in buttons.items():
  near=cases['stand_'+label+'_near'];far=cases['stand_'+label+'_far'];nearSig=observe_signature(near)
  nearDistances=[];farDistances=[]
  for z in cases.values():
   if z['meta'].get('posture')=='stand' and z['meta'].get('button')==near['meta']['button'] and not z['meta'].get('direction'):
    gap=abs(z['initial']['players'][1]['x']-z['initial']['players'][0]['x'])*scale
    if observe_signature(z)==nearSig:nearDistances.append(gap)
    else:farDistances.append(gap)
  threshold=max(nearDistances) if nearDistances else moves[mapping['stand_'+label+'_near']]['source_initial_gap']
  if label=='lp' and game=='umk3':threshold=64
  brackets[label]={'near_observed_max':threshold,'far_observed_min':min(farDistances) if farDistances else None}
  controls[button]={'label':label.upper(),'standing':{'far':mapping['stand_'+label+'_far'],'near':mapping['stand_'+label+'_near'],'nearRange':threshold},'crouch':mapping['crouch_'+label],'airVertical':mapping['airVertical_'+label],'airDirectional':mapping['airForward_'+label]}
  if game=='umk3' and label in ['hk','lk']:controls[button]['back']=mapping['back_'+label]
  if game=='ssf2tu' and label in ['mp','hp','mk','hk']:controls[button]['throws']={'forward':throwmap['throw_'+label+'_1'],'backward':throwmap['throw_'+label+'_-1'],'range':48*scale}
 # Keep default controls and their already-regressed rapid-punch state machine.
 aliases={'normal_stand_lp_far':'punch','normal_crouch_lp':'crouchPunch','normal_airVertical_lp':'airPunch'}
 aliases.update({'normal_stand_hk_far':'kick','normal_crouch_hk':'crouchKick','normal_airVertical_hk':'airKick'} if game=='umk3' else {'normal_stand_lk_far':'kick','normal_crouch_lk':'crouchKick','normal_airVertical_lk':'airKick'})
 for source,target in aliases.items():
  moves[target]={**moves[source],'clip':target};cbank['clips'][target]=cbank['clips'][source] if target.startswith('air') else cbank['clips'][target]
  for control in controls.values():
   for k in ['crouch','airVertical','airDirectional','back']:
    if control.get(k)==source:control[k]=target
   for k in ['near','far']:
    if control['standing'].get(k)==source:control['standing'][k]=target
 victimDefault=moves[throwmap['default']]['grapple']['victimClip']
 PACK['characters'][name]={'moves':moves,'controls':controls,'rangeBrackets':brackets,'defaultThrow':throwmap['default'],'defaultVictimClip':victimDefault,'nativeButtons':buttons,'aliases':aliases}
 print(name,'moves',len(moves),'clips',len(cbank['clips']),'assets',len(cbank['assets']),'unmeasured_damage',[k for k,m in moves.items() if not m['damageMeasured']],flush=True)
# Keep the existing first-pass calibrations separate from the expanded repertoire.
(P/'arena/assets.js').write_text('window.ARENA_ASSETS='+json.dumps(BANK,ensure_ascii=False)+';',encoding='utf-8')
cal=(H/'backup-antes/calibration.js').read_text(encoding='utf-8');(P/'arena/calibration.js').write_text(cal+'\nwindow.NORMAL_REPERTOIRE='+json.dumps(PACK,ensure_ascii=False)+';\n',encoding='utf-8')
unresolved=[{'character':name,'clip':id,'frame':i,'pose':f.get('native_pose_pointer')} for name,b in BANK['characters'].items() for id,c in b['clips'].items() for i,f in enumerate(c['frames']) if f.get('unmapped')]
(H/'repertorio.json').write_text(json.dumps(PACK,indent=2,ensure_ascii=False),encoding='utf-8');(H/'recursos.json').write_text(json.dumps({'new':PROOFS,'failed_observations':UNMAPPED,'unmapped_used':unresolved},indent=2),encoding='utf-8')
print('UNMAPPED USED',len(unresolved),flush=True)
