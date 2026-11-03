'use strict';
(() => {
  const bank = window.ARENA_ASSETS.characters;
  const params = new URLSearchParams(location.search);
  const storedSession=window.FightSession.parse(params);
  const ids=storedSession.ids;
  let SCALE=2;
  const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
  const overlay = document.querySelector('#overlay'), status = document.querySelector('#status');
  const images = new Map(), keys = new Set(), pulses = new Set(), pointers = new Map(), pointerPulses = [], errors = [];
  let game, ready = false, paused = false, last = null, accumulator = 0;
  let network=null;
  const sound=window.ArenaSound?new window.ArenaSound({toggle:document.querySelector('#audio-enabled'),volume:document.querySelector('#audio-volume'),status:document.querySelector('#audio-status')}):null;
  let diagnostics = false;
  const WIDTH = 960, HEIGHT = 600, FLOOR = 530;
  const bindings=[{left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown',punch:'KeyJ',punch2:'KeyN',punch3:'KeyM',kick:'KeyK',kick2:'Comma',kick3:'Period',block:'KeyL',special:'KeyU',throw:'KeyI',teleport:'KeyO',run:'ShiftRight'},
    {left:'KeyA',right:'KeyD',up:'KeyW',down:'KeyS',punch:'KeyF',punch2:'KeyC',punch3:'KeyX',kick:'KeyG',kick2:'KeyZ',kick3:'KeyQ',block:'KeyH',special:'KeyT',throw:'KeyY',teleport:'KeyB',run:'KeyV'}];
  while(bindings.length<ids.length)bindings.push({});
  for(let i=2;i<ids.length;i++){
    const panel=document.querySelector('#p1').cloneNode(true);panel.id='p'+(i+1);
    panel.querySelector('small').textContent='JOGADOR '+(i+1);
    panel.querySelector('.health').setAttribute('aria-label','Vida do jogador '+(i+1));
    document.querySelector('.matchup').append(panel);
  }
  if(ids.length>2){document.querySelector('.matchup').classList.add('crowd');document.querySelector('.matchup').style.setProperty('--player-columns',Math.min(4,ids.length));}
  for(let i=0;i<ids.length;i++){
    const panel=document.querySelector('#p'+(i+1)),meter=document.createElement('div');
    meter.className='super-meter';meter.setAttribute('role','progressbar');meter.setAttribute('aria-label','Barra Super do jogador '+(i+1));meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax','100');
    meter.innerHTML='<i></i><b>SUPER</b>';panel.querySelector('.run-energy').after(meter);
    meter.hidden=!Object.values(window.FIGHT_DATA.characters[ids[i]].moves).some(m=>m.meterCost>0);
    const group=document.createElement('div');group.className='touch';
    const normals=window.NORMAL_REPERTOIRE.characters[ids[i]].controls;
    const labels={left:'←',right:'→',up:'↑',down:'↓'};
    for(const [action,c] of Object.entries(normals))labels[action]=({LP:'Soco baixo',HP:'Soco alto',HK:'Chute alto',LK:'Chute baixo'})[c.label];
    if(bank[ids[i]].universe==='sf')for(const [action,c] of Object.entries(normals))labels[action]=({LP:'Soco leve',MP:'Soco médio',HP:'Soco forte',LK:'Chute leve',MK:'Chute médio',HK:'Chute forte'})[c.label];
    group.innerHTML='<b>'+(i+1)+'P</b>'+Object.entries({...labels,block:'Bloq.',special:'Especial',throw:'Agarrão',teleport:'Telep.',run:'Correr'})
      .map(([action,label])=>`<button data-player="${i}" data-action="${action}" aria-label="Jogador ${i+1}: ${label}">${label}</button>`).join('');
    document.querySelector('.screen-controls').append(group);
  }
  const clearInput = () => {
    keys.clear(); pulses.clear(); pointers.clear();pointerPulses.length=0;
    document.querySelectorAll('.touch button').forEach(b => b.classList.remove('pressed'));
  };
  function inputs(withEdges=false) {
    return bindings.map((map,i)=>{
      if(network){if(i!==network.slot)return {};map=bindings[0];}
      const held=action=>keys.has(map[action])||(withEdges&&pulses.has(map[action]))||[...pointers.values()].some(p=>p.player===i&&p.action===action)||(withEdges&&pointerPulses.some(p=>p.player===i&&p.action===action));
      const v={x:Number(held('right'))-Number(held('left'))};
      for(const action of ['up','down','punch','punch2','punch3','kick','kick2','kick3','block','special','throw','teleport','run'])v[action]=held(action);
      let pad;try{pad=navigator.getGamepads?.()[network?0:i];}catch{}
      if(pad){
        const pressed=n=>!!pad.buttons[n]?.pressed;
        if(Math.abs(pad.axes[0]||0)>.35)v.x=Math.sign(pad.axes[0]);
        if(pressed(14)||pressed(15))v.x=Number(pressed(15))-Number(pressed(14));
        v.up ||= pressed(12)||(pad.axes[1]||0)<-.5;v.down ||= pressed(13)||(pad.axes[1]||0)>.5;
        for(const [name,button] of [['punch',0],['kick',1],['punch2',2],['kick2',3],['punch3',4],['kick3',5],['block',6],['run',7],['special',8],['throw',9],['teleport',10]])v[name] ||= pressed(button);
      }
      return storedSession.cpu.includes(i)&&game?window.FightSession.bot(game,game.players[i]):v;
    });
  }
  function setPaused(value) {
    if (!ready) return;
    paused = value; accumulator = 0; last = null; clearInput();
    if(network)network.input({},true);
    document.querySelector('#pause').textContent = paused ? 'Continuar' : 'Pausar';
    overlay.hidden = !paused;
    if (paused) {
      overlay.querySelector('strong').textContent = 'Arena pausada';
      overlay.querySelector('span').textContent = 'Continue quando estiver pronto.';
      if(network)overlay.querySelector('span').textContent='A partida continua na rede. Seus comandos estão liberados.';
      document.querySelector('#resume').hidden = false;
    }
    status.textContent = paused ? 'Pausado' : window.FightSession.label(game);
  }
  function reset() {
    if (!ready) return;
    if(network){network.rematch();return;}
    game.reset();sound?.reset(); clearInput(); accumulator = 0; last = null; status.textContent=window.FightSession.label(game);draw();
  }
  function scenery(camera) {
    if(game.bonus?.native&&window.NativeCarArt?.drawStage(ctx,{b:game.bonus,left:camera-WIDTH/SCALE/2,scale:SCALE,floor:FLOOR+(game.cameraY||0)*SCALE,width:WIDTH,height:HEIGHT}))return;
    if(window.NativeStages?.get(game.stageId)&&window.NativeStages.draw(ctx,{stageId:game.stageId,left:camera-WIDTH/SCALE/2,cameraY:game.cameraY||0,scale:SCALE,floor:FLOOR,viewportWidth:WIDTH,viewportHeight:HEIGHT,elapsed:Math.max(0,game.elapsed-(game.stageTimeStart||0))}))return;
    const lift=(game.cameraY||0)*SCALE;ctx.save();ctx.translate(0,120+lift);
    const sky = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    sky.addColorStop(0, '#15131c'); sky.addColorStop(.48, '#29242b'); sky.addColorStop(1, '#182744');
    ctx.fillStyle = sky; ctx.fillRect(0, -120-lift, WIDTH, HEIGHT+lift);
    // An original practice room: no claim of recreating a source game's stage.
    ctx.fillStyle = '#d3a55c'; ctx.globalAlpha = .12;
    ctx.beginPath(); ctx.arc(205 - (camera - 550) * .12, 135, 77, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    for (let i = -1; i < 12; i++) {
      const x = i * 125 - ((camera * .3) % 125);
      ctx.fillStyle = '#0c111de0'; ctx.fillRect(x, 105 + (i % 3) * 18, 70, 240);
      ctx.fillStyle = '#59648025'; ctx.fillRect(x + 6, 110 + (i % 3) * 18, 3, 220);
    }
    ctx.fillStyle = '#080e18'; ctx.fillRect(0, 288, WIDTH, 50);
    ctx.strokeStyle = '#a98f6540'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 291); ctx.lineTo(WIDTH, 291); ctx.stroke();
    const floor = ctx.createLinearGradient(0, 332, 0, HEIGHT);
    floor.addColorStop(0, '#292b35'); floor.addColorStop(1, '#12141e');
    ctx.fillStyle = floor; ctx.fillRect(0, 332, WIDTH, HEIGHT - 332);
    const left = game.camera - WIDTH / SCALE / 2;
    ctx.strokeStyle = '#a3a2b116';
    for (let x = Math.floor(left / 40) * 40; x < left + 520; x += 40) {
      const screen = (x - left) * SCALE;
      ctx.beginPath(); ctx.moveTo(screen, 333); ctx.lineTo(screen, HEIGHT); ctx.stroke();
    }
    for (const y of [346, 371, 410, 465]) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke();
    }
    for (const x of [ARENA_RULES.edge - 18, ARENA_RULES.width - ARENA_RULES.edge + 18]) {
      const sx = (x - left) * SCALE;
      ctx.fillStyle = '#dab76b88'; ctx.fillRect(sx, 332, 3, HEIGHT - 332);
    }
    ctx.restore();
  }
  function drawRope(x1,y1,x2,y2){
    const dx=x2-x1,dy=y2-y1,length=Math.hypot(dx,dy);
    if(length<1)return;
    const nx=-dy/length,ny=dx/length,segments=Math.max(2,Math.ceil(length/1.5));
    ctx.beginPath();ctx.moveTo(x1,y1);
    for(let i=1;i<=segments;i++){
      const t=i/segments,phase=t*length*Math.PI*2/9;
      const taper=Math.min(1,t*length/8,(1-t)*length/8),coil=Math.sin(phase)*1.25*taper;
      const along=(Math.cos(phase)-1)*1.2*taper;
      ctx.lineTo(x1+dx*t+nx*coil+dx/length*along,y1+dy*t+ny*coil+dy/length*along);
    }
    ctx.strokeStyle='#55452b';ctx.lineWidth=3;ctx.stroke();
    ctx.strokeStyle='#baab7a';ctx.lineWidth=1.5;ctx.stroke();
  }
  function draw() {
    if (!ready) return;
    sound?.tick(game,network?.match);
    const scenes=window.NativeCinematics?(game.cinematics||[]):[];
    const range=scenes.length?window.NativeCinematics.bounds(scenes):null;
    let camera=game.camera;
    if(ids.length>2){
      const alive=game.players.filter(p=>p.health>0),xs=alive.map(p=>p.x);
      if(game.bonus)xs.push(game.bonus.x-95,game.bonus.x+95);
      if(range)xs.push(range.left,range.right);
      const span=xs.length?Math.max(...xs)-Math.min(...xs):0;
      const target=alive.length<=2&&!range?2:Math.min(2,960/(480+70*Math.max(0,alive.length-2)),880/(span+100));
      SCALE+=(target-SCALE)*(1-Math.exp(-Math.min(.1,window.arenaFrameDelta||1/60)*3));
      if(range){
        SCALE=Math.min(SCALE,920/(span+36));
        const half=WIDTH/(2*SCALE)-18;
        camera=Math.min(Math.min(...xs)+half,Math.max(Math.max(...xs)-half,camera));
      }
    }
    const floor=FLOOR+(game.cameraY||0)*SCALE;
    ctx.imageSmoothingEnabled = false; scenery(camera);
    const left = camera - WIDTH / SCALE / 2;
    window.FightSession.drawBonus(ctx,game,left,SCALE,floor);
    const carClip=game.bonus?.native&&window.NativeCarArt;
    if(carClip)window.NativeCarArt.clip(ctx,game.bonus,left,SCALE,floor);
    const protectedSlots=new Set(scenes.flatMap(c=>[c.owner,c.target]));
    const finishSlots=new Set((network?game.finishOffers:game.visibleFinishOffers?.()||[]).map(c=>c.owner));
    for (const [i, p] of game.players.entries()) {
      const c = bank[p.id], clip=c.clips[p.state]||c.clips.idle, frame = clip.frames[Math.min(p.frame,clip.frames.length-1)];
      const asset = c.assets[frame.asset], im = images.get(p.id + '/' + frame.asset);
      const spriteScale = SCALE * (ARENA_PRESENTATION.universeScale[c.universe] || 1);
      const x = Math.round((p.x - left) * SCALE);
      if(!protectedSlots.has(i)){
      ctx.fillStyle = '#0007'; ctx.beginPath(); ctx.ellipse(x, floor + 2, 50, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.translate(x, floor-p.y*SCALE);
      // Normalize the PNG's captured orientation around its own anchor before
      // applying the live facing. Some teleport poses already face left.
      ctx.scale(p.facing * (frame.sourceFacing || 1) * spriteScale, spriteScale);
      if(p.flash>0)ctx.globalAlpha=.55+Math.sin(game.elapsed*100)*.25;
      ctx.drawImage(im, Math.round(frame.x), Math.round(frame.y)); ctx.restore();
      ctx.font = 'bold 10px Arial'; ctx.textAlign = 'center'; ctx.fillStyle = i ? '#a9bfff' : '#efd38d';
      ctx.fillText((i + 1) + 'P', x, Math.min(HEIGHT-10, floor + 26));
      if (diagnostics) {
        ctx.strokeStyle = i ? '#8eafff' : '#eed18e';
        for(const box of game.hurtBoxes(p))ctx.strokeRect((box.left-left)*SCALE,floor-box.top*SCALE,(box.right-box.left)*SCALE,(box.top-box.bottom)*SCALE);
        const hit=game.activeBox(p);if(hit){ctx.strokeStyle='#ff6565';ctx.strokeRect((hit.left-left)*SCALE,floor-hit.top*SCALE,(hit.right-hit.left)*SCALE,(hit.top-hit.bottom)*SCALE);}
        ctx.font = '11px monospace'; ctx.fillText(`x ${p.x.toFixed(2)} · ${c.fps.toFixed(3)} Hz`, x, floor + 44);
      }
      }
      const panel=document.querySelector('#p'+(i+1));
      panel.querySelector('span').textContent=p.reaction?(p.reaction.guarded?'DEFENDENDO':p.reaction.phase==='getup'?'LEVANTANDO':p.reaction.phase==='down'?'CAÍDO':'ATINGIDO'):({idle:'EM GUARDA',forward:'AVANÇANDO',backward:'RECUANDO',crouch:'AGACHADO',guard:'DEFENDENDO',crouchGuard:'DEFESA BAIXA',jump:'NO AR',jumpForward:'NO AR',jumpBackward:'NO AR',jumpRunForward:'NO AR',run:'CORRENDO',hit:'ATINGIDO',impaled:'PRESO NA LANÇA',reel:'PUXANDO',ko:'K.O.',knockdown:'CAÍDO'})[p.state]||'ATACANDO';
      if(protectedSlots.has(i))panel.querySelector('span').textContent='FINALIZAÇÃO';
      else if(finishSlots.has(i))panel.querySelector('span').textContent='PODE FINALIZAR';
      const stamina=panel.querySelector('.run-energy');if(stamina){const m=c.movement?.run;stamina.hidden=!m;if(m){stamina.querySelector('i').style.width=(100*(p.motion?.runEnergy??m.maximum)/m.maximum)+'%';stamina.setAttribute('aria-valuenow',String(Math.round(p.motion?.runEnergy??m.maximum)));}}
      const meter=panel.querySelector('.super-meter');if(meter&&!meter.hidden){meter.querySelector('i').style.width=p.meter+'%';meter.setAttribute('aria-valuenow',String(Math.round(p.meter)));meter.classList.toggle('full',p.meter>=100-1e-8);}
      panel.querySelector('.health i').style.width=p.health+'%';panel.querySelector('.health').setAttribute('aria-valuenow',p.health);
      panel.querySelector('.score').textContent=game.mode==='bonus'?game.bonus.scores[i]+' PONTOS':'●'.repeat(game.wins[i])+'○'.repeat(Math.max(0,2-game.wins[i]))+(p.combo>1?' · '+p.combo+' ACERTOS':'');
    }
    if(scenes.length)window.NativeCinematics.draw(ctx,{cinematics:scenes,cameraLeft:left,cameraY:game.cameraY||0,scale:SCALE,floor:FLOOR});
    for(const q of game.projectiles){
      const sx=(q.x-left)*SCALE,sy=floor-q.y*SCALE,owner=game.players[q.owner];
      if(q.rope){
        const hand=game.socket(owner,'spear');
        if(!hand)continue;
        drawRope((hand.x-left)*SCALE,floor-hand.y*SCALE,sx,sy);
        ctx.fillStyle='#ddd0a3';ctx.beginPath();ctx.moveTo(sx+q.facing*14,sy);ctx.lineTo(sx-q.facing*8,sy-6);ctx.lineTo(sx-q.facing*8,sy+6);ctx.fill();
      }else{
        const native=game.definition(owner).moves[q.name].projectile;
        if(native?.clip){
          const c=bank[owner.id],clip=c.clips[native.clip],at=Math.floor(q.age*native.sampleRate),loop=native.loopStart||0;
          const index=at<clip.frames.length?at:loop+(at-loop)%Math.max(1,clip.frames.length-loop),frame=clip.frames[index];
          if(frame){const im=images.get(owner.id+'/'+frame.asset);if(im){ctx.save();ctx.translate(sx,sy);ctx.scale(q.facing*(frame.sourceFacing||1)*SCALE*1.25,SCALE*1.25);ctx.drawImage(im,frame.x,frame.y);ctx.restore();}}
          continue;
        }
        const c=bank[owner.id],ids=c.projectileAssets||[],id=ids[Math.floor(q.age*18)%ids.length],a=c.assets[id],im=images.get(owner.id+'/'+id);
        if(im){ctx.save();ctx.translate(sx,sy);ctx.scale(q.facing*SCALE*1.25,SCALE*1.25);ctx.drawImage(im,-a.width/2,-a.height/2);ctx.restore();}
        else{ctx.fillStyle='#8eeaff';ctx.beginPath();ctx.ellipse(sx,sy,24,18,0,0,Math.PI*2);ctx.fill();}
      }
    }
    for(const tether of game.tethers){
      const owner=game.players[tether.owner],target=game.players[tether.target],hand=game.socket(owner,'spear');
      if(!hand)continue;
      const body=game.definition(target).body;
      drawRope((hand.x-left)*SCALE,floor-hand.y*SCALE,
        (target.x+target.facing*9-left)*SCALE,floor-(target.y+body.height*.78)*SCALE);
    }
    for(const e of game.effects){ctx.strokeStyle=e.guarded?'#92baff':'#ffe59a';ctx.lineWidth=3;const x=(e.x-left)*SCALE,y=floor-e.y*SCALE,r=8+e.age*100;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}
    if(carClip)ctx.restore();
    document.querySelector('#timer').textContent=game.mode==='training'?'∞':Math.ceil(game.timer);
    document.querySelector('#round').textContent=game.mode==='bonus'?'CARRO · '+game.bonus.score+' PONTOS':'ROUND '+game.round;
    const message=game.phase==='intro'?(game.mode==='bonus'?'DESTRUA O CARRO':'ROUND '+game.round):game.phase==='roundEnd'?game.result:game.phase==='matchEnd'?game.result+' · FIM DE JOGO':null;
    if(message){ctx.fillStyle='#080b12aa';ctx.fillRect(0,130,WIDTH,100);ctx.fillStyle='#e7d09a';ctx.font='bold 32px Arial';ctx.textAlign='center';ctx.fillText(message,WIDTH/2,185);}
    if (diagnostics) {
      ctx.fillStyle = '#060a12c9'; ctx.fillRect(12, 12, 340, 30);
      ctx.fillStyle = '#d2c8ad'; ctx.font = '12px monospace'; ctx.textAlign = 'left';
      ctx.fillText(`Distância: ${game.snapshot().distance.toFixed(2)} · Câmera: ${game.camera.toFixed(2)}`, 24, 31);
    }
  }
  function tick(now) {
    const delta = last === null ? 0 : Math.min((now - last) / 1000, .1); last = now;window.arenaFrameDelta=delta;
    if(ready&&network){
      network.input(paused?{}:inputs(true)[network.slot]||{});pulses.clear();pointerPulses.length=0;
      network.apply(game);if(network.latest&&!paused)overlay.hidden=true;
    }else if (ready && !paused) {
      accumulator += delta;
      while (accumulator + 1e-10 >= ARENA_RULES.step) {
        game.step(ARENA_RULES.step, inputs(true)); pulses.clear();pointerPulses.length=0;accumulator -= ARENA_RULES.step;
      }
    }
    draw(); requestAnimationFrame(tick);
  }
  const movementCodes = Object.values(bindings[0]).concat(Object.values(bindings[1]));
  window.addEventListener('keydown', e => {
    if (e.target?.matches?.('button,input,a,select') && ['Space', 'Enter'].includes(e.code)) return;
    if (movementCodes.includes(e.code)) {
      e.preventDefault(); if (ready && !paused) {keys.add(e.code);if(!e.repeat)pulses.add(e.code);}
    } else if (['Space', 'Escape', 'KeyR'].includes(e.code)) {
      e.preventDefault(); if (e.repeat) return;
      if (e.code === 'KeyR') reset(); else setPaused(e.code === 'Escape' || !paused);
    }
  });
  window.addEventListener('keyup', e => {if (movementCodes.includes(e.code)) {e.preventDefault(); keys.delete(e.code);}});
  window.addEventListener('blur', () => {clearInput(); setPaused(true);});
  document.addEventListener('visibilitychange', () => {if (document.hidden) {clearInput(); setPaused(true);}});
  for (const button of document.querySelectorAll('.touch button')) {
    button.addEventListener('pointerdown', e => {
      e.preventDefault(); if (!ready || paused) return;
      button.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, {player: +button.dataset.player, action:button.dataset.action});
      pointerPulses.push({player:+button.dataset.player,action:button.dataset.action});
      button.classList.add('pressed');
    });
    const release = e => {pointers.delete(e.pointerId); button.classList.remove('pressed');};
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(type, release);
  }
  document.querySelector('#pause').onclick = () => {setPaused(!paused); canvas.focus();};
  document.querySelector('#resume').onclick = () => {setPaused(false); canvas.focus();};
  document.querySelector('#reset').onclick = () => {reset(); canvas.focus();};
  document.querySelector('#mode').onchange=async e=>{
    if(!ready||network)return;
    const next=e.target.value;
    try{
      if(next==='bonus')await window.NativeCarArt?.load();
      else if(window.NativeStages?.get(storedSession.options.stage))await window.NativeStages.load('assets/stages/',storedSession.options.stage);
    }
    catch{e.target.value=game.mode;status.textContent='Não foi possível carregar o cenário.';return;}
    if(e.target.value!==next)return;
    game.mode=next;reset();canvas.focus();
  };
  document.querySelector('#diagnostics').onchange = e => {diagnostics = e.target.checked; draw();};
  document.querySelector('#full').onclick = async () => {
    try {if (document.fullscreenElement) await document.exitFullscreen(); else await document.body.requestFullscreen();}
    catch (e) {status.textContent = 'Tela cheia indisponível nesta janela.';}
  };
  const load = (id, key, a) => new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => {images.set(id + '/' + key, image); resolve();};
    image.onerror = () => reject(new Error('Não foi possível carregar ' + a.file)); image.src = a.file;
  });
  async function start() {
    try {
      game = new FightArena(bank, ids,window.FIGHT_DATA,storedSession.options);
      if(window.NativeStages?.get(game.stageId))await window.NativeStages.load('assets/stages/',game.stageId);
      if(game.mode==='bonus')await window.NativeCarArt?.load();
      if(window.NativeCinematics)await Promise.all(Object.entries(window.NATIVE_FINISHERS||{}).filter(([,profile])=>profile.url&&profile.provenPairs.some(pair=>ids.some((id,i)=>id===pair.owner&&ids.some((target,j)=>j!==i&&target===pair.victim)))).map(([id,profile])=>window.NativeCinematics.load(profile.url,id)));
      document.querySelector('#mode').value=game.mode;
      await Promise.all([...new Set(ids)].flatMap(id => Object.entries(bank[id].assets).map(([key, a]) => load(id, key, a))));
      game.players.forEach((p, i) => {
        const panel = document.querySelector('#p' + (i + 1)); panel.classList.toggle('sf', bank[p.id].universe === 'sf');
        panel.querySelector('strong').textContent = bank[p.id].name.toUpperCase();
      });
      ready = true; overlay.hidden = true; status.textContent = window.FightSession.label(game); canvas.focus();
      document.querySelectorAll('#pause,#reset').forEach(b => b.disabled = false);
      if(params.has('room')){
        document.body.classList.add('lan');
        network=new window.NetworkArena({room:params.get('room'),match:params.get('match'),ids,
          onStatus:text=>{status.textContent=text;document.querySelector('#reset').disabled=!network?.isHost;},
          onSlot:slot=>{
            document.querySelectorAll('.touch').forEach((el,i)=>el.hidden=i!==slot);
            document.querySelectorAll('.fighter').forEach((el,i)=>el.classList.toggle('mine',i===slot));
          }});
        network.ready();overlay.hidden=false;overlay.querySelector('strong').textContent='Partida em rede local';
        overlay.querySelector('span').textContent='Esperando todos carregarem a arena…';document.querySelector('#resume').hidden=true;
        document.querySelector('#mode').disabled=true;document.querySelector('#reset').textContent='Voltar à sala';
        document.querySelector('header .back').textContent='← Sair da partida';
        document.querySelector('header .back').onclick=e=>{e.preventDefault();network.leave();};
      }
    } catch (e) {
      errors.push(e.message); overlay.querySelector('strong').textContent = 'Não foi possível abrir a arena';
      overlay.querySelector('span').textContent = e.message;
      status.textContent = 'Volte à preparação da partida e confira os participantes.';
      document.querySelectorAll('#pause,#reset').forEach(b => b.disabled = true);
    }
  }
  window.arena = {get ready() {return ready;}, get paused() {return paused;},
    get game() {return game;}, get audio(){return sound?.player;},get network(){return network;}, get zoom() {return SCALE/2;}, get input() {return inputs();}, errors, reset, setPaused};
  start(); requestAnimationFrame(tick);
})();
