const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {createGameServer}=require('./rede/server.cjs');
(async()=>{
 const root=__dirname,app=createGameServer({root,project:'D:/projetos/Mortal Kombat vs Street Fighter'}),addr=await app.listen(0,'127.0.0.1');
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))failed.push(r.url());});
  await page.goto('http://127.0.0.1:'+addr.port+'/expansao/arena/index.html?players=ryu,scorpion');await page.waitForFunction(()=>window.arena?.ready);await page.evaluate(()=>window.arena.setPaused(true));
  for(const [ticks,tag] of [[55,'ativacao'],[110,'voo'],[200,'impactos']]){
   const result=await page.evaluate(ticks=>{const g=window.arena.game;g.reset();g.phase='fight';g.players[0].meter=100;g.players[0].x=400;g.players[1].x=700;g.startAction(g.players[0],'shinkuhadouken');for(let i=0;i<ticks;i++)g.step(1/240,[]);document.querySelector('#overlay').hidden=true;return {freeze:!!g.superFreeze?.remaining,shots:g.projectiles.length,health:g.players[1].health,meter:g.players[0].meter};},ticks);
   if(tag==='ativacao')assert(result.freeze);if(tag==='voo')assert(result.shots);if(tag==='impactos')assert(result.health<100);assert.equal(result.meter,0);
   await page.waitForTimeout(100);await page.screenshot({path:path.join(root,'evidencias/Previa-super-'+tag+'.png')});
  }
  assert(await page.locator('#p1 .super-meter').isVisible());assert(!await page.locator('#p2 .super-meter').isVisible());
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);fs.writeFileSync(path.join(root,'evidencias/testes-super-interface.json'),JSON.stringify({status:'PASS',nativeOwnerAndProjectileRendered:true,superMeterVisible:true,errors,failed},null,2));console.log('PASS Super, impactos e barra renderizados sem erros');
 }finally{await browser.close();await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
