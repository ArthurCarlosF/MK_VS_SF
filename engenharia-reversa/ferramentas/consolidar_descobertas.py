from pathlib import Path
import json,struct,hashlib,csv,ctypes as C
from capstone import *
R=Path(__file__).resolve().parent.parent
sf=(R/'entradas/ssf2tu-68k-opcodes-be.bin').read_bytes();data=(R/'entradas/ssf2tu-68k-data-be.bin').read_bytes();mk=(R/'entradas/umk3-r12-maincpu.bin').read_bytes();E=R/'ssf2t/experimentos'
RAM=0x3d346
sfbyte=lambda b,a:b[RAM+((a&65535)^1)]
ids=[0,1,2,3,13,14,10,9,4,5,6,7,12,15,11,8]
assert [sfbyte((E/f'fight-{i:02}.state').read_bytes(),0xff87df) for i in range(16)]==ids
rows=[]
for mode in ['idle','walk','qcf_punch']:
 for f in sorted(E.glob(mode+'-*.state')):
  b=f.read_bytes();rows.append({'experiment':mode,'sample':int(f.stem.split('-')[-1]),'character':sfbyte(b,0xff87df),'hadouken_state':sfbyte(b,0xff84e2),'hadouken_timer':sfbyte(b,0xff84e3),'action_state':sfbyte(b,0xff8451),'accepted_flag':sfbyte(b,0xff85d9)})
with (R/'ssf2t/ryu-tracos.csv').open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
q=[r for r in rows if r['experiment']=='qcf_punch'];states=[]
for row in q:
 if not states or states[-1]!=row['hadouken_state']:states.append(row['hadouken_state'])
assert states[:5]==[0,2,4,6,0],states
assert any(r['action_state']==12 and r['accepted_flag']==1 for r in q)
assert all(r['hadouken_state']==0 for r in rows if r['experiment']=='idle')
comparison=json.loads((R/'evidencias/core-code-comparison.json').read_text());assert all(any(v['swap'] and v['relative_signature']==hex(a) and v['bytes_matching']==len(sf) for v in comparison) for a in [0xc0,0x332,0x7fd6e])
md=Cs(CS_ARCH_M68K,CS_MODE_BIG_ENDIAN|CS_MODE_M68K_000)
blocks=[('input_dispatch',0x7f862,0x7f87a),('special_action_dispatch',0x7f87a,0x7f8ae),('hadouken_dispatch',0x7fd6e,0x7fd7c),('state_0',0x7fd84,0x7fda0),('state_2',0x7fda0,0x7fdbe),('state_4',0x7fdbe,0x7fdf2),('state_6',0x7fdf2,0x7fe0c),('acceptance_checks',0x7fe0c,0x7fe6c),('timer_reset',0x7fe72,0x7fe82),('commit_hadouken',0x7fea8,0x7fed2),('animation_dispatch',0x5246,0x528c),('ryu_animation_select',0x10ff12,0x10ff42)]
with (R/'ssf2t/ryu-blocos-revisados.asm').open('w') as f:
 for name,a,z in blocks:
  f.write(f'\n; {name} — decoded instructions; CPU byte addresses\n')
  for i in md.disasm(sf[a:z],a):f.write(f'{i.address:08X} {i.bytes.hex():18} {i.mnemonic:9} {i.op_str}\n')
ryu={'character_id':0,'character_ram':'0xff87df','player_base_ram':'0xff844e','serialized_ram_offset':hex(RAM),'byte_lane_xor':1,'character_id_crosscheck':{'tested_characters':16,'ids':ids},'rom_opcode_matches_running_core_bytes':len(sf),'input_dispatch':{'table':'0x7b0b4','entry':'0x7f862','index':0,'table_read_view':'decoded_PC_relative'},'hadouken':{'entry':'0x7fd6e','state_byte_ram':'0xff84e2','timer_byte_ram':'0xff84e3','jump_table':'0x7fd7c','jump_targets':[hex(0x7fd7c+x) for x in struct.unpack_from('>4h',sf,0x7fd7c)],'observed_state_sequence':states,'commit_code':'0x7fea8','committed_action':12,'confirmed_in_isolated_game':True},'other_recognizers_candidates':{'tatsumaki':'0x7f8b8','shoryuken':'0x7fa4a','red_hadouken':'0x7fba8','super':'0x7fed2'},'animation':{'dispatch':'0x5246','character_table_data_view':'0x100000','ryu_entry':hex(struct.unpack_from('>I',data,0x100000)[0]),'sequence_pointer_player_offset':'0x1a','frame_fields_player_offsets':['0x18','0x14'],'status':'static linkage decoded; complete animation grammar not reconstructed'},'limits':['No instruction-by-instruction CPU trace was recorded.','Other move names are candidates, not independently executed move confirmations.','Automatic Ghidra exports contain failures; manual blocks and runtime observations are authoritative for this report.']}
(R/'ssf2t/ryu-mapa.json').write_text(json.dumps(ryu,indent=2))
# TMS addresses below are BIT addresses, not file byte offsets.
base=0xff800000;off=lambda a:(a-base)//8
lookup=struct.unpack_from('<24I',mk,off(0xffb02b90));assert lookup[18]==0xff935a30
palmaster=struct.unpack_from('<24I',mk,off(0xffb04c20));assert palmaster[18]==0xffb0cb20
assert struct.unpack_from('<H',mk,off(palmaster[18]))[0]==64
animations=list(struct.unpack_from('<69I',mk,off(lookup[18])));assert all(base<=v<0xfffff000 for v in animations)
M=R/'umk3/experimentos';baseline=(M/'scorpion-baseline.state').read_bytes();action_events={}
for name,action in [('spear',0x1d),('teleport',0x215)]:
 files=sorted(M.glob(name+'-*.state'));events=[]
 for i,f in enumerate(files):
  b=f.read_bytes();v=struct.unpack_from('<H',b,0xf08b)[0];v2=struct.unpack_from('<H',b,0x104fd)[0]
  if v==action:events.append(i);assert v2==action
 assert len(events)>10,(name,events)
 action_events[name]={'action_id':hex(action),'samples_with_action':events,'serialized_offsets':['0xf08b','0x104fd'],'warning':'These are save-state FILE byte offsets; not emulated CPU RAM addresses.'}
