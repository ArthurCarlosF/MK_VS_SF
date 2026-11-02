from pathlib import Path
import ctypes as C,struct,re,json,collections,hashlib
ROOT=Path(__file__).resolve().parent.parent
rom=(ROOT/'entradas/umk3-r12-maincpu.bin').read_bytes();base=0xff800000
lib=C.CDLL(str(ROOT/'ferramentas/tmsdecode.dll'));lib.load_rom.argtypes=[C.c_void_p];lib.decode.argtypes=[C.c_uint,C.c_void_p];lib.decode.restype=C.c_uint
raw=C.create_string_buffer(rom);lib.load_rom(raw);text=C.create_string_buffer(4096)
seeds={struct.unpack_from('<I',rom,i)[0]:'hardware_vector' for i in range(len(rom)-32,len(rom),4)}
# Selection helpers observed in earlier portrait/nav investigation, separate provenance.
seeds[0xffa68000]='selection_helper_previous_investigation'
q=collections.deque(seeds);seen={};entries=dict(seeds);edges=[];unresolved=[]
def valid(a):return base<=a<0xffffffe0 and (a&15)==0
while q:
 pc=q.popleft()
 while valid(pc) and pc not in seen:
  result=lib.decode(pc,text);n=result&0xffff;s=text.value.decode();mn=s.split()[0] if s.split() else '';length=n//8
  if not n or mn=='DW':unresolved.append({'at':hex(pc),'reason':'invalid_or_data','text':s});break
  seen[pc]={'address':f'{pc:08X}','offset':(pc-base)//8,'bits':n,'bytes':rom[(pc-base)//8:(pc-base)//8+length].hex(),'assembly':s}
  target=re.findall(r'\b(FF[0-9A-F]{6})h',s)
  branch=mn.startswith(('JA','JR','DSJ')) or mn in ('CALLA','CALLR')
  if branch and target:
   dst=int(target[-1],16);edges.append({'from':hex(pc),'to':hex(dst),'kind':mn})
   if valid(dst):
    q.append(dst)
    if mn in ('CALLA','CALLR'):entries.setdefault(dst,'direct_call')
  if mn in ('JUMP','CALL'):unresolved.append({'at':hex(pc),'reason':'indirect_control_flow','text':s})
  if mn in ('RETS','RETI','JUMP','JA','JR'):break
  pc+=n
out=ROOT/'umk3';(out/'fluxo-instrucoes.json').write_text(json.dumps(list(seen.values()),indent=2));(out/'fluxo-arestas.json').write_text(json.dumps(edges,indent=2));(out/'fluxo-pendencias.json').write_text(json.dumps(unresolved,indent=2))
with (out/'umk3-fluxo-alcancavel.asm').open('w') as f:
 f.write('; STATIC REACHABILITY CANDIDATES, NOT DYNAMIC EXECUTION PROOF. INDIRECT BRANCHES REMAIN UNRESOLVED.\n')
 for pc,r in sorted(seen.items()):
  if pc in entries:f.write(f'\n; ENTRY {pc:08X} {entries[pc]}\n')
  f.write(f'{pc:08X} {r["offset"]:06X} {r["bytes"]:16} {r["assembly"]}\n')
result={'rom_sha256':hashlib.sha256(rom).hexdigest(),'seed_entries':{hex(k):v for k,v in seeds.items()},'instructions':len(seen),'candidate_function_entries':len(entries),'direct_edges':len(edges),'unresolved':len(unresolved),'reachable_byte_coverage':sum(r['bits']//8 for r in seen.values()),'rom_bytes':len(rom),'claim':'static direct-control-flow traversal, incomplete for indirect jumps and task continuations'}
(out/'resumo-fluxo.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2))
