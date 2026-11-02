const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const root=path.resolve(__dirname,'..'),passed=[];
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const p=await browser.newPage({viewport:{width:1440,height:1280}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));
  const url=pathToFileURL(path.join(root,'arena','index.html')).href;
  await p.goto(pathToFileURL(path.join(root,'index.html')).href);await p.waitForFunction(()=>selection.ready);
  await p.evaluate(()=>{selection.confirm(0);selection.confirm(1);});await p.locator('#start').click();await p.waitForFunction(()=>window.arena?.ready);
  assert.deepEqual(await p.evaluate(()=>arena.game.ids),['scorpion','ryu']);passed.push('Selection opens combat without loading original games');
  await p.waitForFunction(()=>arena.game.phase==='fight');
  let x=await p.evaluate(()=>arena.game.players[0].x);await p.keyboard.down('ArrowRight');await p.waitForTimeout(150);await p.keyboard.up('ArrowRight');
  assert((await p.evaluate(()=>arena.game.players[0].x))>x);
  await p.keyboard.down('KeyD');await p.keyboard.down('ArrowLeft');assert.deepEqual(await p.evaluate(()=>arena.input.map(i=>i.x)),[-1,1]);await p.keyboard.up('KeyD');await p.keyboard.up('ArrowLeft');
  passed.push('Simultaneous independent movement');
  await p.keyboard.down('ArrowUp');await p.waitForTimeout(170);assert((await p.evaluate(()=>arena.game.players[0].y))>0);await p.keyboard.up('ArrowUp');await p.waitForTimeout(1100);
  await p.keyboard.down('KeyS');await p.waitForTimeout(50);assert.equal(await p.evaluate(()=>arena.game.players[1].state),'crouch');await p.keyboard.up('KeyS');passed.push('Keyboard jump and crouch select native sprites');
  await p.evaluate(()=>{arena.game.players[0].x=530;arena.game.players[1].x=596.75;});
  await p.keyboard.press('KeyJ');await p.waitForTimeout(300);assert((await p.evaluate(()=>arena.game.players[1].health))<100);
  assert((await p.locator('#p2 .health').getAttribute('aria-valuenow'))<100);passed.push('Keyboard attack applies damage and updates life bar');
  await p.locator('#pause').click();assert(await p.evaluate(()=>arena.paused));let frozen=await p.evaluate(()=>JSON.stringify(arena.game.snapshot()));await p.waitForTimeout(120);assert.equal(await p.evaluate(()=>JSON.stringify(arena.game.snapshot())),frozen);
  await p.locator('#resume').click();await p.keyboard.down('KeyF');await p.evaluate(()=>window.dispatchEvent(new Event('blur')));assert(await p.evaluate(()=>arena.paused));assert((await p.evaluate(()=>arena.input)).every(i=>!i.punch));await p.keyboard.up('KeyF');await p.locator('#resume').click();passed.push('Pause and lost focus freeze safely and release buttons');
  await p.locator('#mode').selectOption('training');assert.equal(await p.evaluate(()=>arena.game.mode),'training');await p.waitForFunction(()=>arena.game.phase==='fight');assert.equal(await p.locator('#timer').textContent(),'∞');passed.push('Training mode resets match and disables timer');
  const button=p.locator('[data-player="0"][data-action="punch"]');const box=await button.boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();assert(await p.evaluate(()=>arena.input[0].punch));await p.mouse.move(5,5);await p.mouse.up();assert.equal(await p.evaluate(()=>arena.input[0].punch),false);passed.push('Onscreen action releases outside button');
  await p.locator('#diagnostics').check();await p.locator('canvas').focus();
  // Enumerate every imported clip in both display orientations; catches stale
  // frame indices and missing pose assets beyond normal gameplay coverage.
  await p.evaluate(()=>arena.setPaused(true));
  const names=await p.evaluate(()=>Object.keys(ARENA_ASSETS.characters.scorpion.clips));
  for(const name of names){await p.evaluate(name=>{for(const player of arena.game.players){player.state=name;player.frame=999;}},name);await p.waitForTimeout(20);}
  await p.evaluate(()=>{arena.game.reset();for(let i=0;i<300;i++)arena.game.step(1/240);document.querySelector('#overlay').hidden=true;});await p.waitForTimeout(40);
  await p.screenshot({path:path.join(root,'arena','Previa.png'),fullPage:true});passed.push('Every imported pose renders without missing assets');
  await p.evaluate(()=>{arena.game.players[0].x=535;arena.game.players[1].x=600;for(let i=0;i<30;i++)arena.game.step(1/240,[{punch:i===0},{}]);});await p.waitForTimeout(40);
  await p.screenshot({path:path.join(root,'arena','Previa-combate.png'),fullPage:true});
  await p.evaluate(()=>{arena.game.reset();arena.game.phase='fight';arena.game.step(1/240,[{up:true,x:1},{down:true}]);for(let i=0;i<40;i++)arena.game.step(1/240,[{}, {down:true}]);});await p.waitForTimeout(40);await p.locator('canvas').screenshot({path:path.join(root,'arena','Previa-pulo.png')});
  await p.goto(url+'?p1=ryu&p2=scorpion');await p.waitForFunction(()=>arena.ready);assert.deepEqual(await p.evaluate(()=>arena.game.ids),['ryu','scorpion']);passed.push('Reversed matchup preserves character and scale ownership');
  await p.setViewportSize({width:600,height:1000});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));passed.push('Controls and health bars fit small viewport');
  await p.goto(pathToFileURL(path.join(root,'index.html')).href);await p.waitForFunction(()=>selection.ready);await p.evaluate(()=>{selection.players[0].index=0;selection.confirm(0);selection.confirm(1);});assert(await p.locator('#start').isDisabled());passed.push('Unimplemented characters cannot start combat');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'arena','verificacao-interface-combate.json'),JSON.stringify({status:'PASS',date:new Date().toISOString(),passed,errors},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length,passed},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
