from pathlib import Path
import json
H=Path(__file__).resolve().parents[1]
P=H.parents[1]
records={}
for game in ['umk3','ssf2tu']:
 path=H/'execucao-01/original'/game/'rep-1/trace.json'
 if not path.exists():continue
 d=json.loads(path.read_text());summary={}
 for c in d['cases']:
  poses=[s['after']['pose'] for s in c['samples']]
  changes=[{'sample':i,'pose':v,'state':c['samples'][i]['after']['state_raw']} for i,v in enumerate(poses) if i==0 or v!=poses[i-1]]
  if game=='umk3':
   active={'punch':{'0xff9393d0','0xff9394f0'},'kick':{'0xff93ac90'},'punch_low':{'0xff937f70'},'kick_low':{'0xff938170'}}
  else:active={'punch':{'0x11017a'},'kick':{'0x11050a'},'punch_low':{'0x1107a6'},'kick_low':{'0x110932'}}
  family=next((k for k in ['punch_low','kick_low','punch','kick'] if c['id'].startswith(k)),None)
  extensions=[r['sample'] for r in changes if family and r['pose'] in active[family]]
  summary[c['id']]={'extensions':extensions,'changes':changes,'life_final':c['samples'][-1]['after']['life_native']}
 records[game]={'fps':d['fps'],'cases':summary}
 for kind in ['punch','kick','punch_low','kick_low']:
  print(game,kind,'pairs',[(k.rsplit('_',1)[1],v['extensions']) for k,v in summary.items() if k.startswith(kind+'_pair_')])
  print('TRAINS',[(k,v['extensions']) for k,v in summary.items() if k.startswith(kind+'_train_')])
 for id in ['guard_punch','jump_held','spear_motion','hadouken_motion','hadouken_release']+[f'hadouken_gap_{g:02}' for g in [4,8,12,20,30,40]]:
  print(game,id,[(x['sample'],x['pose'],x['state']) for x in summary[id]['changes']][:16])
(H/'analise-nativa.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
