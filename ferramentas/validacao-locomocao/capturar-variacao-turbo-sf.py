"""Repeated original runs quantify the arcade's variable presentation cadence."""
from pathlib import Path
import json,sys,struct,time
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121'
bootstrap=(W/'sondar-velocidades-sf.py').read_text().split('rows=[];start=',1)[0]
exec(compile(bootstrap,str(W/'sondar-velocidades-sf.py'),'exec'))
def write_bytes(b,address,payload):
 for i,v in enumerate(payload):b[0x3d346+(((address+i)&65535)^1)]=v
def observed(snapshot):
 return {'x':struct.unpack('>h',read(snapshot,0xff8454,2))[0],'p2_x':struct.unpack('>h',read(snapshot,0xff8854,2))[0],'frame':hex(struct.unpack('>I',read(snapshot,0xff8468,4))[0]),'counter':read(snapshot,0xff801d,1)[0],'timer':struct.unpack('>H',read(snapshot,0xff8466,2))[0]}
started=time.monotonic();native_count=0
try:
 ticks([],10)
 for ident in [f'sf-{n}' for n in range(16)]+['akuma']:
  folder=E/'original'/ident
  if (folder/'variacao-turbo.json').exists():continue
  trace=json.loads((folder/'trace.json').read_text());baseline=(folder/'baseline.state').read_bytes();cases=[]
  for c in trace['cases']:
   if c['id']=='idle':continue
   repeats=[]
   for rep in range(6):
    if time.monotonic()-started>420:raise TimeoutError('Native variation bound')
    restore(baseline);ticks([],3)
    goal=c['initial']['p2_x']-c['initial']['x']
    for _ in range(100):
     d=observed(state());gap=d['p2_x']-d['x']
     if abs(gap-goal)<4:break
     ticks([7] if gap>goal else [6],1)
    ticks([],24+rep*13)
    initial=observed(state());samples=[]
    for sample in c['samples']:
     ticks(sample['keys'],1);samples.append(observed(state()));native_count+=1
    repeats.append({'initial':initial,'samples':samples})
   cases.append({'id':c['id'],'repeats':repeats})
  (folder/'variacao-turbo.json').write_text(json.dumps({'id':ident,'fps':trace['fps'],'romModified':False,'fixture':'Ordinary native input establishes distance; native camera, controls and timing routines unchanged.','cases':cases},separators=(',',':')))
  print('VARIATION',ident,len(cases),native_count,flush=True)
finally:lib.retro_unload_game();lib.retro_deinit()
