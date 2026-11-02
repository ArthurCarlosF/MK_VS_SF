"""Derive video-sampled phases from retained native execution observations."""
from pathlib import Path
import json,statistics,collections
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-5';OLD=P/'comparacao/passo-4'
text=(H/'backup-antes/assets.js').read_text(encoding='utf-8');BANK=json.loads(text.split('=',1)[1].rstrip(';'))
PACK=json.loads((OLD/'repertorio.json').read_text(encoding='utf-8'))
RESULT={'schema':5,'characters':{},'limits':['Video-sampled clock; complete internal SF Turbo scheduler remains pending.','MK near-variant late active boundaries are not isolated by the entry fixture.','Complete MK collision rectangles, hitstun, push and cancel trees remain separate work.']}
AUDIT=[]
def load(root):
 out=[]
 for f in root.glob('*/trace.json'):
  c=json.loads(f.read_text(encoding='utf-8'));c['_file']=str(f.relative_to(P));out.append(c)
 return out
def hp_hits(c):return [r for r in c['samples'] if r['after']['players'][1]['health']<r['before']['players'][1]['health']]
def ranges(indices):
 out=[]
 for i in sorted(set(indices)):
  if out and out[-1][1]==i:out[-1][1]=i+1
  else:out.append([i,i+1])
 return out
def freeze(r,side='before',port=0):
 raw=r[side]['players'][port].get('runtimeBytes');return bytes.fromhex(raw)[0x47] if raw else 0
