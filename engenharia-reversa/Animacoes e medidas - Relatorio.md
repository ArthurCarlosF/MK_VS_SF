# Ryu e Scorpion — pacote inicial

RYU E SCORPION — ANIMAÇÕES E PRIMEIRAS MEDIDAS
Atualizado em 23/10/2026

COMO ABRIR
Use “Ver animações.cmd”, na pasta principal do projeto.
Escolha a animação em cada lado. Você pode pausar, avançar uma amostra,
reduzir a velocidade e comparar os sprites com a captura original.

ENTREGA DESTA ETAPA
Scorpion: 42 imagens únicas; parado, caminhada para frente/para trás,
poses da lança e do teleporte.
Ryu: 22 imagens únicas do corpo e 7 do projétil Hadouken; parado,
caminhada para frente/para trás e Hadouken.
Total: 71 imagens transparentes, com dimensões e pixels nativos.
As quantidades são imagens únicas compartilhadas entre sequências,
não a quantidade total de amostras nem o repertório completo dos lutadores.

MÉTODO
Dados gráficos dos jogos locais fornecidos pelo usuário, decodificados
sem redesenhar. Paletas e posições observadas em execuções isoladas.
Partidas com dois jogadores humanos, adversário parado; entradas reproduzíveis.
O relógio usa amostras emuladas, não a velocidade do computador.
Arquivos originais dos jogos não foram alterados nesta etapa.

MEDIDAS CONFIRMADAS NESTA EXECUÇÃO
UMK3: 53,204948 amostras por segundo; imagem nativa 400 x 254.
Super Turbo: 59,633331 amostras por segundo; imagem nativa 384 x 224.
As frequências diferem e não devem ser igualadas simplesmente quadro a quadro.

Scorpion — caminhada:
24 amostras de direção = 451,09 ms.
Frente: +71,5 unidades durante a entrada; +78 após o trecho de soltura.
Passo observado quando em movimento: +3,25 unidades/amostra.
Trás: -49,5 unidades durante a entrada; -54 após o trecho de soltura.
Passo observado quando em movimento: -2,25 unidades/amostra.
Primeira alteração de posição: índice de amostra 2, contando a partir de zero.

Ryu — caminhada:
24 amostras de direção = 402,46 ms.
Frente: +90 unidades durante a entrada; +96 após o trecho de soltura.
Passos observados: +3 ou +6 unidades/amostra.
Trás: -56 unidades durante a entrada; -60 após o trecho de soltura.
Passos observados: -2 ou -4 unidades/amostra.
Primeira alteração de posição: índice de amostra 1.
A velocidade Turbo pode produzir mais de uma atualização interna por amostra.

Ryu — Hadouken:
Entrada no estado de golpe: amostra 10; último estado observado: amostra 56.
47 amostras nesse estado = 788,15 ms nesta execução.
Projétil visível confirmado entre as amostras 22 e 35.
Primeira aparição: 368,92 ms após o início da sequência de comandos,
ou 201,23 ms após a entrada no estado de golpe.
Isto mede estado e aparência visual; não mede o primeiro quadro de colisão.

LIMITES IMPORTANTES PARA A PRÓXIMA ETAPA
Esta é uma extração inicial. Ainda faltam ataques normais, defesa, dano,
pulos, quedas, outros especiais, áudio e o repertório completo de cada lutador.
A corda/ponta da lança e efeitos do teleporte de Scorpion ainda não estão
separados em imagens transparentes; aparecem nas capturas originais.
Algumas transições de Scorpion ainda apresentam divergências de composição,
ordem ou atraso de exibição. A posição parada coincide em todos os pixels
visíveis comparados; isso não significa fidelidade integral de todas as poses.
Média de coincidência visível por sequência de Scorpion: 100% parado,
97,79% frente, 98,50% trás, 98,78% lança e 92,96% teleporte.
Há amostras isoladas de transição com coincidência bem menor.
Ryu: 100% parado e caminhadas; 99,89% em média no corpo durante Hadouken.
Projéteis mantidos na prévia tiveram pelo menos 95% de coincidência visível.
As comparações aceitam diferença de até 3 por canal de cor na captura.

Deslocamentos usam coordenadas internas de cada jogo, com câmera separada;
não são uma escala física já unificada para o crossover.
Os tempos completos dos clipes incluem comandos e pausas neutras. Não são
duração do golpe. Ainda não foram separados startup, active e recovery,
nem reconstruídas hitboxes, colisões, dano ou regras do combate.
O estado do golpe de Scorpion precisa de instrumentação adicional: antigos
offsets de depuração não são válidos após a nova alocação para dois jogadores.
Nenhuma dessas medidas representa recuperação do código-fonte original completo.

ARQUIVOS E CONTINUIDADE
Cada personagem tem manifesto-animacoes.json, spritesheet.png, quadros PNG,
medicao-bruta.json, capturas originais e CSVs por sequência.
Os manifestos preservam origem, posição, ponteiro, ordem e referência visual.
Evidências adicionais ficam em engenharia-reversa/evidencias.
A verificação da interface está em verificacao-interface.json.

Próxima etapa: completar e corrigir a composição dos efeitos e transições,
extrair ataques básicos/defesa/pulo e medir colisões e tempos de ação.
Depois, usar essas referências na implementação do combate independente.


Referência técnica de composição CPS2: https://github.com/libretro/mame2003-plus-libretro/blob/master/src/vidhrdw/cps1_vidhrdw.c
