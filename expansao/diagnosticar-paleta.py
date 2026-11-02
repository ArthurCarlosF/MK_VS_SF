from pathlib import Path
import struct,sys
R=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa')
rom=(R/'entradas/umk3-r12-maincpu.bin').read_bytes();BASE=0xff800000
for ident in ['mk-9','mk-18','mk-1']:
    b=(Path(__file__).parent/'recursos-nativos'/ident/'baseline.state').read_bytes()
    off=lambda a:0x2c19+(a-0x1000000)//8
    obj=struct.unpack_from('<I',b,off(0x10609d0))[0];body=b[off(obj):off(obj)+150]
    print(ident,hex(obj),'words',[(i,hex(struct.unpack_from('<H',body,i)[0])) for i in range(24,90,2)])
    for i in range(0,130,2):
        ptr=struct.unpack_from('<I',body,i)[0]
        if BASE<=ptr<0xfffff000:
            index=(ptr-BASE)//8;n=struct.unpack_from('<H',rom,index)[0]
            print('ROM pointer',i,hex(ptr),'first',n)