for game,id in [('umk3','scorpion'),('ssf2tu','ryu')]:
 bank=BANK['characters'][id];pack=PACK['characters'][id]
 main=load(H/f'execucao-01/original/{game}/rep-1');byid={c['id']:c for c in main}
 extra=[]
 for root in ['piloto-01','controle-01','ar-01','ar-tarde-01','ar-guarda-01','ar-hit-01','hk-whiff-01','limites-01','baixo-01']:
  extra+=load(H/f'{root}/original/{game}/rep-1')
 allcases=main+extra
 if game=='umk3':
  for root in ['execucao-01','contatos-01','tardios-01']:
   extra+=load(OLD/f'{root}/original/{game}/rep-1')
  allcases=main+extra
 neutral=set()
 for ref in load(OLD/f'execucao-01/original/{game}/rep-1'):
  if ref['id'].startswith('reference_'):neutral.update(r['after']['players'][0]['pose'] for r in ref['samples'])
 for name in ['idle','forward','backward','crouch','jump','jumpForward','jumpBackward','jumpRunForward','run']:
  neutral.update(f.get('native_pose_pointer') for f in bank['clips'].get(name,{}).get('frames',[]))
 known={f['native_pose_pointer']:f for clip in bank['clips'].values() for f in clip['frames'] if f.get('native_pose_pointer')}
 def signature(c):
  seq=[]
  for r in c['samples']:
   ptr=r['after']['players'][0]['pose']
   if ptr not in neutral and (not seq or ptr!=seq[-1]):seq.append(ptr)
  return tuple(seq[:2])
 def same(c,base,allowSharedAir=False):
  return c['meta'].get('posture')==base['meta'].get('posture') and (allowSharedAir or c['meta'].get('button')==base['meta'].get('button')) and signature(c)==signature(base)
 def end_of(c):
  rows=c['samples'];posture=c['meta'].get('posture','stand')
  if game=='ssf2tu':
   attack=[r['sample'] for r in rows if (r['after']['players'][0]['state'][1]==10 if not posture.startswith('air') else r['after']['players'][0]['state'][1:3]==[4,6])]
  else:attack=[r['sample'] for r in rows if r['after']['players'][0]['pose'] not in neutral]
  assert attack,c['id'];return max(attack)+1
 def freeze_runs(c):
  return ranges(r['sample'] for r in c['samples'] if freeze(r)>0)
 phases={};fps=bank['fps']
 for name,old in pack['moves'].items():
  if name in pack['aliases'].values():continue
  base=byid[old['source_case']]
  if old.get('grapple'):
   phases[name]={'timing':{'kind':'grapple','source':base['_file'],'durationSamples':old['sourceSamples'],'damageSample':old['grapple']['damageSample'],'grabSample':old['grapple']['grabSample'],'confidence':'Native two-actor trajectory; grab lock subframe not reconstructed.'}}
   continue
  air=old.get('air',False);matched=[c for c in allcases if same(c,base)]
  # Never treat an impact pause or an on-contact aerial fall as whiff recovery.
  source=base
  if game=='umk3' and air and hp_hits(base):
   whiffs=[c for c in allcases if same(c,base,True) and not hp_hits(c)]
   assert whiffs,('No isolated airborne whiff',name)
   source=min(whiffs,key=lambda c:end_of(c))
  rawEnd=end_of(source);raw=source['samples'][:rawEnd]
  kept=[r for r in raw if game!='ssf2tu' or not freeze(r)]
  if game=='umk3':
   for r in kept:
    ptr=r['after']['players'][0]['pose']
    if ptr not in known:
     import sys,hashlib
     sys.path.insert(0,str(P/'engenharia-reversa/ferramentas'))
     import decodificar_mk_sprites as mk
     mk.use_runtime_palette((H/f'execucao-01/original/{game}/rep-1/baseline-duplo.state').read_bytes())
     im,meta=mk.decode_frame(int(ptr,16));key='fase-'+ptr[2:];im.save(P/f'arena/assets/{id}/{key}.png');ox,oy=meta['origin_in_png']
     bank['assets'][key]={'file':f'assets/{id}/{key}.png','width':im.width,'height':im.height,'sha256_pixels':hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest(),'metadata':meta}
     known[ptr]={'asset':key,'x':-ox,'y':-134-oy,'sourceFacing':1,'native_pose_pointer':ptr}
  assert kept and all(r['after']['players'][0]['pose'] in known for r in kept),(name,source['_file'],[r['after']['players'][0]['pose'] for r in kept if r['after']['players'][0]['pose'] not in known])
  clip=old['clip'];frames=[dict(known[r['after']['players'][0]['pose']]) for r in kept]
  bank['clips'][clip]={'frames':frames,'loop':False,'sampleAligned':True,'steps':[0],'source_case':source['id'],'phaseRevision':5}
  sf_attacks=[];hurt=[]
  if game=='ssf2tu':
   for r in kept:
    boxes=r['after']['players'][0]['boxes'];scale=1.25
    def convert(b):return {'x':-(b['x']+b['w'])*scale,'y':b['y']*scale,'w':b['w']*scale,'h':b['h']*scale}
    sf_attacks.append([convert(b) for b in boxes if b['kind']=='attack']);hurt.append([convert(b) for b in boxes if b['kind']=='hurt'])
   indices=[i for i,b in enumerate(sf_attacks) if b];evidence='Native CPS2 attack rectangles on every retained video sample.'
  else:
   contacts=[r['sample'] for c in matched for r in hp_hits(c)]
   if not contacts:contacts=[round(old['startup']*fps)]
   first=min(contacts)
   if air:
    # The held air-strike pose stays active until the native attack/landing
    # transition. Contact motion is a separate branch, not extra whiff frames.
    heldPose=kept[first]['after']['players'][0]['pose'];stop=first+1
    while stop<len(kept) and kept[stop]['after']['players'][0]['pose']==heldPose:stop+=1
    indices=list(range(first,stop));evidence='Observed first contact; native held air-strike pose until its recovery/landing transition. Late contacts separately retained; no recovered MK rectangle.'
   else:
    indices=list(range(first,max(contacts)+1));evidence='Native contact samples, including delayed target entry. Latest boundary is empirically bounded, not recovered MK collision code.'
  assert indices,(name,source['id']);first,last=min(indices),max(indices);end=len(kept)
  assert last<end,(name,last,end)
  patch={'startup':first/fps,'active':(last-first+1)/fps,'recovery':(end-last-1)/fps,'sourceSamples':end,'sampleRate':fps,'activeRanges':ranges(indices),'nativePoseTimeline':[r['after']['players'][0]['pose'] for r in kept],
   'timing':{'source':source['_file'],'sourceRawSamples':rawEnd,'keptSourceSamples':[r['sample'] for r in kept],'removedPauseSamples':[r['sample'] for r in raw if r not in kept],'startupSamples':first,'activeRanges':ranges(indices),'recoverySamples':end-last-1,'durationSamples':end,'activeEvidence':evidence}}
  if game=='ssf2tu':
   pools=[c for c in allcases if c['meta'].get('button')==base['meta'].get('button')]
   lengths=[b-a for c in pools for a,b in freeze_runs(c)];guarded=[b-a for c in pools if c['meta'].get('guard') for a,b in freeze_runs(c)]
   assert lengths,('No measured native pause for strength',name)
   pause=statistics.median_low(lengths);block=statistics.median_low(guarded) if guarded else pause
   patch.update(attackTimeline=sf_attacks,calibration={'hurtTimeline':hurt,'sampleRate':fps},hitstop=pause/fps,blockHitstop=block/fps)
   patch['timing'].update(nativePauseOffset='actor + 0x47 (0xff8495 / 0xff8895)',observedFreezeVideoSamples=sorted(set(lengths)),impactPauseSamples=pause,guardPauseSamples=block)
  else:
   patch.update(hitstop=0,blockHitstop=0)
   if air:
    # Across retained successful air strikes the attacker holds x/y for eight
    # native samples, then drops with reset vertical velocity and +.75 gravity.
    patch.update(holdContactUntilLanding=True,contactResponse={'ownerPauseSamples':8,'fallGravityPerSample':.875 if base['meta']['posture']=='airVertical' else .75,'horizontalSpeedPerSample':0,'onBlock':True})
  phases[name]=patch
  AUDIT.append({'character':id,'move':name,'oldSamples':[round(old[k]*fps) for k in ['startup','active','recovery']],'newSamples':[first,last-first+1,end-last-1],'source':source['_file']})
 # Aliases are the same native variants; preserve command/cancel/repeat policy.
 for source,target in pack['aliases'].items():
  phases[target]=json.loads(json.dumps(phases[source]));sourceClip=pack['moves'][source]['clip'];bank['clips'][target]=json.loads(json.dumps(bank['clips'][sourceClip]))
 if game=='umk3':
  for name,folder,case,start in [('punchFollow','alternado-01','alternate_lp__late23',10),('punchReturn','retorno-01','return_lp__late34',20)]:
   c=load(H/f'{folder}/original/umk3/rep-1');c=next(c for c in c if c['id']==case)
   length=len(bank['clips'][name]['frames']);indices=list(range(start,start+length))
   assert [f['native_pose_pointer'] for f in bank['clips'][name]['frames']]==[c['samples'][i]['after']['players'][0]['pose'] for i in indices],name
   phases[name]={'startup':11/fps,'active':6/fps,'recovery':(length-17)/fps,'sourceSamples':length,'sampleRate':fps,'activeRanges':[[11,17]],'hitstop':0,'blockHitstop':0,
    'nativePoseTimeline':[c['samples'][i]['after']['players'][0]['pose'] for i in indices],
    'timing':{'source':c['_file'],'sourceRawSamples':start+length,'keptSourceSamples':indices,'removedPauseSamples':[],'startupSamples':11,'activeRanges':[[11,17]],'recoverySamples':length-17,'durationSamples':length,'activeEvidence':'Delayed entry confirms last active sample 26/36 in the native alternate-arm sequence.'}}
 RESULT['characters'][id]={'moves':phases}
(P/'arena/assets.js').write_text('window.ARENA_ASSETS='+json.dumps(BANK,ensure_ascii=False)+';',encoding='utf-8')
cal=(H/'backup-antes/calibration.js').read_text(encoding='utf-8');(P/'arena/calibration.js').write_text(cal+'\nwindow.PHASE_CALIBRATION='+json.dumps(RESULT,ensure_ascii=False)+';\n',encoding='utf-8')
(H/'fases.json').write_text(json.dumps(RESULT,indent=2,ensure_ascii=False),encoding='utf-8');(H/'mudancas.json').write_text(json.dumps(AUDIT,indent=2),encoding='utf-8')
print(json.dumps({'status':'PREPARED','normal_records':len(AUDIT),'changes':sum(a['oldSamples']!=a['newSamples'] for a in AUDIT)}))
