const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),s={window:{}};vm.createContext(s);
for(const f of ['assets','engine','commands','collisions','calibration','combat-data','fight-engine'])vm.runInContext(fs.readFileSync(path.join(root,'arena',f+'.js'),'utf8'),s);
const W=s.window,bank=W.ARENA_ASSETS.characters,passed=[];
const move=(id,name)=>W.FIGHT_DATA.characters[id].moves[name];
const hpAfter=(id,name,guarded=false)=>100-(guarded?move(id,name).chip||0:move(id,name).damage);
const near=(actual,expected)=>assert(Math.abs(actual-expected)<1e-8,actual+' != '+expected);
const test=(name,f)=>{f();passed.push(name);};
const run=(g,sec,inputs=[{},{}])=>{for(let i=0;i<Math.round(sec*240);i++)g.step(1/240,typeof inputs==='function'?inputs(i):inputs);};
const game=(ids)=>{let g=new W.FightArena(bank,ids);g.phase='fight';return g;};
const close=g=>{g.players[0].x=530;g.players[1].x=596.75;};
const press=(g,i,button,other={})=>{let inputs=[{},{}];inputs[i]={[button]:true};inputs[1-i]=other;g.step(1/240,inputs);};
test('Intro prohibits damage; transitions into fight',()=>{let g=new W.FightArena(bank);close(g);run(g,1,[{punch:true},{}]);assert.equal(g.players[1].health,100);assert.equal(g.phase,'intro');run(g,.2);assert.equal(g.phase,'fight');});
test('Each fighter keeps a separate animation clock',()=>{let g=game();run(g,1);assert.equal(g.players[0].motionTick,53);assert.equal(g.players[1].motionTick,59);});
test('Standing punch hits once per press, not every active tick',()=>{let g=game();close(g);run(g,1,[{punch:true},{}]);near(g.players[1].health,hpAfter('scorpion','punch'));assert.equal(g.events.filter(e=>e.type==='hit').length,1);});
test('Whiff does not damage opponent',()=>{let g=game();press(g,0,'kick');run(g,1);assert.equal(g.players[1].health,100);});
test('Ryu blocks by holding back; block button alone does not block',()=>{
 for(const [input,hp] of [[{x:1},hpAfter('scorpion','punch',true)],[{block:true},hpAfter('scorpion','punch')]]){let g=game();close(g);press(g,0,'punch',input);run(g,.5,[{},input]);near(g.players[1].health,hp);}
});
test('Scorpion requires block button; walking back alone takes damage',()=>{
 for(const [input,hp] of [[{block:true},100],[{},hpAfter('ryu','punch')]]){let g=game();close(g);press(g,1,'punch',input);run(g,.5,[input,{}]);near(g.players[0].health,hp);}
});
test('Low attack defeats standing guard; crouching back blocks it',()=>{
 for(const [input,hp] of [[{x:1},hpAfter('scorpion','crouchKick')],[{x:1,down:true},hpAfter('scorpion','crouchKick',true)]]){let g=game();close(g);g.step(1/240,[{down:true,kick:true},input]);run(g,.6,[{},input]);near(g.players[1].health,hp);}
});
test('Overhead requires standing guard',()=>{let g=game(),p=g.players[1],m={level:'overhead',kind:'strike'};p.input={x:1,down:true};assert.equal(W.FightCollision.canGuard(p,g.definition(p),m),false);p.input.down=false;assert.equal(W.FightCollision.canGuard(p,g.definition(p),m),true);});
test('Crouch hurtbox is shorter and air hurtbox follows vertical position',()=>{let g=game(),p=g.players[0];let h=W.FightCollision.hurt(p,g.definition(p));p.input.down=true;assert(W.FightCollision.hurt(p,g.definition(p)).top<h.top);p.airborne=true;p.y=50;assert.equal(W.FightCollision.hurt(p,g.definition(p)).bottom,50);});
test('Held up repeats jumps after landing, as observed in both originals',()=>{
 for(let i=0;i<2;i++){let g=game();let inputs=[{},{}];inputs[i]={up:true};run(g,.25,inputs);assert(g.players[i].y>30);run(g,1,inputs);assert(g.events.filter(e=>e.type==='jump'&&e.player===i).length>=2);run(g,1);assert.equal(g.players[i].y,0);assert.equal(g.players[i].airborne,false);}
});
test('Directional jump crosses the opponent and changes facing on landing',()=>{let g=game();close(g);g.step(1/240,[{up:true,x:1},{}]);run(g,1);assert(g.players[0].x>g.players[1].x);assert.equal(g.players[0].facing,-1);});
test('Air and crouch inputs choose their distinct attack data',()=>{let g=game();g.step(1/240,[{down:true,kick:true},{}]);assert.equal(g.players[0].action.name,'crouchKick');g=game();g.step(1/240,[{}, {up:true}]);run(g,.15);press(g,1,'punch');assert.equal(g.players[1].action.name,'airPunch');});
test('Hitstun prevents actions until recovery',()=>{let g=game();close(g);press(g,0,'punch');run(g,.24);assert(g.players[1].stun>0);press(g,1,'kick');assert.equal(g.players[1].action,null);run(g,.8);assert.equal(g.players[1].stun,0);});
test('Simultaneous active hits trade without player order advantage',()=>{let g=game();close(g);g.startAction(g.players[0],'punch');g.startAction(g.players[1],'punch');g.players.forEach(p=>{p.action.time=move(p.id,'punch').startup;});run(g,.03);near(g.players[0].health,hpAfter('ryu','punch'));near(g.players[1].health,hpAfter('scorpion','punch'));});
test('Native MK throw bypasses button guard, damages once and releases after its curve',()=>{let g=game();g.players[0].x=530;g.players[1].x=586;press(g,0,'throw',{block:true});run(g,2.1,[{}, {block:true}]);near(g.players[1].health,100-move('scorpion','throw').damage);assert.equal(g.grapples.length,0);assert(g.events.some(e=>e.type==='grabEnd'));});
test('Distant throw misses',()=>{let g=game();press(g,0,'throw');run(g,1);assert.equal(g.players[1].health,100);});
test('Projectile appears then damages; one instance per owner',()=>{let g=game(['ryu','scorpion']);press(g,0,'special');run(g,.4);assert.equal(g.projectiles.length,1);assert.equal(g.startAction(g.players[0],'projectile'),false);run(g,1.4);assert.equal(g.players[1].health,87);});
test('Projectile blocking applies chip without full damage',()=>{let g=game(['ryu','scorpion']);press(g,0,'special',{block:true});run(g,1.5,[{}, {block:true}]);assert.equal(g.players[1].health,99);});
test('Opposing projectiles cancel each other',()=>{let g=game();g.startAction(g.players[0],'spear');g.startAction(g.players[1],'projectile');g.spawnProjectile(g.players[0],'spear');g.spawnProjectile(g.players[1],'projectile');g.players.forEach(p=>p.action.spawned=true);g.projectiles.forEach(q=>q.y=70);run(g,.6);assert(g.events.some(e=>e.type==='projectileClash'));assert(g.players.every(p=>p.health===100));});
test('Spear originates at the animated hand in both directions',()=>{
 for(const ids of [['scorpion','ryu'],['ryu','scorpion']]){
  let g=game(ids),i=ids.indexOf('scorpion');press(g,i,'special');run(g,.25);
  const p=g.players[i],hand=g.socket(p,'spear'),q=g.projectiles[0];
  assert(hand&&q);assert.equal(hand.y,p.y+105);assert.equal(q.y,hand.y);
  assert((q.x-hand.x)*p.facing>=8);assert((hand.x-p.x)*p.facing>60);
 }
});
test('Rope disappears when the spear action is interrupted',()=>{
 let g=game();press(g,0,'special');run(g,.3);assert(g.projectiles.some(q=>q.rope));
 g.players[0].action=null;g.players[0].stun=.3;g.step(1/240);assert(!g.projectiles.some(q=>q.rope));
});
test('Spear pulls on hit',()=>{let g=game();press(g,0,'special');run(g,1.7);assert.equal(g.players[1].health,91);assert(Math.abs(g.snapshot().distance-65)<.01);assert.equal(g.tethers.length,0);});
test('Spear hold, continuous fast pull and recovery work facing both ways',()=>{
 for(const ids of [['scorpion','ryu'],['ryu','scorpion']]){
  let g=game(ids),i=ids.indexOf('scorpion'),target=g.players[1-i];press(g,i,'special');
  let previous=target.x,hitSeen=false,holdSeen=false,pullSeen=false,steps=[];
  for(let j=0;j<650;j++){
   g.step(1/240,[{},{}]);const delta=Math.abs(target.x-previous);
   assert(delta<=8*53.20494842529297/240+1e-5,'No single-tick teleport');
   if(g.tethers.length){hitSeen=true;const t=g.tethers[0];
    assert.equal(target.state,'impaled');assert.equal(target.action,null);
    if(t.phase==='impale'){holdSeen=true;assert(delta<1e-7);}
    if(t.phase==='pull'&&delta>0){pullSeen=true;steps.push(delta);}
   }
   previous=target.x;
  }
  assert(hitSeen&&holdSeen&&pullSeen);assert(steps.length>20);
  assert(g.events.some(e=>e.type==='pullEnd'));assert.equal(g.tethers.length,0);
  assert(Math.abs(g.snapshot().distance-65)<.01);
 }
});
test('Guarded spear never restrains or pulls',()=>{let g=game();press(g,0,'special',{x:1});run(g,1.5,[{}, {x:1}]);assert(!g.events.some(e=>e.type==='pullStart'));assert.equal(g.tethers.length,0);assert.equal(g.players[1].health,100);});
test('Interrupting Scorpion releases victim and removes tether',()=>{
 let g=game();press(g,0,'special');while(!g.tethers.length)g.step(1/240);g.hitstop=0;
 g.players[0].stun=.3;g.players[0].action=null;g.step(1/240);assert.equal(g.tethers.length,0);
 assert(g.events.some(e=>e.type==='pullCancelled'));run(g,.8);assert.equal(g.players[1].stun,0);
});
test('Round reset clears spear restraints',()=>{let g=game();press(g,0,'special');while(!g.tethers.length)g.step(1/240);g.reset();assert.equal(g.tethers.length,0);assert(g.players.every(p=>p.state==='idle'));});
test('Spear reaches maximum arena separation in either direction',()=>{
 for(const ids of [['scorpion','ryu'],['ryu','scorpion']]){
  let g=game(ids),i=ids.indexOf('scorpion');g.players[0].x=375;g.players[1].x=725;
  assert.equal(g.snapshot().distance,350);press(g,i,'special');run(g,2.8);
  assert.equal(g.players[1-i].health,91);assert(g.events.some(e=>e.type==='pullEnd'));
  assert(Math.abs(g.snapshot().distance-65)<.01);
 }
});
test('Full-range miss expires and releases Scorpion instead of locking forever',()=>{
 let g=game();g.players[0].x=375;g.players[1].x=725;press(g,0,'special',{down:true});
 run(g,2.2,[{}, {down:true}]);assert.equal(g.players[1].health,100);
 assert.equal(g.projectiles.length,0);assert.equal(g.players[0].action,null);assert.equal(g.tethers.length,0);
});
test('Spear still cancels if Scorpion is interrupted during extended flight',()=>{
 let g=game();g.players[0].x=375;g.players[1].x=725;press(g,0,'special');run(g,.94);
 assert(g.projectiles.some(q=>q.rope));assert(g.players[0].action);
 g.players[0].action=null;g.players[0].stun=.3;g.step(1/240);run(g,1.5);
 assert.equal(g.players[1].health,100);assert.equal(g.projectiles.length,0);
});
test('Teleport changes sides and orientation',()=>{let g=game();press(g,0,'teleport');run(g,.25);assert(g.players[0].x>g.players[1].x);assert.equal(g.players[0].facing,-1);});
test('Hadouken directional command works facing right and left',()=>{
 for(const ids of [['ryu','scorpion'],['scorpion','ryu']]){let g=game(ids),i=ids.indexOf('ryu'),f=g.players[i].facing;let ins=[{},{}];
  for(const input of [{down:true},{down:true,x:f},{x:f,punch:true}]){ins[i]=input;run(g,.025,ins);}
  assert.equal(g.players[i].action.name,'projectile');}
});
test('Double-back spear and down-back teleport commands are distinct',()=>{
 for(const [seq,name] of [[[-1,0,-1],'spear'],[[0,-1],'teleport']]){let g=game();
  if(name==='teleport')run(g,.03,[{down:true},{}]);
  else for(const x of seq.slice(0,-1))run(g,.03,[{x},{}]);
  g.step(1/240,[{x:-1,punch:name==='spear',punch2:name==='teleport'},{}]);assert.equal(g.players[0].action.name,name);}
});
test('Failed normal during recovery is discarded rather than queued for a later attack',()=>{
 let g=game();press(g,0,'punch');run(g,.32);press(g,0,'kick');run(g,.12);assert.equal(g.players[0].action,null);
 g=game();press(g,0,'punch');run(g,.02);press(g,0,'kick');run(g,.6);assert.equal(g.players[0].action,null);
});
test('Connected punch can cancel into special',()=>{let g=game();close(g);press(g,0,'punch');run(g,.24);assert(g.players[0].action.connected);press(g,0,'special');run(g,.09);assert.equal(g.players[0].action.name,'spear');});
test('KO awards round then advances; two wins end match',()=>{let g=game();close(g);g.players[1].health=move('scorpion','punch').damage;press(g,0,'punch');run(g,.4);assert.equal(g.phase,'roundEnd');assert.equal(g.wins[0],1);run(g,3);assert.equal(g.round,2);run(g,1.3);close(g);g.players[1].health=move('scorpion','punch').damage;press(g,0,'punch');run(g,.4);run(g,3);assert.equal(g.phase,'matchEnd');assert.equal(g.wins[0],2);g.reset();assert.equal(g.wins[0],0);assert.equal(g.phase,'intro');});
test('Timeout and double KO produce explicit result',()=>{let g=game();g.timer=.001;g.step(1/240);assert.equal(g.phase,'roundEnd');assert.equal(g.roundWinner,null);g=game();close(g);g.players[0].health=move('ryu','punch').damage;g.players[1].health=move('scorpion','punch').damage;g.startAction(g.players[0],'punch');g.startAction(g.players[1],'punch');g.players.forEach(p=>{p.action.time=move(p.id,'punch').startup;});run(g,.03);assert.equal(g.phase,'roundEnd');assert.equal(g.roundWinner,null);});
test('Training has no timer loss and restores KO health',()=>{let g=game();g.mode='training';close(g);g.players[1].health=move('scorpion','punch').damage;press(g,0,'punch');run(g,.4);assert.equal(g.players[1].health,100);assert.equal(g.timer,99);assert.equal(g.phase,'fight');});
test('Seeded mixed combat stays finite and inside arena',()=>{let g=game();g.mode='training';let seed=38231;const rnd=()=>{seed=(1664525*seed+1013904223)>>>0;return seed;};let inputs=[{},{}];
 for(let i=0;i<48000;i++){if(i%35===0)inputs=[0,1].map(()=>({x:rnd()%3-1,up:rnd()%9===0,down:rnd()%5===0,punch:rnd()%3===0,kick:rnd()%4===0,special:rnd()%8===0,block:rnd()%6===0,throw:rnd()%8===0}));g.step(1/240,inputs);
  for(const p of g.players){assert(Number.isFinite(p.x)&&Number.isFinite(p.y));assert(p.x>=40-1e-6&&p.x<=1060+1e-6);assert(p.health>=0&&p.health<=100);assert(p.y>=-1e-6);}
  assert(g.snapshot().distance<=350+1e-6);assert(g.projectiles.length<=2);}
});
test('Character registration reuses engine without Ryu/Scorpion branches',()=>{let b={...bank,test:{...bank.ryu,name:'Test'}},d={...W.FIGHT_DATA,characters:{...W.FIGHT_DATA.characters,test:W.FIGHT_DATA.characters.ryu}};let g=new W.FightArena(b,['test','scorpion'],d);g.phase='fight';close(g);press(g,0,'punch');run(g,.4);near(g.players[1].health,hpAfter('ryu','punch'));});
fs.writeFileSync(path.join(root,'arena','verificacao-combate.json'),JSON.stringify({status:'PASS',date:new Date().toISOString(),passed},null,2));
console.log(JSON.stringify({status:'PASS',tests:passed.length,passed},null,2));
