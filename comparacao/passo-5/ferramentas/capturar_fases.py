"""Numeric native phase capture; baseline/config remain inside this execution."""
from pathlib import Path
import ast,sys
PROJECT=Path(__file__).resolve().parents[3]
stub=(PROJECT/'comparacao/passo-4/ferramentas/capturar.py').read_text(encoding='utf-8')
assignment=next(n for n in ast.parse(stub).body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='body' for t in n.targets))
body=ast.literal_eval(assignment.value)
exec(compile(stub[:stub.index('body=')],str(__file__),'exec'))
body=body.replace("'state':list(read(base+2,4)),", "'state':list(read(base+2,4)),'animationTimer':num(base+0x1e,2),'runtimeBytes':read(base,0x100).hex(),")
body=body.replace("start=observe(state());folder", "start=observe(state());last=start;folder")
body=body.replace("before=observe(state());ticks", "before=last;ticks")
body=body.replace("b=state();after=observe(b)","b=state();after=observe(b);last=after")
body=body.replace("render=[visual(b,after,p) for p in [0,1]] if c.get('visual',True) else None", "render=None")
exec(compile(prefix+setup+data+body,str(__file__),'exec'))
