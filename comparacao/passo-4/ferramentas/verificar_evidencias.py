"""Verify captured repetitions and original input hashes; seal current evidence."""
from pathlib import Path
import json,hashlib
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-4'
digest=lambda p:hashlib.file_digest(p.open('rb'),'sha256').hexdigest()
results=[]
for game in ['umk3','ssf2tu']:
 root=H/f'execucao-01/original/{game}';count=0
 for f in (root/'rep-1').glob('*/trace.json'):
  a=json.loads(f.read_text());b=json.loads((root/'rep-2'/f.parent.name/'trace.json').read_text())
  assert a['initial']==b['initial'],(game,f.parent.name,'initial')
  assert len(a['samples'])==len(b['samples'])
  for x,y in zip(a['samples'],b['samples']):
   for k in ['sample','before','after','input']:assert x[k]==y[k],(game,f.parent.name,x['sample'],k)
  count+=1
 results.append({'game':game,'cases':count,'numeric_repeatability':'PASS'})
(H/'repetibilidade.json').write_text(json.dumps(results,indent=2))
old=json.loads((P/'comparacao/execucoes/20261023-metodo-01/manifesto.json').read_text())
inputs=[]
for item in old['inputs']:
 actual=digest(Path(item['path']));assert actual==item['sha256'],item['path'];inputs.append({**item,'current_sha256':actual,'status':'UNCHANGED'})
(H/'integridade-entradas.json').write_text(json.dumps(inputs,indent=2))
assert not json.loads((H/'recursos.json').read_text())['unmapped_used']
tests=[]
for f in [*H.glob('verificacao-*.json'),* (P/'arena').glob('verificacao-*.json')]:
 data=json.loads(f.read_text(encoding='utf-8'));tests.append({'file':str(f.relative_to(P)),'status':data.get('status'),'sha256':digest(f)})
(H/'testes-atual.json').write_text(json.dumps(tests,indent=2))
files=[f for f in H.rglob('*') if f.is_file() and f.name!='integridade-saida.json']
sealed={str(f.relative_to(H)):digest(f) for f in files}
(H/'integridade-saida.json').write_text(json.dumps({'sha256':sealed,'arena':{str(f.relative_to(P)):digest(f) for f in (P/'arena').glob('*') if f.is_file()},'report_sha256':digest(P/'Passo 4 - Repertorio e resultados.txt')},indent=2))
print(json.dumps({'status':'PASS','repetitions':results,'inputs_unchanged':len(inputs),'sealed_files':len(files),'native_case_executions':len(list(H.glob('*/original/*/rep-*/*/trace.json')))}))
