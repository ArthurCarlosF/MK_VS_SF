from pathlib import Path
W=Path(__file__).resolve().parent
p=W/'rede/server.cjs';s=p.read_text('utf8');old="'scorpion-fisica']";new="'scorpion-fisica','locomocao-validada-data','locomocao-validada']"
if old in s:s=s.replace(old,new);p.write_text(s,encoding='utf8')
p=W/'arena/index.html';s=p.read_text('utf8');old='<script src="sf-special-help.js';new='<script src="locomocao-validada-data.js?v=1"></script><script src="locomocao-validada.js?v=1"></script>'+old
if 'src="locomocao-validada.js' not in s:s=s.replace(old,new);p.write_text(s,encoding='utf8')
