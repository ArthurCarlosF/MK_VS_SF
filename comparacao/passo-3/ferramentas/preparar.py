from pathlib import Path
import sys,json,hashlib,statistics
from PIL import Image
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-3';sys.path.insert(0,str(P/'engenharia-reversa/ferramentas'))
import decodificar_mk_sprites as mk
import decodificar_sf_sprites as sf
f=P/'arena/assets.js';s=(H/'backup-antes/assets.js').read_text(encoding='utf-8');bank=json.loads(s[s.index('=')+1:].rstrip(';'))
measurements={};new=[]
for game,name,scale in [('umk3','scorpion',1),('ssf2tu','ryu',1.25)]:
 d=json.loads((H/f'execucao-01/original/{game}/rep-1/trace.json').read_text())
 e=json.loads((H/f'extracao-01/original/{game}/rep-1/trace.json').read_text())
 c=bank['characters'][name];known={}
 for clip in c['clips'].values():
  for frame in clip['frames']:
   if frame.get('native_pose_pointer'):known.setdefault(frame['native_pose_pointer'],frame)
 mk.use_runtime_palette((H/'execucao-01/original/umk3/rep-1/baseline-duplo.state').read_bytes())
 def getcase(id,extra=False):return next(x for x in (e if extra else d)['cases'] if x['id']==id)
 # Acquire new poses from the original data and captured palettes. Known poses
 # keep the already-verified sprite origin, without re-anchoring to pose height.
 for case in d['cases']+e['cases']:
  for sample in case['samples']:
   raw=sample.get('render');pointer=sample['after']['pose']
   if pointer in known or not raw:continue
   if game=='umk3':
    im,meta=mk.decode_frame(int(pointer,16));ox,oy=meta['origin_in_png'];x=-ox;y=-134-oy
   else:
    # Match the native hardware sprite list, which is video-latched, to its
    # descriptor pointer. This evidence is retained as a video-bank observation.
    im,meta=sf.decode(raw)
    if im.width<2:continue
    left,top,_,_=meta['hardware_bounds'];height=raw['y']-d['baseline']['y']
    x=left-64-(raw['x']-sample['after']['camera_left']);y=top-16-205+height
   key='movement-'+pointer[2:];dest=P/f'arena/assets/{name}/{key}.png';im.save(dest)
   c['assets'][key]={'file':f'assets/{name}/{key}.png','width':im.width,'height':im.height,'sha256_pixels':hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest(),'metadata':meta}
   known[pointer]={'asset':key,'x':x,'y':y,'native_pose_pointer':pointer,'sourceFacing':1}
   new.append({'character':name,'pointer':pointer,'case':case['id'],'sample':sample['sample']})
 def frame(pointer):
  if pointer not in known and game=='umk3':
   im,meta=mk.decode_frame(int(pointer,16));key='movement-'+pointer[2:];im.save(P/f'arena/assets/{name}/{key}.png');ox,oy=meta['origin_in_png']
   c['assets'][key]={'file':f'assets/{name}/{key}.png','width':im.width,'height':im.height,'sha256_pixels':hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest(),'metadata':meta}
   known[pointer]={'asset':key,'x':-ox,'y':-134-oy,'sourceFacing':1,'native_pose_pointer':pointer}
  return dict(known.get(pointer,c['clips']['idle']['frames'][0]))
 profiles={}
 for state,id,extra in [('jump','jump_vertical',False),('jumpForward','jump_forward_free',True),('jumpBackward','jump_backward_free',True)]:
  case=getcase(id,extra);rows=case['samples'];sign=-1 if game=='umk3' else 1
  heights=[max(0,sign*(r['after']['y']-case['initial']['y'])*scale) for r in rows]
  airborne=[i for i,h in enumerate(heights) if h>0];land=max(airborne)+1
  end=49 if game=='umk3' and state=='jump' else 45 if game=='umk3' else land+4
  # At UMK3 directional jump startup one ground walk sample precedes 4/frame.
  # Backward SF curve is isolated from the max-distance wall by extra fixture.
  dx=[(r['after']['x']-r['before']['x'])*scale for r in rows[:end]]
  if state=='jump':dx=[0]*end
  profiles[state]={'heights':heights[:end],'deltas':dx,'landingSample':land,'totalSamples':end,'sourceCase':id,'sampleRate':d['fps']}
  c['clips'][state]={'frames':[frame(r['after']['pose']) for r in rows[:end]],'loop':False,'steps':[0],'sampleAligned':True,'source_clip':id}
 if game=='umk3':
  case=getcase('run_forward');rows=case['samples']
  # Repeated run poses in the longer pilot expose the whole cycle.
  pilot=json.loads((H/'piloto/original/umk3/rep-1/trace.json').read_text());pr=next(z for z in pilot['cases'] if z['id']=='probe_11')['samples']
  pointers=[r['after']['pose'] for r in pr[2:29] if int(r['after']['pose'],16)>=0xff946500 and int(r['after']['pose'],16)<0xff947000]
  c['clips']['run']={'frames':[frame(ptr) for ptr in pointers],'loop':True,'steps':[8],'source_clip':'run_forward'}
  source_run=getcase('run_jump');rows=source_run['samples'][10:];heights=[max(0,source_run['initial']['y']-r['after']['y']) for r in rows];air=[i for i,h in enumerate(heights) if h>0];end=max(air)+6;landing=max(air)+1
  profiles['jumpRunForward']={'heights':heights[:end],'deltas':[8 if i<2 else 4 if i<=landing else 0 for i in range(end)],'landingSample':landing,'totalSamples':end,'sourceCase':'run_jump[10:]','sampleRate':d['fps']}
  c['clips']['jumpRunForward']={'frames':[frame(r['after']['pose']) for r in rows[:end]],'loop':False,'steps':[0],'sampleAligned':True}
  run={'speed':8,'maximum':48,'depletionPerSample':1,'recoveryDelaySamples':48,'recoveryPerSample':1,'ramAddress':'0x1060a70'}
 else:run=None
 forward=getcase('walk_forward_24');back=getcase('walk_backward_24')
 def cadence(case):return [abs(r['after']['x']-r['before']['x'])*scale for r in case['samples'][2:24]]
 # SF data captures its selected turbo cadence; it is empirical, not the
 # recovered full internal speed scheduler. Keep that limitation explicit.
 c['movement']={'inputDelaySamples':2,'walk':{'forward':cadence(forward),'backward':cadence(back)},'jumps':profiles,'run':run,
  'sourceScale':scale,'sampleRate':d['fps'],'pushHalfWidth':31.5 if game=='umk3' else 16*scale,
  'bodyClearanceHeight':38 if game=='umk3' else 45*scale,'maximumDistance':306 if game=='umk3' else 304*scale,
  'jumpRepeatSamples':49 if game=='umk3' else 39,
  'limits':['SF turbo cadence sampled, not full original scheduler.','Body/camera crossover rules are explicit adaptations, not one shared original engine.']}
 measurements[name]=c['movement']
# Do not overwrite the previously fixed basic attack clips.
bank['limits']=['Movement measured per character; source video sampling and SF turbo scheduler limits documented in passo-3.', 'Mixed-game arena body and camera are explicit crossover rules.']
f.write_text('window.ARENA_ASSETS='+json.dumps(bank,ensure_ascii=False)+';',encoding='utf-8')
(H/'movimento-medido.json').write_text(json.dumps({'characters':measurements,'new_poses':new},indent=2),encoding='utf-8')
print('Movement data prepared; new native poses:',len(new))
