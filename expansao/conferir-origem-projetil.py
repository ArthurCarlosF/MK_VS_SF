from pathlib import Path
import os,json
import numpy as np
W=Path(__file__).parent;os.environ['MKVSF_SPECIAL_OUTPUT']='origem-projetil'
source=(W/'capturar-especiais-ryu.py').read_text(encoding='utf-8')
exec(compile(source[:source.index('assets={};pixels={};cases={};')],str(W/'capturar-especiais-ryu.py'),'exec'))
restore(baseline);ticks([],3);index=0;observed=[]
for keys,count in [([5],3),([5,7],3),([7],3),([7,0],2),([],35)]:
 for _ in range(count):
  before=state();d0=observe(before);ticks(keys,1);after=state();d1=observe(after)
  if 19<=index<=26:
   row={'sample':index,'native':{},'objects':[]}
   for phase,b,d in [('before',before,d0),('after',after,d1)]:
    qs=projectiles(b);cx=int.from_bytes(readmem(b,0xff8ed4,2),'big',signed=True);cy=int.from_bytes(readmem(b,0xff8ed8,2),'big',signed=True)
    row['native'][phase]={'camera':[cx,cy],'projectiles':[(q['x'],q['y']) for q in qs],'player':[d['x'],d['y']]}
    for alt in [False,True]:
     objects=[v[:4] for v in d['all_objects_alt' if alt else 'all_objects'] if (v[3]&31)==14 and 0xe200<=v[2]<0xe300]
     if not objects:continue
     use=dict(d);use['p1_objects']=objects
     if qs:use['frame']=qs[0]['pose']
     im,meta=decoder.decode(use);l,t,_,_=meta['hardware_bounds'];match,n=quality(im,np.array(latest.convert('RGB')),l-64,t-16)
     row['objects'].append({'phase':phase,'alt':alt,'bounds':meta['hardware_bounds'],'match':match,'descriptorAnchor':meta['origin_in_png'],
                            'worldAnchor': [qs[0]['x']-cx-(l-64),av.geometry.base_height-(qs[0]['y']-15)+cy-(t-16)] if qs else None})
   observed.append(row);print(json.dumps(row),flush=True)
  index+=1
(W/'evidencias/origem-projetil.json').write_text(json.dumps(observed,indent=2))
lib.retro_unload_game();lib.retro_deinit()
