"""Install verified experimental 8.5. Preserve legacy arena and previous files."""
from pathlib import Path
import json,shutil,datetime
W=Path(__file__).parent;P=Path(r'D:/projetos/Mortal Kombat vs Street Fighter');target=P/'expansao'
stamp=datetime.datetime.now().strftime('%Y%m%d-%H%M%S');backup=P/'dados/plan-backups'/('aereos-super-8.5-'+stamp);backup.mkdir(parents=True)
for name in ['Estado da expansao.txt','arena/LEIA-ME.txt','CONTINUIDADE DO PROJETO.txt','Etapas do projeto.txt']:
 src=W/name;dst=backup/'trabalho-anterior'/name;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
status='''MORTAL KOMBAT VS STREET FIGHTER — EXPANSÃO 8.5 EXPERIMENTAL
Atualizado em 02/11/2026

COMO ABRIR
Use “Abrir expansao.cmd”, na pasta principal do projeto.
Rede local: http://192.168.0.199:8765/ (endereço atual deste PC).
Após atualizar, recarregue a arena para aparecer a revisão 8.5.

IMPLEMENTADO NESTA REVISÃO
Shinku Hadouken do Ryu, com barra SUPER visível, consumo na ativação,
pausa dos outros lutadores/projéteis e relógio da rodada em andamento.
Comando: baixo, diagonal à frente, frente, baixo, diagonal à frente,
frente + soco, com a barra cheia. As variações de retorno pelo neutro,
diagonal e trás foram verificadas em sessões do Super Turbo original.
O projétil pode continuar após acertar, com pausa entre contatos e um
orçamento de até cinco contatos, compartilhado entre alvos e choques.
Um Hadouken azul/vermelho gasta um contato; Supers completos se anulam.
Distância e movimento podem impedir que todos os contatos acertem.

Tatsumaki aéreo nas três forças, com arte/reação nativa e aterrissagem própria.
Comando no ar: baixo, diagonal para trás, trás + chute.
Na subida aplica impulso horizontal e gravidade reduzida por um período.
Na descida conserva o movimento do salto, sem o impulso de subida.
Direção do salto e força do chute influenciam o movimento.
Durante a preparação do salto, ainda no chão, vale a variante terrestre.

PERMANECE DISPONÍVEL
Ryu e Scorpion jogáveis; básicos, defesa, agarrões, sequências e especiais.
Ryu: Hadouken azul/vermelho, Shoryuken e Tatsumaki terrestre em três forças.
Scorpion: lança com puxão e teleporte; sequências de socos e combos atuais.
Salas pela rede local, anfitrião, prontidão, carregamento sincronizado,
reconexão, todos contra todos simultâneo e equipes experimentais.
Interface para 2 a 8 participantes; motor testado também com 16.
Teclado, mapeamento de controles e botões na tela; zoom conforme sobreviventes.
Treino, versus local, IA simples e protótipo cooperativo de destruir carro.
38 retratos/pacotes iniciais extraídos. Apenas Ryu e Scorpion estão integrados
ao combate: os demais pacotes ainda não representam personagens jogáveis.

VALIDAÇÃO DESTA REVISÃO
9 grupos de Super, 9 de especiais aéreos e 6 de políticas de pausa aprovados.
Interface: comandos, três forças, aterrissagem, arte e barra sem erros de carga.
Super pela rede: comando de teclado, ativação e barra idênticos em dois
navegadores independentes; barra inicial preparada somente no servidor de teste.
Regressões e protocolo de rede continuam sendo verificados separadamente.

LIMITES REAIS — PEDIDO INTEGRAL AINDA PENDENTE
Cadência nativa exata, dano aleatório, cantos, cancelamentos, contatos
intermediários e certas variantes de reação/âncora ainda exigem comparação.
A física aérea usa campos medidos; a fase do relógio lógico é aproximada.
As alturas das curvas normais correspondem à inferência de velocidade,
mas isso não equivale a aprovar a fidelidade integral do movimento.
Choques de Supers com orçamentos diferentes ainda precisam de testemunhas.
As 45 divergências SF do relatório anterior não foram declaradas resolvidas.
Faltam integrar o restante do elenco e personagens secretos/chefes, seus
repertórios completos, as finalizações nativas do UMK3 arcade, todos os
cenários, áudio, apresentação, modos finais, acabamento e validação física.
O desafio do carro permanece um protótipo de regras/arte, não a conversão final.
Não foram acrescentadas Brutalities de console nem finalizações fictícias SF.

PRESERVAÇÃO E PUBLICAÇÃO
Arena anterior preservada; instalação mantém cópias dos arquivos substituídos.
GitHub: publicação intermediária 8.2, commit 8017028; esta revisão local 8.5
não é a versão completa nem foi apresentada como envio final do projeto.
Roteiro completo, em uma sequência de 1 a 15: Etapas do projeto.txt.
'''
(W/'Estado da expansao.txt').write_text(status,encoding='utf-8-sig')
(W/'arena/LEIA-ME.txt').write_text(status,encoding='utf-8-sig')
old=(W/'CONTINUIDADE DO PROJETO.txt').read_text(encoding='utf-8-sig')
continuity='''CONTINUIDADE — REVISÃO LOCAL 8.5, 02/11/2026
Estado atual de uso: Estado da expansao.txt. Roteiro: Etapas do projeto.txt.
Super e Tatsumaki aéreo agora integrados; notas anteriores de ausência são históricas.
Originais e arena anterior preservados. GitHub ainda contém a publicação 8.2.

NOVOS DADOS E MOTOR
arena/ryu-super.js e ryu-aereos.js gerados de sessões nativas SSF2T US.
arena/special-engine.js: pausa de ativação e física aérea reutilizáveis.
fight-engine.js: orçamento/pausa de recontato e choque entre projéteis,
fases aéreas/aterrissagem e continuidade do voo no fim de rodada.
commands.js: direções intermediárias verificadas e limites de intervalo
entre etapas. Retorno pelo neutro não renova o tempo da direção anterior.
session.js: carro respeita pausas e orçamento do projétil.
Servidor e HTML carregam os mesmos dados. combatRevision: ryu-aereos-8.5.
Snapshots de rede incluem superFreeze, medidor e fase de aterrissagem.

EVIDÊNCIAS
super-nativo-r1: quatro situações; sondas-pausa-super-r2.json:
pausa não congela FF8DCE, entradas precoces descartadas, últimas duas
amostras aceitas; movimentos direcionais/reconhecedores param na ativação.
choques-super-nativo-r1.json: azul/vermelho gastam um contato e pausam
o Super; dois Supers inteiros se anulam. Orçamentos diferentes pendentes.
comando-super-nativo-r1.json: seis sondas, incluindo retornos neutro,
diagonal e trás aceitos; ausência do primeiro frente rejeitada.
aereo-nativo-r1/r2/r3: 30 situações, forças/altura/direção/momento do salto.
aereo-nativo-r4: impactos aéreos reais, dano testemunhado16/17/19.
fisica-aerea-medida.json: campos 8.8 em3c/3e, desaceleração40, gravidade42;
656 testemunhas estáveis, uma divergência de0,125px e nove não resolvidas.
Impulso256/384/512, gravidade32 durante12/24/30 atualizações na subida;
normal80. Na descida não há impulso/flutuação. Arrasto magnitudinal5.
Velocidade inicial dos saltos: vertical(0,1824), frente(896,1792),
trás(-1024,1856), em8.8. Curvas de altura existentes sem divergências
na inferência registrada; fase de atualização continua aproximada.
Não interpretar essa aprovação como fidelidade completa ou elenco completo.

Scripts exportar-super-ryu.py, exportar-aereos-ryu.py e testes correspondentes.
Testes novos: Super9, aéreos9, pausa6; UI e dois navegadores independentes.
Teste de rede usa barra100 preparada no servidor de teste, não acesso pelo cliente.
Nenhuma declaração de que todos os personagens/finalizações já existem.

HISTÓRICO ANTERIOR (pode descrever pendências já substituídas acima)
'''
(W/'CONTINUIDADE DO PROJETO.txt').write_text(continuity+old,encoding='utf-8-sig')
p=W/'Etapas do projeto.txt';s=p.read_text(encoding='utf-8-sig').replace('Expansão experimental: 8.3','Expansão experimental: 8.5')
addition='''[x] Shinku Hadouken: barra, pausa, contatos sucessivos e choques nativos integrados.
[x] Tatsumaki aéreo nas três forças, física por fase e aterrissagem integrados.
[ ] Fechar a fidelidade do Super e dos aéreos: relógio lógico, aleatoriedade,
    contatos intermediários/em cantos, cancelamentos e refinamento das origens.
'''
if addition not in s:s=s.replace('[ ] Repertório completo de especiais, parâmetros finais e fidelidade integral.',addition+'[ ] Repertório completo de especiais, parâmetros finais e fidelidade integral.')
p.write_text(s,encoding='utf-8-sig')
files=['index.html','rede/server.cjs','Estado da expansao.txt','CONTINUIDADE DO PROJETO.txt','Etapas do projeto.txt',
 'capturar-especiais-ryu.py','exportar-super-ryu.py','exportar-aereos-ryu.py','atualizar-super.py','atualizar-aereos.py','instalar-aereos-super.py',
 'testar-super-ryu.cjs','testar-super-rede.cjs','testar-super-interface.cjs','testar-aereos-ryu.cjs','testar-aereos-interface.cjs','testar-aereos-rede.cjs','testar-pausa-super.cjs',
 'analisar-fisica-aerea.py','medir-velocidades-aereas.py','medir-entrada-aerea.py','medir-pausa-super.py','medir-choques-super.py','medir-comando-super.py','sondar-poses-fixas.py']
for directory in ['arena','evidencias','super-nativo-r1','aereo-nativo-r1','aereo-nativo-r2','aereo-nativo-r3','aereo-nativo-r4']:
 files.extend(str(f.relative_to(W)).replace('\\','/') for f in (W/directory).rglob('*') if f.is_file())
changed=[]
for relative in files:
 src=W/relative;dst=target/relative
 if dst.is_file() and dst.read_bytes()==src.read_bytes():continue
 if dst.is_file():oldfile=backup/'expansao'/relative;oldfile.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(dst,oldfile)
 dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst);changed.append(relative)
shutil.copy2(P/'Etapas do projeto.txt',backup/'Etapas do projeto.txt');shutil.copy2(W/'Etapas do projeto.txt',P/'Etapas do projeto.txt')
assert all((W/r).read_bytes()==(target/r).read_bytes() for r in files)
result={'status':'PASS','revision':'8.5','changedFiles':len(changed),'backup':str(backup),'completeGame':False}
for folder in [W/'evidencias',target/'evidencias']:(folder/'instalacao-aereos-super-8.5.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
