from pathlib import Path
import numpy as np,struct
from PIL import Image
ROOT=Path(__file__).resolve().parent.parent
DATA=(ROOT/'entradas/ssf2tu-68k-data-be.bin').read_bytes()
RAW=np.frombuffer(Path(r'D:/projetos/MK-vs-SF-Fontes/StreetFighterII/DadosExtraidos/ssf2t/SuperStreetFighterIITurbo.vrom').read_bytes(),np.uint8)
PIXELS=np.stack([RAW&15,RAW>>4],axis=1).reshape(-1)
def rgb_palette(words):
 colors=[]
 for i,v in enumerate(words):
  bright=16+(v>>12);colors.append(tuple(((v>>shift)&15)*bright*17//31 for shift in [8,4,0])+(0 if i%16==15 else 255,))
 return np.array(colors,np.uint8)
def decode(data):
 records=data['p1_objects'];palette=rgb_palette(data['palette_words'])
 if not records:return Image.new('RGBA',(1,1)),{'origin_in_png':[0,0],'hardware_bounds':[0,0,1,1],'parts':[]}
 parts=[]
 for x,y,code,attr in records:
  if 'object_palette_words' in data:palette=rgb_palette(data['object_palette_words'][(attr&31)*16:((attr&31)+1)*16])
  code+=((y&0x6000)<<3);nx=1+((attr>>8)&15);ny=1+((attr>>12)&15);flipx=bool(attr&32);flipy=bool(attr&64);indices=np.full((ny*16,nx*16),15,np.uint8)
  for yy in range(ny):
   for xx in range(nx):
    if not flipx and not flipy:tile=(code&~15)+((code+xx)&15)+16*yy
    else:tile=code+(nx-1-xx if flipx else xx)+16*(ny-1-yy if flipy else yy)
    pix=PIXELS[tile*256:(tile+1)*256].reshape(16,16)
    if flipx:pix=pix[:,::-1]
    if flipy:pix=pix[::-1,:]
    indices[yy*16:yy*16+16,xx*16:xx*16+16]=pix
  sx=x&1023;sy=y&1023
  if sx>511:sx-=1024
  if sy>511:sy-=1024
  parts.append((Image.fromarray(palette[indices]),sx,sy,{'tile_code':code,'attribute':hex(attr),'nx':nx,'ny':ny,'flipx':flipx,'flipy':flipy,'x':sx,'y':sy}))
 left=min(x for im,x,y,m in parts);top=min(y for im,x,y,m in parts);right=max(x+im.width for im,x,y,m in parts);bottom=max(y+im.height for im,x,y,m in parts)
 out=Image.new('RGBA',(right-left,bottom-top))
 for im,x,y,m in reversed(parts):out.alpha_composite(im,(x-left,y-top))
 # Preserve signed offsets from the native sprite descriptor separately from our preview anchor.
 frame=int(data['frame'],16);descriptor=struct.unpack_from('>I',DATA,frame+4)[0];native={}
 if 0<=descriptor<len(DATA)-12:
  count,attr,xoff,yoff=struct.unpack_from('>HHhh',DATA,descriptor);native={'address':hex(descriptor),'tile_count':count,'attribute':hex(attr),'signed_x_offset':xoff,'signed_y_offset':yoff}
 primary=parts[0];w,h=primary[0].size;xoff=native.get('signed_x_offset',w//2);yoff=native.get('signed_y_offset',0)
 anchor_x=primary[1]+(w-xoff if primary[3]['flipx'] else xoff)-left;anchor_y=primary[2]+h-yoff-top
 return out,{'origin_in_png':[anchor_x,anchor_y],'hardware_bounds':[left,top,right,bottom],'native_descriptor':native,'parts':[m for im,x,y,m in parts]}
