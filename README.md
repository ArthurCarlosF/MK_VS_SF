# Mortal Kombat vs Street Fighter

Protótipo independente de um crossover entre **UMK3 arcade 1.2** e **Super Street Fighter II Turbo US**. Estado publicado: **8.2 experimental**, em desenvolvimento; o jogo completo ainda não está concluído.

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

- Ryu e Scorpion integrados ao combate, inclusive em vagas repetidas.
- Seleção com 38 retratos, separando os universos MK e SF.
- Movimento, ataques básicos, defesa, agarrões, lança e teleporte, em calibração.
- Shoryuken e Tatsumaki terrestres em três forças, com recursos e trajetórias nativos medidos.
- Partidas simultâneas, câmera conforme sobreviventes e salas de rede local para 2 a 8 participantes; o motor aceita até 16.
- Desafio cooperativo de destruir carro com arte e regras provisórias.
- Capturas iniciais dos outros personagens, ferramentas de análise e relatórios de desenvolvimento.

Ainda faltam os outros 36 personagens com combate próprio, chefes/secretos adicionais, repertórios completos, cenários, áudio, campanha e finalizações MK. Há 45 divergências SF na comparação anterior de sequências, além de outras calibrações pendentes. Os novos especiais também não têm fidelidade integral aprovada. A abertura em outro aparelho foi confirmada, mas a validação física completa de lutas e controles segue pendente.

As finalizações planejadas são as existentes no **UMK3 arcade**, sem Brutalities de console. Personagens SF preservam seu próprio repertório, sem finalizações inéditas.

Veja [Etapas do projeto.txt](Etapas%20do%20projeto.txt), [estado da expansão](expansao/Estado%20da%20expansao.txt) e [continuidade](expansao/CONTINUIDADE%20DO%20PROJETO.txt).

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
