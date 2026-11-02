"""Build an additive Ryu pack from recorded native sessions, never from a clone."""
import collections, hashlib, json, shutil
from pathlib import Path
W=Path(__file__).parent
OUT=W/'arena'; ASSETS=OUT/'assets/ryu-especiais'; ASSETS.mkdir(parents=True,exist_ok=True)
data={'schema':1,'character':'ryu','source':'ssf2tu','assets':{},'clips':{},'moves':{},'reactions':{},'commands':[],
      'status':'IMPLEMENTED_CALIBRATION_PENDING','limits':[
      'Random damage, native turbo scheduling and recognizer timers require further comparison.',
      'Terminal guard reaction is measured at the final contact, not at each rotation.',
      'Air Tatsumaki, red Hadouken and super are not included in this pack.',
      'Cross-universe victims use their own native reaction artwork.']}
audit=[]; manifests={}
for revision in ['r2','r3','r4','r7']:
 root=W/('especiais-nativos-'+revision)/'sf-0'
 manifests[revision]=(root,json.loads((root/'manifesto.json').read_text(encoding='utf-8')))
def case(name,situation,rev='r2'):
 root,manifest=manifests[rev]
 return json.loads((root/'provas'/(name+'_'+situation)/'trace.json').read_text(encoding='utf-8'))
def asset(rev,ident):
 key='special-'+rev+'-'+ident
 if key not in data['assets']:
  root,manifest=manifests[rev]; meta=manifest['assets'][ident]; src=root/meta['file']; target=ASSETS/(key+'.png')
  shutil.copyfile(src,target)
  data['assets'][key]={**meta,'file':'assets/ryu-especiais/'+target.name,'sha256_file':hashlib.sha256(src.read_bytes()).hexdigest()}
 return key
def frame(row,rev,victim=False):
 r=row['victim'] if victim else row
 assert r is not None
 return {'asset':asset(rev,r['asset']),'x':-r['anchor'][0],'y':-r['anchor'][1],
         'sourceFacing':r['sourceFacing'],'native_pose_pointer':r['pose']}
def rects(actor,kind):
 return [{'x':-(b['x']+b['w'])*1.25,'y':b['y']*1.25,'w':b['w']*1.25,'h':b['h']*1.25} for b in actor['boxes'] if b['kind']==kind]
