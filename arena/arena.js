'use strict';
(() => {
  const bank = window.ARENA_ASSETS.characters;
  const params = new URLSearchParams(location.search);
  const ids = [params.get('p1') || 'scorpion', params.get('p2') || 'ryu'];
  const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
  const overlay = document.querySelector('#overlay'), status = document.querySelector('#status');
  const images = new Map(), keys = new Set(), pulses = new Set(), pointers = new Map(), pointerPulses = [], errors = [];
  let game, ready = false, paused = false, last = null, accumulator = 0;
  let diagnostics = false;
  const WIDTH = 960, HEIGHT = 600, SCALE = 2, FLOOR = 530;
  const bindings=[{left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown',punch:'KeyJ',punch2:'KeyN',punch3:'KeyM',kick:'KeyK',kick2:'Comma',kick3:'Period',block:'KeyL',special:'KeyU',throw:'KeyI',teleport:'KeyO',run:'ShiftRight'},
    {left:'KeyA',right:'KeyD',up:'KeyW',down:'KeyS',punch:'KeyF',punch2:'KeyC',punch3:'KeyX',kick:'KeyG',kick2:'KeyZ',kick3:'KeyQ',block:'KeyH',special:'KeyT',throw:'KeyY',teleport:'KeyB',run:'KeyV'}];
  for(let i=0;i<2;i++){
    const group=document.createElement('div');group.className='touch';
    const normals=window.NORMAL_REPERTOIRE.characters[ids[i]].controls;
    const labels={left:'←',right:'→',up:'↑',down:'↓'};
    for(const [action,c] of Object.entries(normals))labels[action]=({LP:'Soco baixo',HP:'Soco alto',HK:'Chute alto',LK:'Chute baixo'})[c.label];
    if(ids[i]==='ryu')for(const [action,c] of Object.entries(normals))labels[action]=({LP:'Soco leve',MP:'Soco médio',HP:'Soco forte',LK:'Chute leve',MK:'Chute médio',HK:'Chute forte'})[c.label];
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
      const held=action=>keys.has(map[action])||(withEdges&&pulses.has(map[action]))||[...pointers.values()].some(p=>p.player===i&&p.action===action)||(withEdges&&pointerPulses.some(p=>p.player===i&&p.action===action));
      const v={x:Number(held('right'))-Number(held('left'))};
      for(const action of ['up','down','punch','punch2','punch3','kick','kick2','kick3','block','special','throw','teleport','run'])v[action]=held(action);
      const pad=navigator.getGamepads?.()[i];
      if(pad){
        const pressed=n=>!!pad.buttons[n]?.pressed;
        if(Math.abs(pad.axes[0]||0)>.35)v.x=Math.sign(pad.axes[0]);
        if(pressed(14)||pressed(15))v.x=Number(pressed(15))-Number(pressed(14));
        v.up ||= pressed(12)||(pad.axes[1]||0)<-.5;v.down ||= pressed(13)||(pad.axes[1]||0)>.5;
        for(const [name,button] of [['punch',0],['kick',1],['block',4],['special',2],['throw',3],['teleport',5],['run',7]])v[name] ||= pressed(button);
      }
      return v;
    });
  }
  function setPaused(value) {
    if (!ready) return;
    paused = value; accumulator = 0; last = null; clearInput();
    document.querySelector('#pause').textContent = paused ? 'Continuar' : 'Pausar';
    overlay.hidden = !paused;
    if (paused) {
      overlay.querySelector('strong').textContent = 'Arena pausada';
      overlay.querySelector('span').textContent = 'Continue quando estiver pronto.';
      document.querySelector('#resume').hidden = false;
    }
    status.textContent = paused ? 'Pausado' : 'Combate local · dois jogadores';
  }
  function reset() {
    if (!ready) return;
    game.reset(); clearInput(); accumulator = 0; last = null; draw();
  }
  function scenery() {
    const lift=(game.cameraY||0)*SCALE;ctx.save();ctx.translate(0,120+lift);
    const camera = game.camera;
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
    const left = game.camera - ARENA_RULES.viewport / 2;
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
    const floor=FLOOR+(game.cameraY||0)*SCALE;
    ctx.imageSmoothingEnabled = false; scenery();
    const left = game.camera - ARENA_RULES.viewport / 2;
    for (const [i, p] of game.players.entries()) {
      const c = bank[p.id], clip=c.clips[p.state]||c.clips.idle, frame = clip.frames[Math.min(p.frame,clip.frames.length-1)];
      const asset = c.assets[frame.asset], im = images.get(p.id + '/' + frame.asset);
      const spriteScale = SCALE * (ARENA_PRESENTATION.universeScale[c.universe] || 1);
      const x = Math.round((p.x - left) * SCALE);
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
      const panel=document.querySelector('#p'+(i+1));
      panel.querySelector('span').textContent=p.reaction?(p.reaction.guarded?'DEFENDENDO':p.reaction.phase==='getup'?'LEVANTANDO':p.reaction.phase==='down'?'CAÍDO':'ATINGIDO'):({idle:'EM GUARDA',forward:'AVANÇANDO',backward:'RECUANDO',crouch:'AGACHADO',guard:'DEFENDENDO',crouchGuard:'DEFESA BAIXA',jump:'NO AR',jumpForward:'NO AR',jumpBackward:'NO AR',jumpRunForward:'NO AR',run:'CORRENDO',hit:'ATINGIDO',impaled:'PRESO NA LANÇA',reel:'PUXANDO',ko:'K.O.',knockdown:'CAÍDO'})[p.state]||'ATACANDO';
      const stamina=panel.querySelector('.run-energy');if(stamina){const m=c.movement?.run;stamina.hidden=!m;if(m){stamina.querySelector('i').style.width=(100*(p.motion?.runEnergy??m.maximum)/m.maximum)+'%';stamina.setAttribute('aria-valuenow',String(Math.round(p.motion?.runEnergy??m.maximum)));}}
      panel.querySelector('.health i').style.width=p.health+'%';panel.querySelector('.health').setAttribute('aria-valuenow',p.health);
      panel.querySelector('.score').textContent='●'.repeat(game.wins[i])+'○'.repeat(Math.max(0,2-game.wins[i]))+(p.combo>1?' · '+p.combo+' ACERTOS':'');
    }
    for(const q of game.projectiles){
      const sx=(q.x-left)*SCALE,sy=floor-q.y*SCALE,owner=game.players[q.owner];
      if(q.rope){
        const hand=game.socket(owner,'spear');
        if(!hand)continue;
        drawRope((hand.x-left)*SCALE,floor-hand.y*SCALE,sx,sy);
        ctx.fillStyle='#ddd0a3';ctx.beginPath();ctx.moveTo(sx+q.facing*14,sy);ctx.lineTo(sx-q.facing*8,sy-6);ctx.lineTo(sx-q.facing*8,sy+6);ctx.fill();
      }else{
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
    document.querySelector('#timer').textContent=game.mode==='training'?'∞':Math.ceil(game.timer);
    document.querySelector('#round').textContent='ROUND '+game.round;
    const message=game.phase==='intro'?'ROUND '+game.round:game.phase==='roundEnd'?game.result:game.phase==='matchEnd'?game.result+' · FIM DE JOGO':null;
    if(message){ctx.fillStyle='#080b12aa';ctx.fillRect(0,130,WIDTH,100);ctx.fillStyle='#e7d09a';ctx.font='bold 32px Arial';ctx.textAlign='center';ctx.fillText(message,WIDTH/2,185);}
    if (diagnostics) {
      ctx.fillStyle = '#060a12c9'; ctx.fillRect(12, 12, 340, 30);
      ctx.fillStyle = '#d2c8ad'; ctx.font = '12px monospace'; ctx.textAlign = 'left';
      ctx.fillText(`Distância: ${game.snapshot().distance.toFixed(2)} · Câmera: ${game.camera.toFixed(2)}`, 24, 31);
    }
  }
  function tick(now) {
    const delta = last === null ? 0 : Math.min((now - last) / 1000, .1); last = now;
    if (ready && !paused) {
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
  document.querySelector('#mode').onchange=e=>{game.mode=e.target.value;reset();canvas.focus();};
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
      game = new FightArena(bank, ids);
      await Promise.all(ids.flatMap(id => Object.entries(bank[id].assets).map(([key, a]) => load(id, key, a))));
      game.players.forEach((p, i) => {
        const panel = document.querySelector('#p' + (i + 1)); panel.classList.toggle('sf', p.id === 'ryu');
        panel.querySelector('strong').textContent = bank[p.id].name.toUpperCase();
      });
      ready = true; overlay.hidden = true; status.textContent = 'Combate local · dois jogadores'; canvas.focus();
      document.querySelectorAll('#pause,#reset').forEach(b => b.disabled = false);
    } catch (e) {
      errors.push(e.message); overlay.querySelector('strong').textContent = 'Não foi possível abrir a arena';
      overlay.querySelector('span').textContent = e.message;
      status.textContent = 'Volte à seleção e escolha Ryu contra Scorpion.';
      document.querySelectorAll('#pause,#reset').forEach(b => b.disabled = true);
    }
  }
  window.arena = {get ready() {return ready;}, get paused() {return paused;},
    get game() {return game;}, get input() {return inputs();}, errors, reset, setPaused};
  start(); requestAnimationFrame(tick);
})();
