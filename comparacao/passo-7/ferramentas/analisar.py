from pathlib import Path
import json,collections
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-7'
def read(f):return json.loads(f.read_text(encoding='utf-8-sig'))
D=read(H/'dados-antes.json')['characters']
B=json.loads((H/'backup-antes/assets.js').read_text(encoding='utf-8').split('=',1)[1].rstrip(';'))['characters']
def load(root,game):
 out=[]
 for f in (H/f'{root}/original/{game}/rep-1').glob('*/trace.json'):
  c=read(f);c['_file']=str(f.relative_to(P));out.append(c)
 return out
def freeze(row,port=0):return bool(bytes.fromhex(row['before']['players'][port].get('runtimeBytes','00'*96))[0x47])
passives={}
for game,id in [('umk3','scorpion'),('ssf2tu','ryu')]:
 passive=set()
 for name in ['reference_stand','reference_crouch']:
  c=read(P/f'comparacao/passo-4/execucao-01/original/{game}/rep-1/{name}/trace.json');passive.update(r['after']['players'][0]['pose'] for r in c['samples'])
 passives[id]=passive
def signature(seq,passive):
 out=[]
 for p in seq:
  if p not in passive and (not out or out[-1]!=p):out.append(p)
 return out
def match(c,id):
 raw=[r['after']['players'][0]['pose'] for r in c['samples'][:10] if not freeze(r)]
 actual=signature(raw,passives[id]);scores=[]
 for name,m in D[id]['moves'].items():
  if not m.get('nativePoseTimeline') or m.get('air') or m.get('grapple'):continue
  sig=signature(m['nativePoseTimeline'],passives[id]);prefix=0
  for a,b in zip(actual,sig):
   if a!=b:break
   prefix+=1
  if prefix:scores.append((prefix,name))
 if not scores:return None
 best=max(s for s,n in scores);names=[n for s,n in scores if s==best]
 return sorted(names,key=lambda n:(not n.startswith('normal_'),n))[0]
sf=[]
for c in load('piloto-sf','ssf2tu')+load('cancelamentos-sf','ssf2tu'):
 rows=c['samples'];special=next((r['sample'] for r in rows if r['after']['players'][0]['pose'] in ['0x111416','0x11142e','0x111446','0x11145e']),None)
 name=match(c,'ryu');m=D['ryu']['moves'].get(name,{})
 # Native special starts after its own input latency; only pre-onset normal
 # samples count towards the first action's clock. Pause is never counted twice.
 age=sum(not freeze(r) for r in rows[:special]) if special is not None else None
 end=m.get('sourceSamples',0)
 canceled=special is not None and age<end-1
 request=c['meta']['offset']+2
 requestAge=sum(not freeze(r) for r in rows[:request])
 contact=c.get('contactSample');normalContact=contact is not None and (special is None or contact<special)
 damage=sum(max(0,r['before']['players'][1]['health']-r['after']['players'][1]['health']) for r in rows[contact:contact+3]) if normalContact else None
 sf.append({'case':c['id'],'source':c['_file'],'move':name,'specialStart':special,'specialAge':age,'requestAge':requestAge,'requestSample':request,'normalDuration':end,'cancel':canceled,'normalContact':normalContact,'outcome':'hit' if normalContact and damage else 'block' if normalContact else 'whiff'})
(H/'analise-sf-piloto.json').write_text(json.dumps(sf,indent=2),encoding='utf-8')
summary=collections.defaultdict(lambda:collections.defaultdict(list))
for row in sf:
 if row['cancel']:summary[row['move']][row['outcome']].append(row['requestAge'])
print('SF cancels',dict(summary))
mk=[]
for c in load('piloto-mk','umk3')+load('limites-mk','umk3')+load('terminais-mk','umk3'):
 hits=[{'sample':r['sample'],'damage':r['before']['players'][1]['health']-r['after']['players'][1]['health']} for r in c['samples'] if r['after']['players'][1]['health']<r['before']['players'][1]['health']]
 seq=[]
 for r in c['samples']:
  ptr=r['after']['players'][0]['pose']
  if not seq or seq[-1][1]!=ptr:seq.append([r['sample'],ptr])
 mk.append({'case':c['id'],'source':c['_file'],'meta':c['meta'],'hits':hits,'poses':seq})
(H/'analise-mk.json').write_text(json.dumps(mk,indent=2),encoding='utf-8')
print('MK >=3 hits',[(c['case'],c['hits']) for c in mk if len(c['hits'])>=3])
