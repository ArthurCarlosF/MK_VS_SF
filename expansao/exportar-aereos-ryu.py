"""Ryu air Tatsumaki: native 8.8 physics fields and separate landing phase."""
from pathlib import Path
import json,math,hashlib
W=Path(__file__).parent
prefix=(W/'exportar-especiais-ryu.py').read_text(encoding='utf-8').split('for kind,strengths,buttons in ')[0]
prefix=prefix.replace('assets/ryu-especiais','assets/ryu-aereos').replace("key='special-'","key='air-'")
exec(compile(prefix,str(W/'exportar-especiais-ryu.py'),'exec'))
for rev,folder in [('a1','aereo-nativo-r1'),('a4','aereo-nativo-r4')]:
 root=W/folder/'sf-0';manifests[rev]=(root,json.loads((root/'manifesto.json').read_text(encoding='utf-8')))
reference=json.loads((W/'arena/assets.js').read_text(encoding='utf-8').split('=',1)[1].strip().rstrip(';'))['characters']['ryu']
velocities={};velocity_audit=[]
for kind,vx,vy,drag in [('jump',0,1824,0),('jumpForward',896,1792,5),('jumpBackward',-1024,1856,5)]:
 curve=reference['movement']['jumps'][kind]['heights'];previous=0;table=[];errors=[]
 for i,height in enumerate(curve):
  expected=lambda t:max(0,math.floor((vy*t-80*t*(t+1)/2)/256))*1.25
  candidates=range(previous,min(60,previous+4)) if i else range(1)
  t=min(candidates,key=lambda t:(abs(expected(t)-height),abs(t-(previous+4/3)))) if height>0 else previous if i<5 else previous+1
  if height>0 and abs(expected(t)-height)>.01:errors.append({'sample':i,'height':height,'inferredHeight':expected(t)})
  table.append({'vx':int(math.copysign(max(0,abs(vx)-drag*t),vx)) if vx else 0,'vy':vy-80*t,'drag':drag,'ticks':t});previous=t
 velocities[kind]=table;velocity_audit.append({'kind':kind,'launchVelocity8_8':[vx,vy],'drag8_8':drag,'heightInferenceErrors':errors})
data['limits']=['Air velocity/gravity/boost fields use native measurements; video-to-logic scheduler phase remains approximate.',
 'Normal jump velocity is inferred from the existing integer-height curves; unresolved samples remain in the audit.',
 'Initial air-to-air contacts are measured; ground/corner/late contacts, multirotation behavior and cancellation branches remain pending.',
 'Artwork origin latency and random damage still require final native comparison.']
audit=[]
for strength,button,boost,float_ticks in [('lk','kick',256,12),('mk','kick2',384,24),('hk','kick3',512,30)]:
 name='air_tatsumaki_'+strength;c=case(name,'isolation','a1');rows=c['samples'];fps=manifests['a1'][1]['fps'];start=17
 commit=next(i for i,r in enumerate(rows) if r['actors'][0]['state'][1]==12)
 land=next(i for i in range(commit,len(rows)) if rows[i]['actors'][0]['state'][1:3]==[12,4])
 end=next(i for i in range(land,len(rows)) if rows[i]['actors'][0]['state'][1]!=12)
 own=rows[start:land];landing=rows[land:end];clip='air_'+name;landclip=clip+'_landing'
 data['clips'][clip]={'frames':[frame(r,'a1') for r in own],'loop':False,'sampleAligned':True}
 data['clips'][landclip]={'frames':[frame(r,'a1') for r in landing],'loop':False,'sampleAligned':True}
 attacks=[rects(r['actorBefore'][0],'attack') for r in own];active=[i for i,boxes in enumerate(attacks) if boxes];assert active
 hit=case(name,'airHit','a4');at=contacts(hit)[0];damage=hp(hit['samples'][at]['actorBefore'][1])-hp(hit['samples'][at]['actors'][1])
 refs={'hit':reaction(name,'airHit','a4')}
 move={'clip':clip,'kind':'specialStrike','air':True,'airborneByHeight':True,'level':'mid','sampleRate':fps,
  'startup':active[0]/fps,'active':(active[-1]+1-active[0])/fps,'recovery':(len(own)-active[-1]-1)/fps,
  'untilLanding':True,'landingClip':landclip,'landingSamples':len(landing),
  'attackTimeline':attacks,'hurtInAir':True,'calibration':{'hurtTimeline':[rects(r['actorBefore'][0],'hurt') for r in own],'sourceCase':name+'_isolation'},
  'landingHurtTimeline':[rects(r['actorBefore'][0],'hurt') for r in landing],
  'airPhysics':{'scale':1.25,'updateRate':fps*4/3,'normalGravity':80,'floatGravity':32,'boost':boost,'floatTicks':float_ticks,
    'commitSample':commit-start,'jumpVelocities':velocities},
  'damage':damage/144*100,'hitstun':.3,'blockstun':.2,'hitstop':0,'push':0,'meterOnHit':0,'meterGain':6/48*100,
  'meterGainSample':commit-start,'reactionProfiles':refs,
  'fidelityStatus':'native rising/descending/backward physics and air-to-air witness; scheduler, damage RNG, origins and remaining contact branches pending'}
 data['moves'][name]=move
 data['commands'].append({'sequence':[2,1,4],'button':button,'negativeEdge':True,'move':name,'air':True,'airborneByHeight':True,'stageSeconds':[8/fps,8/fps],'buttonSeconds':12/fps})
 audit.append({'move':name,'start':start,'commit':commit,'land':land,'end':end,'damageWitness':damage,'boost8_8':boost,'floatTicks':float_ticks,
  'nativeAirHitSample':at,'sourceSha256':hashlib.sha256(json.dumps(c,sort_keys=True).encode()).hexdigest()})
js='/* Native air Tatsumaki physics witnesses; calibration pending. */\n(function(s){const p='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n'
js+='const b=s.ARENA_ASSETS.characters.ryu,d=s.FIGHT_DATA.characters.ryu;Object.assign(b.assets,p.assets);Object.assign(b.clips,p.clips);Object.assign(d.moves,p.moves);Object.assign(s.FIGHT_DATA.reactions,p.reactions);d.commands=[...p.commands,...d.commands];for(const c of d.commands)if(c.move.startsWith("tatsumaki_")){c.airborneByHeight=true;d.moves[c.move].airborneByHeight=true;}s.RYU_AIR_STATUS={status:p.status,limits:p.limits,moves:Object.keys(p.moves)};})(typeof window==="undefined"?globalThis:window);\n'
(OUT/'ryu-aereos.js').write_text(js,encoding='utf-8')
(W/'evidencias/aereos-ryu-integracao.json').write_text(json.dumps({'status':data['status'],'limits':data['limits'],'variants':audit,'velocityInference':velocity_audit,'assets':len(data['assets']),'reactions':len(data['reactions'])},ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'moves':len(data['moves']),'assets':len(data['assets']),'reactions':len(data['reactions']),'inferenceErrors':[len(v['heightInferenceErrors']) for v in velocity_audit],'variants':audit}))
