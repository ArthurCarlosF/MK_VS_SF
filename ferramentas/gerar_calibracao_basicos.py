"""Convert observed native data; preserve evidence and uncertainty per field."""
from pathlib import Path
import json,statistics
ROOT=Path(__file__).resolve().parent.parent
R=ROOT/'engenharia-reversa';result={'schema':1,'characters':{}}
for name,maxhealth in [('scorpion',166),('ryu',144)]:
    capture=json.loads((R/'calibracao-basicos'/name/'medicoes.json').read_text(encoding='utf-8'))
    fps=capture['fps'];moves={}
    idle_capture=json.loads((R/'animacoes-base'/name/'medicao-bruta.json').read_text(encoding='utf-8'))
    idle={s['after']['frame'] for s in idle_capture['experiments']['parado']['samples']}
    crouch={s['after']['frame'] for s in idle_capture['experiments']['agachar']['samples'][12:35]}
    for move in ['punch','kick','crouchPunch','crouchKick']:
        experiments=[e for e in capture['experiments'] if e['move']==move]
        whiff=next(e for e in experiments if e['approach_samples']==0)
        samples=whiff['samples'];neutral=idle|crouch if move.startswith('crouch') else idle
        poses=[i for i,s in enumerate(samples) if s['frame'] not in neutral];end=max(poses)+1
        hits=[e for e in experiments if not e['defending'] and e['samples'][-1]['health'][1]<maxhealth]
        damage=sorted({maxhealth-e['samples'][-1]['health'][1] for e in hits})
        guarded=sorted({maxhealth-e['samples'][-1]['health'][1] for e in experiments if e['defending']})
        if name=='ryu':
            # Source tables express x for native facing_dir=0 (left).
            # Captured Ryu faces right (facing_dir=1), so normalize once.
            timeline=[]
            for sample in samples[:end]:
                timeline.append([{'x':-(b['x']+b['w'])*1.25,'y':b['y']*1.25,
                                  'w':b['w']*1.25,'h':b['h']*1.25}
                                 for b in sample['hitboxes'] if b['kind']=='attack'])
            active=[i for i,boxes in enumerate(timeline) if boxes]
            first,last=min(active),max(active)
            geometry={'attackTimeline':timeline,'geometryEvidence':'Native Ryu ROM tables, canonical facing; SF display scale 1.25.'}
            geometry['hurtTimeline']=[[{'x':-(b['x']+b['w'])*1.25,'y':b['y']*1.25,
                                       'w':b['w']*1.25,'h':b['h']*1.25}
                                      for b in sample['hitboxes'] if b['kind']=='hurt'] for sample in samples[:end]]
        else:
            # Native collision rectangles have not been reconstructed for MK.
            # Use only observed hit times and mark the resulting window inferred.
            contacts=[next(i for i,s in enumerate(e['samples']) if s['health'][1]<maxhealth) for e in hits]
            first=min(contacts);last=max(contacts)
            geometry={'geometryEvidence':'MK rectangles remain provisional; contact window inferred from hit samples.',
                      'observedContactSamples':sorted(set(contacts))}
        native_damage=statistics.median_low(damage)
        # A guard attempt which took full damage is not a measurement of chip.
        chip_values=[v for v in guarded if v<min(damage)]
        chip=statistics.median_low(chip_values) if chip_values else 0
        moves[move]={'startup':first/fps,'active':(last-first+1)/fps,
            'recovery':max(0,(end-last-1)/fps),'duration':end/fps,
            'damage':native_damage/maxhealth*100,'chip':chip/maxhealth*100,
            'nativeDamageObserved':damage,'nativeGuardLossObserved':guarded,'nativeMaxHealth':maxhealth,
            'sampleRate':fps,'sourceSamples':end,'firstActiveSample':first,'lastActiveSample':last,
            'damageEvidence':'Observed baseline hits normalized to 100 life; variable damage/near-far variants not fully reconstructed.',
            **geometry}
        moves[move]['nativePoseTimeline']=[s['frame'] for s in samples[:end]]
        if name=='ryu' and move=='kick':
            lows=[e for e in experiments if e['defending']=='low']
            assert lows and all(e['samples'][-1]['health'][1]==maxhealth for e in lows)
            assert all(any(s.get('p2_state')==8 for s in e['samples']) for e in lows)
            moves[move]['level']='low'
            moves[move]['levelEvidence']='Standing guard took damage, low guard entered native blocking state 8 without damage.'
    result['characters'][name]={'moves':moves,'fps':fps}
    if name=='ryu':
        result['characters'][name]['passiveHurt']={
            'idle':moves['punch']['hurtTimeline'][0],
            'crouch':moves['crouchPunch']['hurtTimeline'][0]}
result['limits']=['SF timing/geometry uses far whiff samples; near variants pending.',
 'MK active windows inferred from limited contacts; native rectangles pending.',
 'Damage variations retained as evidence; deterministic observed representative used.',
 'Stun, push, air normals and cross-game defense interactions remain provisional.']
(ROOT/'arena/calibration.js').write_text('window.BASIC_CALIBRATION='+json.dumps(result,ensure_ascii=False)+';\n',encoding='utf-8')
(ROOT/'arena/calibracao-basicos.json').write_text(json.dumps(result,indent=2,ensure_ascii=False),encoding='utf-8')
for name,c in result['characters'].items():
 print(name,[(m,round(v['duration'],3),round(v['damage'],2),v['firstActiveSample'],v['lastActiveSample']) for m,v in c['moves'].items()])
