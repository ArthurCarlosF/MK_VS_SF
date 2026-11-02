from pathlib import Path
import ctypes as C,struct,json,re
R=Path(__file__).resolve().parent.parent;b=(R/'entradas/umk3-r12-maincpu.bin').read_bytes();base=0xff800000
lib=C.CDLL(str(R/'ferramentas/tmsdecode.dll'));lib.load_rom.argtypes=[C.c_void_p];lib.decode.argtypes=[C.c_uint,C.c_void_p];lib.decode.restype=C.c_uint;raw=C.create_string_buffer(b);lib.load_rom(raw);buf=C.create_string_buffer(4096)
def decode(pc):
 n=lib.decode(pc,buf)&0xffff;return n,buf.value.decode()
helpers=['FF9B3E60h','FF9B3ED0h','FF9B3F20h'];out=[]
for off in range(0,len(b)-8,2):
 pc=base+off*8;n,s=decode(pc)
 if s.split()[0] not in ('CALLA','CALLR','JA','JR') or not any(s.rstrip().endswith(t) for t in helpers):continue
 for back in range(2,31,2):
  start=pc-back*8;nn,ss=decode(start)
  m=re.fullmatch(r'MOVI\s+(FF[0-9A-F]{6})h,A0',ss)
  if not m:continue
  # Accept only a straight, instruction-aligned path from the table load to this call.
  ptr=start+nn;good=True
  while ptr<pc:
   k,line=decode(ptr)
   if not k or line.split()[0] in ('DW','JUMP','JA','JR','RETS','RETI'):good=False;break
   ptr+=k
  if not good or ptr!=pc:continue
  table=int(m[1],16);index=(table-base)//8
  if index<0 or index+22*4>len(b):continue
  values=list(struct.unpack_from('<22I',b,index));target=values[18]
  if not (base<=target<0xffffff00):continue
  out.append(dict(load=hex(start),call=hex(pc),helper=s.strip(),table=hex(table),file_offset=hex(index),scorpion_id=18,scorpion_entry=hex(target),entries=[hex(v) for v in values],classification='character-indexed table; gameplay role not yet named'))
  break
(R/'umk3/tabelas-por-personagem.json').write_text(json.dumps(out,indent=2));print('TABLE_CALLS',len(out))
with (R/'umk3/scorpion-entradas-candidatas.asm').open('w') as f:
 for v in out:
  f.write('\n; TABLE '+v['table']+' CALL '+v['call']+' SCORPION ID18 -> '+v['scorpion_entry']+'\n')
  pc=int(v['load'],16)
  while pc<=int(v['call'],16):
   n,s=decode(pc);f.write(f'{pc:08X} {s}\n');pc+=n
  pc=int(v['scorpion_entry'],16)
  for _ in range(35):
   n,s=decode(pc);f.write(f'{pc:08X} {s}\n');pc+=n
   if s.split()[0] in ('DW','RETS','RETI','JUMP','JA','JR'):break
for v in out:print(v['table'],v['scorpion_entry'],v['call'])
