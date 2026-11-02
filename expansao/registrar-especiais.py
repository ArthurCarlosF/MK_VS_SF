from pathlib import Path
W=Path(__file__).parent
note='''
ESPECIAIS NATIVOS DO RYU — REVISÃO 8.2, 02/11/2026
Implementados três Shoryukens e três Tatsumakis terrestres, cada um com sprites,
trajetória, áreas de contato e recuperação medidos em sessões do SSF2T US.
Shoryuken: frente, baixo, diagonal à frente + um dos três socos.
Tatsumaki: baixo, diagonal para trás, trás + um dos três chutes.
Há comandos ao apertar/soltar; as forças têm percursos e durações diferentes.
Motor: trajetória especial em duas dimensões, fases de contato distintas,
medidor na execução e reações nativas com adaptação de apresentação da vítima.
Fase ascendente do Shoryuken tem testemunha própria de dano e reação.
Oito grupos funcionais novos aprovados; navegador sem falhas de imagem; rede
com 12 grupos e três contextos independentes aprovada. Regressões de combate
(39), sequências (9) e reações (12, incluindo 346 replays) aprovadas nesta revisão.
Esses testes NÃO aprovam fidelidade integral. Distribuição de dano aleatório,
cadência turbo, temporizadores dos comandos, cancelamentos, cantos e todas as
continuações de guarda ainda precisam de comparações adicionais.
Capturados também Hadouken azul/vermelho em três forças e Shinkuhadouken,
com entidades e colisões nativas dos projéteis. Esses novos projéteis ainda
NÃO foram integrados. O Hadouken antigo permanece na arena.
Revisão de captura de projéteis preferida: projetil-nativo-r2, sete casos,
60 imagens e 78 amostras visuais conferidas. Origem calculada por posição
nativa/câmera, com paleta14 azul/super e15 vermelha. Não usar as âncoras do
descritor de ator nos projéteis. Vida lógica SF: ator+0x2a; indicador+0x2c
pode atrasar uma amostra. Evidência: evidencias/projeteis-ryu-auditoria.json.
Servidor instalado confirmou revisão de combate8.2. Teste adicional de teclado
pela rede executou Shoryuken e comparou o mesmo estado nos dois navegadores.
Tatsumaki aéreo também continua pendente. Ryu não está completo.
O pedido integral continua incompleto: demais 36 personagens jogáveis,
secretos/chefes adicionais, finishers MK arcade, cenários, áudio, campanha,
carro fiel, calibração e testes finais. Nenhum commit/envio final foi feito.
'''
for filename in ['Estado da expansao.txt','arena/LEIA-ME.txt','CONTINUIDADE DO PROJETO.txt']:
 p=W/filename;s=p.read_text(encoding='utf-8-sig');s=s.split('\nESPECIAIS NATIVOS DO RYU — REVISÃO 8.2,')[0]
 p.write_text(s.rstrip()+'\n'+note,encoding='utf-8-sig')
p=W/'Etapas do projeto.txt';s=p.read_text(encoding='utf-8-sig').replace('Expansão experimental: 8.1 com rede local','Expansão experimental: 8.2 com rede local e especiais Ryu')
entry='[x] Shoryuken e Tatsumaki terrestres em três forças implementados por dados nativos.\n[ ] Aprovar fidelidade desses especiais: dano aleatório, cadência, comandos,\n    cancelamentos, guarda por fase e reações em cantos.\n'
if entry not in s:s=s.replace('[ ] Repertório completo de especiais, parâmetros finais e fidelidade integral.',entry+'[ ] Repertório completo de especiais, parâmetros finais e fidelidade integral.')
p.write_text(s,encoding='utf-8-sig')
print('Estado e roteiro único atualizados sem marcar o pedido integral como concluído.')
