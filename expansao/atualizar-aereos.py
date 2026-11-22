from pathlib import Path
W=Path(__file__).parent
p=W/'arena/index.html';s=p.read_text(encoding='utf-8').replace('expansão 8.4 experimental — Super do Ryu','expansão 8.5 experimental — especiais aéreos e Super do Ryu').replace('super-8.4','aereos-8.5')
if 'ryu-aereos.js' not in s:s=s.replace('<script src="fight-engine.js','<script src="ryu-aereos.js?v=aereos-8.5"></script><script src="fight-engine.js')
s=s.replace('href="style.css"','href="style.css?v=aereos-8.5"').replace('Shinku Hadouken: baixo,','Tatsumaki também pode ser executado no ar; a força e o momento do salto alteram seu movimento. Shinku Hadouken: baixo,')
p.write_text(s,encoding='utf-8')
p=W/'index.html';s=p.read_text(encoding='utf-8').replace('Expansão 8.4','Expansão 8.5');p.write_text(s,encoding='utf-8')
p=W/'rede/server.cjs';s=p.read_text(encoding='utf-8').replace("'ryu-super','fight-engine'","'ryu-super','ryu-aereos','fight-engine'").replace("combatRevision:'ryu-super-8.4'","combatRevision:'ryu-aereos-8.5'")
s=s.replace('name:p.action.name,time:p.action.time,hit:[]','name:p.action.name,time:p.action.time,landed:!!p.action.landed,landedAt:p.action.landedAt,overrideClip:p.action.overrideClip,hit:[]')
p.write_text(s,encoding='utf-8')
p=W/'testar-super-rede.cjs';s=p.read_text(encoding='utf-8').replace("info.combatRevision,'ryu-super-8.4'","info.combatRevision,'ryu-aereos-8.5'");p.write_text(s,encoding='utf-8')
