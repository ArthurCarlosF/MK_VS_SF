from pathlib import Path
import json
W=Path(__file__).parent;reports=[]
number=lambda b,o,n:int.from_bytes(b[o:o+n],'big',signed=True)
for folder in ['aereo-nativo-r1','aereo-nativo-r2','aereo-nativo-r3']:
 for path in (W/folder/'sf-0/provas').glob('*/trace.json'):
  c=json.loads(path.read_text(encoding='utf-8'));rs=c['samples']
  commit=next(i for i,r in enumerate(rs) if r['actors'][0]['state'][1]==12)
  land=next(i for i in range(commit,len(rs)) if rs[i]['actors'][0]['state'][1:3]==[12,4])
  end=next(i for i in range(land,len(rs)) if rs[i]['actors'][0]['state'][1]!=12)
  raw=lambda a:bytes.fromhex(a['runtime']);initial=raw(rs[commit]['actorBefore'][0]);checked=0;errors=[];unknown=[];ticks=0;first_normal=None;floated=False
  for i in range(commit,land+1):
   r=rs[i];a=raw(r['actorBefore'][0]);b=raw(r['actors'][0]);vx=number(b,0x3c,2);vy=number(b,0x3e,2);ax=number(b,0x40,2)*(1 if vx>=0 else -1);g=number(b,0x42,2)
   dx=number(b,6,4)-number(a,6,4);dy=number(b,10,4)-number(a,10,4)
   candidates=[n for n in range(4) if (n*vx+ax*n*(n-1)//2)*256==dx]
   if len(candidates)!=1:candidates=[n for n in candidates if (n*vy+g*n*(n-1)//2)*256==dy]
   if number(a,0x42,2)==g and g:
    implied=(number(a,0x3e,2)-vy)/g
    if implied in [0,1,2,3]:candidates=[int(implied)]
   if len(candidates)!=1:unknown.append(i);continue
   n=candidates[0];ticks+=n
   if g==32:floated=True
   if floated and g==80 and first_normal is None:first_normal={'sample':i,'observedActorTicks':ticks}
   if i>commit and number(a,0x42,2)==g and r['actors'][0]['y']>40 and n>0:
    expected=(n*vy+g*n*(n-1)//2)*256;expected_v=number(a,0x3e,2)-n*g;checked+=1
    if expected!=dy or expected_v!=vy:errors.append({'sample':i,'ticks':n,'expectedDy':expected,'actualDy':dy,'expectedVy':expected_v,'actualVy':vy})
  report={'case':path.parent.name,'folder':folder,'commit':commit,'landing':land,'end':end,'initialVx':number(initial,0x3c,2)/256,'initialVy':number(initial,0x3e,2)/256,
   'floatApplied':floated,'firstNormalGravity':first_normal,'physicsWitnesses':checked,'physicsErrors':errors,'unresolvedSamples':unknown,'observedActorTicks':ticks}
  reports.append(report);print(json.dumps({k:v for k,v in report.items() if k not in ['physicsErrors','unresolvedSamples']}))
(W/'evidencias/fisica-aerea-medida.json').write_text(json.dumps({'fieldUnits':{'position':'16.16 at offsets6/10','velocity':'8.8 at offsets3c/3e','deceleration':'8.8 at offsets40/42'},'reports':reports},indent=2),encoding='utf-8')
