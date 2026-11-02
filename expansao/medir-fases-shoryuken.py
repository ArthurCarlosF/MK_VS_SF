"""Search real controller-selected spacing for a first contact on DP ascent."""
from pathlib import Path
import os,json
W=Path(__file__).parent
os.environ['MKVSF_SPECIAL_OUTPUT']='busca-fases-shoryuken'
source=(W/'capturar-especiais-ryu.py').read_text(encoding='utf-8')
exec(compile(source[:source.index('assets={};pixels={};cases={};')],str(W/'capturar-especiais-ryu.py'),'exec'))
results=[]
for gap in range(98,129,2):
 restore(baseline);ticks([],3)
 for _ in range(120):
  a=actors(state())
  if a[1]['x']-a[0]['x']<=gap:break
  ticks([],1,second=[6])
 ticks([],10);ready=state();initial=actors(ready)
 for strength,button in [('lp',0),('mp',8),('hp',1)]:
  restore(ready);contact=None;sample=0
  for keys,count in [([7],3),([5],3),([5,7],3),([5,7,button],2),([],70)]:
   for _ in range(count):
    before=actors(state());ticks(keys,1);after=actors(state())
    hp=lambda a:int.from_bytes(bytes.fromhex(a['runtime'])[42:44],'big')
    if hp(after[1])<hp(before[1]):
     contact={'sample':sample,'damage':hp(before[1])-hp(after[1]),'attackBefore':[b['id'] for b in before[0]['boxes'] if b['kind']=='attack'],
              'attackAfter':[b['id'] for b in after[0]['boxes'] if b['kind']=='attack'],'p1':after[0]['x'],'p2':after[1]['x']};break
    sample+=1
   if contact:break
  row={'requestedGap':gap,'actualGap':initial[1]['x']-initial[0]['x'],'strength':strength,'contact':contact};results.append(row);print(json.dumps(row),flush=True)
(W/'evidencias/busca-fases-shoryuken.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit()
