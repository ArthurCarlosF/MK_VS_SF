/* Original SF repertoire presence; native art and commands, fidelity pending. */
(function(s){
 'use strict';
 const packs=s.SF_REPERTOIRE_PACKS,proof={},D=s.FIGHT_DATA.characters;
 for(const[id,pack]of Object.entries(packs)){
  const d=D[id],b=s.ARENA_ASSETS.characters[id];Object.assign(b.assets,pack.assets);Object.assign(b.clips,pack.clips);Object.assign(d.moves,pack.moves);
  d.sfCommandNormals=pack.normals;
  for(const t of pack.throws){
   const c=d.normalControls[t.button],cfg=d.moves[t.move].grapple,key=t.air?'airThrows':'throws';
   c[key]||={range:cfg.range,heightRange:cfg.heightRange};c[key][t.direction===4?'backward':'forward']=t.move;
   if(t.air)d.airDefaultThrow||=t.move;else d.defaultThrow||=t.move;
  }
  for(const m of Object.values(d.moves))if(m.grapple&&!m.sfInput){
   m.grapple.fallbackToNormal=true;
   m.grapple.sfTechable??=!m.air&&!m.grapple.sfHold;
   m.grapple.sfTechWindow??=.2;
   m.grapple.sfRangeForBodies=true;
  }
  // Repeated lights and separated active sections are distinct combat actions,
  // not a held-key auto repeat. Existing calibrated Ryu rules remain intact.
  if(id!=='ryu')for(const button of ['punch','kick']){
   const c=d.normalControls[button],family=[...new Set([c.standing.near,c.standing.far,c.crouch])];
   for(const name of family){const m=d.moves[name];if(m.kind!=='strike')continue;
    m.repeat={mode:'restart',family,buttons:[button],next:name,initial:name,gateFrames:Math.ceil((m.startup+m.active)*b.fps),latencyFrames:1,skipFrames:0,preserveStrike:true};
    m.lateLinkFrames??=3;
   }
   if(d.basicCombinations)d.basicCombinations=d.basicCombinations.filter(n=>!family.includes(n));
   for(const names of Object.values(d.basicRepeat||{}))for(let i=names.length-1;i>=0;i--)if(family.includes(names[i]))names.splice(i,1);
  }
  for(const m of Object.values(d.moves))if(m.kind==='strike'&&m.attackTimeline&&!m.contactGroupTimeline){
   let group=0,previous=false;const groups=m.attackTimeline.map(boxes=>{const active=!!boxes?.length;if(active&&!previous)group++;previous=active;return active?group:0;});
   if(group>1)m.contactGroupTimeline=groups;
  }
  if(['sf-9','sf-14'].includes(id))d.sfWallJump=true;
  proof[id]={normalThrows:pack.throws.filter(t=>!t.air).length,airThrows:pack.throws.filter(t=>t.air).length,
   directionalNormals:pack.normals.length,wallJump:!!d.sfWallJump,specialFamilies:Object.keys(d.sfSpecialFamilies||{})};
 }
 // The collection guide uses '/' for alternative motions, not one concatenated
 // motion. Expand these explicitly and keep each original continuation usable.
 if(D['sf-8'].sfSpecialFamilies){
  const d=D['sf-8'],parents=['inazumakick','forwardstepkick','thunderkick'];
  for(const name of d.sfSpecialFamilies.ssf2t_inazumakick||[]){
   const m=d.moves[name],button=m.sfInput.button;
   m.sfInput={parent:'inazumakick',button,buttonHold:.25,sequence:[],air:false};m.sfKenFollowup=true;
   m.kind='specialStrike';m.level='overhead';m.damage=14;delete m.attackTimeline;
   m.box={x:8,y:25,w:110,h:100};m.startup=.12;m.active=.12;m.recovery=Math.max(.1,m.recovery);
   d.sfSpecialCommands=d.sfSpecialCommands.filter(c=>c.move!==name);
   for(const parent of parents)d.sfSpecialCommands.push({move:name,sfInput:{...m.sfInput,parent}});
  }
 }
 if(D['sf-11'].sfSpecialFamilies){
  const d=D['sf-11'],base=d.sfSpecialFamilies.yogateleport?.[0];
  if(base){
   const original=d.moves[base];d.sfSpecialCommands=d.sfSpecialCommands.filter(c=>c.move!==base);
   const variations=[['frontP',[6,2,3],['punch','punch2','punch3'],85,false],['frontK',[6,2,3],['kick','kick2','kick3'],-75,false],
    ['backP',[4,2,1],['punch','punch2','punch3'],-180,true],['backK',[4,2,1],['kick','kick2','kick3'],-110,true]];
   d.sfSpecialFamilies.yogateleport=[];
   for(let i=0;i<variations.length;i++){
    const [tag,sequence,chord,behind,relativeToOwner]=variations[i],name=i?base+'_'+tag:base;
    const cfg={sequence,chord,button:chord[0],air:false};
    d.moves[name]={...original,sfInput:cfg,targetWarp:{...original.targetWarp,behind,relativeToOwner,lockDestination:true}};
    d.sfSpecialCommands.push({move:name,sfInput:cfg});d.sfSpecialFamilies.yogateleport.push(name);
   }
  }
 }
 if(D['sf-14'].sfSpecialFamilies){
  const d=D['sf-14'],base=d.sfSpecialFamilies.backslash?.[0];
  if(base){
   const original=d.moves[base],b=s.ARENA_ASSETS.characters['sf-14'],name=base+'_short',frames=b.clips[original.clip].frames;
   const n=Math.max(6,Math.ceil(frames.length*.6));b.clips[name]={frames:Array.from({length:n},(_,i)=>frames[Math.min(frames.length-1,Math.floor(i*frames.length/n))]),loop:false};
   const cfg={...original.sfInput,chord:['kick','kick2','kick3'],button:'kick'};
   d.moves[name]={...original,clip:name,sfInput:cfg,recovery:Math.max(.1,n/b.fps-original.startup-original.active),
    motionTimeline:original.motionTimeline?.filter((_,i)=>i<n).map(r=>({...r,x:r.x*.6}))};
   d.sfSpecialCommands=d.sfSpecialCommands.filter(c=>c.move!==base||!c.sfInput.chord?.includes('kick'));
   d.sfSpecialCommands.push({move:name,sfInput:cfg});d.sfSpecialFamilies.backslash.push(name);
  }

 }
 const C=s.FightCommands,action=C.action;
 C.action=function(p,definition,time){
  const request=action(p,definition,time);
  if(!request||request.event?.release||!definition.sfCommandNormals)return request;
  const move=definition.moves[request.move];
  if(move?.kind!=='strike'||move.sfInput)return request;
  const direction=C.direction(p.input,p.facing);
  const command=definition.sfCommandNormals.find(n=>n.button===request.event.button&&n.air===p.airborne&&n.direction===direction);
  return command?{move:command.move,event:request.event}:request;
 };
 const Base=s.FightArena;
 class RepertoireArena extends Base{
  canStart(p,name){
   const m=this.definition(p).moves[name];
   if(!m?.sfKenFollowup||!p.action)return super.canStart(p,name);
   const old=p.airborne;p.airborne=false;
   try{return super.canStart(p,name);}finally{p.airborne=old;}
  }
  startAction(p,name,...args){
   const ok=super.startAction(p,name,...args),m=this.definition(p).moves[name];
   if(ok&&m?.sfFamily==='turnpunch'){
    const held=Math.max(p.sfChordReleases?.punch||0,p.sfChordReleases?.kick||0);
    p.action.sfTurnLevel=Math.min(8,Math.max(1,Math.floor(held/1.5)));this.emit('turnPunchLevel',{player:p.index,level:p.action.sfTurnLevel});
   }
   return ok;
  }
  updatePlayer(p,dt){
   const d=this.definition(p),edge=this.rules.edge??40,away=p.x<edge+26?1:p.x>(this.rules.width||1100)-edge-26?-1:0;
   if(d.sfWallJump&&p.airborne&&p.y>25&&!p.action&&p.stun<=0&&p.input.up&&p.input.x===away&&away&&this.elapsed>(p.sfNextWallJump||0)){
    p.motion||=s.FightMovement.init(this,p);p.motion.jumpFacing=away;p.motion.contactFall={velocity:-6,gravity:.35,horizontal:5};
    p.sfNextWallJump=this.elapsed+.3;p.jumpKind='jumpForward';this.emit('wallJump',{player:p.index});
   }
   super.updatePlayer(p,dt);
  }
  hit(a,b,m,name){
   if(m.sfFamily==='turnpunch'&&a.action?.sfTurnLevel>1)m={...m,damage:m.damage*(1+.15*(a.action.sfTurnLevel-1))};
   const hit=super.hit(a,b,m,name);
   if(hit&&m.sfHeadStomp&&a.airborne){
    a.motion||=s.FightMovement.init(this,a);a.motion.contactFall={velocity:-6,gravity:.35,horizontal:0};a.action=null;
    this.state(a,a.jumpKind);this.emit('headStompBounce',{player:a.index,target:b.index});
   }
   return hit;
  }
  updateGrapples(){
   for(const grab of [...this.grapples]){
    const p=this.players[grab.owner],q=this.players[grab.target],m=this.definition(p).moves[grab.move],cfg=m.grapple;
    if(!cfg.sfHold&&!cfg.sfTechable)continue;
    const mask=actor=>['punch','punch2','punch3','kick','kick2','kick3','throw'].reduce((v,k,i)=>v|(actor.input[k]?1<<i:0),0)|
     (actor.input.x<0?128:actor.input.x>0?256:0)|(actor.input.up?512:0)|(actor.input.down?1024:0);
    const target=mask(q),owner=mask(p),fresh=target&~(grab.sfLastTarget||0),ownerFresh=owner&~(grab.sfLastOwner||0);
    grab.sfLastTarget=target;grab.sfLastOwner=owner;
    if(cfg.sfHold){
     grab.sfEscape=(grab.sfEscape||0)+(fresh?1:0);
     if(ownerFresh&&p.action)p.action.time+=1/this.bank[p.id].fps;
     if(grab.sfEscape>=6){
      this.grapples=this.grapples.filter(g=>g!==grab);p.action=null;q.action=null;q.reaction=null;q.stun=.12;q.invulnerable=.2;q.y=0;q.airborne=false;
      this.state(p,'idle');this.state(q,'hit');this.emit('grabEscape',{player:q.index,target:p.index});
     }
    }else if(cfg.sfTechable&&this.definition(q).guard==='back'&&p.action?.time<=cfg.sfTechWindow&&(fresh&127)&&(q.input.x||q.input.throw)){
     grab.sfSoftened=true;this.emit('throwTech',{player:q.index,target:p.index});
    }
   }
   super.updateGrapples();
  }
 }
 s.FightArena=RepertoireArena;
 s.SF_REPERTOIRE_STATUS={status:'IMPLEMENTED_FIDELITY_PENDING',characters:proof};
 s.SFRepertoireHelp={add(ids,anchor){
  const names={punch:'Soco leve',punch2:'Soco médio',punch3:'Soco forte',kick:'Chute leve',kick2:'Chute médio',kick3:'Chute forte'},dirs={1:'Baixo + Trás',2:'Baixo',3:'Baixo + Frente',4:'Trás',6:'Frente'};
  for(const id of [...new Set(ids)].filter(id=>packs[id])){
   const d=D[id],details=document.createElement('details'),title=document.createElement('summary');details.className='prototype-note';title.textContent=s.ARENA_ASSETS.characters[id].name+' — agarrões e golpes direcionais';details.append(title);
   const rows=[];
   for(const t of packs[id].throws)rows.push((t.air?'No ar, perto: ':'Perto: ')+dirs[t.direction]+' + '+names[t.button]+(t.hold?' — imobilização. Alterne botões para acelerar; a vítima pode se debater.':'.'));
   if(id==='ryu')rows.push('Perto: Frente ou Trás + Soco médio/forte ou Chute médio/forte.');
   for(const n of packs[id].normals)rows.push((n.air?'No ar: ':'')+dirs[n.direction]+' + '+names[n.button]+'.');
   if(d.sfWallJump)rows.push('Salto na parede: no ar junto à borda, Cima + direção para longe da parede.');
   rows.push('Para amortecer um arremesso comum de SF, tente um agarrão logo após ser agarrado.');
   for(const text of rows){const p=document.createElement('p');p.textContent=text;details.append(p);}anchor.after(details);anchor=details;
  }
 }};
})(typeof window==='undefined'?globalThis:window);
