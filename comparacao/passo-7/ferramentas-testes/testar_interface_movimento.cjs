const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-3'),passed=[];
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
 const page=await b.newPage({viewport:{width:1280,height:1200}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));const url=pathToFileURL(path.join(P,'arena/index.html')).href;
 await page.goto(url);await page.waitForFunction(()=>window.arena?.ready);await page.waitForFunction(()=>arena.game.phase==='fight');
 assert((await page.locator('#build-version').innerText()).includes('tempos 5.0'));passed.push('Visible build identifies current phase revision 5.0');
 await page.keyboard.down('ArrowRight');await page.keyboard.down('ShiftRight');await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>arena.game.players[0].state),'run');
 assert((await page.locator('#p1 .run-energy').getAttribute('aria-valuenow'))<48);assert(await page.locator('#p2 .run-energy').isHidden());await page.keyboard.up('ArrowRight');await page.keyboard.up('ShiftRight');passed.push('Right Shift + forward runs and shows MK energy; Ryu has no run bar');
 await page.evaluate(()=>{arena.setPaused(true);arena.reset();arena.game.phase='fight';for(let i=0;i<35;i++)arena.game.step(1/240,[{x:1,run:true},{}]);document.querySelector('#overlay').hidden=true;});await page.evaluate(()=>new Promise(requestAnimationFrame));await page.locator('canvas').screenshot({path:path.join(H,'Previa-corrida.png')});
 for(const id of ['scorpion','ryu'])for(const side of [1,-1]){
  await page.goto(url+'?p1='+id+'&p2='+id);await page.waitForFunction(()=>arena.ready);await page.evaluate(({side})=>{arena.setPaused(true);const g=arena.game;g.phase='fight';g.players[0].x=side===1?440:660;g.players[1].x=side===1?680:420;g.players[0].facing=side;g.players[1].facing=-side;g.step(1/240,[{up:true,x:-side},{}]);for(let i=0;i<57;i++)g.step(1/240);document.querySelector('#overlay').hidden=true;},{side});await page.evaluate(()=>new Promise(requestAnimationFrame));
  await page.locator('canvas').screenshot({path:path.join(H,`Previa-pulo-tras-${id}-${side}.png`)});
  const data=await page.evaluate(()=>{const p=arena.game.players[0],c=ARENA_ASSETS.characters[p.id],f=c.clips[p.state].frames[p.frame],a=c.assets[f.asset];return {state:p.state,y:p.y,offset:f.y,height:a.height,frame:p.frame,asset:f.asset};});
  assert.equal(data.state,'jumpBackward');assert(data.y>30);assert(data.offset<0,'Sprite should remain above its foot origin: '+JSON.stringify(data));
 }
 passed.push('Backward jumps render native poses facing both ways without missing assets');
 await page.goto(url+'?p1=ryu&p2=scorpion');await page.waitForFunction(()=>arena.ready);await page.waitForFunction(()=>arena.game.phase==='fight');await page.keyboard.down('KeyA');await page.keyboard.down('KeyV');await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>arena.game.players[1].state),'run');await page.keyboard.up('KeyA');await page.keyboard.up('KeyV');passed.push('Player 2 V runs Scorpion in reversed matchup');
 await page.setViewportSize({width:600,height:1100});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));passed.push('Extra run control and energy bar fit narrow viewport');
 await page.evaluate(()=>{arena.setPaused(true);const g=arena.game;g.reset();g.phase='fight';});await page.waitForTimeout(30);await page.screenshot({path:path.join(H,'Previa-interface.png'),fullPage:true});assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(P,'arena/verificacao-interface-movimento.json'),JSON.stringify({status:'PASS',tests:passed.length,passed},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length,passed}));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
