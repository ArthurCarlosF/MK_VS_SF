const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(root,'arena',f+'.js'),'utf8'),s);
const W=s.window,bank=W.ARENA_ASSETS.characters,passed=[];
function test(name,fn){fn();passed.push(name);}
function near(a,b){assert(Math.abs(a-b)<1e-8,`${a} != ${b}`);}
test('Eight ground actions match current native phase duration and pose pointers',()=>{
 for(const [name,c] of Object.entries(W.BASIC_CALIBRATION.characters))for(const action of Object.keys(c.moves)){
  const m=W.PHASE_CALIBRATION.characters[name].moves[action],applied=W.FIGHT_DATA.characters[name].moves[action],clip=bank[name].clips[action];
  near(applied.startup+applied.active+applied.recovery,m.sourceSamples/m.sampleRate);
  assert.equal(clip.frames.length,m.sourceSamples);assert(clip.frames.every(f=>!f.unmapped));
  clip.frames.forEach((f,i)=>assert.equal(f.native_pose_pointer,m.nativePoseTimeline[i]));
 }
});
test('Current Ryu ground attack rectangles match original ROM bytes on unpaused samples',()=>{
 const rom=fs.readFileSync(path.join(root,'engenharia-reversa/entradas/ssf2tu-68k-data-be.bin'));
 for(const name of Object.keys(W.BASIC_CALIBRATION.characters.ryu.moves)){
  const move=W.FIGHT_DATA.characters.ryu.moves[name],phase=W.PHASE_CALIBRATION.characters.ryu.moves[name];
  const source=JSON.parse(fs.readFileSync(path.join(root,phase.timing.source)));
  for(let i=0;i<move.attackTimeline.length;i++){
   const native=source.samples[phase.timing.keptSourceSamples[i]].after.players[0].boxes.find(b=>b.kind==='attack'),boxes=move.attackTimeline[i];
   assert.equal(boxes.length,native?1:0);
   if(native){const a=parseInt(native.address,16),h=rom.readInt8(a),rx=rom[a+2];
    near(boxes[0].x,(-h-rx)*1.25);near(boxes[0].y,(rom.readInt8(a+1)-rom[a+3])*1.25);
    near(boxes[0].w,rx*2*1.25);near(boxes[0].h,rom[a+3]*2*1.25);}
  }
 }
});
test('Damage and MK guarded loss retain native health scale',()=>{
 near(W.FIGHT_DATA.characters.scorpion.moves.punch.damage,8/166*100);
 near(W.FIGHT_DATA.characters.scorpion.moves.punch.chip,2/166*100);
 near(W.FIGHT_DATA.characters.ryu.moves.punch.damage,4/144*100);
 assert.equal(W.FIGHT_DATA.characters.ryu.moves.punch.chip,0);
});
test('New mirror fixture corrects standing Ryu LK to mid: both guards block',()=>{
 const H=path.join(root,'comparacao/passo-4/execucao-01/original/ssf2tu/rep-1');
 assert.equal(W.FIGHT_DATA.characters.ryu.moves.kick.level,'mid');
 for(const guard of ['high','low']){
  const c=JSON.parse(fs.readFileSync(path.join(H,'contact_lk_'+guard,'trace.json')));
  assert.equal(c.samples.at(-1).after.players[1].health,c.initial.players[1].health);
 }
});
test('Ryu uses three native vulnerability boxes in standing guard baseline',()=>{
 const g=new W.FightArena(bank);g.phase='fight';assert.equal(g.hurtBoxes(g.players[1]).length,3);
});
test('Calibrated Ryu jab recovers before Scorpion jab and does not leave hanging frames',()=>{
 const g=new W.FightArena(bank);g.phase='fight';g.players[0].x=375;g.players[1].x=725;
 g.step(1/240,[{punch:true},{punch:true}]);for(let i=0;i<60;i++)g.step(1/240);
 assert.equal(g.players[1].action,null);assert(g.players[0].action);
 for(let i=0;i<60;i++)g.step(1/240);assert.equal(g.players[0].action,null);
});
test('Ryu proximity guard stops retreat while an incoming nearby move starts',()=>{
 const g=new W.FightArena(bank);g.phase='fight';g.players[0].x=530;g.players[1].x=596.75;
 g.step(1/240,[{punch:true},{x:1}]);for(let i=0;i<30;i++)g.step(1/240,[{}, {x:1}]);
 near(g.players[1].x,596.75);assert.equal(g.players[1].state,'guard');
});
fs.writeFileSync(path.join(root,'arena/verificacao-calibracao.json'),JSON.stringify({status:'PASS',passed},null,2));
console.log(JSON.stringify({status:'PASS',tests:passed.length,passed},null,2));
