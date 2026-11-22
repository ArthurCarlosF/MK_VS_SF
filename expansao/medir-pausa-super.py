"""Native witnesses for input handling during super freeze; no ROM patch."""
from pathlib import Path
import os,json
W=Path(__file__).parent;os.environ['MKVSF_SPECIAL_OUTPUT']='super-sondas-r2'
source=(W/'capturar-especiais-ryu.py').read_text(encoding='utf-8');exec(compile(source[:source.index('assets={};pixels={};cases={};')],str(W/'capturar-especiais-ryu.py'),'exec'))
sequence=[]
for keys,n in [([5],3),([5,7],3),([7],3),([5],3),([5,7],3),([7],3),([7,0],2),([],100)]:sequence.extend([keys]*n)
results=[]
for press,duration in [(i,1) for i in range(24,43)]+[(30,15),(35,10)]:
 restore(baseline);ticks([],3);restore(putmem(state(),0xff8702,b'\x30'));rows=[]
 for i,keys in enumerate(sequence):
  before=state();ticks(keys,1,second=[0] if press<=i<press+duration else []);after=state();a=actors(after);qs=projectiles(after)
  rows.append({'sample':i,'p1':{'state':a[0]['state'],'meter':a[0]['meter']},'p2':{'state':a[1]['state'],'pose':a[1]['pose'],
    'attacking':any(b['kind']=='attack' for b in a[1]['boxes'])},
   'videoCounter':readmem(after,0xff801c,1)[0],'logicCounter':readmem(after,0xff801d,1)[0],
   'rng':readmem(after,0xff82d0,2).hex(),'roundTimer':readmem(after,0xff8dce,2).hex(),
   'projectiles':[{'x':q['x'],'y':q['y'],'pause':bytes.fromhex(q['runtime'])[0x47],'remaining':bytes.fromhex(q['runtime'])[0x4f]} for q in qs]})
 freeze=[r['sample'] for r in rows if r['p1']['state'][1:3]==[12,4]]
 attacks=[r['sample'] for r in rows if r['p2']['attacking']]
 result={'pressSample':press,'heldSamples':duration,'freezeSamples':freeze,'targetAttackSamples':attacks,'rows':rows};results.append(result)
 print(json.dumps({k:v for k,v in result.items() if k!='rows'}),flush=True)
qcf_results=[]
qcf=[]
for keys,n in [([5],2),([5,6],2),([6],2),([6,0],2)]:qcf.extend([keys]*n)
for offset in [23,27,31,35]:
 restore(baseline);ticks([],3);restore(putmem(state(),0xff8702,b'\x30'));rows=[]
 for i,keys in enumerate(sequence):
  j=i-offset;second=qcf[j] if 0<=j<len(qcf) else []
  ticks(keys,1,second=second);b=state();a=actors(b);qs=projectiles(b)
  rows.append({'sample':i,'p1State':a[0]['state'],'p2State':a[1]['state'],'p2Recognizer':list(readmem(b,0xff88e2,2)),
    'p2Projectile':any(int.from_bytes(bytes.fromhex(q['runtime'])[0x26:0x28],'big')==0x884e for q in qs)})
 accepted=[r['sample'] for r in rows if r['p2State'][1]==12];shots=[r['sample'] for r in rows if r['p2Projectile']]
 qcf_results.append({'motionStart':offset,'buttonSample':offset+6,'acceptedSamples':accepted,'projectileSamples':shots,'rows':rows})
 print(json.dumps({k:v for k,v in qcf_results[-1].items() if k!='rows'}),flush=True)
(W/'evidencias/sondas-pausa-super-r2.json').write_text(json.dumps({'setup':'isolated native session; super meter48 fixture; ROM unmodified','results':results,'qcfResults':qcf_results},indent=2),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit()
