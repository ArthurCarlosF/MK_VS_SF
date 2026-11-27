from pathlib import Path
W=Path(__file__).resolve().parent;p=W/'capturar-variacao-turbo-sf.py';s=p.read_text()
s=s.replace('variacao-turbo.json','variacao-turbo-final-akuma-20261127.json').replace('24+rep*13','[52,57,62,67,72,77][rep]')
s=s.replace("for ident in [f'sf-{n}' for n in range(16)]+['akuma']:","for ident in ['akuma']:")
s=s.replace("exec(compile(bootstrap,str(W/'sondar-velocidades-sf.py'),'exec'))", "exec(compile(bootstrap,str(W/'sondar-velocidades-sf.py'),'exec'))\n@VIDEO\ndef discard_video(data,w,h,pitch):pass\nlib.retro_set_video_refresh(discard_video)")
exec(compile(s,str(p),'exec'))