def hp(a):return int.from_bytes(bytes.fromhex(a['runtime'])[0x2a:0x2c],'big')
def contacts(c):return [i for i,r in enumerate(c['samples']) if hp(r['actors'][1])<hp(r['actorBefore'][1])]
def reaction(name,situation,rev='r3'):
 c=case(name,situation,rev); rows=c['samples']; hits=contacts(c); assert hits
 # Terminal contact avoids baking subsequent contacts into a reaction.
 start=hits[-1] if situation.startswith('block') else hits[0]
 end=next(i for i in range(start+2,len(rows)) if rows[i]['actors'][1]['state'][1]!=14)
 guarded=situation.startswith('block'); origin=rows[start]['actors'][1]; floor=c['initial'][1]['y']
 direction=1 if origin['x']>=rows[start]['actors'][0]['x'] else -1
 chunk=rows[start:end]; heights=[max(0,(r['actors'][1]['y']-floor)*1.25) for r in chunk]
 kd=not guarded and max(heights)>5
 up=next((i for i,r in enumerate(chunk) if r['actors'][1]['state'][2]>=4),None) if kd else None
 peak=max(range(len(heights)),key=heights.__getitem__)
 land=next((i for i in range(peak+1,len(heights)) if heights[i]<=0),len(heights)) if kd else len(heights)
 pid='ryu_special_'+name+'_'+situation; clip='react_'+pid; samples=[]; ages=collections.defaultdict(int); pause_count=0; seen=False
 for i,r in enumerate(chunk):
  a,q=r['actors']; phase='guard' if guarded else 'getup' if up is not None and i>=up else 'down' if kd and i>=land else 'air' if heights[i]>.01 else 'hit'
  paused=bool(bytes.fromhex(r['actorBefore'][1]['runtime'])[0x47]); owner_paused=bool(bytes.fromhex(r['actorBefore'][0]['runtime'])[0x47])
  if owner_paused and not seen:pause_count+=1
  elif pause_count:seen=True
  if not paused:ages[phase]+=1
  hurt=rects(q,'hurt')
  samples.append({'x':(q['x']-origin['x'])*direction*1.25,'y':heights[i],'ownerX':0,'frame':i,
                  'facing':q['facing']*direction,'phase':phase,'phaseAge':max(0,ages[phase]-1),'paused':paused,
                  'vulnerable':bool(hurt),'bodyPush':any(b['kind']=='push' for b in q['boxes']),'hurt':hurt})
 phases={}
 for phase in ages:
  indices=[i for i,s in enumerate(samples) if s['phase']==phase]; active=[i for i in indices if not samples[i]['paused']]
  phases[phase]={'start':indices[0],'end':indices[-1]+1,'active':active or indices,'activeCount':max(1,ages[phase])}
 fps=manifests[rev][1]['fps']; damage=hp(rows[start]['actorBefore'][1])-hp(rows[start]['actors'][1])
 data['clips'][clip]={'frames':[frame(r,rev,True) for r in chunk],'loop':False,'sampleAligned':True}
 data['reactions'][pid]={'id':pid,'character':'ryu','sourceGame':'ssf2tu','sourceCase':name+'_'+situation,
  'fps':fps,'clip':clip,'family':('guardLow' if situation=='blockLow' else 'guardHigh') if guarded else 'launch' if kd else 'standingHit',
  'strength':'heavy','guarded':guarded,'knockdown':kd,'controlSamples':len(samples),'duration':len(samples)/fps,
  'samples':samples,'phases':phases,'initialHeight':heights[0],'landSample':land,'getupSample':up,
  'ownerPauseSeconds':pause_count/fps,'damageObserved':damage,'damagePercent':damage/144*100,
  'earlyInputSamples':0,'corner':False,'evidence':'Native terminal contact; early control and corner variants still pending.'}
 return pid
