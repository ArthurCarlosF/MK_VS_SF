const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const{chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const root=process.env.MK_ROOT||__dirname,out=path.join(__dirname,'evidencias/caminhada-elenco-20261121'),app=require(path.join(root,'rede/server.cjs')).createGameServer({root,project:'D:/Projetos/Mortal Kombat vs Street Fighter'}),addr=await app.listen(0,'127.0.0.1');
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true}),errors=[],results=[];
 try{
  const page=await browser.newPage({viewport:{width:1280,height:1000}});page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.url());});
  const ids=process.env.MK_TEST_CHARACTERS?process.env.MK_TEST_CHARACTERS.split(','):Object.keys(require('./carregar-modelo-testes.cjs')().NATIVE_GROUND_GAITS);
  for(const id of ids){
   await page.goto(`http://127.0.0.1:${addr.port}/expansao/arena/index.html?players=${id},scorpion&mode=training&stage=practice`);await page.waitForFunction(()=>window.arena?.ready,null,{timeout:90000});
   const row=await page.evaluate(()=>{
    const a=window.arena;a.setPaused(true);const g=a.game;g.phase='fight';g.timer=999;const p=g.players[0];p.x=450;g.players[1].x=750;
    const seen=[];
    for(const input of [{x:1},{x:-1},{down:true},{x:1},{x:1,run:true},{}]){
     for(let i=0;i<Math.ceil(12*240/g.bank[p.id].fps);i++)g.step(1/240,[{},{}]);
     // Each browser smoke case needs free runway, not a later body collision
     // after accumulating several previous forward walks.
     p.x=450;g.players[1].x=750;g.camera=550;
     const start=p.x;for(let i=0;i<Math.ceil(20*240/g.bank[p.id].fps);i++){g.step(1/240,[input,{}]);const f=g.clip(p,p.state).frames[p.frame];if(!f||!g.bank[p.id].assets[f.asset])throw Error('Invalid gait artwork');}
     seen.push({input,moved:p.x-start,state:p.state,frame:p.frame});
    }
    return {id:p.id,seen,canRun:g.bank[p.id].universe==='mk'&&g.bank[p.id].nativeGroundGait.canRun!==false,maximumStep:g.bank[p.id].nativeGroundGait.forwardSpeed*2,errors:a.errors};
   });
   if(!row.canRun)console.log(JSON.stringify(row));
   assert(row.seen[0].moved>0);assert(row.seen[1].moved<0);assert.equal(row.seen[2].moved,0);
   if(row.canRun)assert(row.seen[4].moved>row.seen[3].moved);else{assert.notEqual(row.seen[4].state,'run');assert(Math.abs(row.seen[4].moved-row.seen[3].moved)<=row.maximumStep);}
   assert.deepEqual(row.errors,[]);results.push(row);
   if(['mk-0','scorpion','human-smoke'].includes(id)){await page.addStyleTag({content:'#overlay{display:none!important}'});await page.waitForTimeout(50);await page.screenshot({path:path.join(out,'browser-'+id+'.png')});}
   console.log('BROWSER',id);
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,process.env.MK_ROOT?'interface-instalacao.json':process.env.MK_TEST_CHARACTERS?'interface-parcial.json':'interface.json'),JSON.stringify({root,status:'PASS',results,errors},null,2));console.log('PASS',results.length,'fighters in browser');
 }finally{await browser.close();await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
