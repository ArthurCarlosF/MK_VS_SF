const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const results=[];try{const p=await b.newPage({viewport:{width:1280,height:1180}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(const index of [0,1]){
  await p.goto(pathToFileURL(path.join(root,'arena/index.html')).href+(index?'?p1=ryu&p2=scorpion':''));await p.waitForFunction(()=>arena.ready);
  const initial=await p.evaluate(index=>{
   arena.setPaused(true);const g=arena.game;g.phase='fight';g.mode='training';
   const owner=g.players[index],target=g.players[1-index];owner.x=index?710:390;target.x=index?390:710;
   const input=[{},{}];input[index]={special:true};g.step(1/240,input);
   for(let i=0;i<400&&!g.tethers.length;i++)g.step(1/240);
   document.querySelector('#overlay').hidden=true;
   return {x:target.x,state:target.state,health:target.health,tether:g.tethers[0]};
  },index);assert(initial.tether&&initial.state==='impaled');assert.equal(initial.x,index?390:710);
  await p.waitForTimeout(30);await p.locator('canvas').screenshot({path:path.join(root,'arena',`Lanca-${index}-impacto.png`)});
  const middle=await p.evaluate(index=>{
   const g=arena.game,target=g.players[1-index],owner=g.players[index];let samples=[],frames=new Set();
   for(let i=0;i<65;i++){const prev=target.x;g.step(1/240);samples.push(Math.abs(target.x-prev));frames.add(target.frame);}
   const ctx=document.querySelector('canvas').getContext('2d'),move=ctx.moveTo,line=ctx.lineTo,stroke=ctx.stroke;
   let points=[];window.reelRopes=[];
   ctx.moveTo=function(x,y){points=[{x,y}];return move.call(this,x,y);};
   ctx.lineTo=function(x,y){points.push({x,y});return line.call(this,x,y);};
   ctx.stroke=function(){if(this.strokeStyle==='#baab7a')reelRopes.push([...points]);return stroke.call(this);};
   return {x:target.x,state:target.state,ownerState:owner.state,hand:g.socket(owner,'spear'),maxStep:Math.max(...samples),frames:frames.size,tether:g.tethers[0]};
  },index);
  assert(middle.maxStep<=8*53.20494842529297/240+1e-6);assert(middle.frames>1);assert.equal(middle.ownerState,'reel');assert.equal(middle.state,'impaled');
  await p.waitForFunction(()=>reelRopes.length>0);
  const rope=await p.evaluate(()=>reelRopes.at(-1));assert(rope.length>10);
  const a=rope[0],z=rope.at(-1);const deviations=rope.map(q=>Math.abs((z.x-a.x)*(q.y-a.y)-(z.y-a.y)*(q.x-a.x))/Math.hypot(z.x-a.x,z.y-a.y));
  assert(Math.max(...deviations)>1,'Coils should be visibly different from a straight segment');
  await p.locator('canvas').screenshot({path:path.join(root,'arena',`Lanca-${index}-puxando.png`)});
  const end=await p.evaluate(()=>{for(let i=0;i<300;i++)arena.game.step(1/240);return {distance:arena.game.snapshot().distance,tethers:arena.game.tethers.length,completed:arena.game.events.some(e=>e.type==='pullEnd')};});
  assert.equal(end.tethers,0);assert(end.completed);assert(Math.abs(end.distance-65)<.01);
  await p.waitForTimeout(30);await p.locator('canvas').screenshot({path:path.join(root,'arena',`Lanca-${index}-fim.png`)});
  results.push({index,initial,middle,end,coilDeviation:Math.max(...deviations),status:'PASS'});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'arena/verificacao-puxao.json'),JSON.stringify({status:'PASS',results,errors},null,2));console.log(JSON.stringify(results,null,2));
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
