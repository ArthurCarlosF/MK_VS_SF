"""Use the audited native decoders on the new, separate capture pack."""
from pathlib import Path
import sys
HERE = Path(__file__).resolve().parent
source = (HERE / 'exportar_animacoes.py').read_text(encoding='utf-8')
source = source.replace("OUT=R/'animacoes'", "OUT=R/'animacoes-base'")
source = source.replace("verificacao-animacoes.json", "verificacao-base-animacoes.json")
if len(sys.argv)>1:
    assert sys.argv[1] in ('scorpion','ryu')
    source=source.replace("for name in ['scorpion','ryu']:", 'for name in '+repr([sys.argv[1]])+':')
labels = {'parado': 'Parado', 'andar_frente': 'Caminhada longa frente', 'andar_tras': 'Caminhada longa trás',
          'pulo': 'Pulo vertical', 'pulo_frente': 'Pulo para frente', 'agachar': 'Agachar e levantar',
          'soco': 'Soco', 'chute': 'Chute', 'soco_baixo': 'Soco agachado',
          'chute_baixo': 'Chute agachado', 'soco_aereo': 'Soco aéreo', 'chute_aereo': 'Chute aéreo',
          'defesa': 'Defesa', 'defesa_baixa': 'Defesa baixa', 'dano': 'Reação ao golpe', 'queda': 'Queda'}
start = source.index('LABELS='); end = source.index('\n', start)
source = source[:start] + 'LABELS=' + repr(labels) + source[end:]
exec(compile(source, str(__file__), 'exec'))
