"""Native reaction curves and victim-owned sprites; explicit crossover adapters."""
from pathlib import Path
import json,sys,statistics,hashlib,collections,copy
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-6';sys.path.insert(0,str(P/'engenharia-reversa/ferramentas'))
import decodificar_mk_sprites as mk
import decodificar_sf_sprites as sf
def read(f):return json.loads(f.read_text(encoding='utf-8'))
def cases(root):
 out={}
 for f in root.glob('*/trace.json'):
  c=read(f);c['_file']=str(f.relative_to(P));out[c['id']]=c
 return out
BANK=json.loads((H/'backup-antes/assets.js').read_text(encoding='utf-8').split('=',1)[1].rstrip(';'))
DEFS=read(H/'dados-antes.json')['characters']
RESULT={'schema':6,'profiles':{},'characters':{},'policy':{'physics':'Attack source controls contact duration and root motion.','presentation':'Victim uses its own native reaction poses, retimed by reaction phase in crossover.','stageTransition':'Uppercut stage elevation is projected onto a single practice floor; raw source retained.','mkVulnerability':'MK hurt rectangles/flags are not recovered; grounded knockdown/getup is protected conservatively.'}}
UNMAPPED=[];AUDIT=[]
for game,id,scale,hp in [('umk3','scorpion',1,166),('ssf2tu','ryu',1.25,144)]:
 bank=BANK['characters'][id];bank['reactionSource']=id;fps=bank['fps'];main=cases(H/f'execucao-01/original/{game}/rep-1');probes=cases(H/f'provas-02/original/{game}/rep-1');actions=cases(H/f'comandos-01/original/{game}/rep-1')
 actions.update(cases(H/f'comandos-02/original/{game}/rep-1'))
 main.update(cases(H/f'extra-ar-01/original/{game}/rep-1'))
 if game=='ssf2tu':
  extra=cases(H/'duplo-01/original/ssf2tu/rep-1')
  for c in extra.values():c['meta']['auxiliaryGroup']=True
  main.update(extra)
 passive=set()
 for name in ['reference_stand','reference_crouch']:
  c=read(P/f'comparacao/passo-4/execucao-01/original/{game}/rep-1/{name}/trace.json');passive.update(r['after']['players'][0]['pose'] for r in c['samples'])
 for name in ['idle','crouch','forward','backward','run']:
  passive.update(f.get('native_pose_pointer') for f in bank['clips'].get(name,{}).get('frames',[]))
 for c in read(P/f'comparacao/passo-3/execucao-01/original/{game}/rep-1/trace.json')['cases']:
  if (c['id'].startswith('walk_') or c['id'].startswith('run_')) and 'jump' not in c['id']:
   passive.update(r['after']['pose'] for r in c['samples'])
 jump={f.get('native_pose_pointer') for f in bank['clips']['jump']['frames']}-passive
 jumpDelay=next(i for i,f in enumerate(bank['clips']['jump']['frames']) if f.get('native_pose_pointer') in jump)
 getupPoses={hex(v) for v in ([0xff93e230,0xff93e270,0xff93e2b0,0xff93e2f0,0xff93e350,0xff93e3b0] if game=='umk3' else [0x112c8e,0x112ca6,0x112cbe,0x112cd6,0x112cee])}
 known={f['native_pose_pointer']:f for c in bank['clips'].values() for f in c['frames'] if f.get('native_pose_pointer')}
 if game=='umk3':mk.use_runtime_palette((H/f'execucao-01/original/{game}/rep-1/baseline-duplo.state').read_bytes())
 def sprite(c,row,port=1):
  q=row['after']['players'][port];ptr=q['pose']
  if ptr in known:return dict(known[ptr])
  try:
   if game=='umk3':
    im,meta=mk.decode_frame(int(ptr,16));ox,oy=meta['origin_in_png'];x=-ox;y=-134-oy;face=1
   else:
    visual=row['render'][port] if row.get('render') else None
    if not visual or not visual['p1_objects']:raise ValueError('no native object bank')
    visual=dict(visual)
    if port:
     words=list(visual['object_palette_words']);words[256:272]=words[16:32];visual['object_palette_words']=words
    im,meta=sf.decode(visual);left,top,_,_=meta['hardware_bounds'];x=left-64-(q['x']-row['after']['camera']);y=top-16-205+(q['y']-40);face=q['facing']
   key='reaction-'+ptr[2:];im.save(P/f'arena/assets/{id}/{key}.png')
   bank['assets'][key]={'file':f'assets/{id}/{key}.png','width':im.width,'height':im.height,'sha256_pixels':hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest(),'metadata':meta}
   known[ptr]={'asset':key,'x':x,'y':y,'sourceFacing':face,'native_pose_pointer':ptr};return dict(known[ptr])
  except Exception as ex:
   UNMAPPED.append({'case':c['id'],'pose':ptr,'port':port,'sample':row['sample'],'error':str(ex)});return None
 # Latch the last of the three retained hardware observations for each pose.
 for c in [*main.values(),*probes.values()]:
  rows=c['samples']
  for i,row in enumerate(rows):
   for port in ([0,1] if c['id'].startswith('throw_') or c['id'].startswith('stand_lp_near') and game=='umk3' else [1]):
    ptr=row['after']['players'][port]['pose']
    if ptr in known:continue
    pick=row
    for nxt in rows[i+1:i+3]:
     if nxt['after']['players'][port]['pose']!=ptr:break
     if nxt.get('render') and nxt['render'][port]:pick=nxt
    sprite(c,pick,port)
 # Signatures exclude every ordinary airborne/standing/crouched pose.
 normal=passive|jump
 def signature(c):
  out=[]
  for r in c['samples']:
   ptr=r['after']['players'][0]['pose']
   if ptr not in normal and (not out or out[-1]!=ptr):out.append(ptr)
  return tuple(out[:2])
 def loss(c):return c['initial']['players'][1]['health']-c['samples'][-1]['after']['players'][1]['health']
 def blocked(c):
  if not c['meta'].get('guard'):return False
  refs=[loss(x) for x in main.values() if not x['meta'].get('guard') and signature(x)==signature(c) and loss(x)>0]
  return loss(c)==0 or bool(refs and loss(c)<statistics.median_low(refs)*.55)
 def activeEnd(c,start):
  rows=c['samples'];seen=False
  for i in range(start,len(rows)):
   q=rows[i]['after']['players'][1]
   active=(q['state'][1] in [14,20]) if game=='ssf2tu' else q['pose'] not in passive
   if active:seen=True
   if seen and not active:return i
  return None
 def firstJump(c,start):return next((r['sample'] for r in c['samples'] if r['sample']>start and r['after']['players'][1]['pose'] in jump),None)
 attackPoses={f.get('native_pose_pointer') for n,c in bank['clips'].items() if n.startswith('normal_') or n in ['punch','punchFollow','punchReturn','crouchPunch'] for f in c['frames']}-normal
 accepted=collections.defaultdict(list);rejected=collections.defaultdict(list)
 for c in actions.values():
  start=c.get('contactSample');offset=c['meta'].get('actionProbeOffset')
  if start is None or offset is None:continue
  key=c['id'].split('__act')[0]
  ok=any(r['sample']>=start+offset and r['after']['players'][1]['pose'] in attackPoses for r in c['samples'])
  (accepted if ok else rejected)[key].append(offset)
 profileCases={};catalog={};rowsByProfile={}
 throwCases={m.get('source_case') for m in DEFS[id]['moves'].values() if m.get('grapple')}
 def make(c,start=None,release=False,quick=False,endOverride=None):
  contact=c.get('contactSample')
  if contact is None:return None
  start=contact if start is None else start;rows=c['samples'];guard=blocked(c);q0=rows[start]['after']['players'][1];a0=rows[start]['after']['players'][0]
  direction=1 if q0['x']>=a0['x'] else -1
  end=activeEnd(c,contact)
  probe=probes.get(c['id']+'__jump');jp=firstJump(probe,contact) if probe else None;jumpControl=jp-jumpDelay if jp is not None else None
  if guard and game=='umk3':end=jumpControl
  if endOverride is not None:end=endOverride
  if end is not None and c['meta'].get('victimCondition')=='air' and game=='ssf2tu':
   while end<len(rows)-1 and (abs(rows[end]['after']['players'][1]['y']-c['initial']['players'][0]['y'])>1 or rows[end]['after']['players'][1]['state'][1] not in [0,2,8]):end+=1
  if end is None or end<=start or end>=len(rows):return None
  # Presentation includes the native guard exit / crouch-to-stand tail after
  # control returns; it never extends the control lock itself.
  full=end
  while full<len(rows)-1 and rows[full]['after']['players'][1]['pose'] not in passive:full+=1
  if guard:
   full=next((i for i in range(end,len(rows)) if rows[i]['after']['players'][1]['pose'] in passive),end)
  full=min(full,len(rows)-1)
  floor0=c['initial']['players'][1]['y'];sign=-1 if game=='umk3' else 1
  common=0;prev=None;heights=[];sharedOffsets=[]
  for r in rows[start:full]:
   a,q=r['after']['players'];
   if game=='umk3' and prev:
    da=a['y']-prev[0]['y'];dq=q['y']-prev[1]['y']
    if abs(da)>128 and abs(dq-da)<40:common+=da
   heights.append(sign*(q['y']-common-floor0)*scale);sharedOffsets.append(common);prev=[a,q]
  if c['meta'].get('victimCondition')=='air':
   # Ground remains the attacker's reference when the victim was already up.
   floor0=c['initial']['players'][0]['y'];heights=[sign*(r['after']['players'][1]['y']-off-floor0)*scale for r,off in zip(rows[start:full],sharedOffsets)]
  maxH=max(heights,default=0);getup=next((i for i,r in enumerate(rows[start:full]) if r['after']['players'][1]['pose'] in getupPoses),None)
  kd=getup is not None or release or (maxH>5 and c['meta'].get('victimCondition')!='air')
  # Detect the floor-contact plateau, excluding the initial hit-pause plateau.
  land=None
  if kd and maxH>5:
   peak=max(range(len(heights)),key=lambda i:heights[i])
   for i in range(peak+1,max(peak+1,len(heights)-3)):
    ys=[rows[start+j]['after']['players'][1]['y'] for j in range(i,i+4)]
    if max(ys)-min(ys)<.01:land=i;break
  if land is None:land=getup if kd and getup is not None else len(heights)
  elevation=heights[land] if land<len(heights) and abs(heights[land])>32 and any(sharedOffsets) else 0
  if elevation:
   for i in range(len(heights)):
    t=min(1,i/max(1,land));heights[i]-=elevation*t*t*(3-2*t)
  initialHeight=max(0,heights[0]) if heights else 0
  strength='light' if loss(c)<=hp*.065 else 'medium' if loss(c)<=hp*.14 else 'heavy'
  family='guardLow' if guard and (c['meta'].get('guard')=='low') else 'guardHigh' if guard else 'airHit' if c['meta'].get('victimCondition')=='air' else 'sweep' if kd and ((c['meta'].get('posture')=='crouch' and c['meta'].get('button') in ([8,9] if game=='umk3' else [9,10,11])) or c['meta'].get('baseCase')=='back_lk') else 'launch' if kd else 'crouchHit' if c['meta'].get('victimCondition')=='duck' else 'standingHit'
  pid=id+'_'+c['id']+('_released' if release else '')+('_quick' if quick else '')
  clip='react_'+pid
  frames=[sprite(c,r,1) for r in rows[start:full]]
  if not frames or any(f is None for f in frames):return None
  bank['clips'][clip]={'frames':frames,'loop':False,'sampleAligned':True,'source_case':c['id'],'reactionRevision':6}
  samples=[];ownerPause=0;ownerPauseStarted=False;ownerPauseFinished=False;phaseAges=collections.defaultdict(int)
  for i,(r,height) in enumerate(zip(rows[start:full],heights)):
   a,q=r['after']['players'];phase='guard' if guard else 'getup' if getup is not None and i>=getup else 'down' if kd and i>=land else 'air' if maxH>5 and height>.01 else 'hit'
   raw=bytes.fromhex(r['before']['players'][1].get('runtimeBytes',''));pause=bool(game=='ssf2tu' and raw[0x47])
   ownerRaw=bytes.fromhex(r['before']['players'][0].get('runtimeBytes',''));ownerPaused=bool(game=='ssf2tu' and ownerRaw[0x47]>0)
   if ownerPaused and not ownerPauseFinished:ownerPause+=1;ownerPauseStarted=True
   elif ownerPauseStarted:ownerPauseFinished=True
   boxes=q['boxes'];hurt=[{'x':-(b['x']+b['w'])*scale,'y':b['y']*scale,'w':b['w']*scale,'h':b['h']*scale} for b in boxes if b['kind']=='hurt']
   vulnerable=bool(hurt) if game=='ssf2tu' else not (kd and phase in ['down','getup'])
   if release:vulnerable=False if i<end-start else vulnerable
   if not pause:phaseAges[phase]+=1
   samples.append({'x':(q['x']-q0['x'])*direction*scale,'y':max(0,height),'ownerX':(a['x']-a0['x'])*direction*scale if not elevation and not c['meta'].get('special') and c['id'] not in throwCases else 0,'frame':i,'facing':q['facing']*direction,'phase':phase,'phaseAge':phaseAges[phase]-1,'paused':pause,'vulnerable':vulnerable,'bodyPush':bool([b for b in boxes if b['kind']=='push']) if game=='ssf2tu' else phase in ['hit','guard'],'hurt':hurt})
  for s in samples:s['phaseAge']=max(0,s['phaseAge'])
  phases={}
  for phase in dict.fromkeys(s['phase'] for s in samples):
   indices=[i for i,s in enumerate(samples) if s['phase']==phase];active=[i for i in indices if not samples[i]['paused'] and rows[start+i]['after']['players'][1]['pose'] not in passive]
   phases[phase]={'start':indices[0],'end':indices[-1]+1,'active':active or indices,'activeCount':max(1,phaseAges[phase])}
  control=end-start;lead=0
  if not kd and c['meta'].get('victimCondition')!='air':
   key=c['id'];firstAccepted=min(accepted.get(key,[control-(1 if guard else 2)]));lead=max(0,min(2,control-firstAccepted))
  profile={'id':pid,'character':id,'sourceGame':game,'sourceCase':c['id'],'source':c['_file'],'startSample':start,'endSample':end,'fullEndSample':full,'fps':fps,'clip':clip,'family':family,'strength':strength,'guarded':guard,'knockdown':kd,'controlSamples':control,'duration':control/fps,'samples':samples,'phases':phases,'initialHeight':initialHeight,'landSample':land,'getupSample':getup,'ownerPauseSeconds':ownerPause/fps,'damageObserved':loss(c),'damagePercent':loss(c)/hp*100,'earlyInputSamples':lead,'earlyInputEvidence':('phase-sensitive approximation' if accepted.get(c['id']) and rejected.get(c['id']) and min(accepted[c['id']])<=max(rejected[c['id']]) else 'measured window' if accepted.get(c['id']) else 'same-family fallback'),'corner':bool(c['meta'].get('corner')),'stageElevationRemoved':elevation,'evidence':'Native two-player trajectory and ROM sprites. MK vulnerability is conservative while down/getting up.'}
  RESULT['profiles'][pid]=profile;rowsByProfile[pid]=c;profileCases[c['id']]=pid
  key=family+'.'+strength
  if not profile['corner'] and not quick and not release and not c['meta'].get('auxiliaryGroup') and c['id'] not in throwCases and (key not in catalog or not elevation and not c['meta'].get('special')):catalog[key]=pid
  AUDIT.append({'character':id,'profile':pid,'source':c['_file'],'controlSamples':control,'fullSamples':len(samples),'ownerPauseSamples':ownerPause,'stageElevationRemoved':elevation,'acceptedOffsets':accepted.get(c['id'],[]),'rejectedOffsets':rejected.get(c['id'],[])})
  return pid
 for c in main.values():
  if c.get('contactSample') is not None:make(c)
 # Attach an early held-up escape only when its native trajectory is available.
 for cid,pid in list(profileCases.items()):
  c=main[cid];probe=probes.get(cid+'__jump');base=RESULT['profiles'][pid]
  if probe:
   j=firstJump(probe,c['contactSample'])
   if j is not None:
    cut=j-jumpDelay
    if cut>c['contactSample'] and cut<base['endSample']:
     probeCopy=dict(probe);probeCopy['id']=cid+'__up_escape'
     quick=make(probeCopy,endOverride=cut,quick=True)
     if quick:base['upEscape']=quick
 # Match exact native attack signatures first; annotate any family fallback.
 def moveSource(m):
  source=m.get('timing',{}).get('source')
  if source:return read(P/source)
  cid=m.get('source_case');f=P/f'comparacao/passo-4/execucao-01/original/{game}/rep-1/{cid}/trace.json'
  return read(f) if f.exists() else None
 moves={}
 originals={cid:pid for cid,pid in profileCases.items() if cid in main}
 for name,m in DEFS[id]['moves'].items():
  if m.get('kind') in ['spear'] or m.get('pull'):continue
  src=moveSource(m);sig=signature(src) if src else None
  special=name if name in ['teleport','projectile'] else None
  refs={};confidence={}
  for outcome in ['hit','block','blockLow','duck','air','cornerHit','cornerBlock']:
   def eligible(c,pf):
    if outcome.startswith('corner')!=bool(c['meta'].get('corner')):return False
    if outcome in ['block','blockLow','cornerBlock']:return pf['guarded'] and (c['meta'].get('guard')=='low' if outcome=='blockLow' else c['meta'].get('guard')!='low')
    if pf['guarded']:return False
    condition=c['meta'].get('victimCondition')
    if outcome=='duck':return condition=='duck'
    if outcome=='air':return condition=='air'
    return condition is None
   candidates=[(cid,pid) for cid,pid in originals.items() if eligible(main[cid],RESULT['profiles'][pid]) and (main[cid]['meta'].get('special')==special if special else not main[cid]['meta'].get('special'))]
   exact=[(cid,pid) for cid,pid in candidates if sig is not None and signature(main[cid])==sig]
   if not exact and special:exact=candidates
   if not exact and src:
    exact=[(cid,pid) for cid,pid in candidates if main[cid]['meta'].get('button')==src['meta'].get('button') and main[cid]['meta'].get('posture')==src['meta'].get('posture')];confidence[outcome]='same input/posture family; exact variant not isolated'
   if not exact and outcome=='air':
    fallback=[(cid,pid) for cid,pid in originals.items() if RESULT['profiles'][pid]['family']=='airHit']
    if fallback:exact=[min(fallback,key=lambda pair:abs(RESULT['profiles'][pair[1]]['damagePercent']-m['damage']))];confidence[outcome]='native airborne reaction family fallback; exact attack/airborne combination not isolated'
   if exact:
    cid,pid=min(exact,key=lambda pair:RESULT['profiles'][pair[1]]['stageElevationRemoved']!=0);refs[outcome]=pid;confidence.setdefault(outcome,'native attack signature')
  if not refs.get('hit') and name in ['punchFollow','punchReturn']:continue
  if refs:
   patch={'reactionProfiles':refs,'reactionEvidence':confidence}
   # Block chip is part of the measured block outcome; preserve RNG limits.
   if refs.get('block'):patch['chip']=RESULT['profiles'][refs['block']]['damagePercent']
   if special and refs.get('hit'):patch['damage']=RESULT['profiles'][refs['hit']]['damagePercent']
   moves[name]=patch
 # Preserve jab family semantics and attach all delayed alternate arms.
 for name in ['punchFollow','punchReturn']:
  if name in DEFS[id]['moves'] and 'punch' in moves:moves[name]=json.loads(json.dumps(moves['punch']))
 if game=='ssf2tu' and 'normal_stand_hk_near' in moves and 'hk_second_hit' in main:
  # The first near-HK contact matches the one-contact corner trial. Project its
  # reciprocal recoil onto a free victim; retain the observation and derivation.
  first=copy.deepcopy(RESULT['profiles'][originals['corner_hk_block']]);firstId=id+'_hk_first_block_free';first['id']=firstId;first['corner']=False
  first.pop('upEscape',None)
  first['derivedFrom']=first['source'];first['evidence']='Single-contact native corner guard duration; free push derived from reciprocal owner recoil.'
  for s in first['samples']:s['x']=-s['ownerX'];s['ownerX']=0
  RESULT['profiles'][firstId]=first
  low=copy.deepcopy(first);lowId=id+'_hk_first_block_low';low['id']=lowId;low['family']='guardLow';low['character']=id+'-derived-low-guard';RESULT['profiles'][lowId]=low
  secondHit=originals['hk_second_hit'];secondBlock=originals.get('hk_second_block')
  def secondContact(c):
   prev=0;events=[]
   for r in c['samples']:
    v=bytes.fromhex(r['after']['players'][0]['runtimeBytes'])[0x47]
    if v>0 and prev==0:events.append(r['sample'])
    prev=v
   return events[1] if len(events)>1 else None
  secondLow=None
  c=main.get('contact_hk_low');at=secondContact(c) if c else None
  if at is not None:
   cp=dict(c);cp['id']=c['id']+'__second_contact';cp['meta']={**c['meta'],'auxiliaryGroup':True};secondLow=make(cp,start=at)
  patch=moves['normal_stand_hk_near'];patch['reactionProfiles']['block']=firstId;patch['reactionProfiles']['blockLow']=lowId
  src=moveSource(DEFS[id]['moves']['normal_stand_hk_near']);kept=DEFS[id]['moves']['normal_stand_hk_near']['timing']['keptSourceSamples']
  patch['contactGroupTimeline']=[2 if any(b['kind']=='attack' and int(b['address'],16)==0x198b7c for b in src['samples'][i]['after']['players'][0]['boxes']) else 1 for i in kept]
  patch['contactGroups']={'2':{'damage':RESULT['profiles'][secondHit]['damagePercent'],'reactionProfiles':{'hit':secondHit,'block':secondBlock,'blockLow':secondLow or secondBlock},'nativeGroup':2}}
 # Long native throws release their owner while the victim is still flying.
 for name,m in DEFS[id]['moves'].items():
  if not m.get('grapple'):continue
  cid=m.get('source_case');c=main.get(cid)
  if not c:continue
  rows=c['samples'];ownerAttack=[r['sample'] for r in rows if r['after']['players'][0]['pose'] not in normal]
  if not ownerAttack:continue
  ownerEnd=max(ownerAttack)+1
  # The victim switches to its independent native fall before the owner is
  # necessarily ready again. SF marks this with state 20; MK uses generic fall
  # poses instead of the dedicated throw poses.
  if game=='ssf2tu':independent=next((r['sample'] for r in rows if r['after']['players'][1]['state'][1]==20),ownerEnd)
  else:independent=next((r['sample'] for r in rows if 0xff93de00<=int(r['after']['players'][1]['pose'],16)<=0xff93e3ff),ownerEnd)
  release=min(ownerEnd,independent)
  if release<=2 or release>=len(rows):continue
  tail=make(c,start=release-1,release=True)
  if not tail:continue
  probe=probes.get(cid+'__jump')
  if probe:
   first=firstJump(probe,c['contactSample'])
   cut=first-jumpDelay if first is not None else None
   if cut is not None and release-1<cut<RESULT['profiles'][tail]['endSample']:
    cp=dict(probe);cp['id']=cid+'__released_up'
    fast=make(cp,start=release-1,release=True,quick=True,endOverride=cut)
    if fast:RESULT['profiles'][tail]['upEscape']=fast
  first=c['initial']['players'];direction=first[0]['facing'];curve=[];sign=-1 if game=='umk3' else 1
  for r in rows[:release]:
   a,q=r['after']['players'];curve.append({'ownerX':(a['x']-first[0]['x'])*scale*direction,'ownerY':max(0,sign*(a['y']-first[0]['y'])*scale),'targetX':(q['x']-first[0]['x'])*scale*direction,'targetY':max(0,sign*(q['y']-first[1]['y'])*scale),'ownerFacing':a['facing']*direction,'targetFacing':q['facing']*direction})
  actorFrames=[sprite(c,r,0) for r in rows[:ownerEnd]];victimFrames=[sprite(c,r,1) for r in rows[:release]]
  if any(f is None for f in actorFrames+victimFrames):continue
  bank['clips'][m['clip']]={'frames':actorFrames,'loop':False,'steps':[0],'sampleAligned':True}
  victim=m['grapple']['victimClip'];bank['clips'][victim]={'frames':victimFrames,'loop':False,'steps':[0],'sampleAligned':True}
  hits=[r['sample'] for r in rows if r['after']['players'][1]['health']<r['before']['players'][1]['health']]
  damageAt=hits[0] if hits else m['grapple']['damageSample']
  patch=moves.setdefault(name,{})
  patch.update(sourceSamples=ownerEnd,startup=m['grapple']['grabSample']/fps,active=max(0,(ownerEnd-m['grapple']['grabSample'])/fps),recovery=0,actorFacing=[r['after']['players'][0]['facing']*direction for r in rows[:ownerEnd]],grapple={**m['grapple'],'timeline':curve,'damageSample':damageAt,'releaseReaction':tail,'deferredDamageSample':max(0,damageAt-(release-1)) if damageAt>=release-1 else None})
  if game=='ssf2tu':
   patch['calibration']={'sampleRate':fps,'hurtTimeline':[[{'x':-(b['x']+b['w'])*scale,'y':b['y']*scale,'w':b['w']*scale,'h':b['h']*scale} for b in r['after']['players'][0]['boxes'] if b['kind']=='hurt'] for r in rows[:ownerEnd]]}
 for family in ['standingHit','crouchHit','guardHigh','guardLow','airHit','launch','sweep']:
  choices=[v for k,v in catalog.items() if k.startswith(family+'.')]
  if choices:catalog[family]=choices[0]
 bank['reactionCatalog']=catalog
 RESULT['characters'][id]={'moves':moves,'catalog':catalog,'jumpPresentationSamples':jumpDelay}
used={f.get('native_pose_pointer') for c in BANK['characters'].values() for clip in c['clips'].values() for f in clip['frames']}
unresolved=[x for x in UNMAPPED if x['pose'] not in used]
(P/'arena/assets.js').write_text('window.ARENA_ASSETS='+json.dumps(BANK,ensure_ascii=False)+';',encoding='utf-8')
cal=(H/'backup-antes/calibration.js').read_text(encoding='utf-8');(P/'arena/calibration.js').write_text(cal+'\nwindow.REACTION_CALIBRATION='+json.dumps(RESULT,ensure_ascii=False)+';\n',encoding='utf-8')
(H/'reacoes.json').write_text(json.dumps(RESULT,ensure_ascii=False,indent=2),encoding='utf-8');(H/'medicoes.json').write_text(json.dumps(AUDIT,indent=2),encoding='utf-8');(H/'recursos.json').write_text(json.dumps({'failedObservations':UNMAPPED,'unresolved':unresolved},indent=2),encoding='utf-8')
print(json.dumps({'profiles':len(RESULT['profiles']),'characters':{id:len(c['moves']) for id,c in RESULT['characters'].items()},'unresolved':len(unresolved)}))

