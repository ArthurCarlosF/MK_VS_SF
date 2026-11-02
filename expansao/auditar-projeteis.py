from pathlib import Path
import json,hashlib
from PIL import Image
W=Path(__file__).parent;root=W/'projetil-nativo-r2/sf-0';manifest=json.loads((root/'manifesto.json').read_text(encoding='utf-8'));cases=[]
for ident,a in manifest['assets'].items():
 im=Image.open(root/a['file']).convert('RGBA');assert im.size==(a['width'],a['height'])
 assert hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest()==a['sha256_pixels'],ident
for name,entry in manifest['cases'].items():
 c=json.loads((root/entry['file']).read_text(encoding='utf-8'));rows=c['samples'];flight=[r for r in rows if r['projectiles']]
 assert flight,name
 fx=[e for r in rows for e in r['effects'] if e['projectilePosition'] is not None];assert fx,name
 assert all(e['originMethod']=='world position minus camera and hardware bounds' and e['match']>=.95 for e in fx)
 assert all(e['paletteSlot']==(15 if name.startswith('red_') else 14) for e in fx)
 hp=lambda a:int.from_bytes(bytes.fromhex(a['runtime'])[42:44],'big')
 hits=[{'sample':r['sample'],'damage':hp(r['actorBefore'][1])-hp(r['actors'][1])} for r in rows if hp(r['actors'][1])<hp(r['actorBefore'][1])]
 cases.append({'case':name,'firstEntitySample':flight[0]['sample'],'lastEntitySample':flight[-1]['sample'],
  'projectilePosePointers':list(dict.fromkeys(q['pose'] for r in flight for q in r['projectiles'])),
  'verifiedVisualSamples':len(fx),'minimumVisualMatch':min(e['match'] for e in fx),'contacts':hits,
  'firstProjectile':{k:flight[0]['projectiles'][0][k] for k in ['x','y','boxes','paletteSlot']},
  'traceSha256':hashlib.sha256((root/entry['file']).read_bytes()).hexdigest()})
assert len(cases)==7
report={'status':'FILES_VERIFIED_REVIEW_PENDING','integratedInCombat':False,'assets':len(manifest['assets']),'cases':cases,
 'discoveries':['Actual health is actor+0x2a; visual health at+0x2c can update a sample later.',
 'Projectile entities: ff97a2 + slot*c0, eight slots, active word0101.',
 'Palette slot: projectile+0x16, blue/super14 and red15.',
 'Projectile sprite origins use world position minus camera and hardware bounds; actor descriptor offsets are unsuitable.'],
 'pending':['Native scheduler and random damage','Flight and impact pauses, super durability and freezing','Close, crouching, air and corner contact branches','Integration and comparison in both universes']}
(W/'evidencias/projeteis-ryu-auditoria.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'status':report['status'],'cases':len(cases),'assets':report['assets'],'visualSamples':sum(c['verifiedVisualSamples'] for c in cases),'integratedInCombat':False}))
