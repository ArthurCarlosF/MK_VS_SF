from pathlib import Path
W=Path(__file__).parent
p=W/'arena/index.html';s=p.read_text(encoding='utf-8')
if 'ryu-projeteis.js' not in s:s=s.replace('<script src="fight-engine.js?', '<script src="ryu-projeteis.js?v=projeteis-8.3"></script><script src="fight-engine.js?')
s=s.replace('especiais-8.2','projeteis-8.3').replace('arena.js?v=rede-8.1','arena.js?v=projeteis-8.3').replace('session.js?v=expansao-8.0','session.js?v=projeteis-8.3')
s=s.replace('Revisão: expansão 8.2 experimental — especiais do Ryu.','Revisão: expansão 8.3 experimental — projéteis do Ryu.')
s=s.replace('Cada força tem trajetória própria.','Cada força tem trajetória própria. Hadouken vermelho: trás, diagonal abaixo/trás, baixo, diagonal abaixo/frente, frente + soco. Hadoukens azul e vermelho têm três forças.')
p.write_text(s,encoding='utf-8')
p=W/'index.html';s=p.read_text(encoding='utf-8').replace('Expansão 8.2','Expansão 8.3');p.write_text(s,encoding='utf-8')
p=W/'rede/server.cjs';s=p.read_text(encoding='utf-8').replace("combatRevision:'ryu-especiais-8.2'","combatRevision:'ryu-projeteis-8.3'");p.write_text(s,encoding='utf-8')
