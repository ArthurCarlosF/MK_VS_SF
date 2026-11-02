from pathlib import Path
import json
P=Path(__file__).resolve().parents[3];H=P/'comparacao/passo-7'
def save(name,cases):
 (H/name).write_text(json.dumps({'cases':cases,'checkpoints':[]}),encoding='utf-8')
def inputs(timeline,tail=100,guard=None):
 n=max(timeline,default=0)+tail
 return [{'frames':1,'p1':timeline.get(i,{}),'p2':guard or {}} for i in range(n)]
def setup(context,game):
 return [{'frames':100 if context=='near' else 32 if game=='umk3' else 28,'p1':{'x':1}},{'frames':12}]
mk=[]
for context in ['far','near']:
 for guard in [False,True]:
  for off in [None,*range(2,25)]:
   tl={0:{'raw':[1]},1:{'raw':[1]}}
   if off is not None:tl.update({off:{'raw':[1]},off+1:{'raw':[1]}})
   name=f'hp_{context}_{"guard" if guard else "hit"}_{off}'
   mk.append({'id':name,'setup':setup(context,'umk3'),'segments':inputs(tl,80,{'raw':[10]} if guard else {}),'meta':{'kind':'hp_pair','context':context,'guard':guard,'offset':off,'button':1}})
 for rhythm in [3,4,6,8,10,14]:
  tl={i+j:{'raw':[1]} for i in range(0,90,rhythm) for j in range(2)}
  mk.append({'id':f'hp_train_{context}_{rhythm}','setup':setup(context,'umk3'),'segments':inputs(tl,70),'meta':{'kind':'hp_train','context':context,'rhythm':rhythm,'button':1}})
 mk.append({'id':f'hp_hold_{context}','setup':setup(context,'umk3'),'segments':[{'frames':80,'p1':{'raw':[1]}},{'frames':70}],'meta':{'kind':'hp_hold','context':context,'button':1}})
save('casos-soco-alto.json',mk)

mk=[]
buttons={'lp':0,'hp':1,'hk':8,'lk':9}
for context in ['far','near']:
 for first,fb in buttons.items():
  for second,sb in buttons.items():
   for off in [4,8,12,16,20]:
    tl={0:{'raw':[fb]},1:{'raw':[fb]},off:{'raw':[sb]},off+1:{'raw':[sb]}}
    mk.append({'id':f'pair_{context}_{first}_{second}_{off}','setup':setup(context,'umk3'),'segments':inputs(tl),'meta':{'kind':'normal_pair','context':context,'first':first,'second':second,'offset':off}})
 for route,sequence in {'hp_hp_lk_bhk':['hp','hp','lk','bhk'],'hk_hk_lk_bhk':['hk','hk','lk','bhk'],'hp_hp_lp_lp':['hp','hp','lp','lp']}.items():
  for rhythm in [4,6,8,10,12]:
   tl={}
   for i,key in enumerate(sequence):
    v={'raw':[buttons[key.removeprefix('b')]],**({'x':-1} if key.startswith('b') else {})}
    tl[i*rhythm]=v;tl[i*rhythm+1]=v
   for defend in [False,True]:
    mk.append({'id':f'route_{context}_{route}_{rhythm}_{defend}','setup':setup(context,'umk3'),'segments':inputs(tl,110),'meta':{'kind':'route','context':context,'route':route,'rhythm':rhythm,'defendAfterContact':defend}})
save('casos-mk-piloto.json',mk)

sf=[]
buttons={'lp':0,'mp':8,'hp':1,'lk':9,'mk':10,'hk':11}
for context in ['far','near']:
 for posture in ['stand','crouch']:
  for first,fb in buttons.items():
   for outcome in ['hit','block','whiff']:
    for off in [4,12,20,28]:
     tl={0:{'raw':[fb],**({'down':True} if posture=='crouch' else {})},1:{'raw':[fb],**({'down':True} if posture=='crouch' else {})},off:{'down':True},off+1:{'down':True,'x':1},off+2:{'x':1,'raw':[0]},off+3:{'x':1,'raw':[0]}}
     sf.append({'id':f'cancel_{context}_{posture}_{first}_{outcome}_{off}','setup':[] if outcome=='whiff' else setup(context,'ssf2tu'),'segments':inputs(tl,110,{'x':1,'down':True} if outcome=='block' else {}),'meta':{'kind':'cancel','context':context,'posture':posture,'first':first,'outcome':outcome,'offset':off,'button':fb}})
save('casos-sf-piloto.json',sf)
print(len(mk),len(sf))
