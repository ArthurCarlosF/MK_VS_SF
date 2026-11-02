from pathlib import Path
import json,math,hashlib,csv,statistics,struct
import numpy as np
from PIL import Image
import decodificar_mk_sprites as mk
import decodificar_sf_sprites as sf
R=Path(__file__).resolve().parent.parent;OUT=R/'animacoes'
LABELS={'parado':'Parado','andar_frente':'Andar para a frente','andar_tras':'Andar para trás','lanca':'Lança','teleporte':'Teleporte','hadouken':'Hadouken'}
mk.use_runtime_palette((OUT/'scorpion/baseline-duplo.state').read_bytes())
FULL={'schema':1,'units':'emulated video samples; positions in each original game world coordinates','characters':{}}
VALID=[]

def render(name,d,alt=False):
 if name=='ryu':
  use=dict(d)
  if alt:use['p1_objects']=d['p1_objects_alt']
  im,meta=sf.decode(use);left,top,_,_=meta['hardware_bounds'];return im,meta,left-64,top-16
 im,meta=mk.decode_frame(int(d['frame'],16));meta=dict(meta);origin=list(meta['origin_in_png'])
 if int(d['flags'],16)&16:
  im=im.transpose(Image.Transpose.FLIP_LEFT_RIGHT);origin[0]=im.width-origin[0]
 meta['origin_in_png']=origin;meta['flipx']=bool(int(d['flags'],16)&16)
 return im,meta,math.floor(d['x']-d['camera_x']-origin[0]),math.floor(d['y']-origin[1])

def score(im,target,x,y):
 a=np.array(im);h,w=a.shape[:2];left=max(0,x);top=max(0,y);right=min(target.shape[1],x+w);bottom=min(target.shape[0],y+h)
 if left>=right or top>=bottom:return 0.,0,0
 aa=a[top-y:bottom-y,left-x:right-x];bb=target[top:bottom,left:right];mask=aa[:,:,3]>0;n=int(mask.sum())
 if n<1:return 0.,0,0
 error=np.max(np.abs(aa[:,:,:3].astype(int)-bb.astype(int)),axis=2);ok=int(np.sum((error<=3)&mask));exact=int(np.sum((error==0)&mask));return ok/n,n,exact

def register(im,meta,bank,assets,folder):
 key=hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest()
 if key not in bank:
  ident=f'frame-{len(assets):04}';file=folder/'quadros'/f'{ident}.png';im.save(file)
  bank[key]=ident;assets[ident]={'file':f'{folder.name}/quadros/{ident}.png','width':im.width,'height':im.height,'sha256_pixels':key,'metadata':meta}
 return bank[key]

