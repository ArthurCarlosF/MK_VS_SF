"""Headless libretro renderer for locally supplied arcade data; no desktop UI capture."""
from pathlib import Path
import ctypes as C,sys,json,time
import numpy as np
from PIL import Image
ROOT=Path(r'C:/Users/Pichau/Documents/Codex/2026-10-22/ve/work/selection-assets');SAVE=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/execucao-animacoes')/sys.argv[1];SAVE.mkdir(parents=True,exist_ok=True)
lib=C.CDLL(str(ROOT/'core/mame2003_plus_libretro.dll'))
class Variable(C.Structure):_fields_=[('key',C.c_char_p),('value',C.c_char_p)]
class Game(C.Structure):_fields_=[('path',C.c_char_p),('data',C.c_void_p),('size',C.c_size_t),('meta',C.c_char_p)]
class Info(C.Structure):_fields_=[('library_name',C.c_char_p),('library_version',C.c_char_p),('valid_extensions',C.c_char_p),('need_fullpath',C.c_bool),('block_extract',C.c_bool)]
ENV=C.CFUNCTYPE(C.c_bool,C.c_uint,C.c_void_p);VIDEO=C.CFUNCTYPE(None,C.c_void_p,C.c_uint,C.c_uint,C.c_size_t);SAMPLE=C.CFUNCTYPE(None,C.c_int16,C.c_int16);BATCH=C.CFUNCTYPE(C.c_size_t,C.c_void_p,C.c_size_t);POLL=C.CFUNCTYPE(None);INPUT=C.CFUNCTYPE(C.c_int16,C.c_uint,C.c_uint,C.c_uint,C.c_uint)
variables={};buffers=[];pixel=0;frame=0;latest=None;inputs={};descriptors=[];capture=set();game=sys.argv[1] if len(sys.argv)>1 else 'ssf2tu'
LOG=C.CFUNCTYPE(None,C.c_int,C.c_char_p)
@LOG
def logger(level,fmt):
 if level>=2:print('CORE',level,fmt.decode(errors='replace').strip(),flush=True)
pathbytes=str(SAVE).encode();buffers.append(pathbytes)
@ENV
def env(cmd,data):
 global pixel
 if cmd==27:C.cast(data,C.POINTER(C.c_void_p))[0]=C.cast(logger,C.c_void_p);return True
 if cmd in (9,30,31):C.cast(data,C.POINTER(C.c_char_p))[0]=pathbytes;return True
 if cmd==3:C.cast(data,C.POINTER(C.c_bool))[0]=True;return True
 if cmd==10:pixel=C.cast(data,C.POINTER(C.c_uint))[0];return True
 if cmd==16:
  p=C.cast(data,C.POINTER(Variable));i=0
  while p[i].key:
   key=p[i].key.decode();definition=p[i].value.decode();default=definition.split('; ',1)[-1].split('|')[0]
   if 'skip_disclaimer' in key or 'skip_warnings' in key:default='enabled'
   if 'sample_rate' in key and '0' in definition.split('; ',1)[-1].split('|'):default='0'
   variables[key]=default.encode();i+=1
  return True
 if cmd==15:
  p=C.cast(data,C.POINTER(Variable));key=p[0].key.decode()
  if key in variables:p[0].value=variables[key];return True
  return False
 if cmd==17:C.cast(data,C.POINTER(C.c_bool))[0]=False;return True
 if cmd in (1,8,11,18,35,37):return True
 if cmd==47:C.cast(data,C.POINTER(C.c_uint))[0]=1;return True
 if cmd==39:C.cast(data,C.POINTER(C.c_uint))[0]=0;return True
 return False
