/* Reusable deterministic combat simulation. No DOM or renderer dependency. */
(function(scope){
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const C=scope.FightCollision, Commands=scope.FightCommands;
  class FightArena {
    constructor(bank,ids=['scorpion','ryu'],data=scope.FIGHT_DATA){
      if(ids.length!==2||ids.some(id=>!bank[id]||!data.characters[id]))throw Error('Escolha lutadores disponÃƒÆ’Ã‚Â­veis.');
      this.bank=bank;this.ids=[...ids];this.data=data;this.rules=data.rules;
      this.mode='versus';this.reset();
    }
    createPlayer(id,i){return {id,index:i,x:i?660:440,y:0,vx:0,vy:0,facing:i?-1:1,
      state:'idle',frame:0,clock:0,motionTick:0,stateTime:0,airborne:false,jumpTime:0,
      jumpDirection:0,jumpKind:'jump',input:Commands.normalize(),previousInput:{},history:[],buffer:[],
      motionConsumedAt:-1,jumpPressed:false,action:null,stun:0,guardStun:0,knockdown:0,
      health:this.rules.health,meter:0,combo:0,comboTime:0,invulnerable:0,flash:0,blocked:false,localHitstop:0};}
    reset(){
      this.wins=[0,0];this.round=1;this.elapsed=0;this.serial=0;this.events=[];
      this.camera=550;this.startRound();
    }
    startRound(){
      this.players=this.ids.map((id,i)=>this.createPlayer(id,i));this.projectiles=[];this.effects=[];this.tethers=[];
      this.phase='intro';this.phaseTime=this.rules.introSeconds;this.timer=this.rules.roundSeconds;
      this.grapples=[];this.hitstop=0;this.roundWinner=null;this.result='';this.roundReason='';this.camera=550;
      this.emit('round',{round:this.round});
    }
    emit(type,detail={}){
      this.events.push({id:++this.serial,type,time:this.elapsed,...detail});
      if(this.events.length>100)this.events.splice(0,this.events.length-100);
    }
    definition(p){return this.data.characters[p.id];}
    clip(p,name){const c=this.bank[p.id];return c.clips[name]||c.clips.idle;}
    state(p,name){if(p.state!==name){p.state=name;p.frame=0;p.clock=0;p.stateTime=0;p.motionTick=0;}}
    animation(p,dt){
      const clip=this.clip(p,p.state);p.stateTime+=dt;p.clock+=dt;
      while(p.clock+1e-10>=1/this.bank[p.id].fps){
        p.clock-=1/this.bank[p.id].fps;p.motionTick++;
        p.frame=clip.loop===false?Math.min(clip.frames.length-1,p.frame+1):(p.frame+1)%clip.frames.length;
      }
    }
    canStart(p,name){
      const move=this.definition(p).moves[name];
      if(!move||p.health<=0||p.stun>0||p.guardStun>0||p.knockdown>0||this.tethers.some(t=>t.owner===p.index||t.target===p.index))return false;
      if(!!move.air!==p.airborne)return false;
      if(this.grapples?.some(t=>t.owner===p.index||t.target===p.index))return false;
      if(move.grapple){const other=this.players[1-p.index];
        if(other.airborne||other.stun>0||other.knockdown>0||other.invulnerable>0||
          Math.abs(other.x-p.x)>move.grapple.range)return false;
        if(move.grapple.escapeByBack&&other.input.x===-other.facing)return false;
      }
      if(move.kind==='projectile'&&this.projectiles.filter(q=>q.owner===p.index).length>=this.rules.maximumProjectiles)return false;
      if(p.action){
        const current=this.definition(p).moves[p.action.name];
        if(!p.action.connected||!current.cancel?.includes('special')||!['projectile','spear'].includes(name))return false;
      }
      return true;
    }
    startAction(p,name,repeat=false,skip=0){
      const previous=repeat?p.action:null;
      if(repeat){p.action=null;}
      if(!this.canStart(p,name))return false;
      p.action={name,time:0,hit:new Set(),spawned:false,connected:false};
      // A repeat can branch visually before the preceding strike checks contact.
      // Preserve that strike through its remaining active samples instead of
      // silently dropping the first/third/etc. hit of a rapid punch sequence.
      if(previous&&this.definition(p).moves[previous.name]?.repeat?.preserveStrike){
        const old=this.definition(p).moves[previous.name];
        if(previous.time<old.startup+old.active&&previous.hit.size===0)
          p.action.carriedStrike={name:previous.name,time:previous.time,hit:previous.hit};
      }
      p.buffer.shift();p.motionConsumedAt=this.elapsed;p.motionTick=0;
      this.state(p,this.definition(p).moves[name].clip);
      if(repeat){p.frame=Math.floor(skip*this.bank[p.id].fps);p.clock=0;p.stateTime=skip;p.motionTick=p.frame;p.action.time=skip;}
      this.emit('action',{player:p.index,move:name});return true;
    }
    requestAction(p,request){
      const def=this.definition(p),a=p.action,m=a&&def.moves[a.name],fps=this.bank[p.id].fps;
      if(a&&m.repeat?.family.includes(request.move)){
        const r=m.repeat,age=a.time*fps;
        if(r.mode==='alternate'){
          if(age<r.lastFrame+1e-6){
            a.repeatAt=Math.max(a.time,r.gateFrames/fps);a.repeatName=r.next;return true;
          }
          if(age>=r.lateFrame-fps/240-1e-6)return this.startAction(p,r.initial,true);
          return false;
        }
        if(age>=r.gateFrames-1e-6&&!a.repeatName){
          a.repeatAt=a.time+r.latencyFrames/fps;a.repeatName=r.next;a.repeatSkip=r.skipFrames/fps;return true;
        }
        return false;
      }
      if(a&&request.move===a.name&&m.lateRepeatFrames!==undefined&&
        a.time>=(m.startup+m.active+m.recovery)-(m.lateRepeatFrames||0)/fps-1/240-1e-8)
        return this.startAction(p,a.name,true);
      return this.startAction(p,request.move);
    }
    beginJump(p){
      if(this.bank[p.id].movement)return scope.FightMovement.beginJump(this,p);
      p.airborne=true;p.jumpTime=0;p.jumpDirection=p.input.x;p.jumpKind=p.input.x?'jumpForward':'jump';
      const jump=this.bank[p.id].jump?.[p.jumpKind];
      p.vx=p.input.x*(jump?.horizontalSpeed||180);
      p.vy=jump?.velocity||330;this.state(p,p.jumpKind);this.emit('jump',{player:p.index});
    }
    trajectory(p,dt){
      if(this.bank[p.id].movement)return;
      if(!p.airborne)return;
      p.jumpTime+=dt;
      const jump=this.bank[p.id].jump?.[p.jumpKind],heights=jump?.heights;
      if(heights){
        const f=p.jumpTime*this.bank[p.id].fps,i=Math.floor(f),mix=f-i;
        p.y=(heights[i]||0)*(1-mix)+(heights[i+1]||0)*mix;
        if(i>=heights.length-1)this.land(p);
      }else{
        p.vy-=950*dt;p.y+=p.vy*dt;if(p.y<=0&&p.vy<0)this.land(p);
      }
      p.x+=p.vx*dt;
    }
    land(p){
      p.y=0;p.airborne=false;p.vx=0;p.vy=0;p.action=null;p.stun=Math.max(p.stun,.045);
      this.state(p,'idle');this.emit('land',{player:p.index});
    }
    beginGrapple(p,move){
      const target=this.players[1-p.index];
      if(target.health<=0||target.airborne||target.knockdown>0||Math.abs(target.x-p.x)>move.grapple.range)return false;
      target.action=null;target.buffer=[];target.vx=0;target.vy=0;
      this.grapples.push({owner:p.index,target:target.index,move:p.action.name,
        originX:p.x,facing:p.facing,damageApplied:false});
      this.emit('grab',{player:p.index,target:target.index,move:p.action.name});return true;
    }
    updateGrapples(){
      const keep=[];
      for(const grab of this.grapples){
        const p=this.players[grab.owner],q=this.players[grab.target],move=this.definition(p).moves[grab.move];
        if(!p.action||p.action.name!==grab.move||p.health<=0||p.stun>0||this.phase!=='fight'){
          q.stun=Math.max(q.stun,.12);this.emit('grabCancelled',{player:p.index});continue;
        }
        const cfg=move.grapple,index=Math.floor(p.action.time*this.bank[p.id].fps+1e-8),row=cfg.timeline[Math.min(index,cfg.timeline.length-1)];
        const actorClip=this.clip(p,move.clip);
        // Native motion is mirrored as a unit around the attacker's initial
        // facing. At stage edges, clamp both roots while preserving continuity.
        p.x=clamp(grab.originX+row.ownerX*grab.facing,40,1060);p.y=row.ownerY;
        q.x=clamp(grab.originX+row.targetX*grab.facing,40,1060);q.y=row.targetY;
        p.facing=grab.facing*row.ownerFacing;q.facing=grab.facing*row.targetFacing;
        this.state(p,move.clip);p.frame=Math.min(index,actorClip.frames.length-1);p.clock=0;
        const victimClip=p.id===q.id?cfg.victimClip:this.definition(q).defaultVictimClip;
        this.state(q,victimClip||'knockdown');q.frame=Math.min(index,this.clip(q,q.state).frames.length-1);q.clock=0;
        q.buffer=[];q.action=null;q.vx=0;q.vy=0;q.airborne=false;
        if(index>=cfg.damageSample&&!grab.damageApplied){
          grab.damageApplied=true;q.health=Math.max(0,q.health-move.damage);q.flash=.1;
          p.combo=1;p.comboTime=1.1;this.emit('hit',{player:p.index,target:q.index,damage:move.damage,move:grab.move,combo:1});
        }
        if(index>=cfg.timeline.length-1){
          p.y=0;p.action=null;q.y=0;q.stun=.1;q.invulnerable=.2;
          this.state(p,'idle');this.state(q,'knockdown');this.emit('grabEnd',{player:p.index,target:q.index});
        }else keep.push(grab);
      }
      this.grapples=keep;
    }
    updatePlayer(p,dt){
      if(this.grapples?.some(t=>t.target===p.index))return;
      if(p.localHitstop>1e-9){p.localHitstop=Math.max(0,p.localHitstop-dt);p.buffer=[];return;}
      p.flash=Math.max(0,p.flash-dt);p.invulnerable=Math.max(0,p.invulnerable-dt);
      p.comboTime=Math.max(0,p.comboTime-dt);if(!p.comboTime)p.combo=0;
      const captured=this.tethers.find(t=>t.target===p.index);
      const reeling=this.tethers.find(t=>t.owner===p.index);
      if(captured){
        p.buffer=[];p.action=null;p.vx=0;p.vy=0;p.stun=Math.max(p.stun,.1);
        this.state(p,'impaled');this.animation(p,dt);return;
      }
      if(reeling&&p.health>0&&p.stun<=0&&p.knockdown<=0&&p.action?.name===reeling.move){
        p.buffer=[];p.vx=0;this.state(p,reeling.phase==='pull'?'reel':'special');
        this.animation(p,dt);return;
      }
      this.trajectory(p,dt);
      if(p.health<=0){this.state(p,'ko');this.animation(p,dt);return;}
      if(p.knockdown>0){
        p.knockdown=Math.max(0,p.knockdown-dt);this.state(p,'knockdown');
        if(!p.knockdown){p.invulnerable=.25;this.emit('getup',{player:p.index});}
      }else if(p.stun>0){p.stun=Math.max(0,p.stun-dt);this.state(p,'hit');}
      else if(p.guardStun>0){p.guardStun=Math.max(0,p.guardStun-dt);this.state(p,p.input.down?'crouchGuard':'guard');}
      else{
        if(!p.action&&!p.airborne&&p.jumpPressed&&!p.input.down&&!(p.motion?.landing>0)&&!(this.definition(p).guard==='button'&&p.input.block))this.beginJump(p);
        p.opponentDistance=Math.abs(this.players[1-p.index].x-p.x);
        const request=Commands.action(p,this.definition(p),this.elapsed);
        if(request){
          const move=this.definition(p).moves[request.move],other=this.players[1-p.index];
          if(move?.grapple?.escapeByBack&&other.input.x===-other.facing&&request.event?.button==='punch')
            request.move=this.definition(p).normalControls.punch.standing.far;
          this.requestAction(p,request);
        }
        p.buffer=[];
        if(p.action?.repeatName&&p.action.time+dt>=p.action.repeatAt-1e-8){
          const a=p.action;this.startAction(p,a.repeatName,true,a.repeatSkip||0);
        }
        if(p.action){
          const a=p.action,m=this.definition(p).moves[a.name];a.time+=dt;
          if(a.carriedStrike)a.carriedStrike.time+=dt;
          this.state(p,m.clip);
          if(m.grapple&&!a.grabbed&&a.time*this.bank[p.id].fps>=m.grapple.grabSample){this.beginGrapple(p,m);a.grabbed=true;}
          if(a.time>=m.startup&&!a.spawned){
            a.spawned=true;
            if(m.kind==='projectile')this.spawnProjectile(p,a.name);
            if(m.kind==='teleport')this.teleport(p);
          }
          // A tethered projectile must finish its flight before its throwing
          // pose can recover. Otherwise the animation's shorter timer cuts
          // the spear off before it can cross the full visible arena.
          const grappling=this.grapples.some(t=>t.owner===p.index);
          const ropeInFlight=this.projectiles.some(q=>q.owner===p.index&&q.name===a.name&&q.rope);
          const contactInAir=m.holdContactUntilLanding&&a.connected&&p.airborne;
          if(a.time>=m.startup+m.active+m.recovery&&!ropeInFlight&&!grappling&&!a.repeatName&&!contactInAir){p.action=null;this.state(p,p.airborne?p.jumpKind:p.input.down?'crouch':'idle');}
        }else if(p.airborne)this.state(p,p.jumpKind);
        else if(p.input.block&&this.definition(p).guard==='button')this.state(p,p.input.down?'crouchGuard':'guard');
        else if(this.definition(p).guard==='back'&&p.input.x===-p.facing&&
          ((this.players[1-p.index].action&&Math.abs(this.players[1-p.index].x-p.x)<150)||
           this.projectiles.some(q=>q.owner!==p.index&&Math.abs(q.x-p.x)<150))){
          this.state(p,p.input.down?'crouchGuard':'guard');
        }
        else if(p.input.down)this.state(p,'crouch');
        else if(p.input.x&&!this.bank[p.id].movement){
          this.state(p,p.input.x===p.facing?'forward':'backward');
          // Movement samples run at the source character's own video clock.
          const fps=this.bank[p.id].fps,steps=this.clip(p,p.state).steps;
          const before=Math.floor((p.stateTime+1e-9)*fps),after=Math.floor((p.stateTime+dt+1e-9)*fps);
          for(let j=before;j<after;j++)p.x+=p.input.x*steps[j%steps.length];
        }else if(!this.bank[p.id].movement||!p.motion?.lastInput?.x)this.state(p,'idle');
      }
      if(p.vx&&!p.airborne){p.x+=p.vx*dt;p.vx*=Math.exp(-12*dt);if(Math.abs(p.vx)<.1)p.vx=0;}
      if(this.bank[p.id].movement)scope.FightMovement.tick(this,p,dt);
      if(p.action||(!p.airborne&&!(p.motion?.landing>0)))this.animation(p,dt);
      if(p.action?.contactFrame!==undefined&&p.airborne){p.frame=p.action.contactFrame;p.clock=0;}
    }
    socket(p,name){
      const clip=this.clip(p,p.state),frame=clip.frames[Math.min(p.frame,clip.frames.length-1)];
      const point=frame.attachments?.[name];
      if(!point)return null;
      return {x:p.x+p.facing*(frame.sourceFacing||1)*(frame.x+point.x),
        y:p.y-frame.y-point.y};
    }
    spawnProjectile(p,name){
      const m=this.definition(p).moves[name],q=m.projectile;
      const hand=q.socket?this.socket(p,q.socket):null;
      this.projectiles.push({id:++this.serial,owner:p.index,name,x:hand?hand.x+p.facing*q.radius:p.x+p.facing*35,y:hand?hand.y:p.y+q.y,
        facing:p.facing,age:0,speed:q.speed,radius:q.radius,lifetime:q.lifetime,rope:!!q.rope});
      this.emit('projectile',{player:p.index,move:name});
    }
    teleport(p){
      const other=this.players[1-p.index],side=other.x>p.x?1:-1;
      p.x=clamp(other.x+side*68,40,1060);p.facing=other.x>p.x?1:-1;
      this.emit('teleport',{player:p.index});
    }
    updateTethers(dt){
      const keep=[];
      for(const t of this.tethers){
        const owner=this.players[t.owner],target=this.players[t.target];
        const interrupted=owner.health<=0||target.health<=0||owner.stun>0||owner.knockdown>0||owner.action?.name!==t.move||this.phase!=='fight';
        if(interrupted){
          target.stun=Math.max(target.stun,.12);this.emit('pullCancelled',{player:t.owner,target:t.target});continue;
        }
        t.elapsed+=dt;target.airborne=false;target.vx=0;target.vy=0;
        target.y=Math.max(0,target.y-220*dt);
        if(t.phase==='impale'&&t.elapsed>=t.hold){t.phase='pull';this.state(owner,'reel');this.emit('pullStart',{player:t.owner,target:t.target});}
        if(t.phase==='pull'){
          const destination=clamp(owner.x+t.direction*t.stopDistance,40,1060);
          const delta=destination-target.x,step=Math.min(Math.abs(delta),t.speed*dt);
          target.x+=Math.sign(delta)*step;
          if(Math.abs(delta)<=step+1e-7&&target.y<=0){
            target.stun=t.settleStun;owner.action=null;this.state(owner,'idle');
            this.state(target,'hit');target.airborne=false;target.y=0;
            this.emit('pullEnd',{player:t.owner,target:t.target});continue;
          }
        }
        keep.push(t);
      }
      this.tethers=keep;
    }
    resolvePositions(){
      if(this.grapples?.length)return;
      if(this.players.every(p=>this.bank[p.id].movement)){scope.FightMovement.resolve(this);return;}
      const edge=scope.ARENA_RULES.edge,width=scope.ARENA_RULES.width;
      this.players.forEach(p=>p.x=clamp(p.x,edge,width-edge));
      let [left,right]=[...this.players].sort((a,b)=>a.x-b.x);
      if(Math.abs(left.y-right.y)<60){
        const min=this.definition(left).body.halfWidth+this.definition(right).body.halfWidth;
        const gap=right.x-left.x;
        if(gap<min){
          const correction=min-gap;left.x-=correction/2;right.x+=correction/2;
          if(left.x<edge){right.x+=edge-left.x;left.x=edge;}
          if(right.x>width-edge){left.x-=right.x-(width-edge);right.x=width-edge;}
        }
      }
      const max=scope.ARENA_RULES.maximumDistance,gap=right.x-left.x;
      if(gap>max){const extra=(gap-max)/2;left.x+=extra;right.x-=extra;}
      this.players.forEach(p=>{
        const opponent=this.players[1-p.index];
        if(!p.action&&!p.airborne&&Math.abs(opponent.x-p.x)>1)p.facing=opponent.x>p.x?1:-1;
      });
      const half=scope.ARENA_RULES.viewport/2,margin=40,target=(left.x+right.x)/2;
      const lo=Math.max(half,right.x-half+margin),hi=Math.min(width-half,left.x+half-margin);
      this.camera=clamp(this.camera+(target-this.camera)*.033,lo,hi);
    }
    activeBox(p,action=p.action){
      if(!action)return null;const a=action,m=this.definition(p).moves[a.name];
      if(m.grapple)return null;
      const sample=Math.floor((a.time+1e-9)*(m.sampleRate||this.bank[p.id].fps));
      if(m.activeRanges&&!m.activeRanges.some(([first,end])=>sample>=first&&sample<end))return null;
      if(m.attackTimeline){
        const sample=Math.floor((a.time+1e-9)*m.sampleRate);
        const rect=m.attackTimeline[sample]?.[0];
        return rect?C.box(p,rect):null;
      }
      return m.box&&a.time>=m.startup&&a.time<m.startup+m.active?C.box(p,m.box):null;
    }
    hurtBoxes(p){
      const definition=this.definition(p);
      if(!p.airborne){
        const observed=p.action?definition.moves[p.action.name]?.calibration:null;
        let boxes=observed?.hurtTimeline?.[Math.floor((p.action.time+1e-9)*observed.sampleRate)];
        if(!boxes&&['idle','forward','backward','guard','crouch','crouchGuard'].includes(p.state))
          boxes=definition.passiveHurt?.[p.input.down?'crouch':'idle'];
        if(boxes?.length)return boxes.map(box=>C.box(p,box));
      }
      return [C.hurt(p,definition)];
    }
    hit(attacker,defender,move,source){
      if(defender.invulnerable>0||defender.health<=0)return false;
      const guarded=C.canGuard(defender,this.definition(defender),move);
      const chained=defender.stun>0||defender.knockdown>0;
      const damage=guarded?(move.chip||0):move.damage;
      defender.health=Math.max(0,defender.health-damage);defender.flash=.1;
      defender.buffer=[];defender.action=null;
      this.tethers=this.tethers.filter(t=>t.target!==defender.index);
      if(guarded)defender.guardStun=move.blockstun||.15;
      else{
        defender.stun=move.hitstun||.3;
        if(move.knockdown){defender.knockdown=.85;defender.stun=0;defender.invulnerable=.65;}
        attacker.combo=chained?attacker.combo+1:1;attacker.comboTime=1.1;
      }
      defender.vx=(defender.x>=attacker.x?1:-1)*(move.push||0)*(guarded?.45:1);
      if(!guarded&&move.pull&&defender.health>0){
        const config=move.pullMotion;
        defender.vx=0;defender.vy=0;this.state(defender,'impaled');
        this.tethers.push({owner:attacker.index,target:defender.index,move:source,
          phase:'impale',elapsed:0,direction:defender.x>=attacker.x?1:-1,...config});
      }
      attacker.meter=clamp(attacker.meter+(guarded?3:8),0,this.rules.meter);
      defender.meter=clamp(defender.meter+damage*.5,0,this.rules.meter);
      this.hitstop=Math.max(this.hitstop,(guarded?move.blockHitstop:move.hitstop)??move.hitstop??.05);
      const response=move.contactResponse;
      if(response&&attacker.airborne&&(!guarded||response.onBlock)){
        attacker.localHitstop=Math.max(attacker.localHitstop,response.ownerPauseSamples/this.bank[attacker.id].fps);
        if(attacker.motion)attacker.motion.contactFall={velocity:0,gravity:response.fallGravityPerSample,horizontal:response.horizontalSpeedPerSample};
        if(attacker.action)attacker.action.contactFrame=attacker.frame;
      }
      this.effects.push({x:defender.x,y:defender.y+55,age:0,guarded});
      this.emit(guarded?'block':'hit',{player:attacker.index,target:defender.index,damage,move:source,combo:attacker.combo});
      return true;
    }
    collisions(dt){
      const pending=[];
      for(const p of this.players){
        if(!p.action)continue;
        const action=p.action,opponent=this.players[1-p.index];
        for(const strike of [action.carriedStrike,action].filter(Boolean)){
          if(!(strike.hit instanceof Set))strike.hit=new Set(strike.hit);
          const box=this.activeBox(p,strike);
          if(box&&!strike.hit.has(opponent.index)&&this.hurtBoxes(opponent).some(hurt=>C.overlap(box,hurt))){
            const m=this.definition(p).moves[strike.name];
            if(m.kind==='throw'&&(opponent.airborne||opponent.stun>0||opponent.knockdown>0))continue;
            strike.hit.add(opponent.index);action.connected=true;
            pending.push({p,target:opponent,m,name:strike.name});
          }
        }
      }
      // Detect trades before applying either hit, eliminating update-order wins.
      for(const event of pending)this.hit(event.p,event.target,event.m,event.name);
      for(const q of this.projectiles){
        q.age+=dt;q.previousX=q.x;q.x+=q.facing*q.speed*dt;
      }
      const removed=new Set();
      for(let i=0;i<this.projectiles.length;i++)for(let j=i+1;j<this.projectiles.length;j++){
        const a=this.projectiles[i],b=this.projectiles[j];
        if(a.owner!==b.owner&&Math.abs(a.y-b.y)<a.radius+b.radius&&
          Math.abs(a.x-b.x)<=a.radius+b.radius){removed.add(a.id);removed.add(b.id);this.emit('projectileClash');}
      }
      for(const q of this.projectiles){
        if(removed.has(q.id))continue;
        const attacker=this.players[q.owner],target=this.players[1-q.owner],move=this.definition(attacker).moves[q.name];
        const box={left:Math.min(q.previousX,q.x)-q.radius,right:Math.max(q.previousX,q.x)+q.radius,
          bottom:q.y-q.radius,top:q.y+q.radius};
        if(this.hurtBoxes(target).some(hurt=>C.overlap(box,hurt))&&this.hit(attacker,target,move,q.name))removed.add(q.id);
      }
      this.projectiles=this.projectiles.filter(q=>!removed.has(q.id)&&q.age<q.lifetime&&q.x>0&&q.x<1100&&
        (!q.rope||this.players[q.owner].action?.name===q.name));
    }
    endRound(reason){
      if(this.phase!=='fight')return;
      const [a,b]=this.players;this.roundWinner=a.health===b.health?null:(a.health>b.health?0:1);
      if(this.roundWinner!==null)this.wins[this.roundWinner]++;
      this.phase='roundEnd';this.phaseTime=this.rules.betweenRounds;this.roundReason=reason;
      this.result=this.roundWinner===null?'EMPATE':this.bank[this.players[this.roundWinner].id].name.toUpperCase()+' VENCE';
      this.projectiles=[];this.tethers=[];this.grapples=[];this.emit('roundEnd',{winner:this.roundWinner,reason});
    }
    step(dt,inputs=[0,0]){
      if(!(dt>0&&dt<=.05))throw Error('Invalid simulation step');
      this.elapsed+=dt;
      this.players.forEach((p,i)=>{
        const frozen=p.frozenEdges||[];
        Commands.record(p,Commands.normalize(inputs[i]),this.elapsed,this.definition(p));
        p.buffer=[...frozen,...p.buffer];
        p.frozenEdges=this.hitstop>0?p.buffer.filter((e,j,list)=>list.findIndex(q=>q.button===e.button&&q.release===e.release)===j):[];
      });
      this.effects=this.effects.filter(e=>(e.age+=dt)<.18);
      if(this.phase==='intro'){
        this.phaseTime-=dt;this.players.forEach(p=>{p.buffer=[];this.animation(p,dt);});
        if(this.phaseTime<=0){this.phase='fight';this.emit('fight');}return;
      }
      if(this.phase==='roundEnd'){
        this.phaseTime-=dt;this.players.forEach(p=>{this.trajectory(p,dt);this.state(p,p.health<=0?'ko':'idle');this.animation(p,dt);});
        if(this.phaseTime<=0){
          if(this.wins.some(w=>w>=this.rules.roundsToWin)){this.phase='matchEnd';this.emit('matchEnd',{winner:this.roundWinner});}
          else {this.round++;this.startRound();}
        }return;
      }
      if(this.phase==='matchEnd')return;
      if(this.hitstop>1e-9){this.hitstop=Math.max(0,this.hitstop-dt);return;}
      if(this.mode!=='training')this.timer=Math.max(0,this.timer-dt);
      this._positionBefore=this.players.map(p=>p.x);
      this.players.forEach(p=>this.updatePlayer(p,dt));this.updateTethers(dt);this.updateGrapples();this.resolvePositions();this.collisions(dt);this.resolvePositions();
      if(this.players.every(p=>this.bank[p.id].movement))scope.FightMovement.camera(this,dt);
      if(this.mode==='training'){
        this.players.forEach(p=>{if(p.health<=0){p.health=this.rules.health;p.stun=0;p.knockdown=0;p.invulnerable=.3;}});
      }else if(this.players.some(p=>p.health<=0))this.endRound('ko');
      else if(this.timer<=0)this.endRound('time');
    }
    snapshot(){return {players:this.players.map(p=>({...p,action:p.action?{...p.action,hit:[...p.action.hit],carriedStrike:p.action.carriedStrike?{...p.action.carriedStrike,hit:[...p.action.carriedStrike.hit]}:null}:null})),
      camera:this.camera,distance:Math.abs(this.players[1].x-this.players[0].x),elapsed:this.elapsed,
      grapples:(this.grapples||[]).map(t=>({...t})),phase:this.phase,timer:this.timer,wins:[...this.wins],round:this.round,projectiles:this.projectiles.map(q=>({...q})),tethers:this.tethers.map(t=>({...t}))};}
  }
  scope.FightArena=FightArena;
})(typeof window==='undefined'?globalThis:window);
