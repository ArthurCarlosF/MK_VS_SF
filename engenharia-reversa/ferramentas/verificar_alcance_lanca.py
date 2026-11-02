"""Verify original UMK3 spear at the greatest in-game player separation."""
from pathlib import Path
import sys
HERE=Path(__file__).resolve().parent
source=(HERE/'capturar_animacoes.py').read_text(encoding='utf-8')
prefix=source[:source.index("if game=='ssf2tu':\n for frame")]
prefix=prefix.replace('execucao-animacoes','execucao-alcance-lanca')
prefix=prefix.replace('/animacoes\')','/evidencias/alcance-lanca\')')
setup=source[source.index("if game=='ssf2tu':\n for frame"):source.index('def sfdata(b):')]
data=source[source.index('def sfdata(b):'):source.index("print('BASELINE'")]
body='''
ticks([6],110,second=[7]);ticks([],12)
start=getdata(state());latest.save(OUT/'distancia-maxima.png')
records=[];index=0
for keys,count in [([6],4),([],4),([6],4),([0],3),([],160)]:
 for _ in range(count):
  before=getdata(state());ticks(keys,1);after=getdata(state())
  records.append({'sample':index,'before':before,'after':after})
  if index in [25,45,65,85,105,130,174]:latest.save(OUT/f'lanca-{index:03}.png')
  index+=1
pull=[r['sample'] for r in records if r['after']['p2_x']<r['before']['p2_x']]
result={'game':'UMK3 original, inputs only; no RAM edits','fps':av.timing.fps,
 'initial':start,'initial_separation':abs(start['p2_x']-start['x']),
 'final':records[-1]['after'],'pull_samples':pull,'hit_at_maximum_separation':bool(pull),
 'samples':records}
(OUT/'resultado.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in result.items() if k!='samples'}),flush=True)
lib.retro_unload_game();lib.retro_deinit()
'''
exec(compile(prefix+setup+data+body,str(__file__),'exec'))
