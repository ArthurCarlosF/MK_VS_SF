"""Bounded serial native movement witnesses; no ROM writes or foreign MK states."""
from pathlib import Path
import sys,json,struct,hashlib,time,runpy
W=Path(__file__).resolve().parent
ident=sys.argv[1];game='ssf2tu' if ident.startswith('sf-') or ident in ['ryu','akuma'] else 'umk3'
if ident=='scorpion':ident='mk-18'
if ident=='ryu':ident='sf-0'
OUTDIR=W/'evidencias/caminhada-elenco-20261121/original'/ident
assert not (OUTDIR/'trace.json').exists(),'Preserve previous complete evidence'
OUTDIR.mkdir(parents=True,exist_ok=True)
runpy.run_path(str(W/'finalizacoes-trabalho/prioridade-captura.py'))['ensure_low_priority']()
deadline=time.monotonic()+300;native_count=0
def bounded_run():
 global native_count
 if native_count>=9000 or time.monotonic()>deadline:raise TimeoutError('Native capture bound')
 native_run();native_count+=1
if ident=='akuma':
 source=(W/'capturar-akuma.py').read_text('utf8').split('finally:\n',1)[0]+'finally:pass\n'
 source=source.replace("OUT = WORK / 'recursos-nativos' / 'akuma'",'OUT=Path('+repr(str(OUTDIR))+')')
 source=source.replace("exec(compile(core, str(source_path), 'exec'))", "core=core.replace('lib.retro_init();','native_run=lib.retro_run;lib.retro_run=bounded_run;lib.retro_init();')\nexec(compile(core, str(source_path), 'exec'))")
 sys.argv=[str(__file__)];exec(compile(source,str(W/'capturar-akuma.py'),'exec'))
 baseline=checkpoint;getdata=sfdata;OUTDIR=OUT
 sys.path.insert(0,str(TOOLS));import decodificar_sf_sprites as decoder
 source=(W/'capturar-elenco.py').read_text('utf8');exec(source[source.index('def observe(b):'):source.index('assets={};pixels={};clips={};')])
else:
 source=(W/'capturar-elenco.py').read_text('utf8').split('assets={};pixels={};clips={};',1)[0]
 if ident=='human-smoke':source=runpy.run_path(str(W/'capturar-smoke-humano.py'))['prepare_source'](source)
 source=source.replace("OUTDIR=WORK/'recursos-nativos'/ident",'OUTDIR=Path('+repr(str(OUTDIR))+')')
 entry="exec(compile(prefix,str(TOOLS/'capturar_animacoes.py'),'exec'))"
 source=source.replace(entry,"prefix=prefix.replace('lib.retro_init();','native_run=lib.retro_run;lib.retro_run=bounded_run;lib.retro_init();')\n"+entry)
 sys.argv=[str(__file__),game,ident]
 exec(compile(source,str(W/'capturar-elenco.py'),'exec'))
fps=av.timing.fps;cases=[];art_snapshots={}
def compact(d):
 return {k:d[k] for k in ['x','y','p2_x','frame','flags','state','game_counter_ff801d','observed_word_ff804e','char_p1','char_p2'] if k in d}
def capture(name,segments,near=False):
 restore(baseline);ticks([],3)
 # Use ordinary movement to establish clear room before the recorded input.
 goal=90 if near else (300 if game=='umk3' else 280)
 for _ in range(100):
  d=getdata(state());gap=d['p2_x']-d['x']
  if near and gap<=goal or not near and gap>=goal:break
  ticks([7] if near else [6],1)
 ticks([],24)
 initial=compact(getdata(state()));rows=[]
 for held,count,run in segments:
  keys=held+([11] if run and game=='umk3' else [])
  for _ in range(count):
   before=compact(getdata(state()));ticks(keys,1);snapshot=state();full=getdata(snapshot);after=compact(full)
   pose_key=full['frame']+'-'+str(full.get('flags',''))
   if pose_key not in art_snapshots:art_snapshots[pose_key]=observe(snapshot)
   rows.append({'keys':keys,'runRequested':run,'before':before,'after':after})
 cases.append({'id':name,'initial':initial,'segments':segments,'samples':rows})
 if name in ['forward','backward','forward_crouch','run_crouch']:latest.save(OUTDIR/(name+'.png'))
 print('CASE',ident,name,len(rows),flush=True)
seg=lambda keys,n,run=False:(keys,n,run)
try:
 capture('idle',[seg([],120)],True)
 capture('forward',[seg([7],60),seg([],12)])
 capture('backward',[seg([6],60),seg([],12)],True)
 capture('forward_release',[seg([7],12),seg([],18)])
 capture('backward_release',[seg([6],12),seg([],18)],True)
 for direction,label in [(7,'forward'),(6,'backward')]:
  capture(label+'_crouch',[seg([direction],12),seg([5],12),seg([direction],24),seg([],12)],direction==6)
  capture('crouch_'+label,[seg([5],12),seg([direction],24),seg([],12)],direction==6)
 capture('diagonal_crouch',[seg([5,7],12),seg([5,6],12),seg([],12)])
 capture('direction_change',[seg([7],12),seg([6],12),seg([7],12),seg([],12)])
 capture('run',[seg([7],30,True),seg([],12)])
 capture('run_crouch',[seg([7],12,True),seg([5],12),seg([7],12),seg([],12)])
 capture('run_backward',[seg([7],12,True),seg([6],12),seg([],12)])
 report={'id':ident,'game':game,'fps':fps,'nativeFrames':native_count,'romModified':False,'baselineSha256':hashlib.sha256(baseline).hexdigest(),'cases':cases}
 (OUTDIR/'trace.json').write_text(json.dumps(report,separators=(',',':')),encoding='utf8')
 (OUTDIR/'art-snapshots.json').write_text(json.dumps(art_snapshots,separators=(',',':')),encoding='utf8')
 print('DONE',ident,len(cases),flush=True)
finally:lib.retro_unload_game();lib.retro_deinit()
