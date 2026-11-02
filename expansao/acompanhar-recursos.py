"""Install finished reference packs and retry a bounded batch after its first pass.
Only the explicitly named project's new resource directory can be written.
"""
from pathlib import Path
import json,shutil,time,subprocess,sys,os,hashlib
W=Path(__file__).resolve().parent
SOURCE=W/'recursos-nativos'
TARGET=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/expansao/recursos-nativos').resolve()
EXPECTED=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/expansao').resolve()
assert TARGET.parent==EXPECTED
TARGET.mkdir(parents=True,exist_ok=True)
installed={};retried=False
while True:
    state_file=SOURCE/'lote-estado.json'
    try:status=json.loads(state_file.read_text(encoding='utf-8'))
    except (OSError,ValueError):time.sleep(2);continue
    for folder in SOURCE.iterdir():
        if not folder.is_dir():continue
        manifest=folder/'manifesto.json'
        if not manifest.exists():continue
        raw=manifest.read_bytes();sha=hashlib.sha256(raw).hexdigest()
        if installed.get(folder.name)==sha:continue
        pack=json.loads(raw)
        if pack.get('id')!=folder.name:raise ValueError('Identidade do recurso inconsistente')
        for f in folder.rglob('*'):
            if not f.is_file():continue
            destination=TARGET/f.relative_to(SOURCE)
            if TARGET not in destination.resolve().parents:raise ValueError('Destino fora do projeto')
            destination.parent.mkdir(parents=True,exist_ok=True)
            shutil.copy2(f,destination)
        installed[folder.name]=sha
    result={**status,'installedReferencePacks':len(installed),'physicalLanPageTest':'USER_CONFIRMED','playableCharacters':['scorpion','ryu'],'completeGame':False}
    temp=TARGET/'lote-estado.tmp';temp.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');temp.replace(TARGET/'lote-estado.json')
    if status['status']!='RUNNING':
        if status.get('failed') and not retried:
            retried=True
            with (W/'repeticao-elenco.log').open('w',encoding='utf-8') as stream:
                subprocess.Popen([sys.executable,str(W/'extrair-elenco.py')],stdout=stream,stderr=subprocess.STDOUT,creationflags=subprocess.BELOW_NORMAL_PRIORITY_CLASS if os.name=='nt' else 0)
            time.sleep(3);continue
        print(json.dumps(result,ensure_ascii=False),flush=True)
        break
    time.sleep(3)
