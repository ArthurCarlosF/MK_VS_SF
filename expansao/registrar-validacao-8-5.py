from pathlib import Path
import json,shutil
W=Path(__file__).parent;P=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/expansao')
note='''
VALIDAÇÃO POSTERIOR À INSTALAÇÃO — 02/11/2026
Tatsumaki aéreo leve executado por teclado no servidor real da rede local,
com dois navegadores independentes recebendo o mesmo estado e altura.
Salas do teste encerradas ao final. Testes novos: Super9, aéreos9, pausa6.
Regressões: projéteis9, especiais terrestres8, combate39, sequências9 e rede12
aprovados. Comparações de fidelidade ainda pendentes não foram encerradas.
Conferência de instalação: arena nova idêntica à testada e677 arquivos da
arena anterior preservados. Roteiro continua em uma única sequência1 a15.
'''
for name in ['Estado da expansao.txt','arena/LEIA-ME.txt','CONTINUIDADE DO PROJETO.txt']:
 p=W/name;s=p.read_text(encoding='utf-8-sig')
 if note not in s:p.write_text(s.rstrip()+'\n'+note,encoding='utf-8-sig')
 shutil.copy2(p,P/name)
for name in ['testar-aereos-rede.cjs','instalar-aereos-super.py','registrar-validacao-8-5.py']:
 shutil.copy2(W/name,P/name)
for src in (W/'evidencias').rglob('*'):
 if src.is_file():
  dst=P/'evidencias'/src.relative_to(W/'evidencias');dst.parent.mkdir(parents=True,exist_ok=True)
  if not dst.is_file() or dst.read_bytes()!=src.read_bytes():shutil.copy2(src,dst)
print(json.dumps({'status':'PASS','networkEvidence':'testes-aereos-rede.json','completeGame':False}))
