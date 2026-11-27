from pathlib import Path
import json,struct
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121';rom=Path('D:/Projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/entradas/ssf2tu-68k-data-be.bin').read_bytes()
desc=lambda p:struct.unpack_from('>I',rom,int(p,16)+4)[0]
rows=[]
for f in (E/'original').glob('*/calibracao-turbo-20261127.json'):
 training=json.loads(f.read_text());reference=json.loads(f.with_name('variacao-turbo.json').read_text());by={c['id']:c for c in reference['cases']}
 for c in training['cases']:
  refs=by[c['id']]['repeats'];maximum=0;visual=0
  for rep in c['repeats']:
   for i,s in enumerate(rep['samples']):
    if any(r['samples'][i]['p2_x']-r['samples'][i]['x']<100 for r in refs) or s['p2_x']-s['x']<100:continue
    near=[(x['x']-r['initial']['x'],desc(x['frame'])) for r in refs for x in r['samples'][max(0,i-1):i+2]];x=s['x']-rep['initial']['x'];maximum=max(maximum,min(v[0] for v in near)-x,x-max(v[0] for v in near));visual+=desc(s['frame']) not in {v[1] for v in near}
  rows.append({'id':training['id'],'case':c['id'],'nativePixelOutside':maximum,'visualMismatches':visual,'pass':maximum<=1 and not visual})
(E/'autocomparacao-original-20261127.json').write_text(json.dumps({'purpose':'Original versus original: checks whether a six-repeat envelope covers other native clock phases at the unchanged one-frame/one-pixel tolerance. No crossover model involved.','rows':rows},indent=2))
print(json.dumps({'cases':len(rows),'failed':sum(not r['pass'] for r in rows),'charactersFailing':sorted({r['id'] for r in rows if not r['pass']}),'examples':[r for r in rows if not r['pass']][:12]},indent=2))
