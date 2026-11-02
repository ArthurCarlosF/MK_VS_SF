"""Capture character-owned native resources through inputs, in a separate output tree.
This exports measured reference clips, not a complete playable moveset.
"""
from pathlib import Path
import sys,json,struct,hashlib,math
import numpy as np
from PIL import Image

WORK=Path(__file__).resolve().parent
PROJECT=Path(r'D:/projetos/Mortal Kombat vs Street Fighter')
TOOLS=PROJECT/'engenharia-reversa/ferramentas'
game,ident=sys.argv[1:3]
roster=json.loads((PROJECT/'roster.js').read_text(encoding='utf-8').split('=',1)[1].rstrip().rstrip(';'))
entry=next(c for c in roster if c['id']==ident)
OUTDIR=WORK/'recursos-nativos'/ident
OUTDIR.mkdir(parents=True,exist_ok=True)
setup_profile=None
if game=='umk3':
    # Access the arcade's existing secret fighters through an isolated CMOS
    # profile. Values come from the emulator project's published unlock records;
    # no ROM bytes or combat routines are patched.
    seed=next((WORK/'recursos-nativos/mk-15/runtime').rglob('umk3.nv'),None)
    if seed:
        profile=bytearray(seed.read_bytes())
        for offset,value in [(0x10fc,0xed),(0x10fe,0xb0),(0x1104,0xed),(0x1106,0xb0),(0x110c,0xed),(0x110e,0xb0)]:profile[offset]=value
        destination=OUTDIR/'runtime'/seed.relative_to(WORK/'recursos-nativos/mk-15/runtime')
        destination.parent.mkdir(parents=True,exist_ok=True);destination.write_bytes(profile)
        setup_profile={'kind':'isolated_arcade_cmos_unlocks','source':'https://github.com/libretro/mame2003-plus-libretro/blob/master/metadata/cheat.dat','changed_offsets':['0x10fc','0x10fe','0x1104','0x1106','0x110c','0x110e'],'rom_modified':False}
source=(TOOLS/'capturar_animacoes.py').read_text(encoding='utf-8')
prefix=source[:source.index("if game=='ssf2tu':\n for frame")]
prefix=prefix.replace("SAVE=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/execucao-animacoes')/sys.argv[1]",'SAVE=Path('+repr(str(OUTDIR/'runtime'))+')')
prefix=prefix.replace("OUT=Path(r'D:/projetos/Mortal Kombat vs Street Fighter/engenharia-reversa/animacoes')/('ryu' if game=='ssf2tu' else 'scorpion')",'OUT=Path('+repr(str(OUTDIR))+')')
assert 'execucao-animacoes' not in prefix
exec(compile(prefix,str(TOOLS/'capturar_animacoes.py'),'exec'))
data=source[source.index('def sfdata(b):'):source.index("print('BASELINE'")]
exec(compile(data,str(TOOLS/'capturar_animacoes.py'),'exec'))
if game=='ssf2tu':
    ui=int(ident.split('-')[1]);expected=[0,1,2,3,13,14,10,9,4,5,6,7,12,15,11,8][ui]
    for frame in range(2101):
        inputs={}
        if 1600<=frame<1605:inputs={(0,2):1,(1,2):1}
        if 1950<=frame<1960:inputs={(0,3):1,(1,3):1}
        lib.retro_run()
    ticks([],12)
    for _ in range(ui%8):ticks([7],6);ticks([],10)
    if ui//8:ticks([5],6);ticks([],10)
    # P2 begins at Ken; choose the same native character without editing RAM.
    ticks([],6,second=[4]);ticks([],10)
    for _ in range(ui%8):ticks([],6,second=[7]);ticks([],10)
    if ui//8:ticks([],6,second=[5]);ticks([],10)
    ticks([0],6,second=[0]);ticks([],850)
else:
    expected=int(ident.split('-')[1]);row=round((entry['y']-27)/55);col=round((entry['x']-31)/49)
    if setup_profile:
        ticks([],600);ticks([0,1,3,8,9,10,11],8,second=[0,1,3,8,9,10,11]);ticks([],200)
        latest.save(OUTDIR/'perfil-apos-confirmacao.png')
        ticks([],400)
        for _ in range(4):ticks([2],5,second=[2]);ticks([],10)
        ticks([3],5,second=[3]);ticks([],80);ticks([0],5,second=[0]);ticks([],60)
        ticks([],5,second=[3]);ticks([],60)
        latest.save(OUTDIR/'selecao-antes-direcoes.png')
    else:
        for frame in range(801):
            inputs={}
            if 600<=frame<605:inputs={(0,2):1,(1,2):1}
            if 640<=frame<645:inputs={(0,3):1,(1,3):1}
            if 740<=frame<745:inputs={(0,0):1,(1,0):1}
            lib.retro_run()
    for _ in range(col):ticks([7],5);ticks([],10)
    for _ in range(row):ticks([5],5);ticks([],10)
    if not setup_profile:ticks([2],5);ticks([],10);ticks([],5,second=[3]);ticks([],60)
    ticks([0],5,second=[0]);ticks([],700)
