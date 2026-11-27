# Mortal Kombat vs Street Fighter

Protótipo independente de um crossover entre **UMK3 arcade 1.2** e **Super Street Fighter II Turbo US**. Esta publicação reúne o elenco implementado e a validação de locomoção de novembro de 2026. O jogo continua em desenvolvimento.

## Executar

Instale Node.js 24 com npm. Na pasta do repositório:

```sh
npm ci
npm start
```

Abra <http://localhost:8765/> para criar ou entrar em uma sala. O terminal informa os endereços para outros aparelhos da mesma rede. Mantenha o servidor aberto; `Ctrl+C` encerra. O acesso por outros aparelhos depende da liberação da porta 8765 na rede local do anfitrião.

O jogo usa teclado, controles de console e botões na tela. Cada aparelho controla sua própria vaga. O anfitrião pode esperar os participantes escolherem seus personagens e ficarem prontos antes de iniciar.

Para preparar uma partida no mesmo aparelho, abra <http://localhost:8765/expansao/index.html>. Os comandos de Windows que usam caminhos da instalação original são mantidos como histórico; `npm start` é a entrada portátil deste repositório.

## Estado atual

- 43 personagens selecionáveis, separando os universos MK e SF, com repertórios implementados em revisão.
- Caminhada para frente e para trás aprovada para os 43 personagens: 26 MK e 17 SF. Foram conferidas também as transições de direção, agachar/levantar e corrida onde existe no original.
- Movimento, ataques básicos, defesa, agarrões, lança e teleporte, em calibração.
- Especiais terrestres do Ryu, Tatsumaki aéreo e Shinku Hadouken em calibração.
- Partidas simultâneas, câmera conforme sobreviventes e salas de rede local para 2 a 8 participantes; o motor aceita até 16.
- 16 cenários de Street Fighter com escolha sincronizada nas salas, músicas da coletânea e primeiros efeitos do Scorpion.
- Desafio cooperativo do carro com cais, colisões, estados de dano e pontuação recuperados do SSF2. Relógio e efeitos ainda em revisão.
- Capturas iniciais dos outros personagens, ferramentas de análise e relatórios de desenvolvimento.

Implementação não significa validação integral: golpes, finalizações, cenários, áudio, colisões e controles em rede continuam exigindo comparação e correções. Esta publicação não certifica o jogo completo ou fidelidade integral aos arcades. Os 43 perfis de caminhada aprovados estão ativos; as demais validações do plano continuam separadas.

As finalizações planejadas são as existentes no **UMK3 arcade**, sem Brutalities de console. Personagens SF preservam seu próprio repertório, sem finalizações inéditas.

Veja o [plano com as caixas atuais](Novo%20plano%20do%20projeto.txt), a [validação das caminhadas](Validacao%20das%20caminhadas.txt) e o [ponto de retomada](PROGRESSO%20PARA%20CONTINUAR.txt). Os resumos dos testes estão em `validacao-locomocao/`.

## Testes

```sh
npm test
```

Confere os recursos dos 43 perfis de caminhada, os testes funcionais dos seis especiais do Ryu e os testes do protocolo de rede. Os testes abrem uma porta temporária e não encerram o servidor da instalação local. Outros testes e capturadores de pesquisa ainda dependem de caminhos, ferramentas e evidências da máquina de desenvolvimento; não fazem parte dessa rotina portátil. Aprovação funcional não comprova fidelidade integral aos arcades.

## Organização e publicação

- `expansao/`: versão experimental atual, motor, recursos e rede.
- `arena/`: versão anterior de referência, preservada.
- `assets/`, `roster.js`: recursos da seleção.
- `comparacao/`, `engenharia-reversa/`, `ferramentas/`: ferramentas e relatórios selecionados.
- `PUBLICACAO.json`: seleção de arquivos incluídos e exclusões.

ROMs, coletâneas completas, saves, estados completos de memória emulada, perfis de navegador, binários instalados e capturas brutas volumosas permanecem locais. O protótipo usa os recursos visuais já exportados incluídos neste repositório; ferramentas de nova extração precisam das fontes locais. A análise não recuperou integralmente o código-fonte original dos jogos.

Os nomes e recursos dos jogos pertencem aos seus respectivos titulares. Esta publicação não atribui ao projeto a autoria desses recursos. Dependências do servidor e seus avisos constam em [TERCEIROS.txt](expansao/rede/TERCEIROS.txt) e no arquivo de dependências. Nenhuma licença geral sobre recursos de terceiros é concedida aqui.
