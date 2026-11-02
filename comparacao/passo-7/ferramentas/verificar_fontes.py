from pathlib import Path
import json,hashlib,collections
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-7'
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
 return h.hexdigest()
result={'status':'PASS','repeatPairs':collections.Counter(),'captures':{},'originals':[]}
mapping=read(H/'mapa-repeticoes.json')
for id,rel in mapping.items():
 game='ssf2tu' if '/ssf2tu/' in rel else 'umk3'
 assert read(H/rel)==read(H/f'repeticao-01/original/{game}/rep-2/{id}/trace.json'),id
 result['repeatPairs'][game]+=1
for root in H.iterdir():
 if root.is_dir():
  n=len(list(root.rglob('trace.json')))
  if n:result['captures'][root.name]=n
for x in read(P/'comparacao/execucoes/20261023-metodo-01/manifesto.json')['inputs']:
 assert sha(Path(x['path']))==x['sha256'];result['originals'].append(x)
for step in [5,6]:
 root=P/f'comparacao/passo-{step}';manifest=read(root/'integridade-saida.json')
 for rel,h in manifest['files'].items():
  file=(root/rel) if step==5 else P/rel
  assert sha(file)==h,(step,rel)
result['previousSeals']='UNCHANGED'
(H/'verificacao-fontes.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))
