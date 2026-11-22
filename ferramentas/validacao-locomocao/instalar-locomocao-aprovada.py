from pathlib import Path
import json,re,shutil,hashlib
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121';I=Path(r'D:/Projetos/Mortal Kombat vs Street Fighter/expansao')
results=json.loads((E/'comparacao.json').read_text())['rows'];mk=[r for r in results if r['id'] not in ['ryu','akuma'] and not r['id'].startswith('sf-')]
assert len(mk)==644 and len({r['id'] for r in mk})==23
assert all(r['pass'] and r['maxPositionError']==0 and r['visualMismatches']==0 for r in mk)
source=W/'arena/locomocao-validada-data.js';packs=json.JSONDecoder().raw_decode(source.read_text().split('NATIVE_GROUND_GAITS=',1)[1])[0]
boss=json.loads((W/'evidencias/caminhada-chefes-20261122/comparacao.json').read_text())['results'];assert len(boss)==6 and all(r['pass'] for r in boss)
sf=json.loads((E/'promocao-sf.json').read_text())['approvedCharacters']
approved={r['id'] for r in mk}|{r['id'] for r in boss}|set(sf)
assert set(packs)==approved and len(packs)==31
browser=json.loads((E/'interface.json').read_text());assert browser['status']=='PASS' and {r['id'] for r in browser['results']}==approved
html=W/'arena/index.html';s=html.read_text('utf8');s=re.sub(r'(src="(?:locomocao-validada(?:-data)?|arena)\.js\?v=)[^"]*',r'\g<1>caminhada-20261122-1',s);html.write_text(s,encoding='utf8')
files=['arena/index.html','arena/arena.js','rede/server.cjs','arena/locomocao-validada.js','arena/locomocao-validada-data.js']
files+=sorted({'arena/'+a['file'] for p in packs.values() for a in p['assets'].values()})
backup=E/'backup-instalacao-20261122';audit=[]
for relative in files:
 src=W/relative;dst=I/relative;previous=backup/relative
 if dst.exists() and not previous.exists():previous.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(dst,previous)
 dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
 assert sha(src)==sha(dst);audit.append({'file':relative,'sha256':sha(dst)})
(E/'instalacao.json').write_text(json.dumps({'approvedCharacters':sorted(packs),'files':audit,'backup':str(backup),'unapprovedSfNotInstalled':True},indent=2));print('Installed',len(files),'files for',len(packs),'approved fighters')
