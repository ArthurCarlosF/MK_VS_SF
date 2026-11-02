from pathlib import Path
import json, hashlib

P=Path(__file__).resolve().parents[3]
H=P/'comparacao/passo-6'
def read(p): return json.loads(p.read_text(encoding='utf-8-sig'))
def sha(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''):h.update(b)
    return h.hexdigest()

result={'status':'PASS','repeatPairs':{},'captures':{},'originalInputs':[]}
for game in ['umk3','ssf2tu']:
    a=H/'execucao-01/original'/game/'rep-1'; b=a.parent/'rep-2'; count=0
    for f in a.rglob('trace.json'):
        assert read(f)==read(b/f.relative_to(a)),str(f)
        count+=1
    result['repeatPairs'][game]=count
for name in ['execucao-01','provas-01','provas-02','comandos-01','comandos-02','extra-ar-01','duplo-01']:
    result['captures'][name]=len(list((H/name).rglob('trace.json')))
assert sum(result['captures'].values())==687
clean=0
for f in (H/'provas-02').rglob('trace.json'):
    c=read(f);contact=c.get('contactSample')
    if contact is None:continue
    first=next((r['sample'] for r in c['samples'] if r['input'][1].get('up')),None)
    assert first==contact+3,(str(f),contact,first)
    clean+=1
result['cleanJumpProbeContacts']=clean
for row in read(P/'comparacao/execucoes/20261023-metodo-01/manifesto.json')['inputs']:
    assert sha(Path(row['path']))==row['sha256']
    result['originalInputs'].append(row)
sealed=P/'comparacao/passo-5'
for rel,h in read(sealed/'integridade-saida.json')['files'].items():
    assert sha(sealed/rel)==h,rel
result['previousStepSeal']='UNCHANGED'
measurements=read(H/'medicoes.json')
result['measuredRecoveryWindows']=[]
for row in measurements:
    accepted=row['acceptedOffsets'];rejected=row['rejectedOffsets']
    if not accepted:continue
    phaseSensitive=bool(rejected and min(accepted)<=max(rejected))
    result['measuredRecoveryWindows'].append({'profile':row['profile'],'controlSamples':row['controlSamples'],'earliestAcceptedOffset':min(accepted),'latestRejectedOffset':max(rejected) if rejected else None,'phaseSensitive':phaseSensitive})
result['diagnosticExcluded']='provas-01: held-up begins too early for a clean recovery probe; never used by preparar_reacoes.py.'
(H/'verificacao-fontes.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))
