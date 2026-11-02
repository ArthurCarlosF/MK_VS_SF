const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');
const P=path.resolve(__dirname,'..'),H=path.join(P,'comparacao/passo-2'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(P,'arena',f+'.js'),'utf8'),s);
const W=s.window,bank=W.ARENA_ASSETS.characters,passed=[];
const test=(name,fn)=>{fn();passed.push(name);};
function game(id){const g=new W.FightArena(bank,[id,id]);g.phase='fight';return g;}
function run(g,n,input={}){for(let i=0;i<Math.round(n*240);i++)g.step(1/240,[input,{}]);}
function actions(g){return g.events.filter(e=>e.type==='action'&&e.player===0);}
function cmd(g,inputs){for(const input of inputs)run(g,.035,input);}
const native={};for(const game of ['umk3','ssf2tu'])native[game]=JSON.parse(fs.readFileSync(path.join(H,'execucao-01/original',game,'rep-1/trace.json')));

test('Both native batteries repeat exactly across fresh sessions (220 case comparisons)',()=>{
 for(const game of ['umk3','ssf2tu']){const second=JSON.parse(fs.readFileSync(path.join(H,'execucao-01/original',game,'rep-2/trace.json')));
 assert.equal(native[game].cases.length,110);assert.deepEqual(native[game].cases,second.cases);}
});
test('Holding any mapped normal never auto-repeats (both characters, standing/crouched)',()=>{
 for(const id of ['scorpion','ryu'])for(const button of ['punch','punch2'])for(const down of [false,true]){
  const g=game(id);run(g,1.6,{[button]:true,down});assert.equal(actions(g).length,1);
 }
});
test('MK early re-press branches into the native alternate punch',()=>{
 const g=game('scorpion');run(g,1/53.204948425,{punch:true});run(g,3/53.204948425);run(g,1/53.204948425,{punch:true});run(g,.8);
 assert(actions(g).some(e=>e.move==='punchFollow'));assert(bank.scorpion.clips.punchFollow.frames.some(f=>f.native_pose_pointer==='0xff9394f0'));
});
test('MK rapid presses alternate the returning arm; holding button does not',()=>{
 const g=game('scorpion');for(let i=0;i<12;i++){run(g,2/53.204948425,{punch:true});run(g,2/53.204948425);}run(g,.8);
 assert(actions(g).some(e=>e.move==='punchReturn'));assert(actions(g).some(e=>e.move==='punchFollow'));
});
test('MK presses in the measured closed jab window do not launch a later punch',()=>{
 const g=game('scorpion');run(g,1/240,{punch:true});run(g,16/53.204948425);run(g,1/240,{punch:true});run(g,1);
 assert.equal(actions(g).length,1);
});
test('Ryu re-presses light punch before full recovery in standing and crouched stance',()=>{
 for(const down of [false,true]){const g=game('ryu');run(g,1/240,{punch:true,down});run(g,.075,{down});run(g,1/240,{punch:true,down});run(g,.4,{down});assert.equal(actions(g).length,2);}
});
test('An early different normal is discarded, never replayed after recovery',()=>{
 for(const id of ['scorpion','ryu']){const g=game(id);run(g,1/240,{kick:true});run(g,.06);run(g,1/240,{punch:true});run(g,1);assert.equal(actions(g).length,1);}
});
test('Simultaneous punch/kick resolves to punch and cannot leave a queued kick',()=>{
 for(const id of ['scorpion','ryu']){const g=game(id);run(g,.03,{punch:true,kick:true});run(g,1);assert.equal(actions(g).length,1);assert.equal(actions(g)[0].move,'punch');}
});
test('MK block prevents normal attack; holding back still permits Ryu punch',()=>{
 const a=game('scorpion');run(a,.04,{punch:true,block:true});run(a,.7,{block:true});assert.equal(actions(a).length,0);
 const b=game('ryu');run(b,.04,{punch:true,x:-1});run(b,.7,{x:-1});assert.equal(actions(b).length,1);
});
test('Up held repeats jumps; release stops new jumps',()=>{
 for(const id of ['scorpion','ryu']){const g=game(id);run(g,2.5,{up:true});assert(g.events.filter(e=>e.type==='jump'&&e.player===0).length>=2);run(g,1.4);assert(!g.players[0].airborne);}
});
test('SF Hadouken works on pressing or releasing punch in either facing',()=>{
 for(const facing of [1,-1])for(const release of [false,true]){
  const g=game('ryu');if(facing===-1){g.players[0].x=660;g.players[1].x=440;g.players[0].facing=-1;g.players[1].facing=1;}
  if(release){run(g,.03,{punch:true});run(g,.17,{punch:true});}
  cmd(g,[{down:true,punch:release},{down:true,x:facing,punch:release},{x:facing,punch:release},{x:facing,punch:!release}]);
  assert(actions(g).some(e=>e.move==='projectile'));
 }
});
test('SF does not create normal punches on release',()=>{
 const g=game('ryu');run(g,.04,{punch:true});run(g,.8);assert.equal(actions(g).length,1);
});
test('SF motion without diagonal and stale diagonal are rejected',()=>{
 for(const seq of [[{down:true},{x:1},{x:1,punch:true}], [{down:true},{down:true,x:1}]]){
  const g=game('ryu');cmd(g,seq);if(seq.length===2){run(g,.4,{down:true,x:1});cmd(g,[{x:1},{punch:true}]);}
  assert(!actions(g).some(e=>e.move==='projectile'));
 }
});
test('Native fine-window battery establishes diagonal expiry and mandatory diagonal',()=>{
 const d=JSON.parse(fs.readFileSync(path.join(H,'limites-01/original/ssf2tu/rep-1/trace.json')));
 const special=id=>d.cases.find(c=>c.id===id).samples.some(s=>s.after.state_raw[1]===12);
 assert(special('qcf_diagonal_07'));assert(!special('qcf_diagonal_08'));assert(!special('qcf_no_diagonal'));
});
test('Native MK teleport uses high punch; low punch stays normal',()=>{
 for(const button of ['punch','punch2']){const g=game('scorpion');cmd(g,[{down:true},{x:-1},{x:-1,[button]:true}]);assert.equal(actions(g).at(-1).move,button==='punch2'?'teleport':'punch');}
});
test('Both native input policies can register a third character without engine branches',()=>{
 const b={...bank,other:{...bank.ryu}},data={...W.FIGHT_DATA,characters:{...W.FIGHT_DATA.characters,other:W.FIGHT_DATA.characters.ryu}};
 const g=new W.FightArena(b,['other','scorpion'],data);g.phase='fight';cmd(g,[{down:true},{down:true,x:1},{x:1,punch:true}]);assert.equal(g.players[0].action.name,'projectile');
});
test('Pending jab repeat cannot survive a hit interruption or round reset',()=>{
 const g=game('scorpion');run(g,.01,{punch:true});run(g,.07);run(g,.01,{punch:true});assert(g.players[0].action.repeatName);
 g.players[0].action=null;g.players[0].stun=.4;run(g,.8);assert.equal(actions(g).length,1);g.reset();assert(g.players.every(p=>!p.action&&p.buffer.length===0));
});
fs.writeFileSync(path.join(P,'arena/verificacao-comandos.json'),JSON.stringify({status:'PASS',date:new Date().toISOString(),tests:passed.length,passed},null,2));
console.log(JSON.stringify({status:'PASS',tests:passed.length,passed},null,2));
