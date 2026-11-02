"""Read-only gameplay measurements: native health, poses, SF collision tables."""
from pathlib import Path
import sys
HERE=Path(__file__).resolve().parent
source=(HERE/'capturar_animacoes.py').read_text(encoding='utf-8')
prefix=source[:source.index("if game=='ssf2tu':\n for frame")].replace('execucao-animacoes','execucao-calibracao')
prefix=prefix.replace("/animacoes')","/calibracao-basicos')")
data=source[source.index('def sfdata(b):'):source.index("print('BASELINE'")]
setup=source[source.index("if game=='ssf2tu':\n for frame"):source.index('def sfdata(b):')]
body='''
DATA=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/entradas/ssf2tu-68k-data-be.bin').read_bytes() if game=='ssf2tu' else b''
def extra(b):
 if game=='umk3':
  off=lambda bit:0x2c19+(bit-0x1000000)//8
  return {'health':[struct.unpack_from('<H',b,off(a))[0] for a in [0x1060a60,0x1061610]]}
 read=lambda addr,n:bytes(b[0x3d346+(((addr+i)&65535)^1)] for i in range(n))
 base=0xff844e;word=lambda addr:int.from_bytes(read(addr,2),'big')
 frameptr=int.from_bytes(read(base+0x1a,4),'big');hp=word(base+0x2c)
 table=int.from_bytes(read(base+0x34,4),'big');boxes=[]
 if frameptr<len(DATA)-32 and table<len(DATA)-16 and table>0:
  for offset,ident,stride,kind in [(0,8,4,'hurt'),(2,9,4,'hurt'),(4,10,4,'hurt'),(6,12,16,'attack')]:
   boxid=DATA[frameptr+ident]
   if not boxid or (kind=='attack' and not read(base+3,1)[0]):continue
   address=table+int.from_bytes(DATA[table+offset:table+offset+2],'big',signed=True)+boxid*stride
   if address<0 or address+6>=len(DATA):continue
   x,y,rx,ry=struct.unpack_from('>bbBB',DATA,address)
   if kind=='attack' and DATA[address+5]>=128:x=-DATA[address+5]
   boxes.append({'kind':kind,'id':boxid,'address':hex(address),'x':x-rx,'y':y-ry,'w':rx*2,'h':ry*2})
 return {'health':[hp,word(base+0x400+0x2c)],'attack_state':read(base+3,1)[0],
  'hitboxes':boxes,'hitbox_table':hex(table),'counter':read(0xff801d,1)[0],
  'p2_state':read(base+0x400+3,1)[0]}
assert extra(baseline)['health']==([166,166] if game=='umk3' else [144,144]),extra(baseline)
results=[]
for approach in [0,24,36,48]:
 for move,keys in [('punch',[0]),('kick',[8 if game=='umk3' else 9]),('crouchPunch',[5,0]),('crouchKick',[5,8 if game=='umk3' else 9])]:
  guards=([False,True,'low'] if game=='ssf2tu' and move=='kick' else [False,True]) if approach in [36,48] else [False]
  for defend in guards:
   restore(baseline);ticks([],3);ticks([7],approach);ticks([],12)
   if move.startswith('crouch'):ticks([5],8)
   before=getdata(state());initial=extra(state());samples=[]
   for i in range(85):
    first=keys if i<2 else [5] if move.startswith('crouch') else []
    second=([10] if game=='umk3' else [7]) if defend else []
    if defend and (move=='crouchKick' or defend=='low'):second+=[5]
    ticks(first,1,second=second);b=state();d=getdata(b);e=extra(b)
    samples.append({'sample':i,'x':d['x'],'y':d['y'],'p2_x':d['p2_x'],'frame':d['frame'],**e})
    if approach==0 and not defend and i in [0,3,6,9,12,18,24,36,48]:latest.save(OUT/f'{move}-{i:02}.png')
   result={'move':move,'approach_samples':approach,'defending':defend,
    'distance':before['p2_x']-before['x'],'initial':initial,'samples':samples}
   results.append(result)
   print(game,move,approach,defend,'health',initial['health'],samples[-1]['health'],flush=True)
out={'game':game,'fps':av.timing.fps,'experiments':results,'method':'Fresh match; inputs only, serialized RAM reads; no RAM writes.'}
(OUT/'medicoes.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit();print('DONE',game,flush=True)
'''
exec(compile(prefix+setup+data+body,str(__file__),'exec'))