baseline=state();initial=getdata(baseline)
if initial['char_p1']!=expected:
    latest.save(OUTDIR/'selecao-falhou.png')
    (OUTDIR/'selecao-falhou.state').write_bytes(baseline)
    (OUTDIR/'selecao-falhou.json').write_text(json.dumps(initial),encoding='utf-8')
assert initial['char_p1']==expected,(ident,entry['name'],expected,initial)
(OUTDIR/'baseline.state').write_bytes(baseline);latest.save(OUTDIR/'baseline.png')
sys.path.insert(0,str(TOOLS))
if game=='umk3':
    import decodificar_mk_sprites as decoder
    # The old Scorpion decoder restricted headers to its upper ROM region.
    # Sonya/Jax/etc. have valid limb descriptors below 0xffc00000. Retain all
    # original dimension/format checks, and accept the full mapped ROM range.
    decoder_source=(TOOLS/'decodificar_mk_sprites.py').read_text(encoding='utf-8')
    frame_function=decoder_source[decoder_source.index('def decode_frame(addr):'):decoder_source.index("if __name__=='__main__':")]
    frame_function=frame_function.replace('assert 0xffc00000<=a<0xfffff000','assert BASE<=a<0xfffff000')
    exec(compile(frame_function,str(TOOLS/'decodificar_mk_sprites.py'),'exec'),decoder.__dict__)
    state_offset=lambda address:0x2c19+(address-0x1000000)//8
    native_object=struct.unpack_from('<I',baseline,state_offset(0x10609d0))[0]
    palette_slot=struct.unpack_from('<H',baseline,state_offset(native_object)+40)[0]&255
    decoder.use_runtime_palette(baseline,offset=0x8ec19+palette_slot*512)
else:
    import decodificar_sf_sprites as decoder

def observe(b):
    d=getdata(b)
    if game=='umk3':
        obj=struct.unpack_from('<I',b,state_offset(0x10609d0))[0]
        slot=struct.unpack_from('<H',b,state_offset(obj)+40)[0]&255
        d['palette_slot']=slot;d['palette_words']=list(struct.unpack_from('<64H',b,0x8ec19+slot*512))
    if game=='ssf2tu':
        # Preserve every P1 object, including tile codes excluded by the old Ryu-only filter.
        for key,start in [('p1_objects',0x9346),('p1_objects_alt',0xb346)]:
            d[key]=[]
            for off in range(start,start+0x2000,8):
                x,y,code,attr=struct.unpack_from('<4H',b,off)
                if attr&31==1:d[key].append([x,y,code,attr])
    return d

def decode(d,alt=False):
    if game=='umk3':
        words=tuple(d['palette_words'])
        if getattr(decoder,'last_native_palette',None)!=words:
            decoder.last_native_palette=words;decoder.CACHE.clear()
            decoder.PALETTE=[(decoder.expand(v>>10&31),decoder.expand(v>>5&31),decoder.expand(v&31),255 if i else 0) for i,v in enumerate(words)]
            decoder.PALETTE_SOURCE={'kind':'native_actor_runtime_palette','slot':d['palette_slot']}
        im,meta=decoder.decode_frame(int(d['frame'],16));meta=dict(meta);anchor=list(meta['origin_in_png'])
        if int(d['flags'],16)&16:
            im=im.transpose(Image.Transpose.FLIP_LEFT_RIGHT);anchor[0]=im.width-anchor[0]
        meta['origin_in_png']=anchor
        return im,meta,math.floor(d['x']-d['camera_x']-anchor[0]),math.floor(d['y']-anchor[1])
    use=dict(d)
    if alt:use['p1_objects']=d['p1_objects_alt']
    im,meta=decoder.decode(use);left,top,_,_=meta['hardware_bounds']
    return im,meta,left-64,top-16

def quality(im,target,x,y):
    a=np.array(im);h,w=a.shape[:2];left=max(0,x);top=max(0,y);right=min(target.shape[1],x+w);bottom=min(target.shape[0],y+h)
    if left>=right or top>=bottom:return 0,0
    aa=a[top-y:bottom-y,left-x:right-x];bb=target[top:bottom,left:right];mask=aa[:,:,3]>0;n=int(mask.sum())
    if n<1:return 0,0
    err=np.max(np.abs(aa[:,:,:3].astype(int)-bb.astype(int)),axis=2)
    return float(np.sum((err<=3)&mask))/n,n

