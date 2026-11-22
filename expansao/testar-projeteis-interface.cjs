const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {createGameServer}=require('./rede/server.cjs');
(async()=>{
 const root=__dirname,app=createGameServer({root,project:'D:/projetos/Mortal Kombat vs Street Fighter'}),addr=await app.listen(0,'127.0.0.1');
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))failed.push(r.url());});
  await page.goto('http://127.0.0.1:'+addr.port+'/expansao/arena/index.html?players=ryu,ryu');await page.waitForFunction(()=>window.arena?.ready);await page.evaluate(()=>window.arena.setPaused(true));
  for(const [move,ticks,distance,tag] of [['hadouken_lp',60,350,'azul'],['red_hadouken_hp',60,350,'vermelho'],['red_hadouken_hp',180,250,'queimadura']]){
   const result=await page.evaluate(({move,ticks,distance})=>{const g=window.arena.game;g.reset();g.phase='fight';g.players[0].x=400;g.players[1].x=400+distance;g.startAction(g.players[0],move);for(let i=0;i<ticks;i++)g.step(1/240,[]);document.querySelector('#overlay').hidden=true;return {shots:g.projectiles.length,reaction:g.players[1].reaction?.profile};},{move,ticks,distance});
   if(tag==='queimadura')assert(result.reaction?.includes('red_hadouken_hp_far'));else assert(result.shots>0);
   await page.waitForTimeout(150);await page.locator('canvas').screenshot({path:path.join(root,'evidencias/Previa-projetil-'+tag+'.png')});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);fs.writeFileSync(path.join(root,'evidencias/testes-projeteis-interface.json'),JSON.stringify({status:'PASS',blue:true,red:true,nativeBurnReaction:true,errors,failed},null,2));console.log('PASS projéteis azul/vermelho e reação nativa de queimadura carregados e renderizados sem erros');
 }finally{await browser.close();await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
