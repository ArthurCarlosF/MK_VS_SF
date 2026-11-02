"""Bounded native resource batch. It never marks characters playable."""
from pathlib import Path
import concurrent.futures,json,subprocess,sys,time,os
W=Path(__file__).resolve().parent
P=Path(r'D:/projetos/Mortal Kombat vs Street Fighter')
roster=json.loads((P/'roster.js').read_text(encoding='utf-8').split('=',1)[1].rstrip().rstrip(';'))
status={'status':'RUNNING','startedAt':time.strftime('%Y-%m-%dT%H:%M:%S%z'),'completed':[],'failed':[],'active':[],'total':len(roster),'scope':'Native reference clips only. Complete playable integration remains pending.'}
import threading
lock=threading.Lock()
def save():
    f=W/'recursos-nativos/lote-estado.json'
    tmp=f.with_suffix('.tmp');tmp.write_text(json.dumps(status,ensure_ascii=False,indent=2),encoding='utf-8');tmp.replace(f)
def group(side):
    for c in (c for c in roster if c['side']==side):
        dest=W/'recursos-nativos'/c['id'];manifest=dest/'manifesto.json'
        if manifest.exists() and (side!='mk' or json.loads(manifest.read_text(encoding='utf-8')).get('captureSchema',1)>=2):
            with lock:status['completed'].append(c['id']);save()
            continue
        with lock:status['active'].append(c['id']);save()
        log=W/('captura-'+c['id']+'.log')
        with log.open('w',encoding='utf-8') as stream:
            result=subprocess.run([sys.executable,str(W/'capturar-elenco.py'),'umk3' if side=='mk' else 'ssf2tu',c['id']],stdout=stream,stderr=subprocess.STDOUT,creationflags=subprocess.BELOW_NORMAL_PRIORITY_CLASS if os.name=='nt' else 0)
        with lock:
            status['active'].remove(c['id'])
            if result.returncode==0 and manifest.exists():status['completed'].append(c['id'])
            else:status['failed'].append({'id':c['id'],'code':result.returncode,'log':log.name})
            save()
        print(c['id'],'OK' if result.returncode==0 else 'FAILED',flush=True)
(W/'recursos-nativos').mkdir(exist_ok=True)
save()
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(group,['mk','sf']))
with lock:
    status['status']='DONE_WITH_FAILURES' if status['failed'] else 'CAPTURED_REVIEW_PENDING'
    status['finishedAt']=time.strftime('%Y-%m-%dT%H:%M:%S%z');save()
print(json.dumps(status,ensure_ascii=False),flush=True)
