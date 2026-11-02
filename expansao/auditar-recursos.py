from pathlib import Path
import json,hashlib
from PIL import Image
W=Path(__file__).resolve().parent
ROOT=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/expansao/recursos-nativos')
roster=json.loads((W/'roster.js').read_text(encoding='utf-8').split('=',1)[1].rstrip().rstrip(';'))
results=[]
for entry in roster:
    folder=ROOT/entry['id'];m=json.loads((folder/'manifesto.json').read_text(encoding='utf-8'))
    assert m['id']==entry['id'];assert m['name']==entry['name']
    assert hashlib.sha256((folder/'baseline.state').read_bytes()).hexdigest()==m['baseline_sha256']
    if entry['side']=='mk':assert m.get('captureSchema',1)>=2
    for ident,a in m['assets'].items():
        with Image.open(folder/a['file']) as image:
            im=image.convert('RGBA');assert im.size==(a['width'],a['height'])
            assert hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest()==a['sha256_pixels'],(entry['id'],ident)
    for name,clip in m['clips'].items():
        assert clip['samples'] and all(r['asset'] in m['assets'] for r in clip['samples'])
        assert all(r['sample']==i for i,r in enumerate(clip['samples']))
    minimum=min(c['mean_match'] or 0 for c in m['clips'].values())
    results.append({'id':m['id'],'name':m['name'],'assets':len(m['assets']),'clips':len(m['clips']),'minimumMeanPixelMatch':minimum,'reviewRequired':minimum<.99})
summary={'status':'FILES_VERIFIED_REVIEW_PENDING','characters':len(results),'assets':sum(r['assets'] for r in results),'clips':sum(r['clips'] for r in results),'lowMatchCharacters':sum(r['reviewRequired'] for r in results),'playableIntegrationComplete':False,'results':results}
(W/'auditoria-recursos.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in summary.items() if k!='results'},ensure_ascii=False))
