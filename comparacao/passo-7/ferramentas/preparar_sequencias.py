"""Native punch state graph, contact combinations and measured special cancels."""
from pathlib import Path
import json,copy,runpy,collections,sys,hashlib
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-7'
ctx=runpy.run_path(str(H/'ferramentas/preparar_soco_alto.py'))
B=ctx['bank'];D=ctx['defs']['characters'];OUT=ctx['out'];mkframe=ctx['frame'];fps=B['characters']['scorpion']['fps'];M=OUT['characters']['scorpion']['moves']
def read(f):return json.loads(f.read_text(encoding='utf-8-sig'))
def source(root,name,game='umk3'):
 f=H/f'{root}/original/{game}/rep-1/{name}/trace.json';c=read(f);c['_file']=str(f.relative_to(P));return c
def frame(ptr):return mkframe(ptr)
def compress(seq):
 out=[]
 for p in seq:
  if not out or out[-1]!=p:out.append(p)
 return out

# All four high/low transitions exist for both alternating arms. A mixed arm
# uses its own native transitional poses, not just the final extension sprite.
state={('L','back'):'punchFollow',('L','front'):'punchReturn',('H','back'):'highPunchFollow',('H','front'):'highPunchReturn'}
clips={}
for old in 'LH':
 for new in 'LH':
  for arm,n in [('back',2),('front',3)]:
   seq=(old+new) if n==2 else ('L'+old+new)
   c=source('mistura-mk','mix_'+seq);start=10*(n-1)
   passive={hex(v) for v in range(0xff936770,0xff936a71,0x60)}
   end=next(r['sample'] for r in c['samples'] if r['sample']>start+8 and r['after']['players'][0]['pose'] in passive)
   name=state[(new,arm)] if old==new else f'mix{old}{new}{arm.title()}'
   clips[(old,new,arm)]=name
   # Keep the independently verified low-only clips/phase calibration intact.
   if old==new=='L':continue
   frames=[frame(r['after']['players'][0]['pose']) for r in c['samples'][start:end]]
   B['characters']['scorpion']['clips'][name]={'frames':frames,'loop':False,'sampleAligned':True,'sequenceRevision':7}
   base=copy.deepcopy(D['scorpion']['moves']['punch' if new=='L' else 'normal_stand_hp_far'])
   base.update(clip=name,startup=11/fps,active=6/fps,recovery=(end-start-17)/fps,sourceSamples=end-start,activeRanges=[[11,17]],nativePoseTimeline=[f['native_pose_pointer'] for f in frames],sequenceEvidence={'source':c['_file'],'samples':[start,end]},punchHeight=new,punchArm=arm)
   base['timing']={**base.get('timing',{}),'source':c['_file'],'keptSourceSamples':list(range(start,end)),'durationSamples':end-start}
   M[name]=base
allNames=['punch','normal_stand_hp_far',*set(clips.values())]
for name in allNames:
 old='L' if name in ['punch','punchFollow','punchReturn'] else 'H' if name in ['normal_stand_hp_far','highPunchFollow','highPunchReturn'] else name[4]
 arm='front' if name in ['punch','normal_stand_hp_far'] or name.endswith('Front') or name.endswith('Return') else 'back'
 nxt='back' if arm=='front' else 'front'
 patch=M.setdefault(name,{})
 patch['repeat']={'mode':'alternate','preserveStrike':True,'gateFrames':10,'lastFrame':14,'lateFrame':19 if name in ['punch','normal_stand_hp_far'] else 1e9,'initial':name,'initialByButton':{'punch':'punch','punch2':'normal_stand_hp_far'},'next':clips[(old,old,nxt)],'buttons':['punch','punch2'],'family':allNames,'nextByButton':{'punch':clips[(old,'L',nxt)],'punch2':clips[(old,'H',nxt)]}}

passive={}
for game,id in [('umk3','scorpion'),('ssf2tu','ryu')]:
 ps=set()
 for ref in ['reference_stand','reference_crouch']:
  ps.update(r['after']['players'][0]['pose'] for r in read(P/f'comparacao/passo-4/execucao-01/original/{game}/rep-1/{ref}/trace.json')['samples'])
 for name in ['idle','forward','backward','crouch']:
  ps.update(f.get('native_pose_pointer') for f in B['characters'][id]['clips'].get(name,{}).get('frames',[]))
 passive[id]=ps
