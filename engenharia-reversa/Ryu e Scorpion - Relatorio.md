# Ryu e Scorpion — primeiro mapa verificado

Atualizado em 23/10/2026.

A investigação localizou os caminhos de seleção das rotinas e dos recursos dos
personagens. Foram executados Hadouken de Ryu e lança e teleporte de Scorpion
nos jogos emulados, com entradas automáticas e dados próprios desta investigação.
As instalações originais e a seleção independente não foram modificadas.

Isso é uma base de engenharia reversa. Não é o código-fonte original completo,
não é um projeto recompilável e ainda não implementa combate no motor novo.

## O que foi verificado

| Verificação | Resultado |
|---|---|
| Identificação dos lutadores de SF | 16 identificadores conferidos em estados capturados após selecionar cada um |
| Código usado na análise de SF | 3.670.016 bytes coincidiram com a vista de instruções do núcleo em execução, com a ordem de bytes normalizada |
| Hadouken de Ryu | Reconhecedor percorreu 0 → 2 → 4 → 6 → 0; o estado de ação passou a 12 e o sinal de aceitação a 1 |
| Lança de Scorpion | Execução visual confirmada; ação 0x1D observada em 36 amostras |
| Teleporte de Scorpion | Execução visual confirmada; ação 0x215 observada em 49 amostras |
| Animações de Scorpion | Tabela de personagem leva ao conjunto compartilhado dos ninjas; 69 ponteiros consecutivos extraídos |
| Paleta de Scorpion | Localizada tabela por personagem e entrada com 64 cores |

As contagens de amostras não são tempos definitivos dos golpes. Velocidade,
amostragem e sincronização precisam ser medidos separadamente.

## Ryu — Super Street Fighter II Turbo americano

Endereços de SF são endereços de **bytes** do Motorola 68000.

- Identificador de Ryu: `0`; byte do personagem 1 em `0xFF87DF`.
- Estrutura do jogador 1: referência em `0xFF844E`.
- Despacho de reconhecimento: tabela em `0x7B0B4`, entrada de Ryu em `0x7F862`.
- A rotina chama outros reconhecedores e termina indo para `0x7FD6E`.
- Em `0x7FD6E`, o estado do Hadouken é lido no deslocamento `0x94` do jogador,
  isto é, `0xFF84E2`. O temporizador fica no byte seguinte.
- A tabela relativa em `0x7FD7C` leva aos casos `0x7FD84`, `0x7FDA0`,
  `0x7FDBE` e `0x7FDF2` para estados 0, 2, 4 e 6.
- Os testes direcionais são baixo, diagonal para a frente e frente, seguidos
  da verificação dos botões. A confirmação em `0x7FEA8` escreve a ação 12,
  limpa o reconhecedor e prepara o estado de animação.

O teste automático usou baixo por três passos, diagonal por três, frente por
três e frente + soco por três. A leitura de RAM confirmou os quatro estados
antes da aceitação do golpe. O controle sem entrada manteve o reconhecedor em 0.

A rotina `0x5246` escolhe o processamento de animação pelo personagem usando
uma tabela lida pela vista de dados em `0x100000`. A entrada de Ryu é `0x10FF12`.
Nesse trecho, o endereço de sequência é gravado no deslocamento `0x1A` do
jogador, e campos do registro são copiados para `0x18` e `0x14`. O formato
completo, a semântica de cada campo e a conversão das animações ainda faltam.

As rotinas `0x7F8B8`, `0x7FA4A`, `0x7FBA8` e `0x7FED2` são candidatas para os
outros reconhecedores de Ryu. Os nomes sugeridos no mapa JSON são hipóteses
apoiadas nos campos acessados e na organização das chamadas; não receberam
confirmação independente executando cada golpe nesta etapa.

## Scorpion — UMK3 arcade revisão 1.2

Endereços TMS34010 são endereços de **bits**. Para esta ROM:
`offset em bytes = (endereço - 0xFF800000) / 8`.

- Identificador de Scorpion: `18` (hexadecimal `0x12`).
- A rotina `0xFF9B3E60` lê o personagem no deslocamento `0x1F0` em bits do
  objeto apontado por A8, multiplica o índice por 32 bits e lê o ponteiro.
- A rotina `0xFFB02AD0` aplica a mesma seleção à tabela de animações
  `0xFFB02B90`. Para Scorpion, o conjunto começa em `0xFF935A30`.
- Os identificadores 18 a 23 compartilham esse conjunto. Isso comprova
  reaproveitamento de recursos, não equivalência de golpes ou comportamento.
- A paleta na tabela `0xFFB04C20` aponta para `0xFFB0CB20`: 64 cores RGB555.
- A entrada candidata da lança fica em `0xFFA9E7F0`; em `0xFFA9E880`, o
  código carrega a ação `0x1D` antes de continuar a preparação do golpe.
