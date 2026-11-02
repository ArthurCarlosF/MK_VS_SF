const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-6'),passed=[];
(async()=>{const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
 const page=await browser.newPage({viewport:{width:1380,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 for(const ids of [['scorpion','ryu'],['ryu','scorpion']]){
  await page.goto(pathToFileURL(path.join(P,'arena/index.html')).href+'?p1='+ids[0]+'&p2='+ids[1]);await page.waitForFunction(()=>arena.ready);
  assert((await page.locator('#build-version').textContent()).includes('reações 6.0'));
  await page.evaluate(()=>arena.setPaused(true));
  for(const family of ['standingHit','guardHigh','guardLow','sweep','launch','airHit'])for(const side of [-1,1]){
   const result=await page.evaluate(({family,side})=>{
    arena.reset();arena.setPaused(true);const g=arena.game;g.phase='fight';g.mode='training';const [a,p]=g.players;a.x=side===1?450:650;p.x=a.x+side*90;a.facing=side;p.facing=-side;
    const source=FightReactions.catalog(g,a,family,'heavy');if(!source)return null;
    p.input={x:0,down:family==='guardLow'};FightReactions.start(g,p,a,source,{direction:side,guarded:family.startsWith('guard')});
    const profile=FIGHT_DATA.reactions[p.reaction.profile];const sample=family==='sweep'?(profile.phases.down?.start||15):family==='launch'?Math.floor(profile.controlSamples/3):Math.min(12,profile.controlSamples-1);
    for(let i=0;i<sample;i++)g.step(1/profile.fps);
    return {state:p.state,frame:p.frame,reaction:!!p.reaction,y:p.y,cameraY:g.cameraY};
   },{family,side});assert(result?.reaction);assert(result.state.startsWith('react_'));
   await page.evaluate(()=>document.querySelector('#overlay').hidden=true);await page.waitForTimeout(25);
   if(side===1&&['standingHit','sweep','launch'].includes(family))await page.screenshot({path:path.join(H,`Previa-${ids.join('-')}-${family}.png`),fullPage:true});
   passed.push(ids.join('/')+' '+family+' '+side);
  }
  for(const action of ['punch','kick']){
   await page.evaluate(()=>{arena.reset();arena.game.phase='fight';arena.game.mode='training';arena.setPaused(false);});
   await page.locator('canvas').focus();const key=action==='punch'?'KeyJ':'KeyK';await page.keyboard.press(key);
   await page.waitForFunction(()=>arena.game.events.some(e=>e.type==='action'&&e.player===0));
   passed.push(ids.join('/')+' keyboard '+action);
  }
  await page.evaluate(()=>{arena.setPaused(true);arena.reset();});assert.deepEqual(await page.evaluate(()=>arena.errors),[]);
 }
 assert.deepEqual(errors,[]);passed.push('No page or asset errors; pause/reset and keyboard remain functional');
 fs.writeFileSync(path.join(H,'verificacao-interface-reacoes.json'),JSON.stringify({status:'PASS',passed},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length}));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
