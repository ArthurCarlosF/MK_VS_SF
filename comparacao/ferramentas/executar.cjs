/* Step 1: same input script, separate native clocks, immutable run evidence. */
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto'),{spawn}=require('child_process');
const project=path.resolve(__dirname,'../..'),home=path.join(project,'comparacao');
const python='C:/Users/Pichau/AppData/Local/Programs/Python/Python311/python.exe';
const coreRoot='C:/Users/Pichau/Documents/Codex/2026-10-22/ve/work/selection-assets';
const modelFiles=['assets.js','presentation.js','engine.js','commands.js','collisions.js','calibration.js','combat-data.js','fight-engine.js','arena.js','index.html','style.css'];
const hashFile=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,''));
const save=(f,v)=>{fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(v,null,2));};
function expand(c){let segments=Array.from({length:c.repeat||1},()=>c.segments).flat();if(c.tail)segments=[...segments,{frames:c.tail,p1:{}}];return segments.flatMap(s=>Array.from({length:s.frames},()=>[s.p1||{},s.p2||{}]));}
function validateNative(trace,suite){
 if(trace.char_ids.some(id=>id!==(trace.game==='umk3'?18:0)))throw Error('Native fixture is not the expected mirror match');
 for(const c of suite.cases){const observed=trace.cases.find(t=>t.id===c.id),expected=expand(c);
  if(!observed||observed.samples.length!==expected.length)throw Error('Native case length mismatch: '+c.id);
  observed.samples.forEach((s,i)=>{if(JSON.stringify(s.input)!==JSON.stringify(expected[i]))throw Error('Input script mismatch: '+c.id+' '+i);});}
}
function child(args,log){return new Promise((resolve,reject)=>{
 const stream=fs.createWriteStream(log),p=spawn(python,args,{windowsHide:true,stdio:['ignore','pipe','pipe']});
 p.stdout.pipe(stream,{end:false});p.stderr.pipe(stream,{end:false});
 p.on('error',e=>{stream.end();reject(e);});p.on('exit',code=>{stream.end();code===0?resolve():reject(Error('Original capture failed, see '+log));});
});}
function buildModel(dir){const s={window:{}};vm.createContext(s);
 for(const f of ['assets.js','engine.js','commands.js','collisions.js','calibration.js','combat-data.js','fight-engine.js'])vm.runInContext(fs.readFileSync(path.join(dir,f),'utf8'),s,{filename:f});return s.window;
}
function prototype(native,suite,model,output){
 const W=buildModel(model),name=native.character,ids=[name,name],fps=native.fps,base=native.baseline;
 const result={schema:1,backend:'prototype',character:name,game:native.game,repetition:native.repetition,fps,
  simulation_step:W.ARENA_RULES.step,fixture:'mirror match; ready fight; positions from native baseline',baseline:base,cases:[]};
 for(const c of suite.cases){const g=new W.FightArena(W.ARENA_ASSETS.characters,ids);g.phase='fight';
  g.players[0].x=base.x;g.players[1].x=base.p2_x;g.camera=(base.x+base.p2_x)/2;
  let ticks=0,video=0;
  const input=(v,port)=>{let out={...v};if(v.guard){if(name==='scorpion')out.block=true;else out.x=port?1:-1;}delete out.guard;return out;};
  function frame(ins){video++;const target=Math.floor(video*240/fps+1e-9);while(ticks<target){g.step(1/240,ins.map(input));ticks++;}}
  for(const seg of c.setup||[])for(let i=0;i<seg.frames;i++)frame([seg.p1||{},seg.p2||{}]);
  const setupVideo=video,setupTicks=ticks;
  function observe(){const p=g.players[0],q=g.players[1],clip=W.ARENA_ASSETS.characters[name].clips[p.state]||W.ARENA_ASSETS.characters[name].clips.idle,f=clip.frames[Math.min(p.frame,clip.frames.length-1)];
   return {x:p.x,y:base.y+(native.game==='umk3'?-p.y:p.y),p2_x:q.x,life_percent:[p.health,q.health],
    pose:f.native_pose_pointer||null,state_raw:p.state,action:p.action?.name||null,asset:f.asset,animation_frame:p.frame};}
  const initial=observe(),inputs=expand(c),checkpoints=new Set([...suite.checkpoints,inputs.length-1]),samples=[];
  inputs.forEach((ins,i)=>{const before=observe();frame(ins);const after=observe();
   const record={sample:i,time_s:(i+1)/fps,simulation_time_s:(ticks-setupTicks)/240,
    resampling_error_s:(i+1)/fps-(ticks-setupTicks)/240,input:ins,before,after,screenshot:null};
   if(checkpoints.has(i))record.render_snapshot=JSON.parse(JSON.stringify({...g.snapshot(),mode:g.mode,phaseTime:g.phaseTime,effects:g.effects,result:g.result}));
   samples.push(record);
  });
  result.cases.push({id:c.id,initial,samples,events:g.events});
 }
 save(output,result);return result;
}
function compare(native,proto,suite){return suite.cases.map(c=>{
 const a=native.cases.find(x=>x.id===c.id),b=proto.cases.find(x=>x.id===c.id);
 const errors={position:0,height:0,life:0},first={};
 for(let i=0;i<a.samples.length;i++){
  const x=a.samples[i].after,y=b.samples[i].after;
  const values={position:Math.abs((x.x-a.initial.x)-(y.x-b.initial.x)),height:Math.abs((x.y-a.initial.y)-(y.y-b.initial.y)),
   life:Math.max(...x.life_percent.map((v,k)=>Math.abs(v-y.life_percent[k])))};
  for(const [k,v] of Object.entries(values)){errors[k]=Math.max(errors[k],v);if(v>({position:1,height:2,life:.01}[k])&&first[k]===undefined)first[k]=i;}
 }
 const initialDistanceError=Math.abs((a.initial.p2_x-a.initial.x)-(b.initial.p2_x-b.initial.x));
 const contextMismatch=c.contact&&initialDistanceError>2;
 return {id:c.id,label:c.label,game:native.game,initialDistanceError,max_error:errors,first_difference_sample:first,
  status:contextMismatch?'context_mismatch':Object.keys(first).length?'difference_observed':'within_numeric_tolerances',
  note:contextMismatch?'Contact differs in starting geometry; not a valid isolated damage equivalence claim.':
   'Numeric movement/life check only; poses, state names and acceptance rules require separate interpretation.'};
});}
function repeatability(a,b){const differences=[];for(let j=0;j<a.cases.length;j++){
 const x=a.cases[j],y=b.cases[j];let n=0;for(let i=0;i<x.samples.length;i++){
  const p=x.samples[i].after,q=y.samples[i].after;
  if(['x','y','p2_x','pose'].some(k=>p[k]!==q[k])||JSON.stringify(p.life_percent)!==JSON.stringify(q.life_percent))n++;
 }if(n)differences.push({id:x.id,differing_samples:n});}
 return {identical:!differences.length,differences,meaning:'Same ordered case script across fresh original sessions; snapshots are restored only within their owning session.'};}
