from pathlib import Path
import subprocess,sys,json,time
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121'
ids=[f'mk-{n}' for n in range(22)]+['human-smoke']+[f'sf-{n}' for n in range(16)]+['akuma']
if len(sys.argv)>1:ids=sys.argv[1:]
results=[]
for ident in ids:
 trace=E/'original'/ident/'trace.json'
 if trace.exists():results.append({'id':ident,'status':'EXISTING'});continue
 with (E/(ident+'.log')).open('w',encoding='utf8') as log:
  try:code=subprocess.run([sys.executable,str(W/'capturar-locomocao-elenco.py'),ident],cwd=W,stdout=log,stderr=subprocess.STDOUT,timeout=330).returncode
  except subprocess.TimeoutExpired:code=-1
 results.append({'id':ident,'status':'CAPTURED' if code==0 and trace.exists() else 'FAILED','code':code})
 (E/'lote.json').write_text(json.dumps(results,indent=2));print(results[-1],flush=True)
 if code:break
