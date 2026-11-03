# Mortal Kombat vs Street Fighter

Protótipo independente de um crossover entre **UMK3 arcade 1.2** e **Super Street Fighter II Turbo US**. Este repositório contém a revisão **8.7 experimental**.

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

- Ryu e Scorpion integrados ao combate. E. Honda, Blanka, Guile, T. Hawk e Ken têm ataques básicos e reações próprias.
- Seleção com 38 retratos, separando os universos MK e SF.
- Movimento, ataques básicos, defesa, agarrões, lança e teleporte, em calibração.
- Especiais terrestres do Ryu, Tatsumaki aéreo e Shinku Hadouken em calibração.
- Partidas simultâneas, câmera conforme sobreviventes e salas de rede local para 2 a 8 participantes; o motor aceita até 16.
- 16 cenários de Street Fighter com escolha sincronizada nas salas, músicas da coletânea e primeiros efeitos do Scorpion.
- Desafio cooperativo do carro com cais, colisões, estados de dano e pontuação recuperados do SSF2. Relógio e efeitos ainda em revisão.
- Capturas iniciais dos outros personagens, ferramentas de análise e relatórios de desenvolvimento.

Ainda faltam o restante do elenco, repertórios completos, cenários MK, áudio, campanha e finalizações. Há 45 divergências SF na comparação anterior de sequências e a validação física de lutas e controles em rede segue pendente.

As finalizações planejadas são as existentes no **UMK3 arcade**, sem Brutalities de console. Personagens SF preservam seu próprio repertório, sem finalizações inéditas.

Veja [Etapas do projeto.txt](Etapas%20do%20projeto.txt), [estado da expansão](expansao/Estado%20da%20expansao.txt) e [ponto de retomada da bancada](expansao/RETOMAR%20AMANH%C3%83.txt).

## Testes

```sh
npm test
```

Executa os testes funcionais dos seis especiais do Ryu e os testes do protocolo de rede. Os testes abrem uma porta temporária e não encerram o servidor da instalação local. Outros testes e capturadores de pesquisa ainda dependem de caminhos, ferramentas e evidências da máquina de desenvolvimento; não fazem parte dessa rotina portátil. Aprovação funcional não comprova fidelidade integral aos arcades.

## Organização e publicação

- `expansao/`: versão experimental atual, motor, recursos e rede.
- `arena/`: versão anterior de referência, preservada.
- `assets/`, `roster.js`: recursos da seleção.
- `comparacao/`, `engenharia-reversa/`, `ferramentas/`: ferramentas e relatórios selecionados.
- `PUBLICACAO.json`: seleção de arquivos incluídos e exclusões.

ROMs, coletâneas completas, saves, estados completos de memória emulada, perfis de navegador, binários instalados e capturas brutas volumosas permanecem locais. O protótipo usa os recursos visuais já exportados incluídos neste repositório; ferramentas de nova extração precisam das fontes locais. A análise não recuperou integralmente o código-fonte original dos jogos.

Os nomes e recursos dos jogos pertencem aos seus respectivos titulares. Esta publicação não atribui ao projeto a autoria desses recursos. Dependências do servidor e seus avisos constam em [TERCEIROS.txt](expansao/rede/TERCEIROS.txt) e no arquivo de dependências. Nenhuma licença geral sobre recursos de terceiros é concedida aqui.
