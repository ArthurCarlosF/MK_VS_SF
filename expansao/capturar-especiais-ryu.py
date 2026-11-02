"""Native Ryu special reference cases, separate from sealed comparisons."""
from pathlib import Path
import sys,json,struct,hashlib,math,os,datetime,re
import numpy as np
from PIL import Image
W=Path(__file__).resolve().parent
sys.argv=[str(__file__),'ssf2tu','sf-0']
source=(W/'capturar-elenco.py').read_text(encoding='utf-8')
prefix=source[:source.index('assets={};pixels={};clips={};')]
output_name=os.environ.get('MKVSF_SPECIAL_OUTPUT','especiais-nativos-'+datetime.datetime.now().strftime('%Y%m%d-%H%M%S'))
assert re.fullmatch(r'[a-zA-Z0-9_-]+',output_name),'Use a local capture folder name.'
assert not (W/output_name/'sf-0/manifesto.json').exists(),'This capture already has a manifest; use a new revision.'
prefix=prefix.replace("OUTDIR=WORK/'recursos-nativos'/ident","OUTDIR=WORK/"+repr(output_name)+"/ident")
exec(compile(prefix,str(W/'capturar-elenco.py'),'exec'))
DATA=decoder.DATA
def readmem(b,address,n):return bytes(b[0x3d346+(((address+i)&65535)^1)] for i in range(n))
def putmem(b,address,value):
    out=bytearray(b)
    for i,v in enumerate(value):out[0x3d346+(((address+i)&65535)^1)]=v
    return bytes(out)
def actors(b,bases=None):
    result=[]
    for base in ([0xff844e,0xff884e] if bases is None else bases):
        num=lambda a,n:int.from_bytes(readmem(b,a,n),'big')
        ptr=num(base+0x1a,4);table=num(base+0x34,4);boxes=[]
        if 0<ptr<len(DATA)-32 and 0<table<len(DATA)-16:
            for off,ident,stride,kind in [(0,8,4,'hurt'),(2,9,4,'hurt'),(4,10,4,'hurt'),(6,12,16,'attack'),(8,13,4,'push')]:
                index=DATA[ptr+ident]
                if not index:continue
                address=table+int.from_bytes(DATA[table+off:table+off+2],'big',signed=True)+index*stride
                if not 0<=address<len(DATA)-16:continue
                x,y,rx,ry=struct.unpack_from('>bbBB',DATA,address)
                if kind=='attack' and DATA[address+5]>=128:x=-DATA[address+5]
                boxes.append({'kind':kind,'id':index,'address':hex(address),'x':x-rx,'y':y-ry,'w':rx*2,'h':ry*2})
        result.append({'x':int.from_bytes(readmem(b,base+6,2),'big',signed=True),'y':int.from_bytes(readmem(b,base+10,2),'big',signed=True),
          'pose':hex(ptr),'health':num(base+0x2c,2),'logicalHealth':num(base+0x2a,2),'facing':1 if num(base+0x12,1) else -1,'state':list(readmem(b,base+2,4)),
          'meter':num(base+0x2b4,1),'boxes':boxes,'runtime':readmem(b,base,0x60).hex()})
    return result

def projectiles(b):
    return [{'base':hex(base),'paletteSlot':int.from_bytes(readmem(b,base+0x16,2),'big')&31,**actors(b,[base])[0]} for base in [0xff97a2+i*0xc0 for i in range(8)] if readmem(b,base,2)==b'\x01\x01']

assets={};pixels={};cases={};(OUTDIR/'quadros').mkdir(exist_ok=True)
def register(im,meta):
    key=hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest()
    if key not in pixels:
        ident='frame-'+str(len(assets)).zfill(4);im.save(OUTDIR/'quadros'/(ident+'.png'));pixels[key]=ident
        assets[ident]={'file':'quadros/'+ident+'.png','width':im.width,'height':im.height,'sha256_pixels':key}
    return pixels[key]

