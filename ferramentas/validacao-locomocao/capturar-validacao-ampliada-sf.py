from pathlib import Path
W=Path(__file__).resolve().parent;p=W/'capturar-variacao-turbo-sf.py';s=p.read_text()
s=s.replace('variacao-turbo.json','variacao-turbo-adicional-20261127.json').replace('range(6)','range(12)').replace('24+rep*13','[7,10,13,16,19,22,25,28,31,34,40,43][rep]').replace('>420','>540')
s=s.replace("for ident in [f'sf-{n}' for n in range(16)]+['akuma']:","for ident in ['sf-0','sf-1','sf-2','sf-3','sf-4','sf-5','sf-6','sf-9','sf-13','sf-14','sf-15','akuma']:")
# Metadata capture only: discarding Python's display conversion does not change
# any emulated CPU instruction, video interrupt, input, ROM or actor routine.
s=s.replace("exec(compile(bootstrap,str(W/'sondar-velocidades-sf.py'),'exec'))", "exec(compile(bootstrap,str(W/'sondar-velocidades-sf.py'),'exec'))\n@VIDEO\ndef discard_video(data,w,h,pitch):pass\nlib.retro_set_video_refresh(discard_video)")
exec(compile(s,str(p),'exec'))