- A entrada candidata do teleporte fica em `0xFFA51C50`. Em `0xFFA51D10`,
  carrega `0x215`, e em `0xFFA51D30` grava esse valor no campo de ação.
- O trecho `0xFFA9FCF0` grava `0x11A` e é candidato à puxada da corda;
  essa atribuição não recebeu um teste independente de confirmação nesta etapa.

Nos testes, a lança usou trás, soltar, trás e soco baixo; o teleporte usou
baixo, trás e soco alto. As capturas mostram a lança e a mudança de posição
com o ataque de teleporte. Os estados 0x1D e 0x215 foram observados nos mesmos
campos dos arquivos de estado. Seus offsets estão no JSON e NÃO devem ser
confundidos com endereços da memória do jogo.

Os nomes das rotinas são atribuições do analista, confrontadas com os valores
de ação, a desmontagem e o comportamento observado. Não foi gravado um trace
completo, instrução por instrução, do processador.

## Revisão da análise automática

O primeiro lote do Ghidra exportou 364 pseudofunções e falhou em 130 de 494
candidatas. Isso é uma contagem da ferramenta, não um percentual de recuperação.
Código e dados ainda precisam ser separados conforme o acesso realizado pelo CPS2.

Na exportação focada, 3 de 10 trechos geraram pseudocódigo e 7 falharam com
`Assignment to constant`. Os trechos gerados também contêm avisos de tabelas
indiretas. Os arquivos de erro foram mantidos. Não foi atribuído sucesso às
rotinas que o decompilador não conseguiu reconstruir.

O material mais útil desta etapa é a combinação de blocos de assembly revisados,
tabelas de endereços, testes de entrada e estados de RAM. O REA permanece
instalado, mas seu adaptador Ghidra no Windows não admite estas arquiteturas.
A análise complementar usou o Ghidra diretamente, Capstone e o desmontador TMS
do MAME, sem apresentar essa execução como suporte nativo do REA.

## Arquivos para continuar

- `ssf2t/ryu-mapa.json`: vínculos, endereços, grau de confirmação e limites.
- `ssf2t/ryu-blocos-revisados.asm`: trechos relevantes do código de Ryu.
- `ssf2t/ryu-tracos.csv`: reconhecedor e estado de ação, amostra por amostra.
- `umk3/scorpion-mapa.json`: vínculos de personagem, animação, paleta e golpes.
- `umk3/scorpion-blocos-revisados.asm`: trechos relevantes de Scorpion.
- `umk3/scorpion-tracos.json`: observações das ações na execução isolada.
- `umk3/tabelas-por-personagem.json`: 26 usos candidatos de tabelas; vários são
  dados, não funções de combate. A classificação ainda é parcial.
- `umk3/resumo-fluxo.json`: percurso estático inicial de 2.776 instruções e
  142 entradas candidatas, limitado por saltos indiretos e tarefas cooperativas.
- `evidencias/verificacao-descobertas.json`: verificações automáticas desta etapa.
- `evidencias/identidades-descobertas.json`: hashes dos arquivos usados.
- `ferramentas/consolidar_descobertas.py`: repete as verificações a partir das capturas.
- `ferramentas/observar_sf.py` e `observar_mk.py`: experimentos emulados; usam
  recursos já extraídos no workspace anterior e não dependem das instalações originais.

## O que ainda falta para o nosso motor

1. Decodificar e exportar os quadros de luta e suas sequências, começando por
   parado, andar e ataque básico de Scorpion e Ryu.
2. Medir deslocamentos, duração e janelas de comandos nos originais.
3. Recuperar colisões, dano, bloqueio e estados de acerto/defesa.
4. Implementar e comparar um confronto mínimo no motor independente.
5. Depois ampliar para os demais especiais, combos, supers e fatalities.

Esta investigação não resolve automaticamente o casamento entre as duas
mecânicas. Ela oferece referências concretas para implementar e verificar isso.

## Referências e origem

Os bytes de jogo são exclusivamente das cópias locais fornecidas pelo usuário.

- Núcleo e desmontador MAME: https://github.com/libretro/mame2003-plus-libretro
- Algoritmo CPS2: `src/machine/cps2crypt.c` do mesmo repositório (BSD-3-Clause).
- Referências de RAM de SF, confrontadas com as capturas locais:
  https://github.com/poliva/ssf2xj/blob/master/lua/pof-ssf2x-training2020.lua
- Limite de arquiteturas do REA no Windows:
  https://github.com/morluto/rea/blob/main/docs/windows-ghidra-p0.md
- Constantes de ações de MK também foram comparadas aos cabeçalhos já presentes
  na investigação anterior; os nomes não foram tratados como prova isolada de
  correspondência entre versões.