getup={hex(v) for v in [0xff93e230,0xff93e270,0xff93e2b0,0xff93e2f0,0xff93e350,0xff93e3b0]}
def hits(c):return [r['sample'] for r in c['samples'] if r['after']['players'][1]['health']<r['before']['players'][1]['health']]
def reaction(c,at,id='scorpion',guarded=False):
 rows=c['samples'];sf=id=='ryu';rate=B['characters'][id]['fps'];scale=1.25 if sf else 1;game='ssf2tu' if sf else 'umk3'
 # Only terminal-prefix witnesses are used; future contacts must not be baked
 # into one reaction when the player may choose to stop the sequence.
 assert not any(i>at+(1 if sf else 0) for i in hits(c)),c['id']
 end=next((i for i in range(at+2,len(rows)) if (rows[i]['after']['players'][1]['state'][1]!=14 if sf else rows[i]['after']['players'][1]['pose'] in passive[id])),None)
 if guarded:end=at+22
 assert end and end<len(rows)-1,c['id']
 a0,q0=rows[at]['after']['players'];direction=1 if q0['x']>=a0['x'] else -1;floor=c['initial']['players'][1]['y'];sign=1 if sf else -1
 heights=[max(0,sign*(r['after']['players'][1]['y']-floor)*scale) for r in rows[at:end]]
 up=next((i for i,r in enumerate(rows[at:end]) if r['after']['players'][1]['pose'] in getup),None);kd=max(heights)>5 or up is not None
 peak=max(range(len(heights)),key=lambda i:heights[i]);land=next((i for i in range(peak+1,len(heights)-3) if max(heights[i:i+4])-min(heights[i:i+4])<.01),up or len(heights)) if kd else len(heights)
 samples=[];ages=collections.defaultdict(int);frames=[];known={f.get('native_pose_pointer'):f for cl in B['characters'][id]['clips'].values() for f in cl['frames'] if f.get('native_pose_pointer')}
 for i,r in enumerate(rows[at:end]):
  a,q=r['after']['players'];ptr=q['pose'];frames.append(copy.deepcopy(known[ptr]) if sf else frame(ptr))
  phase='guard' if guarded else 'getup' if up is not None and i>=up else 'down' if kd and i>=land else 'air' if heights[i]>.01 else 'hit'
  paused=sf and bytes.fromhex(r['before']['players'][1]['runtimeBytes'])[0x47]>0
  if not paused:ages[phase]+=1
  hurt=[{'x':-(b['x']+b['w'])*scale,'y':b['y']*scale,'w':b['w']*scale,'h':b['h']*scale} for b in q['boxes'] if b['kind']=='hurt']
  samples.append({'x':(q['x']-q0['x'])*direction*scale,'y':heights[i],'ownerX':(a['x']-a0['x'])*direction*scale if guarded else 0,'frame':i,'facing':q['facing']*direction,'phase':phase,'phaseAge':max(0,ages[phase]-1),'paused':bool(paused),'vulnerable':bool(hurt) if sf else phase not in ['down','getup'],'bodyPush':not kd,'hurt':hurt})
 phases={}
 for phase in ages:
  indices=[i for i,s in enumerate(samples) if s['phase']==phase];active=[i for i in indices if not samples[i]['paused']]
  phases[phase]={'start':indices[0],'end':indices[-1]+1,'active':active or indices,'activeCount':ages[phase]}
 pid=id+'_chain_'+c['id'];clip='react_'+pid;B['characters'][id]['clips'][clip]={'frames':frames,'loop':False,'sampleAligned':True,'sequenceRevision':7}
 damage=sum(r['before']['players'][1]['health']-r['after']['players'][1]['health'] for r in rows[at:at+(2 if sf else 1)])
 ownerPause=0;seen=False
 if sf:
  for r in rows[at:end]:
   paused=bytes.fromhex(r['before']['players'][0]['runtimeBytes'])[0x47]>0
   if paused:seen=True;ownerPause+=1
   elif seen:break
 pf={'id':pid,'character':id,'sourceGame':game,'sourceCase':c['id'],'source':c['_file'],'startSample':at,'endSample':end,'fullEndSample':end,'fps':rate,'clip':clip,'family':'launch' if kd else 'standingHit','strength':'medium','guarded':guarded,'knockdown':kd,'controlSamples':end-at,'duration':(end-at)/rate,'samples':samples,'phases':phases,'initialHeight':heights[0],'landSample':land,'getupSample':up,'ownerPauseSeconds':ownerPause/rate,'damageObserved':damage,'damagePercent':damage/(144 if sf else 166)*100,'earlyInputSamples':0,'guardLeadSamples':0,'corner':False,'stageElevationRemoved':0,'evidence':'Terminal native prefix; MK vulnerability is conservative; guard timing imported separately.'}
 OUT['profiles'][pid]=pf;return pid

