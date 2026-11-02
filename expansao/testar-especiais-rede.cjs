const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const url=process.env.MKVSF_TEST_URL||'http://192.168.0.199:8765',browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const contexts=[],errors=[];
 try{
  const pages=[];for(let i=0;i<2;i++){const c=await browser.newContext();contexts.push(c);const p=await c.newPage();pages.push(p);p.on('pageerror',e=>errors.push(e.message));await p.goto(url);}
  const [a,b]=pages;await a.fill('#nick','Teste Ryu');await a.click('#create button');await a.waitForFunction(()=>window.roomPage?.room?.code);
  const code=await a.locator('#room-code').textContent();await a.selectOption('#character','ryu');
  await b.fill('#nick','Teste Scorpion');await b.fill('#code',code);await b.click('#join button');await b.waitForFunction(()=>window.roomPage?.room?.players.length===2);
  for(const p of pages)await p.click('#ready');await a.waitForFunction(()=>!document.querySelector('#start').disabled);await a.click('#start');
  for(const p of pages)await p.waitForFunction(()=>window.arena?.ready&&window.arena.network?.latest?.phase==='playing');
  await a.waitForFunction(()=>window.arena.game.phase==='fight');await a.evaluate(()=>window.arena.setPaused(false));await a.locator('canvas').focus();
  await a.keyboard.down('ArrowRight');await a.waitForTimeout(45);await a.keyboard.up('ArrowRight');await a.keyboard.down('ArrowDown');await a.waitForTimeout(45);
  await a.keyboard.down('ArrowRight');await a.waitForTimeout(35);await a.keyboard.down('j');await a.waitForTimeout(35);
  await a.keyboard.up('j');await a.keyboard.up('ArrowRight');await a.keyboard.up('ArrowDown');
  for(const p of pages)await p.waitForFunction(()=>window.arena.network.frames.some(f=>f.state.players[0].action?.name==='shoryuken_lp'));
  const states=await Promise.all(pages.map(p=>p.evaluate(()=>window.arena.network.frames.filter(f=>f.state.players[0].action?.name==='shoryuken_lp').map(f=>({tick:f.tick,player:f.state.players[0]})))));
  const common=states[0].find(f=>states[1].some(v=>v.tick===f.tick));assert(common);assert.deepEqual(common.player,states[1].find(f=>f.tick===common.tick).player);assert.deepEqual(errors,[]);
  const info=await (await a.request.get(url+'/api/info')).json();assert.equal(info.combatRevision,'ryu-especiais-8.2');
  await a.click('#reset');for(const p of pages)await p.waitForURL(url+'/salas.html');for(const p of pages)await p.click('#leave');
  fs.writeFileSync(path.join(__dirname,'evidencias/testes-especiais-rede.json'),JSON.stringify({status:'PASS',url,authoritativeMove:'shoryuken_lp',twoIndependentContexts:true,matchingTick:common.tick,physicalControllersTested:false,errors},null,2));
  console.log('PASS Shoryuken executado por teclado através da rede e reproduzido no mesmo estado nos dois navegadores');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
