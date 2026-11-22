"""Reach a native secret opponent with the game's Kombat Kode, bounded."""
from pathlib import Path
import sys,json,struct,runpy,time
W=Path(__file__).resolve().parent;kind=sys.argv[1];assert kind in ['shao-kahn','noob-saibot','motaro'];probe='--probe' in sys.argv
E=W/'evidencias/caminhada-chefes-20261122'/kind
if probe:E/='probe-selection'
E.mkdir(parents=True,exist_ok=True)
runpy.run_path(str(W/'finalizacoes-trabalho/prioridade-captura.py'))['ensure_low_priority']()
started=time.monotonic();native_count=0
def bounded_run():
 global native_count
 if native_count>=9500 or time.monotonic()-started>300:raise TimeoutError('Native boss capture bound')
 native_run();native_count+=1
source=(W/'capturar-elenco.py').read_text().split('assets={};pixels={};clips={};',1)[0]
source=source.replace("OUTDIR=WORK/'recursos-nativos'/ident",'OUTDIR=Path('+repr(str(E))+')')
old='    ticks([0],5,second=[0]);ticks([],700)'
digits={'shao-kahn':[0,3,3,5,6,4],'noob-saibot':[7,6,9,3,4,2],'motaro':[9,6,9,1,4,1]}[kind]
new='''    ticks([0],5,second=[0]);ticks([],140)
    digits=DIGITS
    for tap in range(max(digits)):
        a=[key for key,n in zip([0,10,8],digits[:3]) if tap<n]
        z=[key for key,n in zip([0,10,8],digits[3:]) if tap<n]
        ticks(a,2,second=z);ticks([],3)
    latest.save(OUTDIR/'kode.png')
    ticks([],620)
'''.replace('DIGITS',repr(digits))
if probe:new="    ticks([0],5,second=[0])\n    for probe_index in range(12):\n        ticks([],40);latest.save(OUTDIR/('phase-'+str((probe_index+1)*40)+'.png'))\n    ticks([],220)"
assert source.count(old)==1;source=source.replace(old,new)
entry="exec(compile(prefix,str(TOOLS/'capturar_animacoes.py'),'exec'))"
source=source.replace(entry,"prefix=prefix.replace('lib.retro_init();','native_run=lib.retro_run;lib.retro_run=bounded_run;lib.retro_init();')\n"+entry)
sys.argv=[str(__file__),'umk3','mk-18'];exec(compile(source,str(W/'capturar-elenco.py'),'exec'))
if probe:lib.retro_unload_game();lib.retro_deinit();print('PROBE DONE');sys.exit(0)
at=lambda a:0x2c19+(a-0x1000000)//8
def hp(b):return struct.unpack_from('<H',b,at(0x1061610))[0]
def knockout():
 for _ in range(120):
  d=getdata(state())
  if abs(d['p2_x']-d['x'])<44:break
  ticks([],1,second=[6])
 ticks([],6);fixture=bytearray(state());struct.pack_into('<H',fixture,at(0x1061610),1);restore(bytes(fixture));ticks([1],2)
 for age in range(90):
  if hp(state())==0:return
  ticks([],1)
 raise RuntimeError('Native KO not observed')
try:
 snapshot=state();values=[struct.unpack_from('<H',snapshot,at((0x20c5c2+i*2)*8))[0] for i in range(6)]
 print('KODE',values,'EXPECTED',digits,flush=True)
 knockout();print('KO1',flush=True)
 for i in range(550):
  ticks([],1)
  if i>100 and hp(state())>=140:break
 else:raise RuntimeError('Round did not restart')
 target={'shao-kahn':25,'noob-saibot':23,'motaro':24}[kind]
 ticks([],50);d=getdata(state());print('AFTER_RESET',d['char_p1'],d['char_p2'],flush=True)
 if d['char_p2']!=target:knockout();print('KO2',flush=True)
 found=d['char_p2']==target;transitions=[]
 for i in range(0 if found else 1800):
  ticks([],1)
  try:d=getdata(state())
  except (struct.error,ValueError):continue
  if i%30==0:transitions.append({'sample':i,'ids':[d['char_p1'],d['char_p2']]})
  if d['char_p2']==target:found=True;break
 (E/'transitions.json').write_text(json.dumps(transitions,indent=2));latest.save(E/'resultado.png')
 if not found:raise RuntimeError('Secret native opponent was not observed')
 ticks([],80);rows=[];(E/'baseline-chefe.state').write_bytes(state());latest.save(E/'chefe.png')
 observer=runpy.run_path(str(W/'finalizacoes-trabalho/observador-processo-mk.py'))['observe']
 for i in range(2200):
  before=state();d=getdata(before);direction=7 if d['p2_x']>=d['x'] else 6
  keys=[direction] if i<500 else [10] if i<800 else [1] if i<1400 and i%32<2 else [] if i<1400 else [6 if direction==7 else 7]
  fixture=bytearray(before);struct.pack_into('<H',fixture,at(0x1060a60),166);struct.pack_into('<H',fixture,at(0x1061610),166);restore(bytes(fixture))
  ticks(keys,1);b=state();obj=struct.unpack_from('<I',b,at(0x1061580))[0];o=at(obj)
  if not 0<=o<len(b)-66 or struct.unpack_from('<H',b,o+62)[0]!=target:break
  rows.append({'sample':i,'x':struct.unpack_from('<i',b,o+16)[0]/65536,'y':struct.unpack_from('<i',b,o+20)[0]/65536,'pose':hex(struct.unpack_from('<I',b,o+58)[0]),'facing':-1 if struct.unpack_from('<H',b,o+30)[0]&16 else 1,'nativeId':struct.unpack_from('<H',b,o+62)[0],'rawObjectHex':b[o:o+66].hex(),'process':observer(b,1)})
 (E/'trace.json').write_text(json.dumps({'id':kind,'fps':av.timing.fps,'nativeFrames':native_count,'rows':rows},separators=(',',':')));print('DONE',kind,flush=True)
finally:lib.retro_unload_game();lib.retro_deinit()
