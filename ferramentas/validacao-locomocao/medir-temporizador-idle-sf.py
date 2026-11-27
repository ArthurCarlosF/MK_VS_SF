from pathlib import Path
import json,struct,hashlib
W=Path(__file__).resolve().parent;E=W/'evidencias/caminhada-elenco-20261121';rom=Path('D:/Projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/entradas/ssf2tu-68k-data-be.bin').read_bytes();f=W/'arena/locomocao-sf-em-validacao-data.js';packs=json.JSONDecoder().raw_decode(f.read_text().split('NATIVE_GROUND_GAITS=',1)[1])[0]
p=packs['akuma'];frames=p['clips']['idle']['frames'];starts={}
for i,frame in enumerate(frames):starts.setdefault(frame['native_pose_pointer'],i)
duration=lambda pose:struct.unpack_from('>H',rom,int(pose,16))[0]
def age(row):return starts[row['frame']]+duration(row['frame'])-row['timer']
source=E/'original/akuma/calibracao-turbo-20261127.json';d=json.loads(source.read_text());steps=0;samples=0
for c in d['cases']:
 for rep in c['repeats']:
  rows=[rep['initial']]+rep['samples']
  for before,after in zip(rows,rows[1:]):
   if before['frame'] not in starts or after['frame'] not in starts:continue
   elapsed=(age(after)-age(before))%len(frames)
   if not 0<elapsed<=3:continue
   steps+=elapsed;samples+=1
rate=steps/samples;before=p['gait']['logicalRates']['idle'];p['gait']['logicalRates']['idle']=rate
p['gait']['idleClockEvidence']='Actual actor animation timer increments over consecutive idle poses in the four independent calibration repetitions; the global game-loop counter is not the actor timer.'
f.write_text('(function(s){s.NATIVE_GROUND_GAITS='+json.dumps(packs,separators=(',',':'))+';})(typeof window===\'undefined\'?globalThis:window);\n')
(E/'akuma-temporizador-idle-20261127.json').write_text(json.dumps({'before':before,'rate':rate,'actorUpdates':steps,'videoSamples':samples,'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest()},indent=2));print('Akuma idle',before,'->',rate,steps,samples)
