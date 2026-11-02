from pathlib import Path
import json,collections,hashlib
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-5'
def read(p):return json.loads(p.read_text(encoding='utf-8'))
repetitions=[]
for game in ['umk3','ssf2tu']:
 root=H/f'execucao-01/original/{game}';n=0
 for f in (root/'rep-1').glob('*/trace.json'):
  a=read(f);b=read(root/'rep-2'/f.parent.name/'trace.json')
  assert a['initial']==b['initial'],(game,a['id'],'initial')
  assert len(a['samples'])==len(b['samples'])
  for x,y in zip(a['samples'],b['samples']):
   for k in ['before','after','input']:assert x[k]==y[k],(game,a['id'],x['sample'],k)
  n+=1
 repetitions.append({'game':game,'cases':n,'status':'PASS'})
observed=collections.defaultdict(set)
for folder in ['limites-01','baixo-01']:
 for f in (H/folder/'original/umk3/rep-1').glob('*/trace.json'):
  c=read(f)
  observed[c['meta']['baseCase']].update(r['sample'] for r in c['samples'] if r['before']['players'][1]['health']>r['after']['players'][1]['health'])
nativeAir=[]
for folder in ['execucao-01','ar-01','ar-tarde-01','ar-guarda-01','ar-hit-01']:
 for f in (H/folder/'original/umk3/rep-1').glob('*/trace.json'):
  c=read(f);rows=c['samples']
  if not c['meta'].get('posture','').startswith('air'):continue
  hits=[r['sample'] for r in rows if r['before']['players'][1]['health']>r['after']['players'][1]['health']]
  if not hits:continue
  i=hits[0];q=rows[i]['after']['players'][0];j=i+1
  while j<len(rows) and all(rows[j]['after']['players'][0][k]==q[k] for k in ['x','y']):j+=1
  gravity=.875 if c['meta']['posture']=='airVertical' else .75
  assert j-i-1==8,c['id']
  for n in range(3):assert rows[j+n]['after']['players'][0]['y']-rows[j+n-1]['after']['players'][0]['y']==gravity*(n+1),c['id']
  nativeAir.append({'file':str(f.relative_to(P)),'pauseSamples':8,'gravityPerSample':gravity,'guarded':bool(c['meta'].get('guard'))})
inputs=[]
old=read(P/'comparacao/execucoes/20261023-metodo-01/manifesto.json')
for item in old['inputs']:
 digest=hashlib.sha256(Path(item['path']).read_bytes()).hexdigest();assert digest==item['sha256'];inputs.append({**item,'status':'UNCHANGED'})
hk=read(H/'hk-whiff-01/original/ssf2tu/rep-1/stand_hk_near__away11/trace.json')
assert hk['initial']['players'][1]['health']==hk['samples'][-1]['after']['players'][1]['health']
assert any(r['after']['players'][0]['pose']=='0x110666' for r in hk['samples'])
hkDuration=max(r['sample'] for r in hk['samples'] if r['after']['players'][0]['state'][1]==10)+1
assert abs(hkDuration-26)<=1
alternate={}
for folder in ['alternado-01','retorno-01']:
 for f in (H/folder/'original/umk3/rep-1').glob('*/trace.json'):
  c=read(f);alternate[c['id']]=[r['sample'] for r in c['samples'] if r['before']['players'][1]['health']>r['after']['players'][1]['health']]
assert alternate['alternate_lp__late24']==[26]
assert alternate['alternate_lp__late25']==[]
assert alternate['return_lp__late34']==[36]
assert alternate['return_lp__late35']==[]
out={'status':'PASS','repetitions':repetitions,'nativeCaseExecutions':len(list(H.glob('*/original/*/rep-*/*/trace.json'))),'mkDelayedContacts':{k:sorted(v) for k,v in observed.items()},'mkAlternateContacts':alternate,'mkAirContact':nativeAir,'sfHKIndependentWhiffSamples':hkDuration,'unchangedInputs':inputs}
(H/'verificacao-nativos.json').write_text(json.dumps(out,indent=2),encoding='utf-8')
print(json.dumps({'status':'PASS','repetitions':repetitions,'nativeCaseExecutions':out['nativeCaseExecutions'],'mkAirContactCases':len(nativeAir)}))
