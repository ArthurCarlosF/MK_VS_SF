/* Experimental match formats. Does not overwrite the sealed native calibration. */
(function(scope){
  'use strict';
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const CAR_BREAK_POINTS=[500,500,500,1000,1000,1000,1000,1000,1000,2000,2000,3000,3000,3000,3000];
  const Base=scope.FightArena;
  class ExpandedArena extends Base{
    startRound(){
      super.startRound();
      const stage=scope.NATIVE_STAGE_DATA?.stages.find(s=>s.id===this.options.stage&&s.selectable);
      this.stageId=stage?.id||'practice';this.nativeStageId=stage?.nativeStageId??null;this.stageTimeStart=this.elapsed;
      if(this.mode==='bonus'){
        this.timer=40;
        this.bonus={x:550,parts:[120,120,100],maximum:[120,120,100],score:0,scores:this.ids.map(()=>0),damage:0};
        if(scope.NativeCarRules){
          const b=this.bonus;b.nativeSeed=(this.options.bonusSeed??0x0bd11d)^this.round;b.nativeClock=0;b.nativeRuptures=0;
          b.native=scope.NativeCarRules.create(()=>this.carNibble());
          this.stageId='bonus-car';this.nativeStageId=16;
        }
        this.players.forEach((p,i)=>{const side=i%2?-1:1;p.x=550+side*Math.min(this.bonus.native?218:450,155+Math.floor(i/2)*52);p.facing=-side;});
        if(this.bonus.native){
          this.carMargins=this.players.map(p=>{
            const b=this.bank[p.id],scale=b.universe==='sf'?1.25:1;
            return Math.min(86,Math.max(22,...b.clips.idle.frames.map(f=>scale*Math.max(Math.abs(f.x),Math.abs(f.x+b.assets[f.asset].width))+3)));
          });
          this.players.forEach(p=>{const margin=this.carMargins[p.index];p.x=clamp(p.x,310+margin,790-margin);});
        }
      }else this.bonus=null;
    }
    carNibble(){
      const b=this.bonus;let n=b.nativeSeed||1;n^=n<<13;n^=n>>>17;n^=n<<5;b.nativeSeed=n>>>0;return n&15;
    }
    carBoxes(){
      const b=this.bonus;
      if(!b.native)return [{left:b.x-94,right:b.x+94,bottom:8,top:100}];
      const scale=1.25;
      return scope.NativeCarRules.hitboxes(b.native).map(r=>({group:r.group,left:b.x+(r.x-r.radiusX)*scale,right:b.x+(r.x+r.radiusX)*scale,bottom:(11+r.y-r.radiusY)*scale,top:(11+r.y+r.radiusY)*scale}));
    }
    carHitbox(attack){return attack&&this.carBoxes().find(box=>scope.FightCollision.overlap(attack,box));}
    hitCar(p,move,source,contact){
      if(!this.bonus||this.phase!=='fight')return false;
      const b=this.bonus;
      if(b.native){
        // Use the native descriptor where one was recorded. Other attacks
        // enter through a deliberately shared crossover conversion.
        const exact=Number.isInteger(move.bonusAttackByte8);
        const attackByte=exact?move.bonusAttackByte8:clamp(Math.round((move.damage||1)/8)-1,0,5);
        const result=scope.NativeCarRules.hit(b.native,contact.group,attackByte);
        if(!result.accepted)return false;
        if(result.underflow)b.nativeRuptures=Math.min(14,b.nativeRuptures+1);
        const points=result.underflow?CAR_BREAK_POINTS[b.nativeRuptures]:100;b.scores[p.index]+=points;b.score+=points;b.damage+=Math.max(0,result.amount);
        if(p.action&&!move.detachedContact){p.action.connected=true;p.action.contactResult='hit';p.action.contactAge=p.action.time*this.bank[p.id].fps;p.action.contactWall=this.elapsed;}
        this.effects.push({x:contact.x,y:contact.y,age:0,guarded:false});
        this.emit('objectHit',{player:p.index,object:'car',part:contact.group,damage:result.amount,points,rupture:result.underflow,move:source,forceSource:exact?'sf-attack-descriptor':'crossover-conversion'});
        return true;
      }
      // An object has no human reaction, guard, tether or throw animation.
      // Damage can cross into another panel once the nearest panel is destroyed.
      const first=contact.y>=65?2:p.x<b.x?0:1;
      const part=[first,...[0,1,2].filter(i=>i!==first)].find(i=>b.parts[i]>0);
      if(part===undefined)return false;
      const damage=Math.min(b.parts[part],Math.max(1,move.damage||1));
      b.parts[part]-=damage;b.damage+=damage;const score=Math.round(b.damage*100);
      b.scores[p.index]+=score-b.score;b.score=score;
      if(p.action&&!move.detachedContact){p.action.connected=true;p.action.contactResult='hit';p.action.contactAge=p.action.time*this.bank[p.id].fps;p.action.contactWall=this.elapsed;}
      this.effects.push({x:contact.x,y:contact.y,age:0,guarded:false});
      this.emit('objectHit',{player:p.index,object:'car',part,damage,move:source});
      if(!b.parts[part])this.emit('objectPartDestroyed',{player:p.index,part});
      return true;
    }
    enemies(p){return this.mode==='bonus'?[]:super.enemies(p);}
    hit(attacker,defender,move,source){
      if(this.players.length===2)return super.hit(attacker,defender,move,source);
      const old=this.hitstop,result=super.hit(attacker,defender,move,source),pause=this.hitstop;
      this.hitstop=old;
      if(result){
        attacker.localHitstop=Math.max(attacker.localHitstop,pause);
        // Native victim timelines already contain their own pause samples.
        if(!defender.reaction)defender.localHitstop=Math.max(defender.localHitstop,pause);
      }
      return result;
    }
    collisions(dt){
      if(this._freezing)return;
      if(this.mode!=='bonus'){super.collisions(dt);return;}
      const b=this.bonus;
      for(const p of this.players){
        if(!p.action)continue;
        for(const strike of [p.action.carriedStrike,p.action].filter(Boolean)){
          const m=this.definition(p).moves[strike.name],active=this.activeBox(p,strike);
          const sample=Math.floor((strike.time+1e-9)*(m.sampleRate||this.bank[p.id].fps));
          const group=m.contactGroupTimeline?.[sample]||1,key='car:'+group;
          const box=this.carHitbox(active);
          if(box&&!strike.hit.has(key)){
            const move=m.contactGroups?.[group]?{...m,...m.contactGroups[group]}:m;
            const force=m.bonusAttackByte8Timeline?.[sample];
            const contact=Number.isInteger(force)?{...move,bonusAttackByte8:force}:move;
            if(this.hitCar(p,contact,strike.name,{group:box.group,x:clamp(p.x+p.facing*60,box.left,box.right),y:(active.top+active.bottom)/2}))strike.hit.add(key);
          }
        }
      }
      this.projectiles=this.projectiles.filter(q=>{
        this.advanceProjectile(q,dt);const swept=this.projectileBox(q);
        if(q.contactPause>1e-9)return true;
        const box=this.carHitbox(swept);
        if(box){
          const base=this.definition(this.players[q.owner]).moves[q.name],cfg=base.projectile;
          const move=cfg.contacts?.[q.contacts||0]?{...base,...cfg.contacts[q.contacts||0]}:base;
          if(this.hitCar(this.players[q.owner],move,q.name,{group:box.group,x:clamp(q.x,box.left,box.right),y:q.y})){
            q.contacts=(q.contacts||0)+1;q.contactPause=cfg.contactPauseSeconds||0;
            return q.contacts<(cfg.maxContacts||1);
          }
        }
        return q.age<q.lifetime&&q.x>0&&q.x<1100&&(!q.rope||this.players[q.owner].action?.name===q.name);
      });
    }
    resolveCrowd(){
      super.resolveCrowd();
      if(!this.bonus)return;
      // Low car chassis is solid; a jump can cross it. No pulling or teleporting the prop.
      this.players.forEach(p=>{if(p.y<90&&Math.abs(p.x-this.bonus.x)<118)p.x=this.bonus.x+(p.x<this.bonus.x?-118:118);if(this.bonus.native){const margin=this.carMargins[p.index];p.x=clamp(p.x,310+margin,790-margin);}});
      this.camera=550;
    }
    step(dt,inputs){
      const bonus=this.mode==='bonus';
      super.step(dt,inputs);
      if(bonus&&this.phase==='fight'){
        const b=this.bonus;
        if(b.native){
          this.cameraY=0;
          b.nativeClock+=dt;
          while(b.nativeClock+1e-9>=1/59.6333313){
            b.nativeClock-=1/59.6333313;const frame=b.native.frame;
            scope.NativeCarRules.tick(b.native,()=>this.carNibble());
            if(b.native.frame!==frame)this.emit('objectDamageStage',{object:'car',frame:b.native.frame});
          }
        }
        const success=b.native?b.native.completed:b.parts.every(v=>v<=0);
        if(success||this.timer<=0){
          this.phase='matchEnd';this.result=(success?'CARRO DESTRUÍDO':'TEMPO ESGOTADO')+' · '+this.bonus.score+' PONTOS';
          this.projectiles=[];this.tethers=[];this.grapples=[];
          this.emit('bonusEnd',{success,score:this.bonus.score,scores:[...this.bonus.scores]});
        }
      }
    }
    snapshot(){return {...super.snapshot(),teams:[...this.teams],mode:this.mode,stageId:this.stageId,nativeStageId:this.nativeStageId,stageTimeStart:this.stageTimeStart,bonus:this.bonus?JSON.parse(JSON.stringify(this.bonus)):null};}
  }
  // Install only on the expansion page. The original arena remains independent.
  scope.FightArena=ExpandedArena;
  scope.FightSession={
    parse(params){
      const list=params.get('players');
      const ids=list?list.split(','):[params.get('p1')||'scorpion',params.get('p2')||'ryu'];
      if(ids.length<2||ids.length>16||ids.some(id=>!scope.FIGHT_DATA.characters[id]))throw Error('Participantes indisponíveis.');
      const cpu=(params.get('cpu')||'').split(',').filter(Boolean).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<ids.length);
      const mode=['versus','training','bonus'].includes(params.get('mode'))?params.get('mode'):'versus';
      const requested=params.get('stage')||'sf-ryu',stage=requested==='practice'?'practice':scope.NATIVE_STAGE_DATA?.stages.find(s=>s.id===requested&&s.selectable)?.id||'practice';
      return {ids,cpu,options:{mode,stage}};
    },
    label(g){return g.mode==='bonus'?'Destrua o carro · '+g.players.length+' participantes':(g.mode==='training'?'Treino livre':'Todos contra todos')+' · '+g.players.length+' jogadores';},
    bot(g,p){
      if(g.phase!=='fight'||p.health<=0)return {};
      const target=g.opponent(p),dx=target.x-p.x,t=Math.floor(g.elapsed*12)+p.index*3;
      const dist=Math.abs(dx),near=g.mode==='bonus'?165:66;
      if(dist>near)return {x:Math.sign(dx),run:dist>220,punch:t%20===0,special:t%37===0};
      return {x:dist<near-18?-Math.sign(dx):0,punch:t%7===0,kick:t%11===0,punch2:t%13===0,down:t%29===0,block:!!target.action&&t%5<2};
    },
    drawBonus(ctx,g,left,scale,floor){
      if(!g.bonus)return;
      if(g.bonus.native&&scope.NativeCarArt?.draw(ctx,g.bonus,left,scale,floor))return;
      const b=g.bonus;ctx.save();ctx.translate((b.x-left)*scale,floor);ctx.scale(scale,scale);
      const gone=i=>b.parts[i]<=0,ratio=i=>b.parts[i]/b.maximum[i];
      ctx.fillStyle='#07090caa';ctx.beginPath();ctx.ellipse(0,4,105,9,0,0,Math.PI*2);ctx.fill();
      for(const x of [-65,65]){ctx.fillStyle='#111318';ctx.beginPath();ctx.arc(x,-13,18,0,Math.PI*2);ctx.fill();ctx.fillStyle='#77818b';ctx.beginPath();ctx.arc(x,-13,9,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle=gone(2)?'#36393b':'#6696b1';ctx.beginPath();ctx.moveTo(-58,-48);ctx.lineTo(-37,gone(2)?-56:-91);ctx.lineTo(32,gone(2)?-52:-91);ctx.lineTo(65,-49);ctx.closePath();ctx.fill();
      if(!gone(2)){ctx.fillStyle='#1a2a35';ctx.fillRect(-30,-83,56,29);ctx.strokeStyle='#c7dbe3';ctx.lineWidth=2;ctx.strokeRect(-30,-83,56,29);}
      for(const [i,x] of [[0,-94],[1,0]]){ctx.fillStyle=gone(i)?'#3b4246':ratio(i)<.5?'#557286':'#86acbf';ctx.beginPath();ctx.moveTo(x,-49);ctx.lineTo(x+94,-49);ctx.lineTo(x+94,gone(i)?-17:-22);ctx.lineTo(x,gone(i)?-12:-22);ctx.closePath();ctx.fill();}
      ctx.strokeStyle='#26323b';ctx.lineWidth=3;
      for(let i=0;i<3;i++){const damage=1-ratio(i),x=i===0?-64:i===1?58:0,y=i===2?-70:-37;if(damage>.15){ctx.beginPath();ctx.moveTo(x-14,y-9);ctx.lineTo(x+3,y+5);ctx.lineTo(x-4,y+14);ctx.stroke();}}
      if(b.parts.every(v=>v<=0)){ctx.fillStyle='#414447';ctx.fillRect(-99,-20,198,9);}
      ctx.restore();
      ctx.save();ctx.font='bold 13px Arial';ctx.fillStyle='#e8d3a1';ctx.textAlign='center';ctx.fillText('CARRO · '+b.score+' PONTOS',480,35);
      ctx.fillStyle='#1c2029';ctx.fillRect(340,44,280,8);ctx.fillStyle='#d2ac5f';ctx.fillRect(340,44,280*b.parts.reduce((a,v)=>a+v,0)/340,8);ctx.restore();
    }
  };
})(typeof window==='undefined'?globalThis:window);