assets={};pixels={};clips={};(OUTDIR/'quadros').mkdir(exist_ok=True)
experiments=[('idle',[([],70)]),('forward',[([7],30),([],10)]),('backward',[([6],30),([],10)]),('crouch',[([5],30),([],12)]),('jump',[([4],3),([],90)]),('jumpForward',[([4,7],3),([],90)]),('jumpBackward',[([4,6],3),([],90)])]
buttons=[('lp',0),('hp',1),('hk',8),('lk',9)] if game=='umk3' else [('lp',0),('mp',8),('hp',1),('lk',9),('mk',10),('hk',11)]
for label,button in buttons:
    experiments.append((label,[([button],2),([],78)]))
    experiments.append(('crouch_'+label,[([5],6),([5,button],2),([5],60),([],8)]))
    experiments.append(('air_'+label,[([4],3),([],12),([button],2),([],78)]))
if game=='umk3':experiments.extend([('guard',[([10],30),([],10)]),('crouchGuard',[([5,10],30),([],10)]),('run',[([7,11],30),([],10)])])
for name,sequence in experiments:
    # UMK3 task scheduling may not round-trip across processes. This restore is
    # inside the same core process that created its baseline, never a foreign state.
    restore(baseline);ticks([],3);rows=[];last_d=None;good=[]
    folder=OUTDIR/'provas'/name;folder.mkdir(parents=True,exist_ok=True)
    for keys,count in sequence:
        for _ in range(count):
            before=observe(state());ticks(keys,1);after=observe(state());target=np.array(latest.convert('RGB'));choices=[];perfect=False
            assert after['char_p1']==expected,(ident,name,after['char_p1'])
            for phase,d in [('before',before),('after',after),*([('previous',last_d)] if last_d else [])]:
                for alt in ([False,True] if game=='ssf2tu' else [False]):
                    try:
                        im,meta,x,y=decode(d,alt)
                        for dx in ([0,-1,1] if game=='umk3' else [0]):
                            q,n=quality(im,target,x+dx,y);choices.append((q,n,phase,alt,im,meta,x+dx,y,d))
                            if q==1 and n>100:perfect=True;break
                    except (ValueError,AssertionError,IndexError,struct.error):pass
                    if perfect:break
                if perfect:break
            assert choices,(ident,name,len(rows),'no valid native sprite')
            q,n,phase,alt,im,meta,x,y,d=max(choices,key=lambda c:c[0]);pixel_hash=hashlib.sha256(str(im.size).encode()+im.tobytes()).hexdigest()
            if pixel_hash not in pixels:
                key='frame-'+str(len(assets)).zfill(4);pixels[pixel_hash]=key;im.save(OUTDIR/'quadros'/(key+'.png'))
                assets[key]={'file':'quadros/'+key+'.png','width':im.width,'height':im.height,'sha256_pixels':pixel_hash,'anchor':meta['origin_in_png'],'native_pose':d['frame']}
            key=pixels[pixel_hash]
            if n>100:good.append(q)
            rows.append({'sample':len(rows),'keys':list(keys),'asset':key,'x':after['x'],'y':after['y'],'pose':d['frame'],'match':round(q,6),'phase':phase,'bank':2 if alt else 1})
            if len(rows) in [1,8,16,24,40,60,80]:latest.save(folder/(str(len(rows)).zfill(3)+'.png'))
            last_d=before
    clips[name]={'samples':rows,'minimum_match':min(good) if good else None,'mean_match':sum(good)/len(good) if good else None,'sequence':sequence}
    print('CLIP',ident,name,len(rows),round(clips[name]['mean_match'] or 0,4),flush=True)
manifest={'schema':1,'captureSchema':2,'setupProfile':setup_profile,'id':ident,'name':entry['name'],'game':game,'native_character':expected,'fps':av.timing.fps,'baseline_sha256':hashlib.sha256(baseline).hexdigest(),'assets':assets,'clips':clips,'limits':['Measured resource clips, not complete playable integration.','No complete specials, supers, fatalities, sounds, combo rules or final calibration.','Pixel matching and selection identity are retained for review.']}
(OUTDIR/'manifesto.json').write_text(json.dumps(manifest,ensure_ascii=False),encoding='utf-8')
lib.retro_unload_game();lib.retro_deinit();print('DONE',ident,len(assets),'native resources',flush=True)
