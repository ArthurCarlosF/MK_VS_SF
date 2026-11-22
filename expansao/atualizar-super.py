from pathlib import Path
W=Path(__file__).parent
p=W/'arena/index.html';s=p.read_text(encoding='utf-8')
a=s.index('<p class="guard-note">Scorpion:');b=s.index('</p>',a)+4
s=s[:a]+'''<p class="guard-note">Scorpion: J/F soco baixo, N/C soco alto, K/G chute alto, vírgula/Z chute baixo; botão de bloqueio. Ryu: três forças em ordem leve, média e forte. Agarrões: MK soco baixo de perto; SF frente ou trás + soco médio/forte ou chute médio/forte de perto. Ryu: segure para trás; baixo + trás protege contra golpes baixos. Lança: trás, solte, trás + soco. Teleporte: baixo, trás + soco alto. Hadouken: baixo, diagonal à frente, frente + apertar ou soltar soco. Hadouken vermelho: trás, diagonal abaixo/trás, baixo, diagonal abaixo/frente, frente + soco. Shoryuken: frente, baixo, diagonal à frente + soco. Tatsumaki: baixo, diagonal para trás, trás + chute. Shinku Hadouken: baixo, diagonal à frente, frente, baixo, diagonal à frente, frente + soco, com a barra SUPER cheia. Os atalhos de especial continuam disponíveis.</p>'''+s[b:]
s=s.replace('expansão 8.3 experimental — projéteis do Ryu','expansão 8.4 experimental — Super do Ryu').replace('projeteis-8.3','super-8.4')
if 'ryu-super.js' not in s:s=s.replace('<script src="fight-engine.js','<script src="ryu-super.js?v=super-8.4"></script><script src="fight-engine.js')
if 'special-engine.js' not in s:s=s.replace('<script src="session.js','<script src="special-engine.js?v=super-8.4"></script><script src="session.js')
p.write_text(s,encoding='utf-8')
p=W/'index.html';s=p.read_text(encoding='utf-8').replace('Expansão 8.3','Expansão 8.4');p.write_text(s,encoding='utf-8')
p=W/'rede/server.cjs';s=p.read_text(encoding='utf-8').replace("'ryu-projeteis','fight-engine','session'","'ryu-projeteis','ryu-super','fight-engine','special-engine','session'").replace("combatRevision:'ryu-projeteis-8.3'","combatRevision:'ryu-super-8.4'")
if 'superFreeze:g.superFreeze' not in s:s=s.replace('projectiles:g.projectiles.map','superFreeze:g.superFreeze?{...g.superFreeze,owners:[...g.superFreeze.owners]}:null,projectiles:g.projectiles.map')
p.write_text(s,encoding='utf-8')
