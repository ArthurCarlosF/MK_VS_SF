from pathlib import Path
import json,struct,hashlib,shutil
from PIL import Image
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121'
rom=Path(r'D:/Projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/entradas/ssf2tu-68k-data-be.bin').read_bytes()
file=W/'arena/locomocao-validada-data.js';text=file.read_text();packs=json.JSONDecoder().raw_decode(text.split('NATIVE_GROUND_GAITS=',1)[1])[0]
frozen={id:p for id,p in packs.items() if p['gait'].get('universe')=='sf'}
probe=json.loads((E/'velocidades-sf.json').read_text());audit=[]
previous_banks=json.loads((E/'bancos-antes.json').read_text())
descriptor=lambda pose:struct.unpack_from('>I',rom,int(pose,16)+4)[0]
def script(start):
 nodes=[];seen={};at=start
 for _ in range(100):
  if at in seen:return nodes,seen[at]
  seen[at]=len(nodes);duration,flags=struct.unpack_from('>HH',rom,at)
  assert 0<duration<240,(hex(at),duration)
  nodes.append((hex(at),duration));at=struct.unpack_from('>I',rom,at+24)[0] if flags&0x8000 else at+24
 raise ValueError('Script not bounded')
for folder in sorted((E/'original').iterdir()):
 if not (folder/'trace.json').exists():continue
 trace=json.loads((folder/'trace.json').read_text());native=trace['id']
 if trace['game']!='ssf2tu':continue
 extra=E/'sf-art'/native/'manifesto.json'
 if not extra.exists():continue
 ident='ryu' if native=='sf-0' else native;print('BUILD',ident,flush=True);original_file=W/'recursos-nativos'/native/'manifesto.json';original=json.loads(original_file.read_text()) if original_file.exists() else {'assets':{}}
 by_descriptor={descriptor(a['native_pose']):{**a,'source':W/'recursos-nativos'/native/a['file']} for a in original['assets'].values()}
 for c in previous_banks[ident]['clips'].values():
  for f in c['frames']:
   if not f:continue
   pose=f.get('native_pose_pointer');a=previous_banks[ident]['assets'][f['asset']]
   if pose and descriptor(pose) not in by_descriptor:
    im=Image.open(W/'arena'/a['file']).convert('RGBA');sha=hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest()
    by_descriptor[descriptor(pose)]={**a,'anchor':[-f['x'],-f['y']],'source':W/'arena'/a['file'],'sha256_pixels':sha}
 for pose,a in json.loads(extra.read_text())['assets'].items():by_descriptor[descriptor(pose)]={**a,'source':extra.parent/a['file']}
 dest=W/'arena/assets/locomocao-validada'/ident;dest.mkdir(parents=True,exist_ok=True)
 pack={'assets':{},'clips':{},'gait':{'universe':'sf','fps':trace['fps'],'walkDelay':2,'sourceScale':1.25,'turboLogicalRate':4/3},'captureSha256':hashlib.sha256((folder/'trace.json').read_bytes()).hexdigest()}
 def frame(pose):
  desc=descriptor(pose);a=by_descriptor[desc];key='gait-sf-'+hex(desc)[2:]
  if key not in pack['assets']:
   shutil.copyfile(a['source'],dest/(key+'.png'));pack['assets'][key]={'file':f'assets/locomocao-validada/{ident}/{key}.png','width':a['width'],'height':a['height'],'sha256_pixels':a['sha256_pixels']}
  x,y=a['anchor'];return {'asset':key,'x':-x,'y':-y,'sourceFacing':1,'native_pose_pointer':pose,'nativeDescriptor':hex(desc)}
 def clip(name,nodes,loop_start=None):
  frames=[frame(pose) for pose,duration in nodes for _ in range(duration)]
  c={'frames':frames,'loop':loop_start is not None,'sampleAligned':True,'nativeLogicalClock':True}
  if loop_start is not None:c['loopStart']=sum(d for _,d in nodes[:loop_start])
  pack['clips'][name]=c
 cases={c['id']:c for c in trace['cases']}
 def rate(rows):return sum((r['after']['game_counter_ff801d']-r['before']['game_counter_ff801d'])%256 for r in rows)/len(rows)
 pack['gait']['logicalRates']={'idle':rate(cases['idle']['samples']),'crouch':rate(cases['crouch_forward']['samples'][2:12])}
 for name,direction in [('forward',7),('backward',6)]:
  rows=cases[name]['samples'];start=next(i for i,r in enumerate(rows) if r['after']['x']!=r['before']['x'])
  nodes,loop=script(int(rows[start]['after']['frame'],16));clip(name,nodes,loop)
  velocity=min(abs(r['x']-r['xBefore']) for r in probe if r['id']==native and r['direction']==direction and abs(r['x']-r['xBefore'])>0)
  pack['gait'][name+'Speed']=velocity*1.25
  pack['gait']['logicalRates'][name]=rate([r for r in rows[2:60] if r['after']['p2_x']-r['after']['x']>=100])
 idle_nodes,_=script(int(cases['idle']['initial']['frame'],16));idle_set={p for p,_ in idle_nodes}
 entry=next(r['after']['frame'] for i,r in enumerate(cases['forward_release']['samples']) if i>=14 and r['after']['frame'] in idle_set)
 nodes,loop=script(int(entry,16));clip('idle',nodes,loop)
 rows=cases['crouch_forward']['samples'];down_start=next(i for i,r in enumerate(rows) if r['after']['state'][1]==2)
 nodes,loop=script(int(rows[down_start]['after']['frame'],16));clip('crouch',nodes,loop)
 held=nodes[-1][0];release=next(i for i,r in enumerate(rows) if not r['keys']==[5]);rise_start=next(i for i in range(release,len(rows)) if rows[i]['after']['frame']!=held)
 candidate=int(held,16)+28
 start=candidate if struct.unpack_from('>H',rom,candidate+2)[0]==2 else int(rows[rise_start]['after']['frame'],16)
 nodes,_=script(start);clip('nativeGaitRise',nodes[:-1]);pack['gait']['standUpSamples']=sum(n for _,n in nodes[:-1])
 move_start=next(i for i in range(release,len(rows)) if rows[i]['after']['x']!=rows[i]['before']['x'])
 pack['gait']['logicalRates']['rise']=pack['gait']['standUpSamples']/(move_start-(release+2))
 # Measure the presentation clock over every independent calibration case,
 # rather than estimating it from a single short walking capture.
 for name in ['idle','forward','backward']:
  family={f['native_pose_pointer'] for f in pack['clips'][name]['frames']}
  selected=[r for c in trace['cases'] for r in c['samples'] if r['after']['frame'] in family]
  pack['gait']['logicalRates'][name]=rate(selected)
 rising=[i for i,r in enumerate(rows) if r['after']['state'][1:3]==[2,2]]
 assert rising
 pack['gait']['logicalRates']['rise']=pack['gait']['standUpSamples']/len(rising)
 pack['gait']['clockEvidence']='All 14 calibration inputs, grouped by native animation family; rise uses observed native control state duration. Repeated validation captures are held separate.'
 if ident in frozen:pack=frozen[ident]
 packs[ident]=pack;audit.append({'id':ident,'gait':pack['gait'],'clips':{n:len(c['frames']) for n,c in pack['clips'].items()},'assets':len(pack['assets'])});print('EXPORT',ident,flush=True)
(W/'arena/locomocao-sf-em-validacao-data.js').write_text('(function(s){s.NATIVE_GROUND_GAITS='+json.dumps(packs,separators=(',',':'))+';})(typeof window===\'undefined\'?globalThis:window);\n',encoding='utf8')
(E/'exportacao-sf.json').write_text(json.dumps(audit,indent=2));print('DONE',len(audit))
