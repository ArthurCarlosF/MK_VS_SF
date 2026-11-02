"""Input-only native chain/cancel experiment, independent emulator process."""
from pathlib import Path
import ast,sys
PROJECT=Path(__file__).resolve().parents[3]
stub=(PROJECT/'comparacao/passo-4/ferramentas/capturar.py').read_text(encoding='utf-8')
node=next(n for n in ast.parse(stub).body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='body' for t in n.targets))
body=ast.literal_eval(node.value)
exec(compile(stub[:stub.index('body=')],str(__file__),'exec'))
body=body.replace("'state':list(read(base+2,4)),", "'state':list(read(base+2,4)),'runtimeBytes':read(base,0x60).hex(),")
body=body.replace("start=observe(state());folder", "start=observe(state());last=start;contact=None;poseAge=[0,0];folder")
body=body.replace("before=observe(state());ticks(keys(seg.get('p1',{})),1,keys(seg.get('p2',{})));b=state();after=observe(b)", """before=last;second=seg.get('p2',{})
  if c['meta'].get('defendAfterContact') and contact is not None:second={'raw':[10]} if game=='umk3' else {'x':1}
  ticks(keys(seg.get('p1',{})),1,keys(second));b=state();after=observe(b);last=after
  if contact is None and (after['players'][1]['health']<before['players'][1]['health'] or (game=='ssf2tu' and bytes.fromhex(after['players'][1]['runtimeBytes'])[0x47]>0)):contact=i
  poseAge=[poseAge[p]+1 if before['players'][p]['pose']==after['players'][p]['pose'] else 0 for p in [0,1]]""")
body=body.replace("render=[visual(b,after,p) for p in [0,1]] if c.get('visual',True) else None", "render=[visual(b,after,p) if poseAge[p]<3 else None for p in [0,1]] if c.get('visual',True) else None")
body=body.replace("'input':[seg.get('p1',{}),seg.get('p2',{})]", "'input':[seg.get('p1',{}),second]")
body=body.replace("'initial':start,'samples':samples", "'initial':start,'contactSample':contact,'samples':samples")
exec(compile(prefix+setup+data+body,str(__file__),'exec'))
