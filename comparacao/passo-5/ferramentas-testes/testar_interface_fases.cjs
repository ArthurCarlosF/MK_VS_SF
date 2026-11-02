const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-5'),passed=[];
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
 const p=await browser.newPage({viewport:{width:1440,height:1500}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));
 for(const ids of [['scorpion','ryu'],['ryu','scorpion']]){
  await p.goto(pathToFileURL(path.join(P,'arena/index.html')).href+'?p1='+ids[0]+'&p2='+ids[1]);await p.waitForFunction(()=>arena.ready);
  assert((await p.locator('#build-version').textContent()).includes('tempos 5.0'));
  for(let i=0;i<2;i++)assert.equal(await p.locator(`[data-player="${i}"][data-action^="punch"]`).count(),ids[i]==='ryu'?3:2);
  for(let i=0;i<2;i++)for(const [action,key] of Object.entries(i?{punch:'KeyF',punch2:'KeyC',punch3:'KeyX',kick:'KeyG',kick2:'KeyZ',kick3:'KeyQ'}:{punch:'KeyJ',punch2:'KeyN',punch3:'KeyM',kick:'KeyK',kick2:'Comma',kick3:'Period'})){
   if(ids[i]==='scorpion'&&action.endsWith('3'))continue;
   await p.evaluate(()=>{arena.reset();arena.game.phase='fight';arena.game.mode='training';arena.setPaused(false);});
   await p.locator('canvas').focus();await p.keyboard.down(key);await p.waitForFunction(i=>arena.game.events.some(e=>e.type==='action'&&e.player===i),i,{timeout:3000});
   assert.equal(await p.evaluate(([i,a])=>arena.input[i][a],[i,action]),true);
   await p.keyboard.up(key);await p.waitForTimeout(35);
   const actions=await p.evaluate(i=>arena.game.events.filter(e=>e.type==='action'&&e.player===i).map(e=>e.move),i);
   assert.equal(actions.length,1,ids[i]+' '+key);passed.push(ids[i]+' '+(i+1)+'P '+key);
  }
  await p.evaluate(()=>arena.setPaused(true));
  // Render every distinct decoded asset in both facings with the real canvas renderer.
  const count=await p.evaluate(async()=>{
   let n=0,seen=new Set();for(const facing of [-1,1])for(const [i,pl] of arena.game.players.entries())for(const [state,clip] of Object.entries(ARENA_ASSETS.characters[pl.id].clips)){
    for(let frame=0;frame<clip.frames.length;frame++){const key=pl.id+'/'+facing+'/'+clip.frames[frame].asset;if(seen.has(key))continue;seen.add(key);pl.state=state;pl.frame=frame;pl.facing=facing;pl.y=0;await new Promise(requestAnimationFrame);n++;}
   }return n;
  });assert(count>500);passed.push('Every distinct decoded asset renders, both facings: '+ids.join('/')+' '+count);
 }
 await p.evaluate(()=>{arena.reset();arena.game.phase='fight';arena.game.players[0].x=530;arena.game.players[1].x=586;arena.game.startAction(arena.game.players[0],'normal_throw_mk_1');for(let n=0;n<120;n++)arena.game.step(1/240);});
 await p.evaluate(()=>document.querySelector('#overlay').hidden=true);await p.waitForTimeout(40);await p.screenshot({path:path.join(H,'Previa-agarrao-Ryu.png'),fullPage:true});
 await p.evaluate(()=>{arena.reset();arena.game.phase='fight';arena.game.players[0].x=530;arena.game.players[1].x=720;arena.game.step(1/240,[{up:true,x:1},{}]);for(let n=0;n<30;n++)arena.game.step(1/240);arena.game.startAction(arena.game.players[0],'normal_airForward_mp');for(let n=0;n<28;n++)arena.game.step(1/240);});
 await p.evaluate(()=>document.querySelector('#overlay').hidden=true);await p.waitForTimeout(40);await p.screenshot({path:path.join(H,'Previa-Ryu-soco-medio-aereo.png'),fullPage:true});
 assert.deepEqual(errors,[]);assert.deepEqual(await p.evaluate(()=>arena.errors),[]);passed.push('No page or asset errors');
 fs.writeFileSync(path.join(H,'verificacao-interface-fases.json'),JSON.stringify({status:'PASS',passed},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
