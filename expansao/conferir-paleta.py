from pathlib import Path
import struct,sys,math
import numpy as np
from PIL import Image
R=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/ferramentas');sys.path.insert(0,str(R))
import decodificar_mk_sprites as m
W=Path(__file__).parent
for ident in ['mk-9','mk-18']:
 b=(W/'recursos-nativos'/ident/'baseline.state').read_bytes();off=lambda a:0x2c19+(a-0x1000000)//8
 o=struct.unpack_from('<I',b,off(0x10609d0))[0];body=off(o);pal=struct.unpack_from('<H',b,body+40)[0]&255;paletteOffset=0x8f419+(pal-4)*512
 m.use_runtime_palette(b,offset=paletteOffset);ptr=struct.unpack_from('<I',b,body+58)[0];im,meta=m.decode_frame(ptr)
 x=struct.unpack_from('<i',b,body+16)[0]/65536; y=struct.unpack_from('<i',b,body+20)[0]/65536;camera=struct.unpack_from('<h',b,off(0x105dae0))[0]
 flags=struct.unpack_from('<H',b,body+30)[0];anchor=meta['origin_in_png']
 if flags&16:im=im.transpose(Image.Transpose.FLIP_LEFT_RIGHT);anchor=[im.width-anchor[0],anchor[1]]
 target=np.array(Image.open(W/'recursos-nativos'/ident/'baseline.png').convert('RGB'));a=np.array(im);sx=math.floor(x-camera-anchor[0]);sy=math.floor(y-anchor[1]);mask=a[:,:,3]>0
 bb=target[sy:sy+im.height,sx:sx+im.width];quality=np.mean(np.max(np.abs(a[:,:,:3].astype(int)-bb.astype(int)),axis=2)[mask]<=3)
 print(ident,'palette',pal,hex(paletteOffset),'match',quality)