async function render(run,results){
 const {chromium}=require('C:/Users/Pichau/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'),{pathToFileURL}=require('url');
 const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 try{const page=await browser.newPage({viewport:{width:1280,height:1200}});let failures=[];page.on('pageerror',e=>failures.push(String(e)));
  for(const {native,proto,file} of results.filter(r=>r.native.repetition===1)){
   await page.goto(pathToFileURL(path.join(project,'arena/index.html')).href+'?p1='+native.character+'&p2='+native.character);
   await page.waitForFunction(()=>window.arena?.ready);await page.evaluate(()=>arena.setPaused(true));
   for(const c of proto.cases)for(const sample of c.samples.filter(s=>s.render_snapshot)){
    await page.evaluate(snap=>{const g=arena.game;Object.assign(g,{camera:snap.camera,elapsed:snap.elapsed,phase:snap.phase,timer:snap.timer,
     wins:snap.wins,round:snap.round,projectiles:snap.projectiles,tethers:snap.tethers,mode:snap.mode,effects:snap.effects,result:snap.result});
     g.players=snap.players.map(p=>({...p,action:p.action?{...p.action,hit:new Set(p.action.hit)}:null}));document.querySelector('#overlay').hidden=true;},sample.render_snapshot);
    await page.evaluate(()=>new Promise(requestAnimationFrame));
    const relative=`${c.id}/${String(sample.sample).padStart(3,'0')}.png`,target=path.join(path.dirname(file),relative);fs.mkdirSync(path.dirname(target),{recursive:true});
    await page.locator('canvas').screenshot({path:target});sample.screenshot=relative;delete sample.render_snapshot;
   }
   save(file,proto);
  }
  if(failures.length)throw Error(failures.join('\n'));
 }finally{await browser.close();}
}
async function main(){
 const supplied=process.argv.indexOf('--resume'),resume=supplied>=0;
 const dir=resume?path.resolve(process.argv[supplied+1]):path.join(home,'execucoes',new Date().toISOString().replace(/[:.]/g,'-'));
 if(!resume&&fs.existsSync(dir))throw Error('Run directory already exists');fs.mkdirSync(dir,{recursive:true});
 const suitePath=path.join(home,'casos.json'),suite=json(suitePath),suiteHash=hashFile(suitePath),model=path.join(dir,'model');fs.mkdirSync(model,{recursive:true});
 const provenance={created_at:new Date().toISOString(),suite_sha256:suiteHash,inputs:[],model:{},tooling:{}};
 for(const f of modelFiles){const from=path.join(project,'arena',f);provenance.model[f]=hashFile(from);fs.copyFileSync(from,path.join(model,f));}
 fs.copyFileSync(suitePath,path.join(dir,'casos.json'));
 for(const f of ['original.py','executar.cjs'])provenance.tooling[f]=hashFile(path.join(__dirname,f));
 for(const f of ['core/mame2003_plus_libretro.dll','roms/umk3.zip','roms/ssf2tu.zip'])provenance.inputs.push({path:path.join(coreRoot,f),sha256:hashFile(path.join(coreRoot,f))});
 for(const f of ['rea-umk3.json','rea-ssf2tu.json']){
  if(fs.existsSync(path.join(home,f))){fs.copyFileSync(path.join(home,f),path.join(dir,f));const e=json(path.join(home,f));provenance['rea_'+f]={evidence_id:e.evidence_id,subject:e.subject,operation:e.operation};}
 }
 save(path.join(dir,'manifesto.json'),provenance);
 const results=[],comparison=[];
 for(const game of ['umk3','ssf2tu'])for(let rep=1;rep<=suite.repetitions;rep++){
  const original=path.join(dir,'original',game,'rep-'+rep,'trace.json');
  if(!resume||!fs.existsSync(original)){console.log('Capturando original:',game,'repetição',rep);await child([path.join(__dirname,'original.py'),game,String(rep),dir],path.join(dir,`original-${game}-${rep}.log`));}
  const native=json(original);validateNative(native,suite);
  const file=path.join(dir,'prototype',game,'rep-'+rep,'trace.json'),proto=prototype(native,suite,model,file);
  results.push({native,proto,file});if(rep===1)comparison.push(...compare(native,proto,suite));
  console.log('Registrado:',game,'repetição',rep);
 }
 console.log('Registrando quadros do protótipo…');await render(dir,results);
 for(const [f,h] of Object.entries(provenance.model))if(hashFile(path.join(project,'arena',f))!==h)throw Error('Prototype changed during run: '+f);
 for(const entry of provenance.inputs)if(hashFile(entry.path)!==entry.sha256)throw Error('Native artifact changed during run');
 const repeat={};for(const game of ['umk3','ssf2tu']){
  const r=results.filter(r=>r.native.game===game);repeat[game]={original:repeatability(r[0].native,r[1].native),prototype:repeatability(r[0].proto,r[1].proto)};
 }
 const summary={schema:1,method_complete:true,comparison_count:comparison.length,repetitions:suite.repetitions,repeatability:repeat,
  differences:comparison,method_limits:['No pixel-equality claim between different presentations.','Native video time resampled to fixed 240 Hz, at most one simulation tick error.',
   'Timing, damage RNG and initial-contact mismatches are reported, never silently aligned.','Source state names are not assumed equivalent.'],
  evidence_levels:{measured:'Native RAM/video and prototype traces with identical input schedule.',inferred:'Numeric comparison and pose interpretation.',provisional:'Prototype rules listed in its current calibration and notes.'},
  rea_role:'Archive inventory/provenance only. No native input routine reconstructed in step 1.'};
 save(path.join(dir,'resumo.json'),summary);
 // Browser-friendly bundle works directly through file:// without fetch.
 const viewer={summary,suite,games:{}};
 for(const r of results.filter(r=>r.native.repetition===1))viewer.games[r.native.game]={native:r.native,prototype:r.proto};
 fs.writeFileSync(path.join(dir,'dados.js'),'window.COMPARACAO='+JSON.stringify(viewer)+';');
 for(const f of ['index.html','viewer.js','viewer.css'])fs.copyFileSync(path.join(home,'viewer',f),path.join(dir,f));
 fs.writeFileSync(path.join(home,'ULTIMA EXECUCAO.txt'),dir+'\n');
 console.log(JSON.stringify({run:dir,method_complete:true,comparisons:comparison.length,repeatability:repeat},null,2));
}
if(require.main===module)main().catch(e=>{console.error(e);process.exitCode=1;});
module.exports={expand,compare,repeatability,validateNative,prototype};
