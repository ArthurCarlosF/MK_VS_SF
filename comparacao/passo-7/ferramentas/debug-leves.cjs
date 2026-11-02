const fs=require('fs'),path=require('path'),vm=require('vm');
const P=path.resolve(__dirname,'../../..'),H=path.join(P,'comparacao/passo-7'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(P,'arena',f+'.js'),'utf8'),s);
const W=s.window,B=W.ARENA_ASSETS.characters,buttons={0:'punch',8:'punch2',1:'punch3',9:'kick',10:'kick2',11:'kick3'},results=[];
const folders=process.argv.slice(2).length?process.argv.slice(2):['leves-sf','links-sf','cancelamentos-sf'];
for(const root of folders)for(const folder of fs.readdirSync(path.join(H,root,'original/ssf2tu/rep-1'),{withFileTypes:true}).filter(d=>d.isDirectory())){
 if(!['light_crouch_9_hit_14','light_crouch_9_block_15'].includes(folder.name))continue;
 const file=path.join(H,root,'original/ssf2tu/rep-1',folder.name,'trace.json'),c=JSON.parse(fs.readFileSync(file)),g=new W.FightArena(B,['ryu','ryu']);g.phase='fight';g.players[0].x=400;g.players[1].x=400+(c.initial.players[1].x-c.initial.players[0].x)*1.25;let tick=0,native=[],actual=[],old=0;const original=g.requestAction.bind(g);g.requestAction=(p,q)=>{const before=[q.move,p.action?.name,p.action?.time*B.ryu.fps,g.hitstop];const result=original(p,q);console.log(c.id,'REQUEST',before,result,p.action?.repeatName,p.action?.repeatAt);return result;};
 for(const r of c.samples){
  const pause=Number.parseInt(r.after.players[1].runtimeBytes.slice(0x47*2,0x48*2),16),before=Number.parseInt(r.before.players[1].runtimeBytes.slice(0x47*2,0x48*2),16);
  if(pause>0&&before===0)native.push(r.sample);
  const end=Math.floor((r.sample+1)*240/B.ryu.fps+1e-9),input=r.input.map(v=>({x:v.x||0,down:!!v.down,up:!!v.up,...Object.fromEntries((v.raw||[]).map(b=>[buttons[b],true]))}));
  while(tick<end){g.step(1/240,input);tick++;}
  if(r.sample>=12&&r.sample<=20)console.log(c.id,r.sample,g.players[0].action?.time*B.ryu.fps,g.hitstop*B.ryu.fps,g.players[0].frozenEdges);
  const hits=g.events.filter(e=>['hit','block'].includes(e.type));if(hits.length>old)actual.push(r.sample);old=hits.length;
 }
 const valid=!(c.meta.kind==='cancel_dense'&&c.meta.offset<2);
 results.push({root,id:c.id,valid,native,actual,nativeContactCount:native.length,prototypeContactCount:actual.length,countsMatch:native.length===actual.length,actions:g.events.filter(e=>e.type==='action').map(e=>e.move),cancels:g.events.filter(e=>e.type==='cancel').map(e=>e.to)});
}
const mismatches=results.filter(r=>r.valid&&!r.countsMatch),summary={status:mismatches.length?'DIFFERENCES':'PASS',cases:results.length,mismatches:mismatches.length,results};
fs.writeFileSync(path.join(H,'comparacao-sf.json'),JSON.stringify(summary,null,2));console.log(JSON.stringify({status:summary.status,cases:results.length,mismatches:mismatches.length,first:mismatches.slice(0,18)}));
