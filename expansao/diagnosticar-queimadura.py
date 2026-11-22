from pathlib import Path
import os,json,collections
W=Path(__file__).parent;os.environ['MKVSF_SPECIAL_OUTPUT']='diagnostico-queimadura-r1'
source=(W/'capturar-especiais-ryu.py').read_text(encoding='utf-8');exec(compile(source[:source.index('assets={};pixels={};cases={};')],str(W/'capturar-especiais-ryu.py'),'exec'))
restore(baseline);ticks([],3);sample=0
for keys,count in [([6],3),([5,6],3),([5],3),([5,7],3),([7],3),([7,1],2),([],65)]:
 for _ in range(count):
  ticks(keys,1)
  if sample in [34,37,40,55,75]:
   d=observe(state());q=actors(state())[1];objects=[]
   for v in d['all_objects']:
    x=v[0]&1023;y=v[1]&1023
    if 220<=x-64<=340 and 50<=y-16<=200:objects.append({'x':x-64,'y':y-16,'code':hex(v[2]),'palette':v[3]&31,'flags':hex(v[3]),'priority':v[0]>>13})
   print(json.dumps({'sample':sample,'pose':q['pose'],'objects':objects}),flush=True)
  sample+=1
lib.retro_unload_game();lib.retro_deinit()
