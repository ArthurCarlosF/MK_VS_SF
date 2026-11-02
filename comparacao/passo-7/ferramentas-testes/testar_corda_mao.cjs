const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const results=[];try{
 const page=await b.newPage({viewport:{width:1280,height:1180}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const index of [0,1]){
  await page.goto(pathToFileURL(path.join(root,'arena/index.html')).href+(index?'?p1=ryu&p2=scorpion':''));await page.waitForFunction(()=>arena.ready);
  const expected=await page.evaluate(index=>{
   arena.setPaused(true);const g=arena.game;g.phase='fight';g.mode='training';
   const p=g.players[index],other=g.players[1-index];p.x=index?710:390;other.x=index?390:710;
   const input=[{},{}];input[index]={special:true};g.step(1/240,input);for(let i=0;i<85;i++)g.step(1/240);
   const hand=g.socket(p,'spear'),q=g.projectiles.find(q=>q.owner===index);
   const left=g.camera-ARENA_RULES.viewport/2,ctx=document.querySelector('canvas').getContext('2d'),original=ctx.stroke;
   let start=null,end=null;const move=ctx.moveTo,line=ctx.lineTo;
   ctx.moveTo=function(x,y){start={x,y};return move.call(this,x,y);};ctx.lineTo=function(x,y){end={x,y};return line.call(this,x,y);};
   window.ropeRender=[];ctx.stroke=function(){if(this.strokeStyle==='#baab7a')ropeRender.push({start,end});return original.call(this);};
   document.querySelector('#overlay').hidden=true;
   return {index,hand,projectile:q,facing:p.facing,screen:{x:(hand.x-left)*2,y:410-hand.y*2}};
  },index);
  await page.waitForFunction(()=>ropeRender.length>0);const drawn=await page.evaluate(()=>ropeRender.at(-1));
  assert(Math.abs(drawn.start.x-expected.screen.x)<1e-7);assert(Math.abs(drawn.start.y-expected.screen.y)<1e-7);
  assert.equal(drawn.start.y,drawn.end.y);assert.equal(expected.projectile.y,expected.hand.y);
  await page.locator('canvas').screenshot({path:path.join(root,'arena',index?'Corda-mao-esquerda.png':'Corda-mao-direita.png')});
  results.push({...expected,drawn,status:'PASS'});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'arena/verificacao-corda.json'),JSON.stringify({status:'PASS',results,errors},null,2));console.log(JSON.stringify(results,null,2));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
