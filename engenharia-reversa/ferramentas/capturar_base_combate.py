"""New, isolated baseline-restored captures; preserve the earlier evidence pack."""
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
source = (HERE / 'capturar_animacoes.py').read_text(encoding='utf-8')
prefix = source[:source.index("if game=='ssf2tu':\n for frame")]
prefix = prefix.replace("execucao-animacoes", "execucao-base-combate")
prefix = prefix.replace("/animacoes')", "/animacoes-base')")
data = source[source.index('def sfdata(b):'):source.index("print('BASELINE'")]
setup = '''
old=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/animacoes')/('ryu' if game=='ssf2tu' else 'scorpion')
baseline=(old/'baseline-duplo.state').read_bytes()
ticks([],60);restore(baseline);ticks([],3)
(OUT/'baseline-duplo.state').write_bytes(baseline);latest.save(OUT/'baseline-duplo.png')
'''
body = '''
experiments=[('parado',[([],60)]),('andar_frente',[([7],90),([],15)]),('andar_tras',[([6],60),([],15)]),
 ('pulo',[([4],3),([],87)]),('pulo_frente',[([4,7],3),([],87)]),
 ('agachar',[([5],40),([],30)]),('soco',[([0],2),([],78)]),
 ('chute',[([8 if game=='umk3' else 9],2),([],78)]),
 ('soco_baixo',[([5],8),([5,0],2),([5],45),([],15)]),
 ('chute_baixo',[([5],8),([5,8 if game=='umk3' else 9],2),([5],45),([],15)]),
 ('soco_aereo',[([4],3),([],12),([0],2),([],73)]),
 ('chute_aereo',[([4],3),([],12),([8 if game=='umk3' else 9],2),([],73)])]
if game=='umk3':experiments.extend([('defesa',[([10],36),([],24)]),('defesa_baixa',[([5,10],36),([],24)])])
if '--reactions' in sys.argv:experiments=[]
manifest={'game':game,'fps':av.timing.fps,'native_resolution':[av.geometry.base_width,av.geometry.base_height],
 'two_player_setup':True,'baseline_sha256':hashlib.sha256(baseline).hexdigest(),'baseline':getdata(baseline),'experiments':{}}
if '--reactions' in sys.argv:manifest=json.loads((OUT/'medicao-bruta.json').read_text(encoding='utf-8'))
for name,sequence in experiments:
 ticks([],60);restore(baseline);ticks([],3)
 folder=OUT/'capturas'/name;folder.mkdir(parents=True,exist_ok=True)
 records=[];index=0
 for keys,count in sequence:
  for _ in range(count):
   before=getdata(state());ticks(keys,1);after=getdata(state());latest.save(folder/f'{index:03}.png')
   records.append({'sample':index,'keys':keys,'before':before,'after':after});index+=1
 manifest['experiments'][name]={'input_sequence':sequence,'samples':records}
 print('CAPTURE',game,name,index,flush=True)
if '--reactions' in sys.argv:
 reactions=[('dano',[1] if game=='umk3' else [0]),('queda',[5,1] if game=='umk3' else [5,11])]
 if game=='ssf2tu':reactions.extend([('defesa',[0]),('defesa_baixa',[5,11])])
 for name,attack in reactions:
  restore(baseline);ticks([],3)
  folder=OUT/'capturas'/name;folder.mkdir(parents=True,exist_ok=True);records=[];index=0
  sequence=[([6],90 if game=='umk3' else 60),([],5)]
  if name=='queda':sequence.append(([5],8))
  sequence.extend([(attack,3),([],110)])
  for second,count in sequence:
   for _ in range(count):
    first=([6]+([5] if name=='defesa_baixa' else [])) if name.startswith('defesa') and index>=60 else []
    before=getdata(state());ticks(first,1,second=second);after=getdata(state());latest.save(folder/f'{index:03}.png')
    records.append({'sample':index,'keys':[],'second_keys':second,'before':before,'after':after});index+=1
  manifest['experiments'][name]={'second_player_input_sequence':sequence,'samples':records}
  print('CAPTURE',game,name,index,flush=True)
(OUT/'medicao-bruta.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit();print('DONE',game,flush=True)
'''
if sys.argv[1] == 'umk3':
    # UMK3's cooperative tasks are not portable across a fresh core process.
    # Re-enter the actual two-player match before recording, never trust a
    # successful unserialize alone as evidence that a character is advancing.
    setup = source[source.index("if game=='ssf2tu':\n for frame"):source.index('def sfdata(b):')]
exec(compile(prefix + setup + data + body, str(__file__), 'exec'))

