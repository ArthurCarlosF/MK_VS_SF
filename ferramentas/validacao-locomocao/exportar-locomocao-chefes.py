"""Measured original AI gaits for the arcade-only opponents."""
from pathlib import Path
import json,struct,hashlib,sys,collections
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-chefes-20261122';T=Path(r'D:/Projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/ferramentas')
sys.path.insert(0,str(T));import decodificar_mk_sprites as d
code=(T/'decodificar_mk_sprites.py').read_text();exec(code[code.index('def decode_frame(addr):'):code.index("if __name__=='__main__':")].replace('assert 0xffc00000<=a<0xfffff000','assert BASE<=a<0xfffff000'),d.__dict__)
source=W/'arena/locomocao-validada-data.js';packs=json.JSONDecoder().raw_decode(source.read_text().split('NATIVE_GROUND_GAITS=',1)[1])[0]
banks=json.loads((W/'evidencias/caminhada-elenco-20261121/bancos-antes.json').read_text());audits=[]
at=lambda a:0x2c19+(a-0x1000000)//8
for ident,native in [('shao-kahn',25),('motaro',24),('noob-saibot',23)]:
 folder=E/ident;trace=json.loads((folder/'trace.json').read_text());rows=trace['rows'];b=banks[ident];baseline=(folder/'baseline-chefe.state').read_bytes()
 owner=struct.unpack_from('<I',baseline,at(0x10609d0))[0];obj=struct.unpack_from('<I',baseline,at(0x1061580))[0];off=at(obj);slot=baseline[off+40]
 floor=134+(struct.unpack_from('<i',baseline,at(owner)+20)[0]-struct.unpack_from('<i',baseline,off+20)[0])/65536
 d.use_runtime_palette(baseline,0x8ec19+slot*512);dest=W/'arena/assets/locomocao-validada'/ident;dest.mkdir(parents=True,exist_ok=True)
 pack={'assets':{},'clips':{},'gait':{'fps':trace['fps'],'walkDelay':2,'downDelay':1,'standUpSamples':0,'canCrouch':ident=='noob-saibot','canRun':False,'nativeAiReference':True},'captureSha256':hashlib.sha256((folder/'trace.json').read_bytes()).hexdigest()}
 def frame(pose):
  key='gait-'+pose[2:]
  if key not in pack['assets']:
   im,meta=d.decode_frame(int(pose,16));im.save(dest/(key+'.png'));pack['assets'][key]={'file':f'assets/locomocao-validada/{ident}/{key}.png','width':im.width,'height':im.height,'sha256_pixels':hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest(),'metadata':meta}
  ox,oy=pack['assets'][key]['metadata']['origin_in_png'];return {'asset':key,'x':-ox,'y':-floor-oy,'sourceFacing':1,'native_pose_pointer':pose}
 mode_evidence={}
 for mode in ['forward','backward','idle']:
  ordered=[]
  for f in b['clips'][mode]['frames']:
   pose='0x'+f['asset']
   if not ordered or pose!=ordered[-1]:ordered.append(pose)
  pose_set=set(ordered);sign=1 if mode=='forward' else -1;vels=collections.Counter();holds=collections.Counter()
  for i in range(1,len(rows)):
   r,z=rows[i],rows[i-1];dx=r['x']-z['x'];wanted=dx*r['facing']*sign>0 if mode!='idle' else dx==0
   if r['pose'] not in pose_set or r['y']!=z['y'] or not wanted:continue
   if mode!='idle' and z['pose'] in pose_set:vels[abs(dx)]+=1
   if r['pose']!=z['pose']:
    end=i+1
    while end<len(rows) and rows[end]['pose']==r['pose'] and rows[end]['y']==r['y']:end+=1
    if 2<end-i<=16:holds[end-i]+=1
  hold=holds.most_common(1)[0][0];pack['clips'][mode]={'frames':[frame(pose) for pose in ordered for _ in range(hold)],'loop':True,'sampleAligned':True}
  if ident=='motaro' and mode=='forward':
   # All seven observed walk entries retain the first pose one extra sample.
   pack['clips'][mode]['frames'].insert(0,dict(pack['clips'][mode]['frames'][0]));pack['clips'][mode]['loopStart']=1
  if mode!='idle':pack['gait'][mode+'Speed']=vels.most_common(1)[0][0]
  mode_evidence[mode]={'poseHoldSamples':hold,'holdWitnesses':dict(holds),'velocityWitnesses':dict(vels)}
 if ident=='noob-saibot':
  master=lambda slot:struct.unpack_from('<I',d.ROM,(0xffb02b90-d.BASE)//8+slot*4)[0]
  assert master(18)==master(23)
  # Noob uses the same original ninja animation table, with its own palette.
  for name in ['crouch','nativeGaitRise']:
   clip=packs['scorpion']['clips'][name];pack['clips'][name]={'frames':[frame(f['native_pose_pointer']) for f in clip['frames']],'loop':False,'sampleAligned':True}
  pack['gait']['standUpSamples']=packs['scorpion']['gait']['standUpSamples'];pack['gait']['sharedNinjaAnimationMaster']=hex(master(23))
  pack['gait']['crouchBodyHeight']=-pack['clips']['crouch']['frames'][-1]['y']
 else:pack['clips']['crouch']=pack['clips']['idle']
 packs[ident]=pack;audits.append({'id':ident,'nativeId':native,'floor':floor,'gait':pack['gait'],'measured':mode_evidence,'limits':['Original opponent AI supplies gait witnesses; player input delay is a crossover controller adaptation.','The original boss AI may interrupt/restart a walk; each invocation is compared separately.']})
source.write_text('(function(s){s.NATIVE_GROUND_GAITS='+json.dumps(packs,separators=(',',':'))+';})(typeof window===\'undefined\'?globalThis:window);\n',encoding='utf8');(E/'exportacao.json').write_text(json.dumps(audits,indent=2));print(json.dumps(audits))
