from pathlib import Path
import numpy as np,zipfile,struct,zlib,json
P=Path('work/selection-assets');S=Path(r'D:\projetos\MK-vs-SF-Fontes\StreetFighterII\DadosExtraidos\ssf2t')
v=(S/'SuperStreetFighterIITurbo.vrom').read_bytes();src=np.frombuffer(v,dtype='<u4');out=np.zeros(src.size,dtype=np.uint32)
for j in range(8):
 n=(src>>(j*4))&15
 for bit in range(4):out|=((n>>bit)&1)<<(bit*8+7-j)
d=out.astype('<u4').tobytes();parts=[d[i:i+0x100000] for i in range(0,len(d),0x100000)]
inter=[]
for a,b in zip(parts[0::2],parts[1::2]):inter.append(np.stack([np.frombuffer(a,np.uint8).reshape(-1,8),np.frombuffer(b,np.uint8).reshape(-1,8)],axis=1).tobytes())
raw=np.frombuffer(b''.join(inter),np.uint8).reshape(-1,4,2);chips=[]
for i in range(4):
 c=raw[:,i,:].tobytes();chips += [c[:0x200000],c[0x200000:0x300000],c[0x300000:0x400000]]
names=['sfx.13m','sfx.14m','sfx.21m','sfx.15m','sfx.16m','sfx.23m','sfx.17m','sfx.18m','sfx.25m','sfx.19m','sfx.20m','sfx.27m'];files=dict(zip(names,chips))
cpu=(S/'SuperStreetFighterIITurbo.u.68k').read_bytes();s=bytearray(cpu);s[0::2],s[1::2]=cpu[1::2],cpu[0::2]
for i,name in enumerate(['sfxu.03e','sfxu.04a','sfxu.05','sfxu.06b','sfxu.07a','sfxu.08','sfx.09']):files[name]=s[i*0x80000:(i+1)*0x80000]
z80=(S/'SuperStreetFighterIITurbo.z80').read_bytes();files['sfx.01']=z80[:0x20000];files['sfx.02']=z80[0x20000:]
qs=(S/'SuperStreetFighterIITurbo.qs').read_bytes();files['sfx.11m']=qs[:0x200000];files['sfx.12m']=qs[0x200000:]
# Encode the publicly documented MAME hardware configuration; this is derived,
# not a missing binary fetched from a ROM collection.
words=[0x94fa,0x8902,0x4c77,0x143f,0x2000,0x0007,0x0838,0x4000,0x0900,0xff00];key=bytearray(20)
for b in range(160):
 bit=(317-b)%160
 if words[b//16]&(0x8000>>(b%16)):key[bit//8]|=1<<((bit^7)%8)
files['ssf2tu.key']=key
(P/'roms').mkdir(exist_ok=True)
with zipfile.ZipFile(P/'roms/ssf2tu.zip','w',zipfile.ZIP_DEFLATED) as z:
 for k,v in files.items():z.writestr(k,v)
report={k:{'bytes':len(v),'crc32':f'{zlib.crc32(v):08x}'} for k,v in files.items()};(P/'ssf2tu-conversion.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
