"""Recover full passive animation cycles and source clocks from native witnesses."""
from pathlib import Path
import json,sys,struct,hashlib
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121';T=Path(r'D:/Projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/ferramentas')
sys.path.insert(0,str(T));import decodificar_mk_sprites as dec
code=(T/'decodificar_mk_sprites.py').read_text();fn=code[code.index('def decode_frame(addr):'):code.index("if __name__=='__main__':")]
exec(fn.replace('assert 0xffc00000<=a<0xfffff000','assert BASE<=a<0xfffff000'),dec.__dict__)
old=json.loads((E/'bancos-antes.json').read_text());packs={};audit=[]
def cycle(poses):
 for first in range(min(12,len(poses)//3)):
  if first and poses[first]==poses[first-1]:continue
  for n in range(12,len(poses)-first-4):
   a=poses[first:first+n];rest=poses[first+n:]
   if len(set(a))>=3 and all(p==a[i%n] for i,p in enumerate(rest)):
    return a
 raise ValueError(('No witnessed loop',len(poses)))
for folder in sorted((E/'original').iterdir()):
 file=folder/'trace.json'
 if not file.exists():continue
 trace=json.loads(file.read_text());native=trace['id']
 if trace['game']!='umk3':continue
 ident='scorpion' if native=='mk-18' else native;b=old[ident];print('EXPORT',ident,flush=True)
 original=json.loads((W/'recursos-nativos'/native/'manifesto.json').read_text())
 # Preserve the established character-specific root/feet conversion.
 floor=None
 for c in b['clips'].values():
  for f in c['frames']:
   a=original['assets'].get(f['asset'])
   if a and a.get('anchor') is not None:floor=-f['y']-a['anchor'][1];break
  if floor is not None:break
 assert floor is not None,ident
 baseline=(folder/'baseline.state').read_bytes();at=lambda a:0x2c19+(a-0x1000000)//8
 obj=struct.unpack_from('<I',baseline,at(0x10609d0))[0];slot=baseline[at(obj)+40];dec.use_runtime_palette(baseline,0x8ec19+slot*512)
 dest=W/'arena/assets/locomocao-validada'/ident;dest.mkdir(parents=True,exist_ok=True)
 pack={'assets':{},'clips':{},'gait':{'fps':trace['fps'],'walkDelay':2,'downDelay':1},'captureSha256':hashlib.sha256(file.read_bytes()).hexdigest()}
 def frame(pose):
  key='gait-'+pose[2:]
  if key not in pack['assets']:
   image,meta=dec.decode_frame(int(pose,16));image.save(dest/(key+'.png'))
   pack['assets'][key]={'file':f'assets/locomocao-validada/{ident}/{key}.png','width':image.width,'height':image.height,'sha256_pixels':hashlib.sha256(str(image.size).encode()+image.tobytes()).hexdigest(),'metadata':meta}
  ox,oy=pack['assets'][key]['metadata']['origin_in_png']
  return {'asset':key,'x':-ox,'y':-floor-oy,'sourceFacing':1,'native_pose_pointer':pose}
 def clip(name,poses,loop=False):pack['clips'][name]={'frames':[frame(p) for p in poses],'loop':loop,'sampleAligned':True}
 cases={c['id']:c for c in trace['cases']}
 for name in ['forward','backward','run']:
  rows=cases[name]['samples'];held=[r for r in rows if r['keys']]
  start=next(i for i,r in enumerate(held) if r['after']['x']!=r['before']['x'])
  observed=[r['after']['frame'] for r in held[start:]]
  if name=='run':
   # Running loops exceed the short contact-free runway. Recover the loop
   # from its original animation bytecode and check its captured prefix.
   needle=struct.pack('<I',int(observed[0],16));candidates=[];search=0
   while True:
    pos=dec.ROM.find(needle,search)
    if pos<0:break
    search=pos+1;cursor=pos;sequence=[];locations={}
    for _ in range(80):
     locations[dec.BASE+cursor*8]=len(sequence);value=struct.unpack_from('<I',dec.ROM,cursor)[0];cursor+=4
     if value==6:cursor+=4;continue
     if value==1:
      target=struct.unpack_from('<I',dec.ROM,cursor)[0]
      if target in locations:candidates.append((sequence,locations[target]))
      break
     if value<dec.BASE:break
     try:dec.decode_frame(value)
     except (AssertionError,ValueError,IndexError,struct.error):break
     sequence.extend([hex(value)]*3)
   def at_index(seq,loop_start,i):return i if i<len(seq) else loop_start+(i-loop_start)%(len(seq)-loop_start)
   poses,loop_start=next((seq,loop_start) for seq,loop_start in candidates if all(p==seq[at_index(seq,loop_start,i)] for i,p in enumerate(observed)))
  else:poses=cycle(observed)
  clip(name,poses,True)
  if name=='run':pack['clips'][name]['loopStart']=loop_start
  speed=abs(held[start]['after']['x']-held[start]['before']['x']);pack['gait'][name+'Speed']=speed
 idle=cycle([r['after']['frame'] for r in cases['idle']['samples']])
 release=cases['forward_release']['samples'];entry=next(r['after']['frame'] for i,r in enumerate(release) if i>=14 and r['after']['frame'] in idle)
 index=idle.index(entry);idle=idle[index:]+idle[:index];clip('idle',idle,True)
 rows=cases['crouch_forward']['samples'];down_end=next(i for i,r in enumerate(rows) if not r['keys']==[5]);move=next(i for i in range(down_end,len(rows)) if rows[i]['after']['x']!=rows[i]['before']['x'])
 # The walk queue delivers the release after two native samples.
 rising=[r['after']['frame'] for r in rows[down_end+2:move]]
 pack['gait']['standUpSamples']=len(rising);clip('nativeGaitRise',rising)
 clip('crouch',[r['after']['frame'] for r in rows[1:down_end]])
 packs[ident]=pack;audit.append({'id':ident,'floor':floor,'clips':{n:len(c['frames']) for n,c in pack['clips'].items()},'gait':pack['gait']})
(W/'arena/locomocao-validada-data.js').write_text('(function(s){s.NATIVE_GROUND_GAITS='+json.dumps(packs,separators=(',',':'))+';})(typeof window===\'undefined\'?globalThis:window);\n',encoding='utf8')
(E/'exportacao.json').write_text(json.dumps(audit,indent=2));print(json.dumps(audit))
