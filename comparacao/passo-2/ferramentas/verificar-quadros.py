from pathlib import Path
import json,sys,struct,math
import numpy as np
from PIL import Image
H=Path(__file__).resolve().parents[1];P=H.parents[1]
sys.path.insert(0,str(P/'engenharia-reversa/ferramentas'))
import decodificar_mk_sprites as mk
folder=H/'sequencia-visual/original/umk3/rep-1'
b=(folder/'baseline-duplo.state').read_bytes();mk.use_runtime_palette(b)
camera=struct.unpack_from('<h',b,0x2c19+(0x105dae0-0x1000000)//8)[0]
c=json.loads((folder/'trace.json').read_text())['cases'][0]
results=[]
for pointer in json.loads((H/'quadros-novos.json').read_text())['pointers']:
 im,m=mk.decode_frame(int(pointer,16));a=np.array(im);mask=a[:,:,3]>0;ox,oy=m['origin_in_png'];best=(0,None)
 for s in c['samples']:
  if not s['screenshot']:continue
  j=s['sample'];neighbors=c['samples'][max(0,j-2):j+3]
  if not any(q['before']['pose']==pointer or q['after']['pose']==pointer for q in neighbors):continue
  ref=np.array(Image.open(folder/s['screenshot']).convert('RGB'))
  for dx in [-1,0,1]:
   x=math.floor(s['after']['x']-camera-ox)+dx;y=math.floor(s['after']['y']-oy)
   crop=ref[y:y+a.shape[0],x:x+a.shape[1]]
   if crop.shape!=a[:,:,:3].shape:continue
   q=float(np.mean((np.max(np.abs(crop.astype(int)-a[:,:,:3].astype(int)),axis=2)<=3)[mask]))
   if q>best[0]:best=(q,j)
 assert best[0]>.99,(pointer,best)
 results.append({'pointer':pointer,'best_match_fraction_rgb_tolerance_3':best[0],'native_video_sample':best[1]})
(H/'verificacao-quadros.json').write_text(json.dumps({'status':'PASS','results':results},indent=2))
print(results)
