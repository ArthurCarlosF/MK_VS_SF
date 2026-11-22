from pathlib import Path
import os,json
W=Path(__file__).parent;os.environ['MKVSF_SPECIAL_OUTPUT']='sonda-entrada-aerea-r2'
source=(W/'capturar-especiais-ryu.py').read_text(encoding='utf-8');exec(compile(source[:source.index('assets={};pixels={};cases={};')],str(W/'capturar-especiais-ryu.py'),'exec'))
result=[]
for direction,up,delay in [(d,u,n) for d,u in [('back',[4,6]),('neutral',[4]),('forward',[4,7])] for n in [3,4,5,6]]:
 restore(baseline);ticks([],3);rows=[];i=0
 for keys,n in [([5],3),([5,6],3),([6],3),(up,delay),(up+[9],2),([],70)]:
  for _ in range(n):
   ticks(keys,1);a=actors(state())[0];raw=bytes.fromhex(a['runtime']);v=lambda o:int.from_bytes(raw[o:o+2],'big',signed=True)/256
   rows.append({'sample':i,'state':a['state'],'pose':a['pose'],'y':a['y'],'meter':a['meter'],'vx':v(0x3c),'vy':v(0x3e),'gravity':v(0x42)});i+=1
 accepted=[r for r in rows if r['state'][1]==12]
 report={'direction':direction,'upSamples':delay,'accepted':bool(accepted),'firstSpecial':accepted[0] if accepted else None,'rows':rows};result.append(report)
 print(json.dumps({k:v for k,v in report.items() if k!='rows'}),flush=True)
(W/'evidencias/entrada-tatsu-aereo.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit()
