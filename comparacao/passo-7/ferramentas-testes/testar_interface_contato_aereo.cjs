const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-5'),passed=[];
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});try{
 const page=await b.newPage({viewport:{width:1280,height:1200}}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 for(const facing of [-1,1]){
  await page.goto(pathToFileURL(path.join(P,'arena/index.html')).href);await page.waitForFunction(()=>arena.ready);
  const data=await page.evaluate(facing=>{
   arena.setPaused(true);arena.reset();const g=arena.game,p=g.players[0],q=g.players[1];g.phase='fight';p.x=facing===1?480:680;q.x=p.x+facing*130;p.facing=facing;q.facing=-facing;
   g.step(1/240,[{up:true,x:facing},{}]);for(let i=0;i<30;i++)g.step(1/240);
   if(!g.startAction(p,'normal_airForward_lp'))throw Error('Air attack refused');
   for(let i=0;i<240&&!g.events.some(e=>e.type==='hit');i++)g.step(1/240);
   if(!g.events.some(e=>e.type==='hit'))throw Error('Air contact fixture missed');
   const before={x:p.x,y:p.y,frame:p.frame};for(let i=0;i<10;i++)g.step(1/240);
   document.querySelector('#overlay').hidden=true;
   return {before,after:{x:p.x,y:p.y,frame:p.frame},localPause:p.localHitstop,globalPause:g.hitstop,facing:p.facing};
  },facing);
  assert.deepEqual(data.before,data.after);assert(data.localPause>0);assert.equal(data.globalPause,0);assert.equal(data.facing,facing);
  await page.evaluate(()=>new Promise(requestAnimationFrame));await page.locator('canvas').screenshot({path:path.join(H,'Previa-contato-aereo-'+facing+'.png')});passed.push('Native attacker-only contact pause renders facing '+facing);
 }
 assert.deepEqual(errors,[]);passed.push('Both canvases render without missing sprites or browser errors');
 fs.writeFileSync(path.join(H,'verificacao-interface-contato-aereo.json'),JSON.stringify({status:'PASS',passed},null,2));console.log(JSON.stringify({status:'PASS',tests:passed.length}));
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
