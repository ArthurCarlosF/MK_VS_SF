from pathlib import Path
import json,collections
W=Path(__file__).parent;root=W/'aereo-nativo-r2/sf-0/provas';samples=[]
for path in root.glob('*/trace.json'):
 case=json.loads(path.read_text(encoding='utf-8'))
 for r in case['samples']:
  a,b=r['actorBefore'][0],r['actors'][0];ticks=(r['nativeClockAfter']-r['nativeClockBefore'])%256
  if ticks!=1 or a['state'][1:3]!=[12,2] or b['state'][1:3]!=[12,2] or min(a['y'],b['y'])<=40:continue
  before=bytes.fromhex(a['runtime']);after=bytes.fromhex(b['runtime']);signed=lambda z,o,n:int.from_bytes(z[o:o+n],'big',signed=True)
  samples.append((before,after,signed(after,10,4)-signed(before,10,4),signed(after,6,4)-signed(before,6,4),case['name']))
print('single native update witnesses',len(samples))
findings={}
for axis,col in [('vertical',2),('horizontal',3)]:
 ranked=[]
 for n,factor in [(2,256),(2,65536),(4,1)]:
  for off in range(0x0e,0x400-n+1,2):
   for when,index in [('before',0),('after',1)]:
    for sign in [1,-1]:
     good=sum(int.from_bytes(row[index][off:off+n],'big',signed=True)*factor*sign==row[col] for row in samples)
     if good>len(samples)*.75:ranked.append({'offset':hex(off),'bytes':n,'factor':factor,'phase':when,'sign':sign,'matches':good})
 ranked.sort(key=lambda r:-r['matches']);findings[axis]=ranked[:12];print(axis,ranked[:12])
(W/'evidencias/candidatos-velocidade-aerea.json').write_text(json.dumps({'witnesses':len(samples),'candidates':findings},indent=2),encoding='utf-8')
