from pathlib import Path
import json,hashlib,re
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121';P=Path('D:/Projetos/Mortal Kombat vs Street Fighter')
report=json.loads((E/'comparacao-variacao-sf.json').read_text());assert len(report['rows'])==442 and all(r['pass'] for r in report['rows'])
for name in ['interface.json','interface-instalacao.json']:
 b=json.loads((E/name).read_text());assert b['status']=='PASS' and len(b['results'])==43
installed=json.loads((E/'instalacao.json').read_text());assert len(installed['approvedCharacters'])==43
marked=json.loads((E/'marcacao-12-sf-20261127.json').read_text());assert marked['onlyCheckboxBytesChanged']
assert 'Scorpion matrix PASS 3384 FAIL 0' in (E/'regressao-combate-43-20261127.log').read_text()
summary={'date':'2026-11-27','approvedWalkingCharacters':43,'sfComparedScenarios':442,'sfFailedScenarios':0,'sfMaximumPixelsOutsideNativeEnvelope':max(r['positionOutsideEnvelope'] for r in report['rows'])/1.25,'sfVisualMismatches':sum(r['visualMismatches'] for r in report['rows']),'browserSource':43,'browserInstalled':43,'combatRegressionPassed':3384,'newWalkingCheckboxes':marked['newlyMarked'],'walkingCheckboxes':len(re.findall(r'\[X\] Caminhada para (?:frente|trás)',(P/'Novo plano do projeto.txt').read_text('utf-8-sig'))),'nativeWitnesses':report['witnesses'],'installedFileCount':len(installed['files']),'scope':'Forward/backward walks, directional transitions, duck/rise and run/no-run behavior. This does not certify every move, finisher, body collision or complete character.'}
assert summary['walkingCheckboxes']==86
(E/'conclusao-caminhadas-20261127.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
text='''VALIDAÇÃO DAS CAMINHADAS — 27/11/2026

Concluída a rodada de caminhada dos 43 personagens: 26 MK e 17 SF.
Os 12 SF que estavam pendentes foram aprovados: Ryu, Chun-Li, Guile, E. Honda, Blanka, Fei Long, T. Hawk, Dee Jay, Balrog, Vega, M. Bison e Akuma.
As 86 caixas de caminhada para frente e para trás estão marcadas. Nesta rodada, somente os espaços das 24 caixas restantes foram trocados por X; o restante do plano foi preservado.

Street Fighter: 442 comparações aprovadas, sem divergências de poses fora da janela aceita. São 13 percursos nos dois lados para os 17 personagens: avanço, recuo, soltura, inversão, agachamento, levantar, diagonais e botão de corrida sem criar corrida inexistente no SF.
Os 12 pendentes têm 18 repetições nativas por percurso; Akuma recebeu ainda seis repetições independentes após sua correção final, totalizando 24. Os cinco SF anteriormente aprovados mantêm suas seis referências.
O critério continua sendo posição dentro da faixa de variação medida no original, com tolerância de um pixel nativo e um quadro nativo; poses usam a mesma janela temporal. Isto não significa trajetórias idênticas quadro a quadro em todas as fases de Turbo.
Uma contraprova original contra original demonstrou que a antiga amostra de seis repetições não cobria outras fases do próprio arcade: 95 de 156 casos ficaram fora, sendo 52 com diferença de posição. A amostra foi ampliada sem modificar ROM, rotinas, frequência de CPU ou tolerância. Os parâmetros foram mantidos fixos durante a captura ampliada; a correção posterior do temporizador de Akuma foi conferida com seis novas repetições.
O deslocamento por atualização lógica e as sequências de sprites vêm das fontes nativas. O temporizador de Akuma foi medido diretamente em 611 intervalos de animação parada, evitando confundir o contador geral do jogo com o contador do personagem.

MK: preservadas as 644 comparações dos 23 personagens comuns e os seis grupos de caminhada dos três chefes, para ambos os lados.
Chefes usam caminhadas observadas na inteligência artificial original; seus controles humanos são uma adaptação do crossover. Motaro e Shao Kahn não recebem agachamento ou corrida inventados. Noob usa a tabela ninja compartilhada da ROM com sua paleta; não houve captura de agachamento comandado por jogador no arcade.

Verificação no navegador: 43 personagens na bancada e 43 na instalação, sem erros de recursos. Regressão de combate: 3384 verificações aprovadas.
A instalação tem cópia de segurança em expansao-trabalho/evidencias/caminhada-elenco-20261121/backup-instalacao-20261127, com hashes conferidos. A referência a expansao-trabalho corresponde à bancada em C:/Users/Pichau/Documents/ChatGPT/ALL_FIGHT.

Escopo: locomoção livre e suas transições. Esta rodada não certifica todos os golpes, finalizações, colisões entre corpos ou a validação completa dos personagens. As outras caixas permaneceram como estavam.
'''
(P/'Validacao das caminhadas.txt').write_text(text,encoding='utf-8')
(P/'PROGRESSO PARA CONTINUAR.txt').write_text(text+'\nRetomada: a caminhada para frente e para trás está concluída para o elenco inteiro. Continuar pelo próximo item ainda vazio no plano, sem desmarcar ou alterar os textos já existentes. Os traços nativos, provas e ferramentas desta rodada permanecem na bancada local; os resumos acompanham a publicação.\n',encoding='utf-8')
print(json.dumps({k:v for k,v in summary.items() if k!='nativeWitnesses'},ensure_ascii=False))
