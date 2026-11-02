"""Extrai os 22 retratos da tabela original de UMK3 R1.2, sem alterar as ROMs.
Uso: python extrair_retratos_mk.py PASTA_ROM_DESTINO PASTA_PNG
A primeira pasta deve conter umk3.maincpu e umk3.gfxrom.
"""
from pathlib import Path
import struct,sys
from PIL import Image
src,out=map(Path,sys.argv[1:3]);out.mkdir(parents=True,exist_ok=True)
cpu=(src/'umk3.maincpu').read_bytes();gfx=(src/'umk3.gfxrom').read_bytes();base=0xff800000
for i in range(22):
 ptr,x,y,ident,flags=struct.unpack_from('<I4H',cpu,0x4d3d0+i*12)
 if ptr in (1,2,3):ptr=struct.unpack_from('<I',cpu,0x4d4dc+(ptr-1)*8)[0]
 w,h,ox,oy,bit,dma,pal=struct.unpack_from('<4HIHI',cpu,(ptr-base)//8)
 bpp=(dma>>12)&7
 if not bpp:bpp=8
 off=(pal-base)//8;n=struct.unpack_from('<H',cpu,off)[0]
 colors=[]
 for j in range(n):
  v=struct.unpack_from('<H',cpu,off+2+j*2)[0];colors.append(tuple(c*255//31 for c in [(v>>10)&31,(v>>5)&31,v&31]))
 data=[]
 for j in range(w*h):
  k=bit+j*bpp;idx=(int.from_bytes(gfx[k//8:k//8+2],'little')>>(k%8))&((1<<bpp)-1);data.append(colors[idx])
 im=Image.new('RGB',(w,h));im.putdata(data);im.save(out/f'{ident:02}.png')
