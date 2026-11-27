from pathlib import Path
import json,hashlib
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121'
read=lambda p:json.JSONDecoder().raw_decode(p.read_text().split('NATIVE_GROUND_GAITS=',1)[1])[0]
file=W/'arena/locomocao-validada-data.js';packs=read(file);candidate=read(W/'arena/locomocao-sf-em-validacao-data.js');report=json.loads((E/'comparacao-variacao-sf.json').read_text());rows=report['rows']
ids={r['id'] for r in rows};approved={id for id in ids if len([r for r in rows if r['id']==id])==26 and all(r['pass'] for r in rows if r['id']==id)}
assert approved
assert len(approved)==17 and len(rows)==442 and all(r['pass'] for r in rows)
frozen=E/'candidatos-congelados-validacao-final-akuma.js'
assert hashlib.sha256(frozen.read_bytes()).digest()==hashlib.sha256((W/'arena/locomocao-sf-em-validacao-data.js').read_bytes()).digest(),'Candidate changed after independent final witnesses'
for id,p in packs.items():
 if p['gait'].get('universe')=='sf':assert id in approved,'Previously promoted SF gait regressed: '+id
for id in approved:
 assert candidate[id]['gait']['universe']=='sf';packs[id]=candidate[id]
file.write_text('(function(s){s.NATIVE_GROUND_GAITS='+json.dumps(packs,separators=(',',':'))+';})(typeof window===\'undefined\'?globalThis:window);\n',encoding='utf8')
(E/'promocao-sf.json').write_text(json.dumps({'approvedCharacters':sorted(approved),'pending':sorted(ids-approved),'comparisonSha256':hashlib.sha256((E/'comparacao-variacao-sf.json').read_bytes()).hexdigest(),'candidateSha256':hashlib.sha256(frozen.read_bytes()).hexdigest(),'criterion':report['criterion'],'witnesses':report['witnesses']},indent=2));print('Approved',sorted(approved),'Pending',len(ids-approved))
