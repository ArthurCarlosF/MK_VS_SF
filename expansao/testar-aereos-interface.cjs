const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {createGameServer}=require('./rede/server.cjs');
(async()=>{
 const root=__dirname,app=createGameServer({root,project:'D:/projetos/Mortal Kombat vs Street Fighter'}),addr=await app.listen(0,'127.0.0.1');
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))failed.push(r.url());});
  await page.goto('http://127.0.0.1:'+addr.port+'/expansao/arena/index.html?players=ryu,scorpion');await page.waitForFunction(()=>window.arena?.ready);await page.evaluate(()=>window.arena.setPaused(true));
  for(const [button,name] of [['kick','lk'],['kick2','mk'],['kick3','hk']]){
   const r=await page.evaluate(button=>{const g=window.arena.game;g.reset();g.phase='fight';g.players[0].x=400;g.players[1].x=750;const fps=window.ARENA_ASSETS.characters.ryu.fps;
    function run(samples,input){for(let i=0;i<Math.round(samples/fps*240);i++)g.step(1/240,[input,{}]);}
    run(8,{up:true});run(3,{down:true});run(3,{down:true,x:-1});run(3,{x:-1});run(2,{x:-1,[button]:true});
    const action=g.players[0].action?.name;run(7,{});document.querySelector('#overlay').hidden=true;return {action,y:g.players[0].y};
   },button);
   assert.equal(r.action,'air_tatsumaki_'+name);assert(r.y>0);await page.waitForTimeout(100);await page.locator('canvas').screenshot({path:path.join(root,'evidencias/Previa-aereo-'+name+'.png')});
   const landed=await page.evaluate(()=>{const g=window.arena.game;for(let i=0;i<500;i++)g.step(1/240,[]);return {y:g.players[0].y,action:g.players[0].action};});assert.equal(landed.y,0);assert.equal(landed.action,null);
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);fs.writeFileSync(path.join(root,'evidencias/testes-aereos-interface.json'),JSON.stringify({status:'PASS',threeStrengths:true,directionalCommands:true,landing:true,errors,failed},null,2));console.log('PASS três Tatsumakis aéreos executados por sequência direcional e renderizados sem erros');
 }finally{await browser.close();await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
