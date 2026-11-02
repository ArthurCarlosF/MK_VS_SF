from pathlib import Path
import json, hashlib, shutil
from datetime import datetime, timezone

P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-7'
assert json.loads((H/'verificacao-fontes.json').read_text())['status']=='PASS'
for name in ['soco-alto','sequencias','reacoes','interface-reacoes','revisao','comandos','fases','repertorio','movimento','combate','calibracao']:
    assert json.loads((H/f'verificacao-{name}.json').read_text())['status']=='PASS',name
model=H/'modelo-7.0';model.mkdir(exist_ok=True)
for name in ['assets.js','engine.js','commands.js','collisions.js','calibration.js','combat-data.js','fight-engine.js','arena.js','index.html','presentation.js','style.css']:
    shutil.copy2(P/'arena'/name,model/name)
tests=H/'ferramentas-testes';tests.mkdir(exist_ok=True)
for f in (P/'ferramentas').glob('testar_*.cjs'):shutil.copy2(f,tests/f.name)
data=json.loads((P/'arena/assets.js').read_text().split('=',1)[1].rstrip(';\r\n '))
assets={P/'arena'/a['file'] for c in data['characters'].values() for a in c['assets'].values()}
files=set(f for f in H.rglob('*') if f.is_file() and f.name!='integridade-saida.json')|assets
files.add(P/'Passo 7 - Sequencias e resultados.txt')
def sha(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
    return h.hexdigest()
manifest={'status':'SEALED','calibrationStatus':'INCOMPLETE: 45 SF contact-count differences retained','createdAt':datetime.now(timezone.utc).isoformat(),'base':str(P),'files':{str(f.relative_to(P)):sha(f) for f in sorted(files)}}
(H/'integridade-saida.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
assert all(sha(P/f)==h for f,h in manifest['files'].items())
print(json.dumps({'status':'SEALED','files':len(files),'sharedAssets':len(assets)}))
