const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=__dirname,original='D:/projetos/Mortal Kombat vs Street Fighter';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.txt':'text/plain; charset=utf-8'};
const server=http.createServer((req,res)=>{
  try{const raw=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(raw.includes('..'))throw Error('path');
    const stage=raw.startsWith('/expansao/'),rel=stage?raw.slice('/expansao/'.length):raw.slice(1),file=path.join(stage?root:original,rel||'index.html');
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
  }catch{res.statusCode=404;res.end('not found');}
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/expansao/';
  const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
  const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))failed.push(r.url());});
  try{
    await page.goto(url+'index.html');await page.waitForFunction(()=>document.querySelectorAll('.portrait img').length===38&&[...document.images].every(i=>i.complete&&i.naturalWidth>0));
    assert.equal(await page.locator('.slot').count(),2);await page.selectOption('#players','4');assert.equal(await page.locator('.slot').count(),4);
    await page.locator('.slot input').evaluateAll(list=>list.forEach(i=>{i.checked=false;i.dispatchEvent(new Event('change'));}));
    await page.click('#play');await page.waitForFunction(()=>window.arena?.ready);await page.evaluate(()=>window.arena.setPaused(true));
    assert.equal(await page.locator('.fighter').count(),4);assert.equal(await page.locator('.touch').count(),4);
    await page.waitForTimeout(1200);const zoom4=await page.evaluate(()=>window.arena.zoom);assert(zoom4<.9&&zoom4>.6,zoom4);
    await page.evaluate(()=>document.querySelector('#overlay').hidden=true);await page.screenshot({path:path.join(root,'Previa-4-jogadores.png'),fullPage:false});
    await page.evaluate(()=>{window.arena.game.players[2].health=0;window.arena.game.players[3].health=0;});await page.waitForTimeout(1600);
    const zoom2=await page.evaluate(()=>window.arena.zoom);assert(zoom2>.98&&zoom2>zoom4);
    await page.goto(url+'arena/index.html?players=scorpion,ryu&mode=bonus');await page.waitForFunction(()=>window.arena?.ready);await page.evaluate(()=>{
      window.arena.setPaused(true);const g=window.arena.game;g.phase='fight';g.players[0].x=432;g.players[0].facing=1;g.players[1].x=668;g.players[1].facing=-1;
      for(let i=0;i<900;i++)g.step(1/240,[{punch:i%80===0},{kick:i%100===0}]);
    });
    const score=await page.evaluate(()=>window.arena.game.bonus.score);assert(score>0);await page.evaluate(()=>document.querySelector('#overlay').hidden=true);await page.waitForTimeout(150);await page.screenshot({path:path.join(root,'Previa-carro.png'),fullPage:false});
    await page.selectOption('#mode','versus');assert.equal(await page.evaluate(()=>window.arena.game.bonus),null);
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
    fs.writeFileSync(path.join(root,'testes-interface.json'),JSON.stringify({status:'PASS',portraits:38,players:4,zoom4,zoom2,carScore:score,errors,failed},null,2));console.log('PASS interface, 38 retratos, 4 jogadores, zoom '+zoom4.toFixed(3)+' → '+zoom2.toFixed(3)+', carro '+score);
  }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
