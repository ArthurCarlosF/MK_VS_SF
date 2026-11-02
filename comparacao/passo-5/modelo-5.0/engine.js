/* Pure simulation: seconds, native world units, and separate character clocks. */
(function (scope) {
  'use strict';
  const RULES = Object.freeze({width: 1100, viewport: 480, edge: 40,
    minimumDistance: 50, maximumDistance: 350, cameraMargin: 40, step: 1 / 240});
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  class MovementArena {
    constructor(bank, ids = ['scorpion', 'ryu']) {
      if (ids.length !== 2 || new Set(ids).size !== 2 || ids.some(id => !bank[id]))
        throw new Error('A arena atual requer Ryu e Scorpion.');
      this.bank = bank; this.ids = ids; this.reset();
    }
    reset() {
      this.players = this.ids.map((id, i) => ({id, x: i ? 660 : 440,
        facing: i ? -1 : 1, state: 'idle', frame: 0, motionTick: 0, clock: 0,
        blocked: false}));
      this.camera = 550; this.elapsed = 0;
    }
    step(dt, inputs = [0, 0]) {
      if (!(dt > 0 && dt <= .05)) throw new Error('Invalid simulation step');
      const old = this.players.map(p => p.x), next = [...old], attempted = [false, false];
      this.players.forEach((p, i) => {
        const dir = Math.sign(inputs[i] || 0);
        p.facing = i ? -1 : 1;
        const state = dir ? (dir === p.facing ? 'forward' : 'backward') : 'idle';
        if (p.state !== state) {
          p.state = state; p.frame = 0; p.motionTick = 0; p.clock = 0;
        }
        const c = this.bank[p.id], clip = c.clips[state];
        p.clock += dt;
        while (p.clock + 1e-10 >= 1 / c.fps) {
          p.clock -= 1 / c.fps;
          if (dir) {
            attempted[i] = true;
            next[i] += dir * clip.steps[p.motionTick % clip.steps.length];
          }
          p.motionTick++;
          p.frame = (p.frame + 1) % clip.frames.length;
        }
        next[i] = clamp(next[i], RULES.edge, RULES.width - RULES.edge);
      });
      // Resolve both players' proposals together; a stationary player is not
      // pushed and simultaneous approaches do not favor one update order.
      const delta = next.map((x, i) => x - old[i]);
      let gap = next[1] - next[0];
      if (gap < RULES.minimumDistance) {
        const a = Math.max(0, delta[0]), b = Math.max(0, -delta[1]);
        if (a + b > 0) {
          const correction = RULES.minimumDistance - gap;
          next[0] -= correction * a / (a + b);
          next[1] += correction * b / (a + b);
        }
      }
      gap = next[1] - next[0];
      if (gap > RULES.maximumDistance) {
        const a = Math.max(0, -delta[0]), b = Math.max(0, delta[1]);
        if (a + b > 0) {
          const correction = gap - RULES.maximumDistance;
          next[0] += correction * a / (a + b);
          next[1] -= correction * b / (a + b);
        }
      }
      this.players.forEach((p, i) => {
        if (p.state === 'idle') p.blocked = false;
        else if (attempted[i]) p.blocked = Math.abs(next[i] - old[i]) < 1e-8;
        p.x = next[i];
      });
      const half = RULES.viewport / 2, target = (next[0] + next[1]) / 2;
      const lo = Math.max(half, next[1] - half + RULES.cameraMargin);
      const hi = Math.min(RULES.width - half, next[0] + half - RULES.cameraMargin);
      this.camera = clamp(this.camera + (target - this.camera) * (1 - Math.exp(-8 * dt)), lo, hi);
      this.elapsed += dt;
    }
    snapshot() {
      return {players: this.players.map(p => ({...p})), camera: this.camera,
        distance: this.players[1].x - this.players[0].x, elapsed: this.elapsed};
    }
  }
  scope.MovementArena = MovementArena; scope.ARENA_RULES = RULES;
})(typeof window === 'undefined' ? globalThis : window);

