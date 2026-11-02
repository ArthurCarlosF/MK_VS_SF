"""Copy only the tested expansion changes, preserving originals and a rollback."""
from pathlib import Path
import datetime,shutil,json,hashlib
W=Path(__file__).resolve().parent;P=Path(r'D:/projetos/Mortal Kombat vs Street Fighter');target=P/'expansao'
files=['arena/engine.js','arena/commands.js','arena/fight-engine.js','arena/session.js','arena/index.html','arena/ryu-especiais.js',
 'rede/server.cjs','index.html','Estado da expansao.txt','arena/LEIA-ME.txt','CONTINUIDADE DO PROJETO.txt','Etapas do projeto.txt',
 'capturar-especiais-ryu.py','exportar-especiais-ryu.py','medir-fases-shoryuken.py','atualizar-especiais.py','registrar-especiais.py','auditar-projeteis.py','conferir-origem-projetil.py',
 'testar-especiais-ryu.cjs','testar-especiais-interface.cjs','testar-especiais-rede.cjs','instalar-especiais.py']
for directory in ['arena/assets/ryu-especiais','evidencias','especiais-nativos-r2','especiais-nativos-r3','especiais-nativos-r4','especiais-nativos-r7','projetil-nativo-r1','projetil-nativo-r2']:
 files.extend(str(p.relative_to(W)).replace('\\','/') for p in (W/directory).rglob('*') if p.is_file())
backup=P/'dados/plan-backups'/('especiais-8.2-'+datetime.datetime.now().strftime('%Y%m%d-%H%M%S'));backup.mkdir(parents=True)
for relative in files:
 src=W/relative;dst=target/relative
 if dst.is_file() and dst.read_bytes()==src.read_bytes():continue
 if dst.is_file():
  old=backup/'expansao'/relative;old.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(dst,old)
 dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
plan=P/'Etapas do projeto.txt';shutil.copy2(plan,backup/plan.name);shutil.copy2(W/plan.name,plan)
checks={r:hashlib.sha256((target/r).read_bytes()).hexdigest() for r in files}
assert all(hashlib.sha256((W/r).read_bytes()).hexdigest()==h for r,h in checks.items())
(target/'evidencias/instalacao-especiais-8.2.json').write_text(json.dumps({'status':'PASS','files':checks,'backup':str(backup),'completeGame':False},indent=2),encoding='utf-8')
print(json.dumps({'status':'PASS','files':len(files),'backup':str(backup)},ensure_ascii=False))
