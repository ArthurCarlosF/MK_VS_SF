const path=require('path'),os=require('os');
const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {createGameServer}=require('./server.cjs');
(async()=>{const app=createGameServer({root:path.resolve(__dirname,'..'),project:'D:/projetos/Mortal Kombat vs Street Fighter'}),addr=await app.listen(0),ip=Object.entries(os.networkInterfaces()).find(([n,v])=>n==='Ethernet'&&v.some(v=>v.family==='IPv4'))?.[1].find(v=>v.family==='IPv4').address;
if(!ip)throw Error('Sem endereço Ethernet');const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
try{const page=await browser.newPage();await page.goto('http://'+ip+':'+addr.port);console.log(JSON.stringify(await page.evaluate(()=>{let result;try{result={available:!!navigator.getGamepads,number:navigator.getGamepads?.().length};}catch(e){result={available:false,error:e.name};}return {isSecureContext,gamepad:result};})));}finally{await browser.close();await app.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
