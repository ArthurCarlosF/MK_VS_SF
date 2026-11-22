from pathlib import Path
import json,hashlib,shutil,datetime
W=Path(__file__).parent;P=Path(r'D:/projetos/Mortal Kombat vs Street Fighter');target=P/'expansao'
note='''
PROJÉTEIS DO RYU — REVISÃO 8.3 EXPERIMENTAL, 02/11/2026
Integrados Hadouken azul e vermelho nas três forças. O LP mantém a identidade
projectile para preservar os vínculos anteriores de cancelamento; os demais
não receberam cópias não medidas dessas regras.
Origem, percurso inicial, retângulos de ataque/choque, três velocidades,
animações, dano/bloqueio e reações usam testemunhas nativas do SSF2T US.
Golpe vermelho inclui a reação nativa de queimadura do Ryu, preservando a
paleta15. Contra Scorpion utiliza o catálogo próprio de reações MK.
O motor aceita imagens/âncoras e colisões por projétil. Contato tardio do
projétil não confirma um soco posterior do dono; o carro respeita essa regra.
As poses do lançador usam imagens comprovadamente idênticas às do atlas já
calibrado. Offsets do descritor nativo não são um apoio de pés comum.
Nove grupos funcionais de projéteis aprovados, incluindo 4/8/16 participantes.
Interface testada e conferida visualmente: azul, vermelho e queimadura.
Regressões anteriores de combate39 e sequências9 continuam aprovadas.
Limites: percurso após a amostra de contato extrapolado; cadência turbo,
dano aleatório, cancelamentos, cenários de proximidade/canto e refinamento
de paleta/latência visual de queimadura continuam pendentes de fidelidade.
Super e Tatsumaki aéreo ainda não integrados. Elenco, finalizações, cenários,
áudio e demais pendências do pedido integral continuam abertos.
GitHub contém a publicação intermediária8.2, commit8017028; esta revisão local
não representa a conclusão do projeto nem recebeu envio final.
'''
for filename in ['Estado da expansao.txt','arena/LEIA-ME.txt','CONTINUIDADE DO PROJETO.txt']:
 p=W/filename;s=p.read_text(encoding='utf-8-sig').split('\nPROJÉTEIS DO RYU — REVISÃO 8.3')[0];p.write_text(s.rstrip()+'\n'+note,encoding='utf-8-sig')
p=W/'Etapas do projeto.txt';s=p.read_text(encoding='utf-8-sig').replace('Expansão experimental: 8.2','Expansão experimental: 8.3')
entry='[x] Hadoukens azul/vermelho em três forças e reação nativa de queimadura Ryu integrados.\n[ ] Fechar a fidelidade dos projéteis: cadência, voo completo, aleatoriedade,\n    cancelamentos e variantes de contato de perto/em cantos.\n'
if entry not in s:s=s.replace('[ ] Repertório completo de especiais, parâmetros finais e fidelidade integral.',entry+'[ ] Repertório completo de especiais, parâmetros finais e fidelidade integral.')
p.write_text(s,encoding='utf-8-sig')
files=['arena/fight-engine.js','arena/session.js','arena/arena.js','arena/index.html','arena/ryu-projeteis.js','rede/server.cjs','index.html',
 'Estado da expansao.txt','arena/LEIA-ME.txt','CONTINUIDADE DO PROJETO.txt','Etapas do projeto.txt',
 'capturar-especiais-ryu.py','exportar-projeteis-ryu.py','testar-projeteis-ryu.cjs','testar-projeteis-interface.cjs',
 'atualizar-projeteis.py','instalar-projeteis.py','diagnosticar-queimadura.py']
for directory in ['arena/assets/ryu-projeteis','evidencias','projetil-nativo-r3','projetil-nativo-r4']:
 files.extend(str(f.relative_to(W)).replace('\\','/') for f in (W/directory).rglob('*') if f.is_file())
backup=P/'dados/plan-backups'/('projeteis-8.3-'+datetime.datetime.now().strftime('%Y%m%d-%H%M%S'));backup.mkdir(parents=True)
for relative in files:
 src=W/relative;dst=target/relative
 if dst.is_file() and dst.read_bytes()==src.read_bytes():continue
 if dst.is_file():old=backup/'expansao'/relative;old.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(dst,old)
 dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
shutil.copy2(P/'Etapas do projeto.txt',backup/'Etapas do projeto.txt');shutil.copy2(W/'Etapas do projeto.txt',P/'Etapas do projeto.txt')
assert all((W/r).read_bytes()==(target/r).read_bytes() for r in files)
(target/'evidencias/instalacao-projeteis-8.3.json').write_text(json.dumps({'status':'PASS','files':len(files),'backup':str(backup),'completeGame':False}),encoding='utf-8')
print(json.dumps({'status':'PASS','files':len(files),'backup':str(backup)},ensure_ascii=False))
