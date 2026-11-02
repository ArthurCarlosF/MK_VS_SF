const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {pathToFileURL}=require('url');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const results=[];
 try{
  const page=await b.newPage({viewport:{width:1280,height:1180}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const index of [0,1]){
   const query=index?'?p1=ryu&p2=scorpion':'';
   await page.goto(pathToFileURL(path.join(root,'arena','index.html')).href+query);
   await page.waitForFunction(()=>arena.ready);
   const evidence=await page.evaluate(index=>{
    arena.setPaused(true);const g=arena.game;g.phase='fight';
    const inputs=[{},{}];inputs[index]={teleport:true};g.step(1/240,inputs);
    for(let i=0;i<61;i++)g.step(1/240,[{},{}]);
    const p=g.players[index],other=g.players[1-index],clip=ARENA_ASSETS.characters.scorpion.clips.teleport;
    const frame=clip.frames[p.frame];
    const ctx=document.querySelector('canvas').getContext('2d'),original=ctx.drawImage;
    window.teleportRender=[];
    ctx.drawImage=function(im,...args){
     if(im.src?.endsWith('/'+frame.asset+'.png'))teleportRender.push({a:this.getTransform().a,asset:frame.asset});
     return original.call(this,im,...args);
    };
    document.querySelector('#overlay').hidden=true;
    return {index,x:p.x,opponentX:other.x,facing:p.facing,sourceFacing:frame.sourceFacing,
      asset:frame.asset,expectedFacing:other.x>p.x?1:-1,frame:p.frame};
   },index);
   await page.waitForFunction(()=>teleportRender.length>0);
   const render=await page.evaluate(()=>teleportRender.at(-1));
   assert.equal(evidence.facing,evidence.expectedFacing);
   assert.equal(evidence.sourceFacing,-1,'Reappearance PNG should preserve captured left-facing orientation');
   assert.equal(Math.sign(render.a)*evidence.sourceFacing,evidence.expectedFacing,
     'Rendered sprite must visually face the opponent, including its captured mirroring');
   await page.locator('canvas').screenshot({path:path.join(root,'arena',index?'Teleporte-direita-para-esquerda.png':'Teleporte-esquerda-para-direita.png')});
   results.push({...evidence,canvasScaleX:render.a,status:'PASS'});
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(root,'arena','verificacao-teleporte.json'),JSON.stringify({status:'PASS',results,errors},null,2));
  console.log(JSON.stringify(results,null,2));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
