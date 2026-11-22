"""Native projectile clash witnesses. Isolated controller/RAM fixtures only."""
from pathlib import Path
import os,json
W=Path(__file__).parent;os.environ['MKVSF_SPECIAL_OUTPUT']='sondas-choques-super-r1'
source=(W/'capturar-especiais-ryu.py').read_text(encoding='utf-8');exec(compile(source[:source.index('assets={};pixels={};cases={};')],str(W/'capturar-especiais-ryu.py'),'exec'))
def expand(parts):
 result=[]
 for keys,n in parts:result.extend([keys]*n)
 return result
superseq=expand([([5],3),([5,7],3),([7],3),([5],3),([5,7],3),([7],3),([7,0],2),([],140)])
blue=expand([([5],3),([5,6],3),([6],3),([6,0],2)])
red=expand([([7],3),([5,7],3),([5],3),([5,6],3),([6],3),([6,0],2)])
oppsuper=expand([([5],3),([5,6],3),([6],3),([5],3),([5,6],3),([6],3),([6,0],2)])
results=[]
for label,seq,offset in [('blue',blue,44),('red',red,44),('super',oppsuper,0)]:
 restore(baseline);ticks([],3)
 ticks([],100,second=[7]);ticks([],10)
 b=putmem(state(),0xff8702,b'\x30');b=putmem(b,0xff8b02,b'\x30');restore(b)
 rows=[]
 for i,keys in enumerate(superseq):
  j=i-offset;ticks(keys,1,second=seq[j] if 0<=j<len(seq) else []);b=state();a=actors(b);qs=projectiles(b)
  rows.append({'sample':i,'actors':[{'x':v['x'],'health':v['logicalHealth'],'state':v['state']} for v in a],
   'projectiles':[{'base':q['base'],'x':q['x'],'state':q['state'],'owner':readmem(b,int(q['base'],16)+0x26,2).hex(),
     'pause':bytes.fromhex(q['runtime'])[0x47],'remaining':bytes.fromhex(q['runtime'])[0x4f]} for q in qs]})
 results.append({'opponentMove':label,'offset':offset,'rows':rows});print(label,'DONE',flush=True)
(W/'evidencias/choques-super-nativo-r1.json').write_text(json.dumps({'romModified':False,'results':results},indent=2),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit()
