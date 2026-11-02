const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {createGameServer}=require('./rede/server.cjs');
(async()=>{
 const root=__dirname,app=createGameServer({root,project:'D:/projetos/Mortal Kombat vs Street Fighter'}),address=await app.listen(0,'127.0.0.1');
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))failed.push(r.url());});
  await page.goto('http://127.0.0.1:'+address.port+'/expansao/arena/index.html?players=ryu,scorpion');
  await page.waitForFunction(()=>window.arena?.ready);await page.evaluate(()=>window.arena.setPaused(true));
  for(const [move,frames] of [['shoryuken_hp',110],['tatsumaki_hk',95]]){
   await page.evaluate(({move,frames})=>{
    const g=window.arena.game;g.reset();g.phase='fight';g.players[0].x=400;g.players[1].x=700;g.startAction(g.players[0],move);
    for(let i=0;i<frames;i++)g.step(1/240,[]);document.querySelector('#overlay').hidden=true;
   },{move,frames});
   await page.waitForTimeout(150);await page.locator('canvas').screenshot({path:path.join(root,'evidencias/Previa-'+move+'.png')});
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  const state=await page.evaluate(()=>({moves:window.RYU_SPECIALS_STATUS.moves,errors:window.arena.errors}));assert.equal(state.moves.length,6);assert.deepEqual(state.errors,[]);
  fs.writeFileSync(path.join(root,'evidencias/testes-especiais-interface.json'),JSON.stringify({status:'PASS',moves:state.moves,errors,failed},null,2));console.log('PASS seis variantes carregadas no navegador sem erros de imagens ou execução');
 }finally{await browser.close();await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
