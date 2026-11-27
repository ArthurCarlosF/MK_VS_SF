from pathlib import Path
import re,json,hashlib
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121';p=Path('D:/Projetos/Mortal Kombat vs Street Fighter/Novo plano do projeto.txt')
sf=json.loads((E/'promocao-sf.json').read_text());assert len(sf['approvedCharacters'])==17 and not sf['pending']
install=json.loads((E/'instalacao.json').read_text());assert len(install['approvedCharacters'])==43
for name in ['interface.json','interface-instalacao.json']:
 r=json.loads((E/name).read_text());assert r['status']=='PASS' and len(r['results'])==43
names={'Ryu','Chun-Li','Guile','E. Honda','Blanka','Fei Long','T. Hawk','Dee Jay','Balrog','Vega','M. Bison','Akuma'}
before=p.read_bytes();bom=before.startswith(b'\xef\xbb\xbf');text=before.decode('utf-8-sig');out=[];current=None;matched=0
for line in text.splitlines(keepends=True):
 m=re.match(r'^\[[ Xx]\] 1\.\d+ — (.+?)(?:\r?\n)?$',line)
 if m:current=m[1]
 if current in names and re.match(r'^\s*\[[ Xx]\] Caminhada para (frente|trás)',line):line=re.sub(r'\[[ Xx]\]','[X]',line,count=1);matched+=1
 out.append(line)
assert matched==24
after=(b'\xef\xbb\xbf' if bom else b'')+''.join(out).encode('utf8');assert len(before)==len(after)
delta=[i for i,(a,b) in enumerate(zip(before,after)) if a!=b];assert all(before[i]==32 and after[i]==88 for i in delta)
backup=E/'plano-antes-12-sf-20261127.txt';assert not backup.exists();backup.write_bytes(before);p.write_bytes(after)
(E/'marcacao-12-sf-20261127.json').write_text(json.dumps({'names':sorted(names),'newlyMarked':len(delta),'onlyCheckboxBytesChanged':True,'sha256':hashlib.sha256(after).hexdigest()},indent=2));print('Updated',len(delta),'checkboxes; all 43 forward/back walks approved')
