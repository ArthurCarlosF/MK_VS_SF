"""Render-only native frame fixtures. All mutations are isolated save-state RAM."""
from pathlib import Path
import os,json,hashlib
import numpy as np
W=Path(__file__).parent;os.environ['MKVSF_SPECIAL_OUTPUT']='poses-fixas-sonda-r1'
source=(W/'capturar-especiais-ryu.py').read_text(encoding='utf-8');exec(compile(source[:source.index('assets={};pixels={};cases={};')],str(W/'capturar-especiais-ryu.py'),'exec'))
out=W/'evidencias/poses-fixas';out.mkdir(exist_ok=True);reports=[]
for label,pointer,timer in [('hold',0x11145e,32767),('advance',0x11145e,1),('previous',0x111446,1),('air',0x111ade,1)]:
 restore(baseline);ticks([],3)
 b=putmem(state(),0xff844e+0x1a,pointer.to_bytes(4,'big'));b=putmem(b,0xff844e+0x18,timer.to_bytes(2,'big'));restore(b)
 history=[]
 for i in range(5):
  if i>0:restore(putmem(state(),0xff844e+0x18,b'\x7f\xff'))
  ticks([],1);b=state();d=observe(b);choices=[]
  for alt in [False,True]:
   im,meta,x,y=decode(d,alt);q,n=quality(im,np.array(latest.convert('RGB')),x,y);choices.append((q,n,im,meta))
  q,n,im,meta=max(choices,key=lambda r:r[0]);sha=hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest();actor_row=actors(b)[0]
  history.append({'sample':i,'pose':actor_row['pose'],'size':list(im.size),'match':q,'pixels':sha,'descriptorAnchor':meta['origin_in_png']})
  if i==4:
   im.save(out/(label+'.png'));latest.save(out/(label+'-scene.png'));left,top,_,_=meta['hardware_bounds'];root=screen_root(actor_row,camera_origin(b))
   history[-1]['calibratedAnchor']=[root[0]+owner_origin_correction[0]-(left-64),root[1]+owner_origin_correction[1]-(top-16)]
 reports.append({'case':label,'requestedPointer':hex(pointer),'timerFixture':timer,'frames':history});print(json.dumps(reports[-1]),flush=True)
(out/'report.json').write_text(json.dumps({'romModified':False,'setup':'isolated RAM frame pointer and animation timer fixtures','cases':reports},indent=2),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit()
