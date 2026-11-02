"""Build the independent movement prototype's small, auditable sprite bank."""
from pathlib import Path
import json
import shutil
import struct
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'engenharia-reversa' / 'animacoes'
DEST = ROOT / 'arena'
DEST.mkdir(exist_ok=True)
result = {'version': 1, 'characters': {}}

for name in ('scorpion', 'ryu'):
    manifest = json.loads((SOURCE / name / 'manifesto-animacoes.json').read_text(encoding='utf-8'))
    raw = json.loads((SOURCE / name / 'medicao-bruta.json').read_text(encoding='utf-8'))
    baseline = manifest['clips']['parado']['frames'][0]
    baseline_asset = manifest['assets'][baseline['asset']]
    with Image.open(SOURCE / baseline_asset['file']) as im:
        floor = baseline['screen_y'] + im.getchannel('A').getbbox()[3]
    anchor_x = baseline['screen_x'] + (33 if name == 'scorpion' else 38)
    # Native-coordinate origins, inferred from stable, pixel-verified captures.
    # Descriptor origin_in_png is not a common foot anchor across these engines.
    character = {'name': 'Scorpion' if name == 'scorpion' else 'Ryu',
                 'universe': 'mk' if name == 'scorpion' else 'sf',
                 'fps': manifest['fps'], 'assets': {}, 'clips': {}}
    ranges = ({'idle': ('parado', 0, 54), 'forward': ('andar_frente', 4, 28),
               'backward': ('andar_tras', 4, 28)} if name == 'scorpion' else
              {'idle': ('parado', 16, 34), 'forward': ('andar_frente', 3, 23),
               'backward': ('andar_tras', 3, 25)})
    for state, (clip_name, start, end) in ranges.items():
        frames = manifest['clips'][clip_name]['frames']
        samples = raw['experiments'][clip_name]['samples']
        prepared = []
        for f in frames[start:end]:
            asset_id = f['asset']
            asset = manifest['assets'][asset_id]
            # Reuse a verified occurrence of this pose, avoiding capture latency
            # in the first sample of some UMK3 pose transitions.
            reference = next((q for q in frames if q['asset'] == asset_id
                              and q['match_fraction'] > .999 and q['sample'] < 28), f)
            x = reference['screen_x'] - (reference['world_x'] - baseline['world_x']) - anchor_x
            y = reference['screen_y'] - floor
            if name == 'scorpion':
                # Prefer ROM multipart anchor over world/video sampling phase.
                x = -asset['metadata']['origin_in_png'][0]
            if asset_id not in character['assets']:
                dest = DEST / 'assets' / name / f'{asset_id}.png'
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(SOURCE / asset['file'], dest)
                character['assets'][asset_id] = {
                    'file': f'assets/{name}/{asset_id}.png',
                    'width': asset['width'], 'height': asset['height'],
                    'sha256_pixels': asset['sha256_pixels']}
            prepared.append({'asset': asset_id, 'x': x, 'y': y,
                             'source_sample': f['sample']})
        # Repeated, measured movement samples; Turbo deltas stay nonuniform.
        movement = [abs(s['after']['x'] - s['before']['x'])
                    for s in samples[2:26]
                    if s['after']['x'] != s['before']['x']] if state != 'idle' else [0]
        character['clips'][state] = {'frames': prepared, 'steps': movement,
                                    'source_clip': clip_name, 'source_range': [start, end]}
    result['characters'][name] = character