for kind,strengths,buttons in [('shoryuken',['lp','mp','hp'],['punch','punch2','punch3']),('tatsumaki',['lk','mk','hk'],['kick','kick2','kick3'])]:
 for strength,button in zip(strengths,buttons):
  name=kind+'_'+strength; c=case(name,'isolation'); rows=c['samples']; fps=manifests['r2'][1]['fps']; start=9
  commit=next(i for i,r in enumerate(rows) if r['actors'][0]['state'][1]==12)
  end=next(i for i in range(commit+1,len(rows)) if rows[i]['actors'][0]['state'][1]!=12)
  own=rows[start:end]; origin=rows[start]['actorBefore'][0]; clip='special_'+name
  data['clips'][clip]={'frames':[frame(r,'r2') for r in own],'loop':False,'sampleAligned':True}
  attack=[rects(r['actorBefore'][0],'attack') for r in own]; hurt=[rects(r['actorBefore'][0],'hurt') for r in own]
  active=[i for i,v in enumerate(attack) if v]; assert active
  ranges=[]
  for i in active:
   if ranges and ranges[-1][1]==i:ranges[-1][1]=i+1
   else:ranges.append([i,i+1])
  timeline=[]; group=0; previous=None; groups={}
  hit=case(name,'hit','r3'); hit_at=contacts(hit)[0]; damage=hp(hit['samples'][hit_at]['actorBefore'][1])-hp(hit['samples'][hit_at]['actors'][1])
  block=case(name,'block','r3'); block_at=contacts(block)[0]; chip=hp(block['samples'][block_at]['actorBefore'][1])-hp(block['samples'][block_at]['actors'][1])
  refs={'hit':reaction(name,'hit'),'block':reaction(name,'block')}
  weak_damage=None;weak_refs=None
  if kind=='shoryuken':
   refs['blockLow']=reaction(name,'blockLow','r4')
   weak_case=case(name,'lateHit','r7');weak_at=contacts(weak_case)[0];weak_row=weak_case['samples'][weak_at]
   assert any(b['id'] in [32,42,44] for b in weak_row['actors'][0]['boxes'] if b['kind']=='attack')
   weak_damage=hp(weak_row['actorBefore'][1])-hp(weak_row['actors'][1])
   weak_refs={**refs,'hit':reaction(name,'lateHit','r7'),'block':refs['blockLow']}
  for i,r in enumerate(own):
   ids=tuple(b['id'] for b in r['actorBefore'][0]['boxes'] if b['kind']=='attack')
   if ids and ids!=previous:
    group+=1
    # Different native contact descriptors have their own measured witness.
    # The full random damage distribution remains a separate pending task.
    weak=kind=='shoryuken' and group>1
    native_damage=weak_damage if weak else damage
    groups[str(group)]={'damage':native_damage/144*100,'nativeChip':(5 if weak else chip)/144*100,'reactionProfiles':weak_refs if weak else refs}
   timeline.append(group if ids else 0); previous=ids
  meter=7 if kind=='shoryuken' else 6
  data['moves'][name]={'clip':clip,'kind':'specialStrike','level':'mid','damage':damage/144*100,'nativeChip':chip/144*100,
   'startup':active[0]/fps,'active':(active[-1]+1-active[0])/fps,'recovery':(len(own)-active[-1]-1)/fps,
   'sampleRate':fps,'activeRanges':ranges,'attackTimeline':attack,'calibration':{'hurtTimeline':hurt,'sourceCase':name+'_isolation'},
   'hurtInAir':True,'bodyPushTimeline':[any(b['kind']=='push' for b in r['actorBefore'][0]['boxes']) for r in own],
   'motionTimeline':[{'x':(r['actors'][0]['x']-origin['x'])*origin['facing']*1.25,'y':max(0,(r['actors'][0]['y']-origin['y'])*1.25)} for r in rows[start:end+1]],
   'contactGroupTimeline':timeline,'contactGroups':groups,'reactionProfiles':refs,'knockdown':True,
   'meterGain':meter/48*100,'meterGainSample':commit-start,'meterOnHit':0,'hitstun':.3,'blockstun':.2,'hitstop':0,'push':0,
   'fidelityStatus':'native measurements integrated; random damage, cadence, cancellations and corner reactions pending'}
  data['commands'].append({'sequence':[6,2,3] if kind=='shoryuken' else [2,1,4], 'button':button,'negativeEdge':True,'move':name,
    'stageSeconds':[8/fps,8/fps],'buttonSeconds':12/fps})
  audit.append({'move':name,'sourceStart':start,'sourceEnd':end,'commit':commit-start,'samples':len(own),'peakHeight':max(v['y'] for v in data['moves'][name]['motionTimeline']),
                'contactGroups':group,'damageObserved':damage,'minimumSpriteMatch':min(r['match'] for r in own),'sourceSha256':hashlib.sha256(json.dumps(c,sort_keys=True).encode()).hexdigest()})
js='/* Generated from native Ryu sessions. Experimental fidelity status is retained. */\n(function(s){\n const p='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
js+=' const b=s.ARENA_ASSETS.characters.ryu,d=s.FIGHT_DATA.characters.ryu; Object.assign(b.assets,p.assets); Object.assign(b.clips,p.clips); Object.assign(d.moves,p.moves); Object.assign(s.FIGHT_DATA.reactions,p.reactions); d.commands=[...p.commands,...d.commands]; d.inputPolicy.negativeEdgeButtons=["punch","punch2","punch3","kick","kick2","kick3"]; s.RYU_SPECIALS_STATUS={status:p.status,limits:p.limits,moves:Object.keys(p.moves)};\n})(typeof window==="undefined"?globalThis:window);\n'
(OUT/'ryu-especiais.js').write_text(js,encoding='utf-8')
(W/'evidencias/especiais-ryu-integracao.json').write_text(json.dumps({'status':data['status'],'limits':data['limits'],'moves':audit,'assets':len(data['assets']),'reactions':len(data['reactions'])},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'moves':len(data['moves']),'assets':len(data['assets']),'reactions':len(data['reactions']),'audit':audit},ensure_ascii=False))
