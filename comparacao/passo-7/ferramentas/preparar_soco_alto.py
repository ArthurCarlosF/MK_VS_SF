from pathlib import Path
import json,sys,copy,hashlib
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-7'
sys.path.insert(0,str(P/'engenharia-reversa/ferramentas'))
import decodificar_mk_sprites as mk
bank=json.loads((H/'backup-antes/assets.js').read_text(encoding='utf-8').split('=',1)[1].rstrip(';'))
defs=json.loads((H/'dados-antes.json').read_text(encoding='utf-8'))
b=bank['characters']['scorpion'];d=defs['characters']['scorpion'];fps=b['fps']
mk.use_runtime_palette((H/'hp-01/original/umk3/rep-1/baseline-duplo.state').read_bytes())
known={f['native_pose_pointer']:f for c in b['clips'].values() for f in c['frames'] if f.get('native_pose_pointer')}
def frame(ptr):
 if ptr not in known:
  im,meta=mk.decode_frame(int(ptr,16));ox,oy=meta['origin_in_png'];key='sequence-'+ptr[2:];im.save(P/f'arena/assets/scorpion/{key}.png')
  b['assets'][key]={'file':f'assets/scorpion/{key}.png','width':im.width,'height':im.height,'sha256_pixels':hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest(),'metadata':meta}
  known[ptr]={'asset':key,'x':-ox,'y':-134-oy,'sourceFacing':1,'native_pose_pointer':ptr}
 return copy.deepcopy(known[ptr])
def load(name):
 path=H/f'{"terminais-mk" if name.startswith("hp_exact") else "hp-01"}/original/umk3/rep-1/{name}/trace.json';c=json.loads(path.read_text());c['_file']=str(path.relative_to(P));return c
out={'schema':7,'characters':{'scorpion':{'moves':{}},'ryu':{'moves':{}}},'profiles':{},'limits':[]};moves=out['characters']['scorpion']['moves']
family=['normal_stand_hp_far','highPunchFollow','highPunchReturn']
moves['normal_stand_hp_far']={'repeat':{'mode':'alternate','preserveStrike':True,'gateFrames':10,'lastFrame':14,'lateFrame':19,'next':'highPunchFollow','initial':family[0],'family':family}}
for name,source,start,end,nextName in [('highPunchFollow','hp_far_hit_4',10,29,'highPunchReturn'),('highPunchReturn','hp_exact_0_4_14',20,41,'highPunchFollow')]:
 c=load(source);clip=name;frames=[frame(r['after']['players'][0]['pose']) for r in c['samples'][start:end]]
 b['clips'][clip]={'frames':frames,'loop':False,'sampleAligned':True,'sequenceRevision':7,'source_case':source}
 m=copy.deepcopy(d['moves']['normal_stand_hp_far']);m.update(clip=clip,startup=11/fps,active=6/fps,recovery=(end-start-17)/fps,sourceSamples=end-start,activeRanges=[[11,17]],nativePoseTimeline=[f['native_pose_pointer'] for f in frames],sequenceEvidence={'source':c['_file'],'samples':[start,end]},repeat={**moves[family[0]]['repeat'],'next':nextName,'lateFrame':1e9})
 # Do not advertise an old clip's isolated phase pointer as this new arm.
 m['timing']={**m.get('timing',{}),'source':c['_file'],'keptSourceSamples':list(range(start,end)),'durationSamples':end-start}
 moves[name]=m
(H/'soco-alto.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
(P/'arena/assets.js').write_text('window.ARENA_ASSETS='+json.dumps(bank,ensure_ascii=False)+';',encoding='utf-8')
(P/'arena/calibration.js').write_text((H/'backup-antes/calibration.js').read_text(encoding='utf-8')+'\nwindow.SEQUENCE_CALIBRATION='+json.dumps(out,ensure_ascii=False)+';\n',encoding='utf-8')
print('HP far alternate clips prepared')
