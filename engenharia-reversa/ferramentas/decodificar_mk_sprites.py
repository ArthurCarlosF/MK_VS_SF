from pathlib import Path
import struct,json
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent.parent
ROM=(ROOT/'entradas/umk3-r12-maincpu.bin').read_bytes()
GFX=Path(r'C:/Users/Pichau/Documents/Codex/2026-10-22/ve/work/umk3-independent/umk3.gfxrom').read_bytes()
BASE=0xff800000
PAL_ADDR=0xffb0cb20
N=struct.unpack_from('<H',ROM,(PAL_ADDR-BASE)//8)[0]
def expand(v):return (v<<3)|(v>>2)
PALETTE=[]
for i in range(N):
 v=struct.unpack_from('<H',ROM,(PAL_ADDR-BASE)//8+2+i*2)[0]
 PALETTE.append((expand(v>>10&31),expand(v>>5&31),expand(v&31),255 if i else 0))
PALETTE_SOURCE={"kind":"rom","bit_address":hex(PAL_ADDR)}
STATIC_PALETTE=list(PALETTE)
CACHE={}
def use_runtime_palette(snapshot,offset=0x8f419):
 global PALETTE,PALETTE_SOURCE
 PALETTE_SOURCE={"kind":"saved_runtime_palette","file_byte_offset":hex(offset)}
 words=struct.unpack_from('<64H',snapshot,offset)
 PALETTE=[(expand(v>>10&31),expand(v>>5&31),expand(v&31),255 if i else 0) for i,v in enumerate(words)]
 CACHE.clear()
 return list(words)
def readbits(bit,n):return (int.from_bytes(GFX[bit//8:bit//8+2],'little')>>(bit%8))&((1<<n)-1)
def part(addr):
 if addr in CACHE:return CACHE[addr]
 w,h,x,y,bit,dma=struct.unpack_from('<HHhhIH',ROM,(addr-BASE)//8)
 assert 0<w<512 and 0<h<512
 bpp=(dma>>12)&7 or 8;skip=bool(dma&0x80);out=np.zeros((h,w,4),np.uint8)
 for row in range(h):
  pre=post=0
  if skip:
   v=readbits(bit,8);bit+=8;pre=(v&15)<<((dma>>8)&3);post=(v>>4)<<((dma>>10)&3)
  assert pre+post<=w,(hex(addr),row,pre,post,w)
  for col in range(pre,w-post):
   idx=readbits(bit,bpp);bit+=bpp;out[row,col]=PALETTE[idx]
 result=(Image.fromarray(out),-x,-y,{'header':hex(addr),'width':w,'height':h,'offset_x':x,'offset_y':y,'dma':hex(dma)})
 CACHE[addr]=result;return result

def decode_frame(addr):
 pieces=[]
 for i in range(12):
  a=struct.unpack_from('<I',ROM,(addr-BASE)//8+i*4)[0]
  if a==0:break
  assert 0xffc00000<=a<0xfffff000,(hex(addr),hex(a))
  pieces.append(part(a))
 assert pieces
 left=min(x for im,x,y,m in pieces);top=min(y for im,x,y,m in pieces);right=max(x+im.width for im,x,y,m in pieces);bottom=max(y+im.height for im,x,y,m in pieces)
 out=Image.new('RGBA',(right-left,bottom-top))
 for im,x,y,m in pieces:out.alpha_composite(im,(x-left,y-top))
 return out,{'frame_pointer':hex(addr),'origin_in_png':[-left,-top],'bounds_relative_to_origin':[left,top,right,bottom],'palette':dict(PALETTE_SOURCE),'parts':[m for im,x,y,m in pieces]}
if __name__=='__main__':
 out=ROOT/'animacoes/scorpion';out.mkdir(parents=True,exist_ok=True)
 im,meta=decode_frame(0xff936770);im.save(out/'primeiro-quadro.png');(out/'primeiro-quadro.json').write_text(json.dumps(meta,indent=2));print(meta)
