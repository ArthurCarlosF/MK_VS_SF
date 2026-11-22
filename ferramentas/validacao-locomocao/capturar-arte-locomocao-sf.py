"""Supplement full SF walk/duck artwork using exact native screen witnesses."""
from pathlib import Path
import sys,json,struct,runpy,time,hashlib
import numpy as np
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121';T=Path(r'D:/Projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/ferramentas')
runpy.run_path(str(W/'finalizacoes-trabalho/prioridade-captura.py'))['ensure_low_priority']()
sys.argv=[str(__file__),'ssf2tu'];game='ssf2tu'
source=(T/'capturar_animacoes.py').read_text('utf8');prefix=source[:source.index("if game=='ssf2tu':\n for frame")]
prefix=prefix.replace("SAVE=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/execucao-animacoes')/sys.argv[1]",'SAVE=Path('+repr(str(E/'sf-art/runtime'))+')')
prefix=prefix.replace("OUT=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/animacoes')/('ryu' if game=='ssf2tu' else 'scorpion')",'OUT=Path('+repr(str(E/'sf-art'))+')')
exec(compile(prefix,str(T/'capturar_animacoes.py'),'exec'));exec(source[source.index('def sfdata(b):'):source.index('def mkdata(b):')]);getdata=sfdata
sys.path.insert(0,str(T));import decodificar_sf_sprites as decoder
source=(W/'capturar-elenco.py').read_text();exec(source[source.index('def observe(b):'):source.index('assets={};pixels={};clips={};')])
start=time.monotonic();count=0
try:
 ticks([],10)
 for ident in [f'sf-{n}' for n in range(16)]+['akuma']:
  baseline=(E/'original'/ident/'baseline.state').read_bytes();folder=E/'sf-art'/ident;folder.mkdir(parents=True,exist_ok=True);assets={};digest_to_id={};checks=[]
  for keys,length in [([7],72),([6],72),([5],40),([],24)]:
   if keys:restore(baseline);ticks([],3)
   previous=None
   for index in range(length):
    if count>4000 or time.monotonic()-start>300:raise TimeoutError('SF art bound')
    before=observe(state());ticks(keys,1);after=observe(state());count+=1
    if index%2:previous=before;continue
    target=np.asarray(latest.convert('RGB'));candidates=[]
    for d in [after,before,*([previous] if previous else [])]:
     for alternate in [False,True]:
      im,meta,x,y=decode(d,alternate);q,n=quality(im,target,x,y)
      candidates.append((q,n,d,im,meta,alternate))
    q,n,d,im,meta,alternate=max(candidates,key=lambda c:(c[0],c[1]));checks.append({'pose':d['frame'],'ratio':q,'pixels':n,'alternate':alternate})
    # Retain measured small pixel differences explicitly; never call these
    # witnesses exact when the native compositor differs at overlapping pixels.
    if q>=.97 and n>100:
     sha=hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest();key=digest_to_id.setdefault(sha,'sprite-'+str(len(digest_to_id)).zfill(4))
     im.save(folder/(key+'.png'));assets[d['frame']]={'file':key+'.png','width':im.width,'height':im.height,'anchor':meta['origin_in_png'],'sha256_pixels':sha,'native_pose':d['frame'],'pixelMatch':q}
    previous=before
  (folder/'manifesto.json').write_text(json.dumps({'assets':assets,'checks':checks},separators=(',',':')));print('ART',ident,len(assets),flush=True)
 print('DONE',count,flush=True)
finally:lib.retro_unload_game();lib.retro_deinit()
