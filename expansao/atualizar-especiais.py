from pathlib import Path
W=Path(__file__).parent
p=W/'arena/index.html';s=p.read_text(encoding='utf-8')
if 'ryu-especiais.js' not in s:
 s=s.replace('<script src="fight-engine.js?v=expansao-8.0"></script>', '<script src="ryu-especiais.js?v=especiais-8.2"></script><script src="fight-engine.js?v=especiais-8.2"></script>')
s=s.replace('commands.js?v=expansao-8.0','commands.js?v=especiais-8.2').replace('engine.js?v=expansao-8.0','engine.js?v=especiais-8.2')
s=s.replace('Os atalhos de especial continuam disponíveis.', 'Shoryuken: frente, baixo, diagonal à frente + soco. Tatsumaki: baixo, diagonal para trás, trás + chute. Cada força tem trajetória própria. Os atalhos de especial continuam disponíveis.')
s=s.replace('Revisão: expansão 8.0 experimental.','Revisão: expansão 8.2 experimental — especiais do Ryu.')
p.write_text(s,encoding='utf-8')
p=W/'index.html';s=p.read_text(encoding='utf-8').replace('Expansão 8.0','Expansão 8.2');p.write_text(s,encoding='utf-8')