@VIDEO
def video(data,w,h,pitch):
 global latest
 if not data:return
 raw=C.string_at(data,pitch*h)
 if pixel==1:
  a=np.frombuffer(raw,np.uint8).reshape(h,pitch)[:,:w*4].reshape(h,w,4);rgb=a[:,:,[2,1,0]]
 else:
  a=np.frombuffer(raw,np.uint16).reshape(h,pitch//2)[:,:w];rgb=np.empty((h,w,3),np.uint8)
  if pixel==2:rgb[:,:,0]=((a>>11)&31)*255//31;rgb[:,:,1]=((a>>5)&63)*255//63;rgb[:,:,2]=(a&31)*255//31
  else:rgb[:,:,0]=((a>>10)&31)*255//31;rgb[:,:,1]=((a>>5)&31)*255//31;rgb[:,:,2]=(a&31)*255//31
 latest=Image.fromarray(rgb)
@SAMPLE
def audio(a,b):pass
@BATCH
def batch(data,n):return n
@POLL
def poll():pass
@INPUT
def input_state(port,device,index,ident):return inputs.get((port,ident),0) if (device&255)==1 else 0
for name,cb,typ in [('environment',env,ENV),('video_refresh',video,VIDEO),('audio_sample',audio,SAMPLE),('audio_sample_batch',batch,BATCH),('input_poll',poll,POLL),('input_state',input_state,INPUT)]:
 f=getattr(lib,'retro_set_'+name);f.argtypes=[typ];f(cb)
lib.retro_get_system_info.argtypes=[C.POINTER(Info)];info=Info();lib.retro_get_system_info(C.byref(info));print(info.library_name,info.library_version,flush=True)
lib.retro_init();lib.retro_load_game.argtypes=[C.POINTER(Game)];lib.retro_load_game.restype=C.c_bool
rom=str(ROOT/'roms'/f'{game}.zip').encode();payload=Game(rom,None,0,None);ok=lib.retro_load_game(C.byref(payload));print('LOAD',ok,'pixel',pixel,'options',variables,flush=True)
assert ok
lib.retro_set_controller_port_device.argtypes=[C.c_uint,C.c_uint]
lib.retro_set_controller_port_device(0,1);lib.retro_set_controller_port_device(1,1)


import struct,hashlib
OUT=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/animacoes')/('ryu' if game=='ssf2tu' else 'scorpion');OUT.mkdir(exist_ok=True,parents=True)
class Geometry(C.Structure):_fields_=[('base_width',C.c_uint),('base_height',C.c_uint),('max_width',C.c_uint),('max_height',C.c_uint),('aspect_ratio',C.c_float)]
class Timing(C.Structure):_fields_=[('fps',C.c_double),('sample_rate',C.c_double)]
class AV(C.Structure):_fields_=[('geometry',Geometry),('timing',Timing)]
av=AV();lib.retro_get_system_av_info.argtypes=[C.POINTER(AV)];lib.retro_get_system_av_info(C.byref(av))
lib.retro_serialize_size.restype=C.c_size_t
lib.retro_serialize.argtypes=[C.c_void_p,C.c_size_t];lib.retro_serialize.restype=C.c_bool
lib.retro_unserialize.argtypes=[C.c_void_p,C.c_size_t];lib.retro_unserialize.restype=C.c_bool
frame=0;capture=set()
def ticks(keys,count,second=()):
 global inputs,frame
 for _ in range(count):
  frame+=1;inputs={(0,k):1 for k in keys};inputs.update({(1,k):1 for k in second});lib.retro_run()
def state():
 n=lib.retro_serialize_size();b=C.create_string_buffer(n);assert lib.retro_serialize(b,n);return b.raw
def restore(b):
 buf=C.create_string_buffer(b);assert lib.retro_unserialize(buf,len(b))
if game=='ssf2tu':
 for frame in range(2101):
  inputs={}
  if 1600<=frame<1605:inputs={(0,2):1,(1,2):1}
  if 1950<=frame<1960:inputs={(0,3):1,(1,3):1}
  lib.retro_run()
 ticks([],12)
 # P2 starts on Ken in this two-player layout; preserve its original default.
 ticks([0],6,second=[0]);ticks([],850)
else:
 for frame in range(801):
  inputs={}
  if 600<=frame<605:inputs={(0,2):1,(1,2):1}
  if 640<=frame<645:inputs={(0,3):1,(1,3):1}
  if 740<=frame<745:inputs={(0,0):1,(1,0):1}
  lib.retro_run()
 for _ in range(6):ticks([7],5);ticks([],10)
 ticks([2],5);ticks([],10);ticks([],5,second=[3]);ticks([],60)
 latest.save(OUT/'entrada-jogador2.png')
 ticks([0],5,second=[0]);ticks([],700)
baseline=state();(OUT/'baseline-duplo.state').write_bytes(baseline);latest.save(OUT/'baseline-duplo.png')

def sfdata(b):
 start=0x3d346
 read=lambda addr,n:bytes(b[start+(((addr+i)&65535)^1)] for i in range(n))
 base=0xff844e
 records=[];all_objects=[]
 # Two copies of object RAM; use the first physical bank and retain both for audit.
 for offset in range(0x9346,0xb346,8):
  x,y,code,attr=struct.unpack_from('<4H',b,offset)
  if (x>>13)>=1 and (y&0x3ff)<240:all_objects.append([x,y,code,attr,offset])
  if (x>>13)==7 and (attr&31)==1 and code<0x8000 and (y&0x3ff)<240:records.append([x,y,code,attr])
 altrecords=[];altall=[]
 for offset in range(0xb346,0xd346,8):
  x,y,code,attr=struct.unpack_from('<4H',b,offset)
  if (x>>13)>=1 and (y&0x3ff)<240:altall.append([x,y,code,attr,offset])
  if (x>>13)==7 and (attr&31)==1 and code<0x8000 and (y&0x3ff)<240:altrecords.append([x,y,code,attr])
 return {'x':int.from_bytes(read(base+6,2),'big',signed=True),'y':int.from_bytes(read(base+10,2),'big',signed=True),'frame':hex(int.from_bytes(read(base+0x1a,4),'big')),'state':[int.from_bytes(read(base+i,1),'big') for i in [2,3,4,5]],'char_p1':read(0xff87df,1)[0],'char_p2':read(0xff8bdf,1)[0],'human':[read(0xff87dc,1)[0],read(0xff8bdc,1)[0]],'command':read(0xff84e2,1)[0],'p1_objects_alt':altrecords,'all_objects_alt':altall,'all_objects':all_objects,'object_palette_words':list(struct.unpack_from('<512H',b,0xd346)),'p1_objects':records,'palette_words':list(struct.unpack_from('<16H',b,0xd366)),'game_counter_ff801d':read(0xff801d,1)[0],'observed_word_ff804e':int.from_bytes(read(0xff804e,2),'big'),'p2_x':int.from_bytes(read(0xff8854,2),'big',signed=True)}
def mkdata(b):
 start=0x2c19
 off=lambda addr:start+(addr-0x1000000)//8
 p1=struct.unpack_from('<I',b,off(0x10609d0))[0];p2=struct.unpack_from('<I',b,off(0x1061580))[0];a=off(p1);a2=off(p2)
 return {'x':struct.unpack_from('<i',b,a+16)[0]/65536,'y':struct.unpack_from('<i',b,a+20)[0]/65536,'frame':hex(struct.unpack_from('<I',b,a+58)[0]),'char_p1':struct.unpack_from('<H',b,a+62)[0],'char_p2':struct.unpack_from('<H',b,a2+62)[0],'p1_object':hex(p1),'p2_object':hex(p2),'p2_x':struct.unpack_from('<i',b,a2+16)[0]/65536,'action_candidates':[struct.unpack_from('<H',b,k)[0] for k in [0xf08b,0x104fd]],'flags':hex(struct.unpack_from('<H',b,a+30)[0]),'camera_x':struct.unpack_from('<h',b,off(0x105dae0))[0]}
getdata=sfdata if game=='ssf2tu' else mkdata
print('BASELINE',getdata(baseline),'FPS',av.timing.fps,flush=True)
experiments=[('parado',[([],150)]),('andar_frente',[([7],24),([],96)]),('andar_tras',[([6],24),([],96)])]
if game=='ssf2tu':experiments.append(('hadouken',[([5],3),([5,7],3),([7],3),([7,0],3),([],108)]))
else:experiments.extend([('lanca',[([6],4),([],4),([6],4),([0],3),([],135)]),('teleporte',[([5],4),([6],4),([1],3),([],139)])])
manifest={'game':game,'fps':av.timing.fps,'native_resolution':[av.geometry.base_width,av.geometry.base_height],'two_player_setup':True,'baseline_sha256':hashlib.sha256(baseline).hexdigest(),'baseline':getdata(baseline),'experiments':{}}
for name,sequence in experiments:
 restore(baseline)
 # Flush the one-frame video latch after restoring. All experiments share this warm-up.
 ticks([],3)
 folder=OUT/'capturas'/name;folder.mkdir(parents=True,exist_ok=True)
 records=[];index=0
 for keys,count in sequence:
  for _ in range(count):
   before=getdata(state());ticks(keys,1);after=getdata(state());latest.save(folder/f'{index:03}.png');records.append({'sample':index,'keys':keys,'before':before,'after':after});index+=1
 manifest['experiments'][name]={'input_sequence':sequence,'samples':records}
 print('EXPERIMENT',name,index,flush=True)
(OUT/'medicao-bruta.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8');lib.retro_unload_game();lib.retro_deinit();print('DONE')
