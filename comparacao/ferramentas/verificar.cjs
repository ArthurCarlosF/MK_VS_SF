const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),run=process.argv[2]||fs.readFileSync(path.join(root,'ULTIMA EXECUCAO.txt'),'utf8').trim();
const json=f=>JSON.parse(fs.readFileSync(f,'utf8').replace(/^\uFEFF/,''));
const {expand,validateNative}=require('./executar.cjs'),suite=json(path.join(run,'casos.json')),summary=json(path.join(run,'resumo.json')),manifest=json(path.join(run,'manifesto.json'));
assert(summary.method_complete);assert.equal(summary.comparison_count,suite.cases.length*2);
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(run,'casos.json'))).digest('hex'),manifest.suite_sha256);
let originalCases=0,prototypeCases=0,images=0,maxError=0;
for(const game of ['umk3','ssf2tu'])for(const rep of [1,2]){
 const native=json(path.join(run,'original',game,'rep-'+rep,'trace.json')),proto=json(path.join(run,'prototype',game,'rep-'+rep,'trace.json'));
 validateNative(native,suite);assert.equal(native.fps,proto.fps);
 for(const c of suite.cases){const a=native.cases.find(x=>x.id===c.id),b=proto.cases.find(x=>x.id===c.id),inputs=expand(c);originalCases++;prototypeCases++;
  assert.equal(a.samples.length,b.samples.length);assert.equal(b.samples.length,inputs.length);
  for(let i=0;i<inputs.length;i++){
   assert.deepEqual(a.samples[i].input,b.samples[i].input);
   assert.equal(a.samples[i].time_s,b.samples[i].time_s);
   maxError=Math.max(maxError,Math.abs(b.samples[i].resampling_error_s));
   assert(Math.abs(b.samples[i].resampling_error_s)<=1/240+1e-8);
   for(const [backend,s] of [['original',a.samples[i]],['prototype',b.samples[i]]]){
    assert(Number.isFinite(s.after.x)&&Number.isFinite(s.after.y));
    if(s.screenshot){assert(fs.existsSync(path.join(run,backend,game,'rep-'+rep,s.screenshot)));images++;}
   }
  }
 }
}
for(const game of ['umk3','ssf2tu']){
 const e=json(path.join(run,'rea-'+game+'.json'));
 assert.equal(e.subject.digest.sha256,manifest.inputs.find(x=>x.path.endsWith(game+'.zip')).sha256);
}
const result={status:'PASS',originalCases,prototypeCases,images,maxResamplingErrorMs:maxError*1000,
 meaning:'Evidence files, input identity, clocks and provenance verified. Does not assert gameplay fidelity.'};
fs.writeFileSync(path.join(run,'verificacao-metodo.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
