from pathlib import Path
import json,hashlib,math
from PIL import Image
import numpy as np
import decodificar_sf_sprites as sf
R=Path(__file__).resolve().parent.parent;ROOT=R/'animacoes';folder=ROOT/'ryu';manifest=json.loads((folder/'manifesto-animacoes.json').read_text(encoding='utf-8'));raw=json.loads((folder/'medicao-bruta.json').read_text(encoding='utf-8'));assets=manifest['assets'];known={v['sha256_pixels']:k for k,v in assets.items()};clip=manifest['clips']['hadouken'];observed=[]
def match(im,screen,x,y):
 a=np.array(im);h,w=a.shape[:2];l=max(0,x);t=max(0,y);r=min(screen.shape[1],x+w);b=min(screen.shape[0],y+h)
 if r<=l or b<=t:return 0.,0
 a=a[t-y:b-y,l-x:r-x];target=screen[t:b,l:r];mask=a[:,:,3]>0;n=int(mask.sum());return (float(np.mean(np.max(np.abs(a[:,:,:3].astype(int)-target.astype(int)),axis=2)[mask]<=3)) if n else 0.),n
for row,entry in zip(raw['experiments']['hadouken']['samples'],clip['frames']):
 choices=[];screen=np.array(Image.open(ROOT/entry['reference']).convert('RGB'))
 for phase in ['before','after']:
  d=row[phase]
  for alt in [False,True]:
   records=d['all_objects_alt' if alt else 'all_objects'];objects=[v[:4] for v in records if (v[3]&31)==14 and 0xe200<=v[2]<0xe300]
   if not objects:continue
   source=dict(d);source['p1_objects']=objects;im,meta=sf.decode(source);x=meta['hardware_bounds'][0]-64;y=meta['hardware_bounds'][1]-16;q,n=match(im,screen,x,y);choices.append((q,n,im,meta,x,y,phase,alt))
 entry['effects']=[]
 if not choices:continue
 q,n,im,meta,x,y,phase,alt=max(choices,key=lambda v:v[0])
 if q<0.95 or n<10:continue
 key=hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest()
 if key not in known:
  ident=f'frame-{len(assets):04}';im.save(folder/'quadros'/f'{ident}.png');meta.pop('native_descriptor',None);meta['role']='hadouken_projectile';meta['origin_in_png']=[im.width//2,im.height//2];meta['render_source']={'phase':phase,'physical_bank':2 if alt else 1};assets[ident]={'file':f'ryu/quadros/{ident}.png','width':im.width,'height':im.height,'sha256_pixels':key,'metadata':meta};known[key]=ident
 entry['effects'].append({'asset':known[key],'screen_x':x,'screen_y':y,'match_fraction':q});observed.append(entry['sample'])
assert observed,'No verified projectile frames'
summary={'first_visible_sample':min(observed),'last_verified_visible_sample':max(observed),'verified_visible_samples':len(observed),'first_visible_ms_from_input_sequence_start':min(observed)*1000/manifest['fps'],'visible_delay_ms_after_action_commit':(min(observed)-clip['summary']['commit_sample'])*1000/manifest['fps'],'meaning':'Visual projectile appearance, not first active collision frame.'}
clip['summary']['projectile_visual']=summary
(folder/'manifesto-animacoes.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False),encoding='utf-8')
# Refresh atlas and shared viewer data after extending the frame bank.
maxw=max(v['width'] for v in assets.values());maxh=max(v['height'] for v in assets.values());cw=max(160,math.ceil((maxw+16)/16)*16);ch=max(160,math.ceil((maxh+16)/16)*16);atlas=Image.new('RGBA',(cw*8,ch*math.ceil(len(assets)/8)))
for i,(ident,a) in enumerate(assets.items()):
 im=Image.open(ROOT/a['file']);x=i%8*cw+(cw-im.width)//2;y=i//8*ch+(ch-im.height)//2;atlas.alpha_composite(im,(x,y));a['atlas_rect']=[x,y,im.width,im.height]
atlas.save(folder/'spritesheet.png');(folder/'manifesto-animacoes.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False),encoding='utf-8')
bundle={'schema':1,'units':'emulated video samples; positions in each original game world coordinates','characters':{n:json.loads((ROOT/n/'manifesto-animacoes.json').read_text(encoding='utf-8')) for n in ['scorpion','ryu']}}
(ROOT/'animacoes.js').write_text('window.ANIMACOES='+json.dumps(bundle,ensure_ascii=False)+';',encoding='utf-8');(R/'evidencias/projetil-hadouken.json').write_text(json.dumps(summary,indent=2));print(json.dumps(summary,indent=2));print('TOTAL_RYU_ASSETS',len(assets))