attacks=[]
for strength,button in [('lp',0),('mp',8),('hp',1)]:
    attacks.append(('shoryuken_'+strength,[([7],3),([5],3),([5,7],3),([5,7,button],2),([],125)],False))
    attacks.append(('hadouken_'+strength,[([5],3),([5,7],3),([7],3),([7,button],2),([],145)],False))
    attacks.append(('red_hadouken_'+strength,[([6],3),([5,6],3),([5],3),([5,7],3),([7],3),([7,button],2),([],165)],False))
for strength,button in [('lk',9),('mk',10),('hk',11)]:
    attacks.append(('tatsumaki_'+strength,[([5],3),([5,6],3),([6],3),([6,button],2),([],155)],False))
attacks.append(('shinkuhadouken',[([5],3),([5,7],3),([7],3),([5],3),([5,7],3),([7],3),([7,0],2),([],185)],True))

selected=set(filter(None,os.environ.get('MKVSF_SPECIAL_CASES','').split(',')))
for name,sequence,super_move in attacks:
    for situation in ['far','hit','block','isolation','blockLow','crouchNear','lateHit']:
        if selected and name+'_'+situation not in selected:continue
        restore(baseline);ticks([],3)
        if situation=='isolation':
            stalled=0;old=None
            for _ in range(160):
                a=actors(state());gap=a[1]['x']-a[0]['x'];stalled=stalled+1 if gap==old else 0;old=gap
                if stalled>20:break
                ticks([],1,second=[7])
            ticks([],10,second=[5])
        elif situation!='far':
            for _ in range(120):
                a=actors(state())
                if a[1]['x']-a[0]['x']<=(int(os.environ.get('MKVSF_LATE_GAP','130')) if situation=='lateHit' else 50):break
                ticks([],1,second=[6])
            ticks([],10)
        if super_move:restore(putmem(state(),0xff8702,b'\x30'));ticks([],1)
        initial=actors(state());records=[];previous=None;folder=OUTDIR/'provas'/(name+'_'+situation);folder.mkdir(parents=True,exist_ok=True)
        for keys,count in sequence:
            for _ in range(count):
                before=state();d0=observe(before);prior=actors(before)
                second=(([7] if prior[1]['facing']<0 else [6])+([5] if situation=='blockLow' else [])) if situation in ['block','blockLow'] else [5] if situation in ['isolation','crouchNear'] else []
                ticks(keys,1,second=second);after=state();d1=observe(after);target=np.array(latest.convert('RGB'));choices=[];perfect=False
                for phase,d in [('before',d0),('after',d1),*([('previous',previous)] if previous else [])]:
                    for alt in [False,True]:
                        try:
                            im,meta,x,y=decode(d,alt);q,n=quality(im,target,x,y);choices.append((q,n,phase,alt,im,meta,d))
                            if q==1 and n>100:perfect=True;break
                        except (ValueError,AssertionError,IndexError,struct.error):pass
                    if perfect:break
                assert choices,(name,situation,len(records),'no sprite')
                q,n,phase,alt,im,meta,d=max(choices,key=lambda c:c[0]);ident=register(im,meta);act=actors(after)
                previous=d0;fx=[];native_projectiles=projectiles(after)
                # Retain observed effect groups; classify collision/projectile
                # semantics separately rather than guessing from their artwork.
                found_fx=False
                for fxphase,fxstate,fxdata in [('before',before,d0),('after',after,d1)]:
                    qs=projectiles(fxstate);palette=qs[0]['paletteSlot'] if len(qs)==1 else 14
                    for altfx in [False,True]:
                        objects=[v[:4] for v in fxdata['all_objects_alt' if altfx else 'all_objects'] if (v[3]&31)==palette and 0xe000<=v[2]<0xf000]
                        if not objects:continue
                        try:
                            use=dict(fxdata);use['p1_objects']=objects;imfx,metafx=decoder.decode(use);l,t,_,_=metafx['hardware_bounds'];fq,fn=quality(imfx,target,l-64,t-16)
                            if fq>=.95 and fn>10:
                                anchor=metafx['origin_in_png'];position=None
                                if len(qs)==1:
                                    cx=int.from_bytes(readmem(fxstate,0xff8ed4,2),'big',signed=True);cy=int.from_bytes(readmem(fxstate,0xff8ed8,2),'big',signed=True)
                                    anchor=[qs[0]['x']-cx-(l-64),av.geometry.base_height-(qs[0]['y']-15)+cy-(t-16)];position=[qs[0]['x'],qs[0]['y']]
                                fx.append({'asset':register(imfx,metafx),'bounds':metafx['hardware_bounds'],'anchor':anchor,'match':fq,'bank':2 if altfx else 1,
                                           'nativePhase':fxphase,'projectilePosition':position,'paletteSlot':palette,'originMethod':'world position minus camera and hardware bounds' if position else 'actor descriptor'})
                                found_fx=True;break
                        except (ValueError,AssertionError,IndexError,struct.error):pass
                    if found_fx:break
                victim=None
                if os.environ.get('MKVSF_CAPTURE_VICTIM')=='1':
                    candidates=[]
                    for vp,vd,vb in [('before',d0,before),('after',d1,after)]:
                        actor=actors(vb)[1]
                        for va in [False,True]:
                            objects=[v[:4] for v in vd['all_objects_alt' if va else 'all_objects'] if (v[3]&31)==16]
                            if not objects:continue
                            use=dict(vd);use['frame']=actor['pose'];use['p1_objects']=objects
                            try:
                                rawim,vm=decoder.decode(use);l,t,_,_=vm['hardware_bounds'];vq,vn=quality(rawim,target,l-64,t-16)
                                normalized=dict(use);words=list(use['object_palette_words']);words[256:272]=words[16:32];normalized['object_palette_words']=words
                                ownim,_=decoder.decode(normalized);candidates.append((vq,vn,ownim,vm,actor,vp,va,hashlib.sha256(rawim.tobytes()).hexdigest()))
                            except (ValueError,AssertionError,IndexError,struct.error):pass
                    if candidates:
                        vq,vn,vim,vm,va,vp,vbank,vsha=max(candidates,key=lambda v:v[0]);victim={'asset':register(vim,vm),'anchor':vm['origin_in_png'],'sourceFacing':va['facing'],'pose':va['pose'],'match':vq,'rawPixelsSha256':vsha,'paletteNormalization':'native P2 slot 16 to native P1 slot 1'}
                records.append({'sample':len(records),'input':list(keys),'actors':act,'actorBefore':actors(before),
                    'asset':ident,'anchor':meta['origin_in_png'],'sourceFacing':actors(before if phase=='before' else after)[0]['facing'],'pose':d['frame'],'match':q,'phase':phase,'bank':2 if alt else 1,'effects':fx,'victim':victim,
                    'projectilesBefore':projectiles(before),'projectiles':native_projectiles})
                if len(records) in [1,10,15,20,30,45,60,90,120,160]:latest.save(folder/(str(len(records)).zfill(3)+'.png'))
        case={'name':name,'situation':situation,'inputSequence':sequence,'initial':initial,'samples':records,
          'setup':{'superMeterFixture':48 if super_move else None,'romModified':False,'positionSetup':'controller input only'},'sourceResolution':[av.geometry.base_width,av.geometry.base_height]}
        cases[name+'_'+situation]=case
        print('SPECIAL',name,situation,'height',max(r['actors'][0]['y'] for r in records),'damage',initial[1]['health']-records[-1]['actors'][1]['health'],'meter',initial[0]['meter'],records[-1]['actors'][0]['meter'],flush=True)
        (folder/'trace.json').write_text(json.dumps(case,ensure_ascii=False),encoding='utf-8')
manifest={'schema':1,'character':'ryu','source':'ssf2tu','fps':av.timing.fps,'baseline_sha256':hashlib.sha256(baseline).hexdigest(),'assets':assets,'cases':{k:{'file':'provas/'+k+'/trace.json','samples':len(v['samples'])} for k,v in cases.items()},'status':'CAPTURED_REVIEW_PENDING'}
(OUTDIR/'manifesto.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit();print('DONE',len(cases),'special references',len(assets),'assets',flush=True)
