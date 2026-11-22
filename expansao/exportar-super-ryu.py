"""Measured Shinku Hadouken integration. No ROM or native state is shipped."""
from pathlib import Path
import json,hashlib
W=Path(__file__).parent
prefix=(W/'exportar-especiais-ryu.py').read_text(encoding='utf-8').split('for kind,strengths,buttons in ')[0]
prefix=prefix.replace('assets/ryu-especiais','assets/ryu-super').replace("key='special-'","key='super-'")
exec(compile(prefix,str(W/'exportar-especiais-ryu.py'),'exec'))
root=W/'super-nativo-r1/sf-0';manifests['s1']=(root,json.loads((root/'manifesto.json').read_text(encoding='utf-8')))
data['limits']=[
 'Native activation, sampled owner animation, initial flight and terminal reactions are integrated.',
 'Turbo scheduler, random damage, intermediate reaction branches, unequal-super clashes, corner and air contacts remain pending.',
 'N-player hit allocation is a crossover policy: one native maximum of five contacts is shared by all targets.'
]
reference=json.loads((W/'arena/assets.js').read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'))['characters']['ryu']
anchors={}
for clipname in ['special','idle','forward','backward','crouch']:
 for f in reference['clips'][clipname]['frames']:
  sha=reference['assets'][f['asset']].get('sha256_pixels')
  if sha:anchors.setdefault(sha,f)
def ownframe(row):
 f=frame(row,'s1');sha=manifests['s1'][1]['assets'][row['asset']]['sha256_pixels']
 if sha in anchors:
  f.update({k:anchors[sha].get(k,1) for k in ['x','y','sourceFacing']});f['originEvidence']='pixel-identical calibrated atlas'
 else:f['originEvidence']='native fixed-position world/camera witness'
 return f
name='shinkuhadouken';c=case(name,'far','s1');rows=c['samples'];fps=manifests['s1'][1]['fps'];start=18
commit=next(i for i,r in enumerate(rows) if r['actors'][0]['state'][1]==12)
end=next(i for i in range(commit+1,len(rows)) if rows[i]['actors'][0]['state'][1]!=12)
freeze=[i for i,r in enumerate(rows) if r['actors'][0]['state'][1:3]==[12,4]]
hits=contacts(c);birth=next(i for i,r in enumerate(rows) if r['projectiles']);q0=rows[birth]['projectiles'][0]
flight=rows[birth:hits[0]];assert len(freeze)>10 and len(hits)==5 and len(flight)>2
ownerclip='super_shinkuhadouken_owner';flyclip='super_shinkuhadouken_flight'
data['clips'][ownerclip]={'frames':[ownframe(r) for r in rows[start:end]],'loop':False,'sampleAligned':True}
frames=[];last=None;first_visible=None
for i,r in enumerate(flight):
 effects=[e for e in r['effects'] if e.get('projectilePosition') is not None and e['paletteSlot']==14]
 if effects:
  e=effects[0];last={'asset':asset('s1',e['asset']),'x':-e['anchor'][0],'y':-e['anchor'][1],'sourceFacing':1}
  if first_visible is None:first_visible=i
 frames.append(last)
assert first_visible is not None
data['clips'][flyclip]={'frames':frames,'loop':True,'sampleAligned':True}
path=[{'x':(r['projectiles'][0]['x']-q0['x'])*1.25,'y':(r['projectiles'][0]['y']-q0['y'])*1.25} for r in flight]
speed=(path[-1]['x']-path[0]['x'])*fps/(len(path)-1)
# Use a terminal native reaction for each contact, restarting on recontact.
# Earlier contacts embedded in one long replay would incorrectly pre-apply hits.
allcontacts=contacts
def contacts(c):return allcontacts(c)[-1:]
refs={s:reaction(name,s,'s1') for s in ['far','hit','block','blockLow']};final_hit=refs.pop('far')
contacts=allcontacts
block=case(name,'block','s1');bh=contacts(block)
damage=[hp(rows[i]['actorBefore'][1])-hp(rows[i]['actors'][1]) for i in hits]
chip=[hp(block['samples'][i]['actorBefore'][1])-hp(block['samples'][i]['actors'][1]) for i in bh]
assert len(chip)==5
pause_counters=[bytes.fromhex(rows[i]['projectiles'][0]['runtime'])[0x47] for i in hits if rows[i]['projectiles']]
assert pause_counters and max(pause_counters)==10 and min(pause_counters)>=9
move={'clip':ownerclip,'kind':'projectile','level':'mid','sampleRate':fps,'startup':(birth-start)/fps,'active':0,'recovery':(end-birth)/fps,
 'damage':damage[0]/144*100,'nativeChip':chip[0]/144*100,'hitstop':0,'push':0,'hitstun':.3,'blockstun':.2,
 'detachedContact':True,'meterCost':100,'meterCostSample':freeze[0]-start,'meterGain':0,'meterOnHit':0,
 'freezeWindow':{'start':(freeze[0]-start)/fps,'duration':len(freeze)/fps,'inputLead':2/fps},
 'reactionProfiles':refs,'calibration':{'hurtTimeline':[rects(r['actorBefore'][0],'hurt') for r in rows[start:end]],'sourceCase':name+'_far'},
 'projectile':{'speed':speed,'spawnX':(q0['x']-rows[birth]['actors'][0]['x'])*1.25,'y':(q0['y']-c['initial'][0]['y'])*1.25,
  'radius':18.75,'lifetime':5,'sampleRate':fps,'motionSamples':path,'clip':flyclip,'loopStart':first_visible,
  'attackTimeline':[rects(r['projectiles'][0],'attack') for r in flight],
  'clashTimeline':[rects(r['projectiles'][0],'push') for r in flight],
  'maxContacts':5,'contactPauseSeconds':10/(fps*4/3),
  'contacts':[{'damage':d/144*100,'nativeChip':ch/144*100,
               'reactionProfiles':{**refs,'hit':final_hit if i==4 else refs['hit']}}
              for i,(d,ch) in enumerate(zip(damage,chip))]},
 'fidelityStatus':'native activation/flight/terminal reaction and blue/red/super clash witnesses; exact scheduler, random damage, intermediate/corner/air contacts and unequal-super clashes pending'}
data['moves'][name]=move
command_evidence=json.loads((W/'evidencias/comando-super-nativo-r1.json').read_text(encoding='utf-8'))
assert {r['case']:r['accepted'] for r in command_evidence['results']}=={
 'canonical':True,'neutral_return':True,'diagonal_return':True,'missing_forward':False,'back_return':True,'neutral_stages':True}
paths=[[2,3,6,3,2,3,6],[2,3,6,4,2,3,6],[2,3,6,2,3,6]]
data['commands']=[{'sequence':seq,'button':b,'negativeEdge':True,'move':name,'allowNeutral':True,
 'stageSeconds':[8/fps]*(len(seq)-1),'buttonSeconds':12/fps,
 'spanWindows':[{'from':2,'to':4,'seconds':8/fps}] if len(seq)==7 else []}
 for b in ['punch','punch2','punch3'] for seq in paths]
js='/* Native Shinku Hadouken witnesses; calibration limits remain explicit. */\n(function(s){const p='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
js+='const b=s.ARENA_ASSETS.characters.ryu,d=s.FIGHT_DATA.characters.ryu;Object.assign(b.assets,p.assets);Object.assign(b.clips,p.clips);Object.assign(d.moves,p.moves);Object.assign(s.FIGHT_DATA.reactions,p.reactions);d.commands=[...p.commands,...d.commands];s.RYU_SUPER_STATUS={status:p.status,limits:p.limits,moves:Object.keys(p.moves)};})(typeof window==="undefined"?globalThis:window);\n'
(OUT/'ryu-super.js').write_text(js,encoding='utf-8')
audit={'status':data['status'],'limits':data['limits'],'sourceStart':start,'commit':commit,'birth':birth,'ownerEnd':end,
 'freezeSamples':freeze,'damageWitness':damage,'chipWitness':chip,'pauseCounter':10,'pauseApproximation':'4/3 native updates per video frame; exact phase scheduler pending',
 'assets':len(data['assets']),'reactions':len(data['reactions']),'clashEvidence':'choques-super-nativo-r1.json',
 'sourceSha256':hashlib.sha256(json.dumps(c,sort_keys=True).encode()).hexdigest()}
(W/'evidencias/super-ryu-integracao.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(audit))
