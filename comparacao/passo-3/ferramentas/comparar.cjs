const fs=require('fs'),vm=require('vm'),path=require('path');
const H=path.resolve(__dirname,'..'),P=path.resolve(H,'../..');
const build=dir=>{const s={window:{}};vm.createContext(s);for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(dir,f+'.js'),'utf8'),s);return s.window;};
function simulate(W,native,c){
 const id=native.character,scale=id==='ryu'?1.25:1,g=new W.FightArena(W.ARENA_ASSETS.characters,[id,id]);g.phase='fight';
 g.players[0].x=c.initial.x*scale;g.players[1].x=c.initial.p2_x*scale;g.camera=(g.players[0].x+g.players[1].x)/2;
 const initial=g.players[0].x,oldBase=c.initial.y,sign=id==='ryu'?1:-1;let ticks=0;const results=[];
 for(const s of c.samples){const target=Math.floor((s.sample+1)*240/native.fps+1e-8);while(ticks<target){g.step(1/240,s.input.map(v=>({...v,block:!!v.guard})));ticks++;}
 const p=g.players[0],q=g.players[1];results.push({sample:s.sample,dx:p.x-initial,height:p.y,p2_x:q.x,camera:g.camera,facing:p.facing,airborne:p.airborne,state:p.state,
 expected_dx:(s.after.x-c.initial.x)*scale,expected_height:Math.max(0,sign*(s.after.y-oldBase)*scale)});}
 return results;
}
const B=build(path.join(H,'backup-antes')),A=build(path.join(P,'arena')),rows=[],runs={};
for(const game of ['umk3','ssf2tu']){
 const native=JSON.parse(fs.readFileSync(path.join(H,'execucao-01/original',game,'rep-1/trace.json')));
 const extra=JSON.parse(fs.readFileSync(path.join(H,'extracao-01/original',game,'rep-1/trace.json')));runs[game]={};
 for(const c of [...native.cases,...extra.cases.filter(c=>c.id.includes('free'))]){
  const before=simulate(B,native,c),after=simulate(A,native,c);const error=list=>({x:Math.max(...list.map(s=>Math.abs(s.dx-s.expected_dx))),height:Math.max(...list.map(s=>Math.abs(s.height-s.expected_height)))});
  rows.push({game,id:c.id,before:error(before),after:error(after),note:'Native scale applied to positions. Source stage/world/camera is different from the crossover; boundary and body cases describe adaptation differences, not isolated motion failure.'});
  runs[game][c.id]=after;
 }
}
fs.writeFileSync(path.join(H,'paridade-movimento.json'),JSON.stringify({rows,runs},null,2));
console.log(JSON.stringify(rows.filter(r=>['walk_forward_12','walk_forward_24','walk_backward_12','walk_backward_24','jump_vertical','jump_forward_free','jump_backward_free'].includes(r.id)),null,2));
module.exports={simulate,build};
