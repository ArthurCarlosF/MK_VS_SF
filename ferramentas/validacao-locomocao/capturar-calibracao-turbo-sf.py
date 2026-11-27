from pathlib import Path
W=Path(__file__).resolve().parent
p=W/'capturar-variacao-turbo-sf.py'
s=p.read_text().replace('variacao-turbo.json','calibracao-turbo-20261127.json').replace('range(6)','range(4)').replace('24+rep*13','47+rep*35').replace('>420','>540')
s=s.replace("for ident in [f'sf-{n}' for n in range(16)]+['akuma']:","for ident in ['sf-0','sf-1','sf-2','sf-3','sf-4','sf-5','sf-6','sf-9','sf-13','sf-14','sf-15','akuma']:")
exec(compile(s,str(p),'exec'))