NEW = ROOT / 'engenharia-reversa' / 'animacoes-base'
measurements = {}
for name, character in result['characters'].items():
    folder = NEW / name
    if not (folder / 'manifesto-animacoes.json').exists():
        continue
    m = json.loads((folder / 'manifesto-animacoes.json').read_text(encoding='utf-8'))
    raw = json.loads((folder / 'medicao-bruta.json').read_text(encoding='utf-8'))
    base = m['clips']['parado']['frames'][0]
    with Image.open(NEW / m['assets'][base['asset']]['file']) as im:
        floor = base['screen_y'] + im.getchannel('A').getbbox()[3]
    anchor = base['screen_x'] + (33 if name == 'scorpion' else 38)
    sign = -1 if name == 'scorpion' else 1
    def height(frame):
        return sign * (frame['world_y'] - base['world_y'])
    def prepare(clip_name, start, end, loop=False):
        entries = []
        for f in m['clips'][clip_name]['frames'][start:end]:
            ident = 'base-' + f['asset']; asset = m['assets'][f['asset']]
            if ident not in character['assets']:
                dest = DEST / 'assets' / name / (ident + '.png')
                shutil.copyfile(NEW / asset['file'], dest)
                character['assets'][ident] = {'file': f'assets/{name}/{ident}.png',
                    'width': asset['width'], 'height': asset['height'], 'sha256_pixels': asset['sha256_pixels']}
            x = (-asset['metadata']['origin_in_png'][0] if name == 'scorpion' else
                 f['screen_x'] - (f['world_x'] - base['world_x']) - anchor)
            entries.append({'asset': ident, 'x': x, 'y': f['screen_y'] - floor + height(f),
                            'source_sample': f['sample']})
        return {'frames': entries, 'steps': [0], 'loop': loop, 'source_clip': clip_name,
                'source_range': [start, end]}
    # Longer captures expose Scorpion's full nine-pose walking cycle.
    if name=='scorpion':
        for state,source in [('forward','andar_frente'),('backward','andar_tras')]:
            old_steps=character['clips'][state]['steps']
            character['clips'][state]=prepare(source,8,53,True)
            character['clips'][state]['steps']=old_steps
    idle = set(f['asset'] for f in m['clips']['parado']['frames'])
    for state, source in {'crouch':'agachar', 'guard':'defesa', 'crouchGuard':'defesa_baixa'}.items():
        if source in m['clips']:
            a,b = (75,85) if name=='ryu' and source.startswith('defesa') else (15,30)
            character['clips'][state] = prepare(source,a,b,True)
    for state, source in {'punch':'soco','kick':'chute','crouchPunch':'soco_baixo',
                          'crouchKick':'chute_baixo','airPunch':'soco_aereo','airKick':'chute_aereo',
                          'hit':'dano','knockdown':'queda'}.items():
        if source not in m['clips']:continue
        fs=m['clips'][source]['frames']; candidates=[f['sample'] for f in fs if f['asset'] not in idle]
        if state.startswith('crouch'):a,b=10,45
        elif state.startswith('air'):a,b=16,36
        elif source in ('dano','queda'):
            candidates=[i for i in candidates if i>=65];a,b=(min(candidates),max(candidates)+1) if candidates else (0,1)
        else:a,b=(min(candidates),max(candidates)+1) if candidates else (0,1)
        character['clips'][state]=prepare(source,a,b)
        if name=='ryu' and state in ('hit','knockdown'):
            # Reaction captures include camera/knockback changes absent from
            # the SF world snapshot. Center these temporary pose anchors;
            # combat movement itself remains controlled by the simulation.
            for f in character['clips'][state]['frames']:
                f['x']=-character['assets'][f['asset']]['width']/2
    fallen=character['clips'].get('knockdown',character['clips']['hit'])
    def horizontalness(frame):
        asset=character['assets'][frame['asset']]
        return asset['width']/asset['height']
    prone=dict(max(fallen['frames'],key=horizontalness))
    prone['x']=-character['assets'][prone['asset']]['width']/2
    with Image.open(DEST/character['assets'][prone['asset']]['file']) as im:
        prone['y']=-im.getchannel('A').getbbox()[3]
    character['clips']['ko']={'frames':[prone],'loop':False,'steps':[0],
                              'source_clip':fallen.get('source_clip'),'note':'Hold horizontal pose on KO.'}
    character['clips']['impaled']={**character['clips']['hit'],'loop':True,
                                   'note':'Loop captured hit reaction during spear restraint.'}
    jumps={}
    for state, source in [('jump','pulo'),('jumpForward','pulo_frente')]:
        samples=raw['experiments'][source]['samples'];base_y=samples[0]['before']['y']
        heights=[max(0,sign*(s['after']['y']-base_y)) for s in samples]
        air=[i for i,h in enumerate(heights) if h>.01];end=max(air)+2
        character['clips'][state]=prepare(source,0,end)
        dx=samples[max(air)]['after']['x']-samples[min(air)]['after']['x']
        speed=abs(dx)/((max(air)-min(air))/raw['fps']) if state=='jumpForward' else 0
        jumps[state]={'heights':[0]+heights[:end], 'horizontalSpeed':speed,
                      'height':max(heights),'duration':(end+1)/raw['fps']}
    character['jump']=jumps
    measurements[name]=jumps
    # Specials and Hadouken visuals reuse the independently verified earlier pack.
    old=json.loads((SOURCE/name/'manifesto-animacoes.json').read_text(encoding='utf-8'))
    old_raw=json.loads((SOURCE/name/'medicao-bruta.json').read_text(encoding='utf-8'))
    for state, source in ([('special','lanca'),('reel','lanca'),('teleport','teleporte')] if name=='scorpion' else [('special','hadouken')]):
        fs=old['clips'][source]['frames'];a,b=(10,57) if name=='ryu' else (11,57) if state=='special' else (11,34)
        if state=='reel':a,b=62,89
        entries=[]
        for f in fs[a:b]:
            asset=old['assets'][f['asset']];ident='special-'+f['asset']
            if ident not in character['assets']:
                shutil.copyfile(SOURCE/asset['file'],DEST/'assets'/name/(ident+'.png'))
                character['assets'][ident]={'file':f'assets/{name}/{ident}.png','width':asset['width'],
                                          'height':asset['height'],'sha256_pixels':asset['sha256_pixels']}
            x=(-asset['metadata']['origin_in_png'][0] if name=='scorpion' else
               f['screen_x']-(f['world_x']-old_raw['baseline']['x'])-106)
            # PNGs preserve the source game's mirroring. The renderer must
            # account for it before applying the current fighter's facing.
            entries.append({'asset':ident,'x':x,'y':f['screen_y']-(246 if name=='scorpion' else 204),
                            'sourceFacing':-1 if asset['metadata'].get('flipx') else 1})
            if name=='scorpion' and state=='special' and f['asset']=='frame-0021':
                # Native PNG coordinates at the extended throwing hand.
                # Keep attachments on the pose, so mirroring uses its anchor.
                entries[-1]['attachments']={'spear':{'x':90,'y':18}}
            if name=='scorpion' and state=='reel':
                hands={'frame-0022':(91,16),'frame-0023':(74,17),
                       'frame-0024':(59,17),'frame-0025':(14,29)}
                hx,hy=hands[f['asset']]
                entries[-1]['attachments']={'spear':{'x':hx,'y':hy}}
        character['clips'][state]={'frames':entries,'loop':False,'steps':[0],'source_clip':source}
    if name=='ryu':
        ids=[]
        for ident,asset in old['assets'].items():
            if asset['metadata'].get('role')!='hadouken_projectile':continue
            key='effect-'+ident;shutil.copyfile(SOURCE/asset['file'],DEST/'assets'/name/(key+'.png'))
            character['assets'][key]={'file':f'assets/{name}/{key}.png','width':asset['width'],
                                     'height':asset['height'],'sha256_pixels':asset['sha256_pixels']}
            ids.append(key)
        character['projectileAssets']=ids
    calibration_file=DEST/'calibracao-basicos.json'
    if calibration_file.exists():
        calibration=json.loads(calibration_file.read_text(encoding='utf-8'))['characters'][name]
        for state,observed in calibration['moves'].items():
            source={'punch':'soco','kick':'chute','crouchPunch':'soco_baixo','crouchKick':'chute_baixo'}[state]
            # Map native CPU pose pointers to already verified decoded images,
            # rather than trimming away startup or guessing an animation rate.
            candidates={}
            descriptor_candidates={}
            for key in [source]+[k for k in m['clips'] if k!=source]:
                for index,f in enumerate(m['clips'][key]['frames']):
                    if f['match_fraction']>.99 and f['source_pointer'] not in candidates:
                        candidates[f['source_pointer']]=(key,index)
                    descriptor=m['assets'][f['asset']]['metadata'].get('native_descriptor',{}).get('address')
                    if descriptor and f['match_fraction']>.99:
                        descriptor_candidates.setdefault(int(descriptor,16),(key,index))
            frames=[];fallback=[]
            for pointer in observed['nativePoseTimeline']:
                if pointer in candidates:
                    source_clip,index=candidates[pointer]
                    f=prepare(source_clip,index,index+1)['frames'][0]
                elif name=='ryu' and (descriptor:=struct.unpack_from('>I',(ROOT/'engenharia-reversa/entradas/ssf2tu-68k-data-be.bin').read_bytes(),int(pointer,16)+4)[0]) in descriptor_candidates:
                    source_clip,index=descriptor_candidates[descriptor]
                    f=prepare(source_clip,index,index+1)['frames'][0]
                else:
                    # Some descriptors share the same displayed recovery pose
                    # but were not visible in the previous capture window.
                    fallback.append(pointer)
                    f=dict(frames[-1] if frames else character['clips'][state]['frames'][0])
                frames.append({**f,'native_pose_pointer':pointer})
            character['clips'][state]={'frames':frames,'loop':False,'steps':[0],
                'sampleAligned':True,'source_clip':source,'unmappedPointers':sorted(set(fallback))}
(DEST/'medidas-pulos.json').write_text(json.dumps(measurements,indent=2),encoding='utf-8')
result['limits'] = ['Empirical movement sample loops, not reconstructed original state machines.',
                    'UMK3 walking is a partial captured sequence loop.',
                    'Per-universe display scaling is set in presentation.js; spacing and camera are prototype rules.']
(DEST / 'assets.js').write_text('window.ARENA_ASSETS=' + json.dumps(result, ensure_ascii=False) + ';\n', encoding='utf-8')
print({k: len(v['assets']) for k, v in result['characters'].items()})