(R/'umk3/scorpion-tracos.json').write_text(json.dumps(action_events,indent=2))
scorp={'character_id':18,'char_field':'A8 + 0x1f0 bits','char_selector':'0xff9b3e60','animation_lookup':'0xffb02ad0','animation_master_table':'0xffb02b90','scorpion_master':'0xff935a30','shared_master_ids':[i for i,v in enumerate(lookup) if v==lookup[18]],'animation_sequence_pointers':[hex(v) for v in animations],'palette_table':'0xffb04c20','palette_entry':'0xffb0cb20','palette_colors':64,'spear':{'entry_candidate':'0xffa9e7f0','action_load':'0xffa9e880','action_id':'0x1d','execution_visual_confirmed':True,'action_state_confirmed':True},'teleport':{'entry_candidate':'0xffa51c50','action_load':'0xffa51d10','action_write':'0xffa51d30','action_id':'0x215','execution_visual_confirmed':True,'action_state_confirmed':True},'rope_pull':{'action_load_candidate':'0xffa9fcf0','action_id':'0x11a','independent_runtime_confirmation':False},'address_unit':'TMS34010 BIT addresses; file offset=(address-0xff800000)/8','limits':['Shared ninja animations do not imply identical moves or gameplay.','No full CPU trace, damage/timing/hitbox reconstruction or fatality recovery is claimed.','Entry labels are analyst attributions supported by static code and observed action IDs.']}
(R/'umk3/scorpion-mapa.json').write_text(json.dumps(scorp,indent=2))
lib=C.CDLL(str(R/'ferramentas/tmsdecode.dll'));lib.load_rom.argtypes=[C.c_void_p];lib.decode.argtypes=[C.c_uint,C.c_void_p];lib.decode.restype=C.c_uint;raw=C.create_string_buffer(mk);lib.load_rom(raw);buf=C.create_string_buffer(4096)
with (R/'umk3/scorpion-blocos-revisados.asm').open('w') as f:
 for name,start,end in [('char_table_lookup',0xff9b3e60,0xff9b3ed0),('animation_lookup',0xffb02ad0,0xffb02b90),('spear_entry',0xffa9e7f0,0xffa9e980),('teleport_entry',0xffa51c50,0xffa52000),('rope_pull_candidate',0xffa9fcf0,0xffa9fd90)]:
  f.write(f'\n; {name} — TMS bit addresses\n');a=start
  while a<end:
   n=lib.decode(a,buf)&0xffff;line=buf.value.decode();assert n
   f.write(f'{a:08X} {off(a):06X} {line}\n');a+=n
results={'checked':True,'sf_character_ids':16,'sf_opcode_bytes_equal_running_core':len(sf),'ryu_hadouken_states':states,'ryu_hadouken_committed_action':12,'scorpion_animation_sequence_pointers':69,'scorpion_spear_samples':len(action_events['spear']['samples_with_action']),'scorpion_teleport_samples':len(action_events['teleport']['samples_with_action']),'original_source_recovered':False}
(R/'evidencias/verificacao-descobertas.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
files=[R/'entradas/umk3-r12-maincpu.bin',R/'entradas/ssf2tu-68k-opcodes-be.bin',R/'entradas/ssf2tu-68k-data-be.bin',R/'ssf2t/ryu-mapa.json',R/'umk3/scorpion-mapa.json']
(R/'evidencias/identidades-descobertas.json').write_text(json.dumps({str(f.relative_to(R)):hashlib.sha256(f.read_bytes()).hexdigest() for f in files},indent=2))