def combo(name,c,start,base,hitIndex,guardCase=None):
 rows=c['samples'];end=next(i for i in range(start+8,len(rows)) if rows[i]['after']['players'][0]['pose'] in passive['scorpion']);frames=[frame(r['after']['players'][0]['pose']) for r in rows[start:end]]
 B['characters']['scorpion']['clips'][name]={'frames':frames,'loop':False,'sampleAligned':True,'sequenceRevision':7}
 m=copy.deepcopy(D['scorpion']['moves'][base]);at=hits(c)[hitIndex];damage=rows[at]['before']['players'][1]['health']-rows[at]['after']['players'][1]['health'];root=rows[start]['after']['players'][0]['x'];face=rows[start]['after']['players'][0]['facing']
 pid=reaction(c,at);refs={**m['reactionProfiles'],'hit':pid,'duck':pid};profile=OUT['profiles'][pid]
 chip=1
 if guardCase:
  gh=hits(guardCase);j=gh[hitIndex];chip=guardCase['samples'][j]['before']['players'][1]['health']-guardCase['samples'][j]['after']['players'][1]['health']
  refs['block']=reaction(guardCase,j,guarded=True);refs['blockLow']=refs['block']
 m.update(clip=name,repeat=None,startup=(at-start)/fps,active=1/fps,recovery=(end-at-1)/fps,sourceSamples=end-start,activeRanges=[[at-start,at-start+1]],sampleRate=fps,damage=damage/166*100,chip=chip/166*100,nativeChip=chip/166*100,knockdown=profile['knockdown'],reactionProfiles=refs,nativePoseTimeline=[f['native_pose_pointer'] for f in frames],rootMotion=[(r['after']['players'][0]['x']-root)*face for r in rows[start:end]],sequenceEvidence={'source':c['_file'],'samples':[start,end],'nativeDamage':damage,'guardDamage':chip},chainEdges=[],specialCancels={},calibration=None)
 m['timing']={'kind':'native-sequence','source':c['_file'],'keptSourceSamples':list(range(start,end)),'durationSamples':end-start}
 m['contactSpacing']={'distance':abs(rows[at]['after']['players'][1]['x']-rows[at]['after']['players'][0]['x']),'maximumEntry':140,'sample':at-start}
 M[name]=m;return m

elbow=source('confirmacao-mk','confirm_elbows_False');elbowG=source('confirmacao-mk','confirm_elbows_True')
combo('elbowFollow',elbow,7,'normal_stand_hp_near',1,elbowG)
third=source('confirmacao-mk','confirm_triple_False');thirdG=source('confirmacao-mk','confirm_triple_True')
combo('comboFrontKick',third,19,'normal_stand_lk_far',2,thirdG)
last=source('confirmacao-mk','confirm_four_False');lastG=source('confirmacao-mk','confirm_four_True')
combo('comboBackKick',last,29,'normal_back_lk',3,lastG)
M['comboBackKick']['level']='mid'
knee=source('confirmacao-mk','confirm_knees_False');kneeG=source('confirmacao-mk','confirm_knees_True')
combo('kneeFollow',knee,7,'normal_stand_lk_near',1,kneeG)
def edge(button,to,lo,hi,gate,direction=None):return {'button':button,'to':to,'window':[lo,hi],'gate':gate,'contact':'any',**({'direction':direction} if direction is not None else {})}
c=source('hp-01','hp_near_guard_None');guardId=reaction(c,hits(c)[0],guarded=True)
M.setdefault('normal_stand_hp_near',{})['reactionProfiles']={**D['scorpion']['moves']['normal_stand_hp_near']['reactionProfiles'],'block':guardId,'blockLow':guardId}
M.setdefault('normal_stand_hp_near',{})['chainEdges']=[edge('punch2','elbowFollow',3,15,7)]
M['elbowFollow']['chainEdges']=[edge('kick2','comboFrontKick',7,19,12)]
M['comboFrontKick']['chainEdges']=[edge('kick2','comboBackKick',10,16,10,-1)]
for name in ['normal_stand_hk_near','normal_stand_lk_near']:M.setdefault(name,{})['chainEdges']=[edge('kick2','kneeFollow',2,15,7)]
# Native selection changes between 73.75 (elbow) and 77 (straight HP).
OUT['characters']['scorpion']['controls']={'punch2':{**D['scorpion']['normalControls']['punch2'],'standing':{**D['scorpion']['normalControls']['punch2']['standing'],'nearRange':75.375}}}
for ref in ['hit','duck']:
 pid=D['scorpion']['moves']['normal_stand_hp_near']['reactionProfiles'].get(ref)
 if pid:
  pf=copy.deepcopy(ctx['defs']['reactions'][pid]);pf['guardLeadSamples']=2;OUT['profiles'][pid]=pf

# Import the unambiguously unguarded low-kick witness. Previous low/high
# metadata classified this weak hit as guard by a damage-ratio heuristic.
c=source('leves-sf','light_crouch_9_hit_10','ssf2tu');pid=reaction(c,c['contactSample'],'ryu')
for name in ['crouchKick','normal_crouch_lk']:
 OUT['characters']['ryu']['moves'].setdefault(name,{})['reactionProfiles']={**D['ryu']['moves'][name]['reactionProfiles'],'hit':pid,'block':'ryu_crouch_contact_lk_low','blockLow':'ryu_crouch_contact_lk_low'}

