"""Headless libretro renderer for locally supplied arcade data; no desktop UI capture."""
from pathlib import Path
import ctypes as C,sys,json,time
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parent;SAVE=ROOT/'isolated-emulation';SAVE.mkdir(exist_ok=True)
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
 if not data or frame not in capture:return
 raw=C.string_at(data,pitch*h)
 if pixel==1:
  a=np.frombuffer(raw,np.uint8).reshape(h,pitch)[:,:w*4].reshape(h,w,4);rgb=a[:,:,[2,1,0]]
 else:
  a=np.frombuffer(raw,np.uint16).reshape(h,pitch//2)[:,:w];rgb=np.empty((h,w,3),np.uint8)
  if pixel==2:rgb[:,:,0]=((a>>11)&31)*255//31;rgb[:,:,1]=((a>>5)&63)*255//63;rgb[:,:,2]=(a&31)*255//31
  else:rgb[:,:,0]=((a>>10)&31)*255//31;rgb[:,:,1]=((a>>5)&31)*255//31;rgb[:,:,2]=(a&31)*255//31
 latest=Image.fromarray(rgb);latest.save(ROOT/f'{game}-frame-{frame}.png')
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

capture={800,1000}
for frame in range(1001):
 inputs={}
 if 600<=frame<605:inputs[(1,2)]=1
 if 640<=frame<645:inputs[(1,3)]=1
 if 740<=frame<745:inputs[(1,0)]=1
 lib.retro_run()
 if frame==800:latest.save(ROOT/'mk-player2.png')
lib.retro_unload_game();lib.retro_deinit()
