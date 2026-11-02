"""Run shared semantic cases against a fresh, isolated native arcade session."""
from pathlib import Path
import sys
PROJECT=Path(__file__).resolve().parents[3]
game,rep,run_dir=sys.argv[1],int(sys.argv[2]),Path(sys.argv[3])
source=(PROJECT/'engenharia-reversa/ferramentas/capturar_animacoes.py').read_text(encoding='utf-8')
prefix=source[:source.index("if game=='ssf2tu':\n for frame")]
prefix=prefix.replace("SAVE=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/execucao-animacoes')/sys.argv[1]", "SAVE=Path("+repr(str(run_dir/'execution'/game/f'rep-{rep}'))+")")
prefix=prefix.replace("OUT=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/animacoes')/('ryu' if game=='ssf2tu' else 'scorpion')", "OUT=Path("+repr(str(run_dir/'original'/game/f'rep-{rep}'))+")")
setup=source[source.index("if game=='ssf2tu':\n for frame"):source.index('def sfdata(b):')]
# P2's default is Ken; move one row up to choose Ryu for an exact mirror fixture.
setup=setup.replace('ticks([0],6,second=[0]);ticks([],850)', 'ticks([],3,second=[4]);ticks([],5);ticks([0],6,second=[0]);ticks([],850)')
data=source[source.index('def sfdata(b):'):source.index("print('BASELINE'")]
body='''
suite=json.loads((Path(sys.argv[4]) if len(sys.argv)>4 else PROJECT/'comparacao/passo-3/casos.json').read_text(encoding='utf-8'))
name='scorpion' if game=='umk3' else 'ryu'
def semantic(v,port):
 keys=list(v.get('raw',[]))
 if v.get('x'):keys.append(7 if v['x']>0 else 6)
 for action,button in [('up',4),('down',5),('punch',0),('kick',8 if game=='umk3' else 9)]:
  if v.get(action):keys.append(button)
 if v.get('run') and game=='umk3':keys.append(11)
 if v.get('guard'):keys.append(10 if game=='umk3' else 7 if port==1 else 6)
 return keys
def health(b):
 if game=='umk3':return [struct.unpack_from('<H',b,0x2c19+(a-0x1000000)//8)[0] for a in [0x1060a60,0x1061610]]
 return [int.from_bytes(bytes(b[0x3d346+(((a+i)&65535)^1)] for i in range(2)),'big') for a in [0xff847a,0xff887a]]
def observe(b):
 hp=health(b)
 if game=='umk3':
  off=lambda addr:0x2c19+(addr-0x1000000)//8
  o=off(struct.unpack_from('<I',b,off(0x10609d0))[0]);q=off(struct.unpack_from('<I',b,off(0x1061580))[0])
  x=struct.unpack_from('<i',b,o+16)[0]/65536;y=struct.unpack_from('<i',b,o+20)[0]/65536
  y2=struct.unpack_from('<i',b,q+20)[0]/65536;facing=[-1 if struct.unpack_from('<H',b,z+30)[0]&16 else 1 for z in [o,q]];camera=struct.unpack_from('<h',b,off(0x105dae0))[0];counter=None
  x2=struct.unpack_from('<i',b,q+16)[0]/65536;pose=hex(struct.unpack_from('<I',b,o+58)[0]);st=None
 else:
  read=lambda a,n:bytes(b[0x3d346+(((a+i)&65535)^1)] for i in range(n))
  num=lambda a,n:int.from_bytes(read(a,n),'big',signed=n==2)
  y2=num(0xff8858,2);camera=num(0xff8ed4,2);facing=[1 if read(a,1)[0] else -1 for a in [0xff8460,0xff8860]];counter=list(read(0xff801c,4))
  x=num(0xff8454,2);y=num(0xff8458,2);x2=num(0xff8854,2);pose=hex(num(0xff8468,4));st=list(read(0xff8450,4))
 return {'x':x,'y':y,'p2_x':x2,'p2_y':y2,'facing_raw':facing,'camera_left':camera,'game_counter':counter,'life_native':hp,'life_percent':[v/(166 if game=='umk3' else 144)*100 for v in hp],'pose':pose,'state_raw':st}
initial=getdata(baseline)
assert initial['char_p1']==initial['char_p2']==(18 if game=='umk3' else 0),initial
assert health(baseline)==([166,166] if game=='umk3' else [144,144])
if game=='ssf2tu':assert initial['human']==[1,1]
results=[]
for case in suite['cases']:
 restore(baseline);ticks([],3)
 for seg in case.get('setup',[]):ticks(semantic(seg.get('p1',{}),0),seg['frames'],semantic(seg.get('p2',{}),1))
 start=observe(state());folder=OUT/case['id'];folder.mkdir(exist_ok=True)
 segments=case['segments']*case.get('repeat',1)
 if case.get('tail'):segments=segments+[{'frames':case['tail'],'p1':{}}]
 total=sum(seg['frames'] for seg in segments);checkpoints=set(suite['checkpoints']+[total-1]);samples=[];index=0
 for seg in segments:
  for _ in range(seg['frames']):
   before=observe(state());ticks(semantic(seg.get('p1',{}),0),1,semantic(seg.get('p2',{}),1));after=observe(state())
   shot=None
   if index in checkpoints:
    shot=f"{case['id']}/{index:03}.png";latest.save(OUT/shot)
   samples.append({'sample':index,'time_s':(index+1)/av.timing.fps,'input':[seg.get('p1',{}),seg.get('p2',{})],
    'before':before,'after':after,'screenshot':shot,'render':getdata(state()) if case.get('visual') else None});index+=1
 results.append({'id':case['id'],'initial':start,'samples':samples})
 print('ORIGINAL',game,rep,case['id'],flush=True)
result={'schema':1,'backend':'original','character':name,'game':game,'repetition':rep,'fps':av.timing.fps,
 'baseline':observe(baseline),'baseline_sha256':hashlib.sha256(baseline).hexdigest(),
 'char_ids':[initial['char_p1'],initial['char_p2']],'two_human_players':True,'cases':results,
 'options':{k:v.decode() for k,v in variables.items()}}
(OUT/'trace.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit();print('DONE',game,rep,flush=True)
'''
exec(compile(prefix+setup+data+body,str(__file__),'exec'))
