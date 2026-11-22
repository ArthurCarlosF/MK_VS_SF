"""Native recognizer transitions with keyboard/controller intermediate directions."""
from pathlib import Path
import os,json
W=Path(__file__).parent;os.environ['MKVSF_SPECIAL_OUTPUT']='sondas-comando-super-r1'
source=(W/'capturar-especiais-ryu.py').read_text(encoding='utf-8');exec(compile(source[:source.index('assets={};pixels={};cases={};')],str(W/'capturar-especiais-ryu.py'),'exec'))
codes={2:[5],3:[5,7],6:[7],5:[],4:[6],1:[5,6]}
cases={'canonical':[2,3,6,2,3,6],'neutral_return':[2,3,6,5,2,3,6],'diagonal_return':[2,3,6,3,2,3,6],
 'missing_forward':[2,3,2,3,6],'back_return':[2,3,6,4,2,3,6],'neutral_stages':[2,5,3,5,6,5,2,5,3,5,6]}
results=[]
for label,sequence in cases.items():
 restore(baseline);ticks([],3);restore(putmem(state(),0xff8702,b'\x30'));rows=[]
 for code in sequence:ticks(codes[code],2)
 for i in range(45):
  ticks(codes[sequence[-1]]+[0] if i<2 else [],1);b=state();a=actors(b)[0];rows.append({'sampleAfterButton':i,'state':a['state'],'meter':a['meter'],'pose':a['pose']})
 accepted=any(r['meter']==0 for r in rows);results.append({'case':label,'sequence':sequence,'stageSamples':2,'accepted':accepted,'rows':rows});print(label,accepted,flush=True)
(W/'evidencias/comando-super-nativo-r1.json').write_text(json.dumps({'romModified':False,'results':results},indent=2),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit()