for name in ['scorpion','ryu']:
 folder=OUT/name;raw=json.loads((folder/'medicao-bruta.json').read_text(encoding='utf-8'));(folder/'quadros').mkdir(exist_ok=True);assets={};bank={};clips={};fps=raw['fps']
 assert all(r['before']['char_p1']==(18 if name=='scorpion' else 0) for e in raw['experiments'].values() for r in e['samples'])
 assert max(r['after']['p2_x'] for r in raw['experiments']['parado']['samples'])==min(r['after']['p2_x'] for r in raw['experiments']['parado']['samples'])
 if name=='ryu':assert raw['baseline']['human']==[1,1]
 for clip,experiment in raw['experiments'].items():
  entries=[];csvrows=[];prev=None;quality=[]
  for row in experiment['samples']:
   target=np.array(Image.open(folder/'capturas'/clip/f'{row["sample"]:03}.png').convert('RGB'));choices=[]
   for phase in ['before','after']:
    d=row[phase]
    for alt in ([False,True] if name=='ryu' else [False]):
     im,meta,x,y=render(name,d,alt)
     for dx in ([0,-1,1] if name=='scorpion' else [0]):
      q,n,exact=score(im,target,x+dx,y);choices.append((q,phase,alt,im,meta,x+dx,y,n,exact,d))
   # Retain a previous CPU sample to account for the non-serialized video latch.
   if prev is not None:
    for alt in ([False,True] if name=='ryu' else [False]):
     d=prev['before'];im,meta,x,y=render(name,d,alt);q,n,exact=score(im,target,x,y);choices.append((q,'previous_before',alt,im,meta,x,y,n,exact,d))
   best=max(choices,key=lambda c:c[0]);q,phase,alt,im,meta,x,y,n,exact,d=best
   meta=dict(meta);meta['render_source']={'phase':phase,'physical_bank':2 if alt else 1,'cpu_frame_pointer':d['frame']}
   ident=register(im,meta,bank,assets,folder);a=row['after'];b=row['before']
   entries.append({'asset':ident,'screen_x':x,'screen_y':y,'world_x':a['x'],'world_y':a['y'],'source_pointer':d['frame'],'sample':row['sample'],'input':row['keys'],'reference':f'{name}/capturas/{clip}/{row["sample"]:03}.png','match_fraction':round(q,6)})
   csvrows.append({'sample':row['sample'],'time_ms':round(row['sample']*1000/fps,6),'keys':'+'.join(map(str,row['keys'])),'world_x_before':b['x'],'world_x_after':a['x'],'delta_x':a['x']-b['x'],'world_y':a['y'],'frame_pointer':a['frame'],'asset':ident,'render_phase':phase,'physical_bank':2 if alt else 1,'visible_pixel_count':n,'rgb_tolerance_3_match_fraction':round(q,6),'action_state':a.get('state',[None,None])[1] if name=='ryu' else None,'game_counter_delta':(a['game_counter_ff801d']-b['game_counter_ff801d'])%256 if name=='ryu' else None})
   if n>100:quality.append(q)
   prev=row
  with (folder/f'{clip}-medidas.csv').open('w',newline='') as f:
   w=csv.DictWriter(f,fieldnames=list(csvrows[0]));w.writeheader();w.writerows(csvrows)
  runs=[]
  for e in entries:
   if not runs or runs[-1]['asset']!=e['asset']:runs.append({'asset':e['asset'],'start_sample':e['sample'],'samples':1})
   else:runs[-1]['samples']+=1
  for run in runs:run['duration_ms']=run['samples']*1000/fps
  summary={'samples':len(entries),'duration_ms':len(entries)*1000/fps,'unique_frames':len(set(e['asset'] for e in entries)),'world_delta_x':experiment['samples'][-1]['after']['x']-experiment['samples'][0]['before']['x'],'world_delta_y':experiment['samples'][-1]['after']['y']-experiment['samples'][0]['before']['y'],'mean_visible_match_fraction':sum(quality)/len(quality) if quality else None,'minimum_visible_match_fraction':min(quality) if quality else None}
  if clip.startswith('andar'):
   active=[r for r in csvrows if r['keys']];deltas=[r['delta_x'] for r in active];moving=[d for d in deltas if d]
   summary.update({'held_input_samples':len(active),'held_input_duration_ms':len(active)*1000/fps,'displacement_during_held_input':sum(deltas),'nonzero_delta_values':sorted(set(moving)),'first_motion_sample':next((r['sample'] for r in active if r['delta_x']),None),'mean_world_units_per_emulated_sample_after_motion_begins':sum(moving)/len(moving) if moving else 0})
  if name=='ryu' and clip=='hadouken':
   values=[r['after']['state'][1] for r in experiment['samples']];hits=[i for i,v in enumerate(values) if v==12]
   assert hits,'Hadouken was not committed'
   summary.update({'commit_sample':hits[0],'last_committed_action_sample':hits[-1],'observed_action_samples':len(hits),'observed_action_ms':len(hits)*1000/fps,'warning':'Action-state duration is not startup/active/recovery frame data.'})
  clips[clip]={'label':LABELS[clip],'frames':entries,'runs':runs,'summary':summary}
  VALID.append({'character':name,'clip':clip,**summary})
 # A native-pixel atlas for review and later engine import; atlas does not rescale sprites.
 maxw=max(v['width'] for v in assets.values());maxh=max(v['height'] for v in assets.values());cw=max(160,math.ceil((maxw+16)/16)*16);ch=max(160,math.ceil((maxh+16)/16)*16);cols=8
 atlas=Image.new('RGBA',(cols*cw,math.ceil(len(assets)/cols)*ch))
 for i,(ident,a) in enumerate(assets.items()):
  im=Image.open(OUT/a['file']);x=(i%cols)*cw+(cw-im.width)//2;y=(i//cols)*ch+(ch-im.height)//2;atlas.alpha_composite(im,(x,y));a['atlas_rect']=[x,y,im.width,im.height]
 atlas.save(folder/'spritesheet.png')
 result={'name':'Scorpion — UMK3' if name=='scorpion' else 'Ryu — Super Turbo','fps':fps,'native_resolution':raw['native_resolution'],'palette_source':'captured runtime RGB555 palette at save-file offset 0x8f419' if name=='scorpion' else 'captured CPS2 object palette RAM; transparency pen 15','assets':assets,'clips':clips,'measurement_limits':['Video samples are not necessarily one internal game update, especially under Super Turbo.','Reference matching chooses between saved sprite banks and adjacent CPU samples to account for rendering latency.','RGB tolerance is 3 per channel, accounting for video color quantization.','These are observed clips, not the entire moveset, collision data or a recovered original engine.']}
 (folder/'manifesto-animacoes.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8');FULL['characters'][name]=result
 print(name,'ASSETS',len(assets),'CLIPS',len(clips),'VALIDATION',[(k,round(v['summary']['mean_visible_match_fraction'],4)) for k,v in clips.items()],flush=True)
(OUT/'animacoes.js').write_text('window.ANIMACOES='+json.dumps(FULL,ensure_ascii=False)+';',encoding='utf-8');(OUT/'medidas-resumo.json').write_text(json.dumps(VALID,indent=2,ensure_ascii=False),encoding='utf-8')
(R/'evidencias/verificacao-animacoes.json').write_text(json.dumps({'exported':True,'measurements':VALID,'original_game_files_modified':False},indent=2,ensure_ascii=False),encoding='utf-8')
