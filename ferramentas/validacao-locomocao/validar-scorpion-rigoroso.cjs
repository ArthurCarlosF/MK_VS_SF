'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),W=require('./carregar-modelo-testes.cjs')(),B=W.ARENA_ASSETS.characters,D=W.FIGHT_DATA.characters;
const E=path.join(__dirname,'evidencias/validacao-scorpion-20261120');fs.mkdirSync(E,{recursive:true});
const rivals=['mk-4','mk-1','ryu','sf-10'],passed=[],failures=[],metrics=[];
function test(group,name,fn){try{const detail=fn();passed.push({group,name,detail});}catch(e){failures.push({group,name,error:e.message,stack:e.stack});console.error('FAIL',group,name,e.message);}}
function game(victim,side=1,gap=85,corner=false){const g=new W.FightArena(B,['scorpion',victim],W.FIGHT_DATA,{mode:'training'});g.phase='fight';g.timer=999;const[p,q]=g.players;p.x=corner?(side===1?920:180):550;q.x=p.x+side*gap;p.facing=side;q.facing=-side;return g;}
function ticks(g,n,a={},b={}){for(let i=0;i<n;i++)g.step(1/240,[a,b]);}
const H='D:/Projetos/Mortal Kombat vs Street Fighter/comparacao/passo-3';
for(const file of ['execucao-01/original/umk3/rep-1/trace.json','extracao-01/original/umk3/rep-1/trace.json']){
 const native=JSON.parse(fs.readFileSync(path.join(H,file))),ids=['walk_forward_12','walk_forward_24','walk_backward_12','walk_backward_24','jump_vertical','jump_forward_free','jump_backward_free'];
 for(const trace of native.cases.filter(c=>ids.includes(c.id)))for(const rival of rivals)for(const side of [1,-1])test(trace.id.startsWith('walk')?trace.id.includes('forward')?'forward':'backward':'jumps',trace.id+'/'+rival+'/'+side,()=>{
  const gap=trace.initial.p2_x-trace.initial.x,g=game(rival,side,gap),p=g.players[0],origin=p.x;let tick=0,errorX=0,errorY=0,poseDiff=0;
  for(const row of trace.samples){const end=Math.floor((row.sample+1)*240/native.fps+1e-8);while(tick<end){g.step(1/240,row.input.map(v=>({...v,x:(v.x||0)*side,block:!!v.guard})));tick++;}
   const dx=(p.x-origin)*side,expectedX=row.after.x-trace.initial.x,expectedY=Math.max(0,trace.initial.y-row.after.y);
   errorX=Math.max(errorX,Math.abs(dx-expectedX));errorY=Math.max(errorY,Math.abs(p.y-expectedY));
   const clip=g.clip(p,p.state),f=clip.frames[p.frame],pose=f?.native_pose_pointer||B.scorpion.assets[f?.asset]?.metadata?.frame_pointer;
   if((p.airborne||['forward','backward'].includes(p.state))&&row.after.pose&&pose!==row.after.pose)poseDiff++;
  }
  metrics.push({id:trace.id,rival,side,errorX,errorY,poseDiff,frames:trace.samples.length});assert(errorX<=1,`x error ${errorX}`);assert(errorY<=1,`height error ${errorY}`);assert(!p.airborne&&p.y===0);return {errorX,errorY,poseDiff};
 });
}
const normals=[...new Set(Object.values(D.scorpion.normalControls).flatMap(c=>[c.standing.far,c.standing.near,c.crouch,c.airVertical,c.airDirectional,c.back]).filter(Boolean))];
const relevant=[...normals,'spear','teleport','nativeAir_teleport','airThrow'];
for(const rival of rivals)for(const side of [1,-1])for(const corner of [false,true])for(const name of relevant)for(const situation of ['standing','guard','crouch','crouchGuard','air','attacking','recovering','far'])test('combat',`${rival}/${side}/${corner}/${name}/${situation}`,()=>{
 const m=D.scorpion.moves[name],g=game(rival,side,m.grapple?52:85,corner),[p,q]=g.players;
 if(situation==='far')q.x=p.x+side*230;
 const qi={block:situation==='guard'||situation==='crouchGuard',down:situation==='crouch'||situation==='crouchGuard'};
 if(D[rival].guard==='back'&&qi.block){delete qi.block;qi.x=side;}
 if(situation==='air'||m.grapple?.airborne){g.beginJump(q);q.airborne=true;q.y=85;q.motion.jumpAge=12;}
 if(m.air){g.beginJump(p);p.airborne=true;p.y=85;p.motion.jumpAge=12;}
 if(situation==='attacking')g.startAction(q,D[rival].normalControls.punch.standing.far);
 if(situation==='recovering')q.stun=.12;
 const can=g.canStart(p,name);if(!can){assert(m.grapple,'unexpected action rejection');return {unavailable:true};}
 assert(g.startAction(p,name));const initial=p.health;let minP=p.health,minQ=q.health;
 for(let i=0;i<1200;i++){g.step(1/240,[{},qi]);for(const actor of g.players){assert(Number.isFinite(actor.x)&&Number.isFinite(actor.y)&&Number.isFinite(actor.health));assert(actor.y>=0&&actor.health>=0&&actor.health<=100);const clip=g.clip(actor,actor.state);assert(clip.frames[actor.frame]);assert(B[actor.id].assets[clip.frames[actor.frame].asset]);}
  assert(p.health<=minP+1e-7&&q.health<=minQ+1e-7,'health increased');minP=p.health;minQ=q.health;
 }
 assert.equal(g.grapples.length,0);assert.equal(g.tethers.length,0);assert(!p.action,'attacker stuck '+p.action?.name);assert(!p.airborne&&p.y===0,'attacker did not land');assert(!q.airborne&&q.y===0,'victim did not land');
 return {damage:100-q.health,received:initial-p.health,hit:g.events.filter(e=>e.type==='hit'||e.type==='block').map(e=>({type:e.type,player:e.player,move:e.move,damage:e.damage}))};
});
const report={date:'2026-11-20',character:'scorpion',rivals:rivals.map(id=>({id,name:B[id].name})),criterion:'Strict item marking requires original comparison as well as behavior tests; matrix execution alone does not validate fidelity.',passed:passed.length,failures,metrics,results:passed};
fs.writeFileSync(path.join(E,'resultado.json'),JSON.stringify(report,null,2));console.log('Scorpion matrix PASS',passed.length,'FAIL',failures.length);if(failures.length)process.exitCode=1;