/* Source-clock movement. Combat remains on its independent fixed 240 Hz step. */
(function(scope){
 'use strict';
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const M={
  profile(g,p){return g.bank[p.id].movement;},
  init(g,p){const m=M.profile(g,p);return {clock:1/(m?.sampleRate||60),queue:[],sample:0,walkTick:0,lastWalk:'',
    runEnergy:m?.run?.maximum||0,runRecovery:0,jumpAge:0,landing:0,lastInput:{}};},
  beginJump(g,p){
   const m=M.profile(g,p),u=p.input,relative=u.x*p.facing;
   p.airborne=true;p.jumpTime=0;p.jumpDirection=u.x;p.jumpKind=!u.x?'jump':relative>0?'jumpForward':'jumpBackward';
   if(relative>0&&m.jumps.jumpRunForward&&p.motion?.lastInput?.run&&p.motion.runEnergy>0)p.jumpKind='jumpRunForward';
   p.motion ||= M.init(g,p);p.motion.jumpAge=0;p.motion.jumpFacing=p.facing;
   p.motion.queue=[];p.motion.landing=0;p.motion.lastWalk='';
   p.vx=0;p.vy=0;g.state(p,p.jumpKind);g.emit('jump',{player:p.index,kind:p.jumpKind});
  },
  tick(g,p,dt){
   const m=M.profile(g,p);if(!m)return;
   p.motion ||= M.init(g,p);const t=p.motion;t.clock+=dt;
   while(t.clock+1e-9>=1/m.sampleRate){
    t.clock-=1/m.sampleRate;t.sample++;
    const u={x:p.input.x,down:p.input.down,up:p.input.up,run:p.input.run,block:p.input.block};
    t.queue.push(u);const input=t.queue.length>m.inputDelaySamples?t.queue.shift():{};
    const locked=p.action||p.stun>0||p.guardStun>0||p.knockdown>0||p.health<=0||g.tethers.some(z=>z.owner===p.index||z.target===p.index);
    let running=false;
    if(p.airborne&&t.contactFall){
     // An airborne MK contact pauses only its attacker, then drops vertically
     // with the native reset velocity. It is separate from the whiff jump curve.
     const fall=t.contactFall;fall.velocity+=fall.gravity;
     p.y=Math.max(0,p.y-fall.velocity);p.x+=fall.horizontal*(t.jumpFacing||p.facing);
     if(p.y<=0){
      const j=m.jumps[p.jumpKind]||m.jumps.jump;
      p.airborne=false;p.action=null;p.vx=0;p.vy=0;t.contactFall=null;
      t.jumpAge=j.landingSample;t.landing=Math.max(0,j.totalSamples-j.landingSample-1);
      g.state(p,p.jumpKind);p.frame=Math.min(j.landingSample,g.clip(p,p.jumpKind).frames.length-1);p.clock=0;
      g.emit('land',{player:p.index});
     }
    }else if(p.airborne&&!locked){
     const j=m.jumps[p.jumpKind]||m.jumps.jump,index=t.jumpAge++;
     const dx=j.deltas[Math.min(index,j.deltas.length-1)]||0;
     if(p.jumpKind==='jumpRunForward'&&index<2&&m.run){t.runEnergy=Math.max(0,t.runEnergy-1);t.runRecovery=m.run.recoveryDelaySamples;}
     // A backward curve contains signed negative deltas. Reflect the captured
     // right-facing curve as a unit; horizontal control cannot steer midair.
     p.x+=dx*t.jumpFacing;p.y=j.heights[index]||0;p.jumpTime=t.jumpAge/m.sampleRate;
     if(!p.action){g.state(p,p.jumpKind);p.frame=Math.min(index,g.clip(p,p.jumpKind).frames.length-1);p.clock=0;}
     if(index>=j.landingSample){
      p.y=0;p.airborne=false;p.vx=0;p.vy=0;t.landing=Math.max(0,j.totalSamples-index-1);
      g.emit('land',{player:p.index});g.resolvePositions();
     }
    }else if(p.airborne){
     // Air normals must continue the same trajectory while their own animation
     // and hitboxes remain independent of the movement clock.
     const j=m.jumps[p.jumpKind]||m.jumps.jump,index=t.jumpAge++;
     p.x+=(j.deltas[index]||0)*t.jumpFacing;p.y=j.heights[index]||0;
     if(index>=j.landingSample){p.y=0;p.airborne=false;p.action=null;t.landing=j.totalSamples-index-1;g.emit('land',{player:p.index});}
    }else if(t.landing>0){
     t.landing--;if(!p.action&&!locked){g.state(p,p.jumpKind);p.frame=Math.min((m.jumps[p.jumpKind]?.landingSample||0)+(m.jumps[p.jumpKind]?.totalSamples||0)-t.landing-(m.jumps[p.jumpKind]?.landingSample||0)-1,g.clip(p,p.jumpKind).frames.length-1);}
    }else if(!locked){
     const guard=(g.definition(p).guard==='button'&&input.block)||
      (g.definition(p).guard==='back'&&input.x===-p.facing&&
       ((g.players[1-p.index].action&&Math.abs(g.players[1-p.index].x-p.x)<150)||g.projectiles.some(q=>q.owner!==p.index&&Math.abs(q.x-p.x)<150)));
     if(input.x&&!input.down&&!guard){
      const kind=input.x===p.facing?'forward':'backward';
      running=!!(m.run&&input.run&&kind==='forward'&&t.runEnergy>0);
      const state=running?'run':kind;
      if(t.lastWalk!==state){t.lastWalk=state;t.walkTick=0;}
      const cadence=m.walk[kind],dx=running?m.run.speed:cadence[t.walkTick%cadence.length];t.walkTick++;
      p.x+=input.x*dx;g.state(p,state);
     }else t.lastWalk='';
    }else{t.lastWalk='';}
    if(m.run){
     if(running){t.runEnergy=Math.max(0,t.runEnergy-m.run.depletionPerSample);t.runRecovery=m.run.recoveryDelaySamples;}
     else if(!p.airborne&&!t.landing){
      if(t.runRecovery>0)t.runRecovery--;else t.runEnergy=Math.min(m.run.maximum,t.runEnergy+m.run.recoveryPerSample);
     }
    }
    t.lastInput=input;
   }
  },
  resolve(g){
   const old=g._positionBefore||g.players.map(p=>p.x),edge=scope.ARENA_RULES.edge,width=scope.ARENA_RULES.width;
   g.players.forEach(p=>p.x=clamp(p.x,edge,width-edge));
   const sorted=[...g.players].sort((a,b)=>a.x-b.x),[a,b]=sorted;
   const am=M.profile(g,a),bm=M.profile(g,b);
   const clearance=((am?.bodyClearanceHeight||38)+(bm?.bodyClearanceHeight||38))/2;
   if(Math.abs(a.y-b.y)<clearance){
    const minimum=(am?.pushHalfWidth||23)+(bm?.pushHalfWidth||23),gap=b.x-a.x;
    if(gap<minimum){
     const overlap=minimum-gap;
     // Walking into a stationary fighter pushes both, as observed in both
     // originals. Two opposing approaches share the correction symmetrically.
     a.x-=overlap/2;b.x+=overlap/2;
     if(a.x<edge){b.x+=edge-a.x;a.x=edge;}if(b.x>width-edge){a.x-=b.x-(width-edge);b.x=width-edge;}
    }
   }
   const max=((am?.maximumDistance||350)+(bm?.maximumDistance||350))/2;
   const gap=b.x-a.x;
   if(gap>max){
    const da=Math.max(0,old[a.index]-a.x),db=Math.max(0,b.x-old[b.index]),total=da+db;
    // At maximum separation, only the fighter attempting to move away is
    // stopped. The stationary fighter is never dragged toward the retreat.
    if(total>1e-8){a.x+=(gap-max)*da/total;b.x-=(gap-max)*db/total;}
    else{a.x+=(gap-max)/2;b.x-=(gap-max)/2;}
   }
   g.players.forEach(p=>{const q=g.players[1-p.index];if(!p.action&&!p.airborne&&Math.abs(q.x-p.x)>1)p.facing=q.x>p.x?1:-1;});
  },
  camera(g,dt){
   const [a,b]=[...g.players].sort((x,y)=>x.x-y.x),half=scope.ARENA_RULES.viewport/2;
   // A common dead zone retains the different source movement profiles while
   // giving both universes the same playable camera. No dependence on 240 Hz.
   const margin=50,lo=b.x-half+margin,hi=a.x+half-margin;
   const target=lo<=hi?clamp(g.camera,lo,hi):(a.x+b.x)/2;
   const maxStep=430*dt;g.camera=clamp(g.camera+clamp(target-g.camera,-maxStep,maxStep),half,scope.ARENA_RULES.width-half);
  }
 };
 scope.FightMovement=M;
})(typeof window==='undefined'?globalThis:window);
