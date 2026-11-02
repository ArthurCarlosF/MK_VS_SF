const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const P=path.resolve(__dirname,'..'),passed=[];
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{const page=await browser.newPage({viewport:{width:1280,height:1050}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(pathToFileURL(path.join(P,'arena/index.html')).href);await page.waitForFunction(()=>window.arena?.ready);await page.waitForFunction(()=>arena.game.phase==='fight');
 await page.keyboard.down('KeyJ');await page.waitForTimeout(900);
 for(let i=0;i<10;i++)await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyJ',repeat:true,bubbles:true})));
 await page.waitForTimeout(120);assert.equal(await page.evaluate(()=>arena.game.events.filter(e=>e.type==='action'&&e.player===0).length),1);await page.keyboard.up('KeyJ');passed.push('Holding J and operating-system repeat produce one punch');
 await page.evaluate(()=>{arena.reset();arena.game.phase='fight';});
 for(let i=0;i<8;i++){await page.keyboard.down('KeyJ');await page.waitForTimeout(45);await page.keyboard.up('KeyJ');await page.waitForTimeout(45);}
 assert(await page.evaluate(()=>arena.game.events.some(e=>e.type==='action'&&['punchFollow','punchReturn'].includes(e.move))));passed.push('Actual browser key taps trigger the native alternate punch sequence');
 await page.evaluate(()=>{arena.setPaused(true);const g=arena.game;g.startRound();g.phase='fight';g.players[0].x=420;g.players[1].x=680;g.startAction(g.players[0],'punchFollow');for(let i=0;i<40;i++)g.step(1/240);});
 await page.evaluate(()=>{document.querySelector('#overlay').hidden=true;return new Promise(requestAnimationFrame);});await page.locator('canvas').screenshot({path:path.join(P,'comparacao/passo-2/Previa-sequencia.png')});
 assert(await page.evaluate(()=>{const c=ARENA_ASSETS.characters.scorpion;return ['punchFollow','punchReturn'].every(n=>c.clips[n].frames.every(f=>{const a=c.assets[f.asset];return f.y+a.height>=-4&&f.y+a.height<=4;}));}));assert.deepEqual(errors,[]);passed.push('New decoded poses load and render without browser errors');
 fs.writeFileSync(path.join(P,'arena/verificacao-interface-comandos.json'),JSON.stringify({status:'PASS',tests:passed.length,passed},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length,passed}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