# Empirical special-cancel windows, in unpaused attacker video samples.
records=read(H/'analise-sf-piloto.json');groups=collections.defaultdict(list)
for r in records:
 # Dense 0/1 overwrite the first normal press: they are setup diagnostics.
 if r['move'] and r['cancel'] and not (r['case'].startswith('dense_') and int(r['case'].rsplit('_',1)[1])<2):groups[r['move']].append(r)
sf=OUT['characters']['ryu']['moves'];aliases=read(P/'comparacao/passo-4/repertorio.json')['characters']['ryu']['aliases']
for name,m in D['ryu']['moves'].items():
 sf.setdefault(name,{})['specialCancels']={}
 if not m.get('air') and not m.get('grapple') and m.get('kind')=='strike':sf[name]['lateLinkFrames']=2
for name,records in groups.items():
 byOutcome={}
 for outcome in sorted(set(r['outcome'] for r in records)):
  ages=[r['requestAge'] for r in records if r['outcome']==outcome]
  lo=min(ages);hi=max(ages)+1
  if outcome!='whiff':lo=min(lo,round(D['ryu']['moves'][name]['startup']*B['characters']['ryu']['fps']))
  byOutcome[outcome]=[[lo,hi]]
 sf[name]['specialCancels']={'projectile':{'ranges':[r for ranges in byOutcome.values() for r in ranges],'byOutcome':byOutcome,'wallByOutcome':{outcome:[[sample,sample+1] for sample in sorted(set(r['requestSample'] for r in records if r['outcome']==outcome))] for outcome in byOutcome},'outcomes':list(byOutcome),'evidence':[r['source'] for r in records],'confidence':'Measured video-sample window; exact internal Turbo scheduler remains separate.'}}
for canonical,alias in aliases.items():
 if canonical in sf:sf[alias]={**sf.get(alias,{}),**copy.deepcopy(sf[canonical])}
# Near standing LP is not the rapid far jab: early on-contact re-presses fail.
sf.setdefault('normal_stand_lp_near',{})['repeat']=None
sf.setdefault('normal_stand_lk_near',{})['repeat']={'mode':'restart','gateFrames':5,'latencyFrames':2,'skipFrames':2,'family':['normal_stand_lk_near','kick','normal_stand_lk_far'],'next':'normal_stand_lk_near'}
sf.setdefault('crouchPunch',{})['repeat']={**D['ryu']['moves']['crouchPunch']['repeat'],'frozenLeadByOutcome':{'hit':2,'block':1}}
sf.setdefault('crouchKick',{})['repeat']={**D['ryu']['moves']['crouchKick']['repeat'],'contactGateFrames':4,'frozenLeadByOutcome':{'hit':2,'block':0}}
sf.setdefault('normal_stand_lk_near',{})['lateLinkFrames']=3
sf.setdefault('normal_crouch_mk',{})['lateLinkFrames']=1

# Proper BB+LP and D,B+HP motions (validated also from neutral) cancel the
# straight punches even on whiff. Knees/elbows have separate combo states.
for name in allNames:
 M.setdefault(name,{})['specialCancels']={
  'spear':{'ranges':[[8,21]],'outcomes':['hit','block','whiff'],'evidence':['comparacao/passo-7/especiais-rapidos-mk','comparacao/passo-7/especiais-validos-mk'],'confidence':'Initial-punch native witnesses; alternating-arm variants share this family policy.'},
  'teleport':{'ranges':[[6,21]],'outcomes':['hit','block','whiff'],'evidence':['comparacao/passo-7/especiais-rapidos-mk','comparacao/passo-7/especiais-validos-mk'],'confidence':'Initial-punch native witnesses; alternating-arm variants share this family policy.'}}

OUT['limits']=['MK attack rectangles and late active limits remain empirical.','Native combo guard curves reuse the matching calibrated reaction family.','SF phase-sensitive button sampling is modeled at source video rate, not a recovered internal Turbo scheduler.','Only currently implemented specials are exposed; the complete special repertoire remains separate.']
(H/'sequencias.json').write_text(json.dumps(OUT,indent=2),encoding='utf-8')
(P/'arena/assets.js').write_text('window.ARENA_ASSETS='+json.dumps(B,ensure_ascii=False)+';',encoding='utf-8')
(P/'arena/calibration.js').write_text((H/'backup-antes/calibration.js').read_text(encoding='utf-8')+'\nwindow.SEQUENCE_CALIBRATION='+json.dumps(OUT,ensure_ascii=False)+';\n',encoding='utf-8')
print(json.dumps({'movesMK':len(M),'movesSF':len(sf),'newReactionProfiles':len(OUT['profiles']),'cancelVariants':len(groups)}))
