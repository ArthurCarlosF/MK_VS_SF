"""Export six measured blue/red fireball variants; retain calibration limits."""
from pathlib import Path
import json,hashlib
W=Path(__file__).parent
prefix=(W/'exportar-especiais-ryu.py').read_text(encoding='utf-8').split('for kind,strengths,buttons in ')[0]
prefix=prefix.replace("assets/ryu-especiais","assets/ryu-projeteis").replace("key='special-'","key='projectile-'")
exec(compile(prefix,str(W/'exportar-especiais-ryu.py'),'exec'))
for revision,folder in [('p2','projetil-nativo-r2'),('p3','projetil-nativo-r3'),('p4','projetil-nativo-r4')]:
 root=W/folder/'sf-0';manifests[revision]=(root,json.loads((root/'manifesto.json').read_text(encoding='utf-8')))
data['limits']=['Native sampled flight is retained until the first contact witness; later flight is extrapolated.',
 'Turbo phase, random damage, cancellation differences, close-range red knockdown and corner branches remain pending.',
 'Super and air Tatsumaki are not included in this pack.']
reference=json.loads((W/'arena/assets.js').read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'))['characters']['ryu']
owner_anchors={}
for clipname in ['special','idle','forward','backward','crouch']:
 for f in reference['clips'][clipname]['frames']:
  sha=reference['assets'][f['asset']].get('sha256_pixels')
  if sha:owner_anchors.setdefault(sha,f)
def owner_frame(row,rev):
 result=frame(row,rev);sha=manifests[rev][1]['assets'][row['asset']]['sha256_pixels'];anchor=owner_anchors.get(sha)
 assert anchor is not None,('Uncalibrated owner sprite origin',rev,row['sample'],row['pose'])
 result.update({k:anchor.get(k,1) for k in ['x','y','sourceFacing']})
 result['originEvidence']='pixel-identical sprite in calibrated owner atlas'
 return result
audits=[]
for color in ['blue','red']:
 for strength,button in zip(['lp','mp','hp'],['punch','punch2','punch3']):
  rev='p4' if color=='red' else 'p2'
  name=('red_' if color=='red' else '')+'hadouken_'+strength;c=case(name,'far',rev);rows=c['samples'];fps=manifests[rev][1]['fps'];start=15 if color=='red' else 9
  commit=next(i for i,r in enumerate(rows) if r['actors'][0]['state'][1]==12)
  end=next(i for i in range(commit+1,len(rows)) if rows[i]['actors'][0]['state'][1]!=12)
  contact=contacts(c)[0];flight=[r for r in rows if r['projectiles'] and r['sample']<contact]
  assert len(flight)>2
  birth=flight[0]['sample'];q0=flight[0]['projectiles'][0];owner=rows[start]['actorBefore'][0]
  path=[{'x':(r['projectiles'][0]['x']-q0['x'])*1.25,'y':(r['projectiles'][0]['y']-q0['y'])*1.25} for r in flight]
  speed=(path[-1]['x']-path[0]['x'])*fps/(len(path)-1)
  assert speed>0
  flyclip='projectile_'+name+'_flight';frames=[];last=None;first_visible=None
  for i,r in enumerate(flight):
   effects=[e for e in r['effects'] if e.get('projectilePosition') is not None and e['paletteSlot']==(15 if color=='red' else 14)]
   if effects:
    e=effects[0];last={'asset':asset(rev,e['asset']),'x':-e['anchor'][0],'y':-e['anchor'][1],'sourceFacing':1}
    if first_visible is None:first_visible=i
   frames.append(last)
  assert first_visible is not None,name
  data['clips'][flyclip]={'frames':frames,'loop':True,'sampleAligned':True}
  ownclip='projectile_'+name+'_owner';data['clips'][ownclip]={'frames':[owner_frame(r,rev) for r in rows[start:end]],'loop':False,'sampleAligned':True}
  block=case(name,'block','p3');bat=contacts(block)[0]
  damage=hp(rows[contact]['actorBefore'][1])-hp(rows[contact]['actors'][1]);chip=hp(block['samples'][bat]['actorBefore'][1])-hp(block['samples'][bat]['actors'][1])
  refs={'hit':reaction(name,'far',rev),'block':reaction(name,'block','p3')}
  move={'clip':ownclip,'kind':'projectile','level':'mid','startup':(birth-start)/fps,'active':0,'recovery':(end-birth)/fps,
    'damage':damage/144*100,'nativeChip':chip/144*100,'sampleRate':fps,'hitstop':0,'push':0,'hitstun':.3,'blockstun':.2,'detachedContact':True,
    'meterGain':2/48*100,'meterGainSample':commit-start,'meterOnHit':0,'reactionProfiles':refs,
    'calibration':{'hurtTimeline':[rects(r['actorBefore'][0],'hurt') for r in rows[start:end]],'sourceCase':name+'_far'},
    'projectile':{'speed':speed,'spawnX':(q0['x']-rows[birth]['actors'][0]['x'])*1.25,'y':(q0['y']-c['initial'][0]['y'])*1.25,
      'radius':18.75,'lifetime':5,'sampleRate':fps,'motionSamples':path,'clip':flyclip,'loopStart':first_visible,
      'attackTimeline':[rects(r['projectiles'][0],'attack') for r in flight],
      'clashTimeline':[rects(r['projectiles'][0],'push') for r in flight]},
    'fidelityStatus':'native samples integrated; full scheduler, random damage, near/corner contacts and cancellations pending'}
  data['moves'][name]=move
  data['commands'].append({'sequence':[4,1,2,3,6] if color=='red' else [2,3,6],'button':button,'negativeEdge':True,
    'move':'projectile' if name=='hadouken_lp' else name,'stageSeconds':[8/fps]*(4 if color=='red' else 2),'buttonSeconds':12/fps})
  audits.append({'move':name,'birthSample':birth-start,'durationSamples':end-start,'observedDamage':damage,'observedChip':chip,
    'flightSamples':len(path),'sampledDistance':path[-1]['x'],'continuationSpeed':speed,'firstVisibleSample':first_visible,
    'colorPalette':15 if color=='red' else 14,'traceSha256':hashlib.sha256(json.dumps(c,sort_keys=True).encode()).hexdigest()})
# Keep the existing LP cancel identity; its previous evidence is not silently
# assigned to medium/strong/red variants.
data['moves']['projectile']=data['moves']['hadouken_lp']
js='/* Native blue/red Ryu projectiles. Calibration limits remain explicit. */\n(function(s){const p='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
js+='const b=s.ARENA_ASSETS.characters.ryu,d=s.FIGHT_DATA.characters.ryu,old=d.moves.projectile;Object.assign(b.assets,p.assets);Object.assign(b.clips,p.clips);Object.assign(d.moves,p.moves);Object.assign(s.FIGHT_DATA.reactions,p.reactions);d.moves.projectile.specialCancels=old.specialCancels;d.commands=[...p.commands.sort((a,b)=>b.sequence.length-a.sequence.length),...d.commands];s.RYU_PROJECTILES_STATUS={status:p.status,limits:p.limits,moves:Object.keys(p.moves).filter(k=>k!=="projectile")};})(typeof window==="undefined"?globalThis:window);\n'
(OUT/'ryu-projeteis.js').write_text(js,encoding='utf-8')
(W/'evidencias/projeteis-ryu-integracao.json').write_text(json.dumps({'status':data['status'],'limits':data['limits'],'variants':audits,'assets':len(data['assets']),'reactions':len(data['reactions'])},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'variants':len(audits),'assets':len(data['assets']),'reactions':len(data['reactions'])}))
