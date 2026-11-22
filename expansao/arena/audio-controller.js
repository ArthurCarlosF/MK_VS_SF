(function(scope){
 'use strict';
 class ArenaSound{
  constructor({toggle,volume,status}){
   this.player=new scope.NativeGameAudio({baseUrl:'../audio/ssf2t/'});this.toggle=toggle;this.status=status;this.started=false;this.pending=null;this.stageKey=undefined;this.matchKey=null;this.epoch=0;this.sceneAudio=new Map();this.sceneBuffers=new Map();this.sceneVoices=new Map();
   let saved={};try{saved=JSON.parse(localStorage.getItem('mkvsf.expansao.audio.v1')||'{}')}catch{}
   toggle.checked=saved.enabled!==false;volume.value=String(Math.min(100,Math.max(0,Number(saved.volume??65))));
   const update=()=>{this.player.setMuted(!toggle.checked);this.player.setVolume(Number(volume.value)/100);try{localStorage.setItem('mkvsf.expansao.audio.v1',JSON.stringify({enabled:toggle.checked,volume:Number(volume.value)}))}catch{}if(toggle.checked)this.unlock();};
   toggle.addEventListener('change',update);volume.addEventListener('input',update);this.player.setVolume(Number(volume.value)/100);this.player.setMuted(!toggle.checked);
   this.gesture=()=>{if(toggle.checked)this.unlock();};scope.addEventListener('pointerdown',this.gesture);scope.addEventListener('keydown',this.gesture);
   scope.addEventListener('pagehide',()=>{this.player.close().catch(()=>{});},{once:true});
  }
  unlock(){
   if(this.started||this.pending)return this.pending;
   this.pending=this.player.unlock().then(async()=>{
    this.started=true;this.status.textContent='';
    try{await this.player.registerCombatManifest('../audio/umk3/sfx-manifesto.json');}
    catch{this.status.textContent='Efeitos do Mortal Kombat indisponíveis';}
   }).catch(()=>{this.status.textContent='Áudio indisponível';}).finally(()=>{this.pending=null;});return this.pending;
  }
  reset(){this.epoch++;this.matchKey=null;this.stageKey=undefined;}
  prepareCinematicAudio(films){
   this.sceneAudio ||=new Map();
   for(const [id,profile] of films)if(profile.audio)this.sceneAudio.set(id,profile.audio);
   // Descriptors are cheap; decode only the finishers offered in this match.
  }
  preloadSceneAudio(){
   for(const {url} of this.sceneAudio.values())this.sceneBuffer(url).catch(()=>{});
  }
  sceneBuffer(url){
   if(!this.sceneBuffers.has(url)){
    const loading=fetch(url).then(response=>{
     if(!response.ok)throw Error('Áudio da finalização indisponível');
     return response.arrayBuffer();
    }).then(bytes=>this.player.bank.context.decodeAudioData(bytes)).catch(error=>{
     this.sceneBuffers.delete(url);throw error;
    });
    this.sceneBuffers.set(url,loading);
   }
   return this.sceneBuffers.get(url);
  }
  syncSceneAudio(scenes,key,paused){
   const active=new Map(scenes.filter(scene=>this.sceneAudio.has(scene.profile)).map(scene=>[key+':'+scene.id,scene]));
   for(const [id,voice] of this.sceneVoices){
    if(!paused&&active.has(id))continue;
    if(voice.source){try{voice.source.stop();}catch{}voice.source.disconnect();}
    this.sceneVoices.delete(id);
   }
   if(!paused)for(const [id,scene] of active){
    const existing=this.sceneVoices.get(id);
    if(existing){existing.scene=scene;continue;}
    const voice={scene,source:null};this.sceneVoices.set(id,voice);
    const audio=this.sceneAudio.get(scene.profile);
    this.sceneBuffer(audio.url).then(buffer=>{
     if(this.sceneVoices.get(id)!==voice)return;
     const offset=voice.scene.time-audio.onsetSeconds;
     if(offset>=buffer.duration)return;
     const ctx=this.player.bank.context,source=ctx.createBufferSource();
     source.buffer=buffer;source.connect(this.player.bank.master);voice.source=source;
     source.onended=()=>{source.disconnect();voice.source=null;};
     source.start(ctx.currentTime+Math.max(0,-offset),Math.max(0,offset));
    }).catch(()=>{this.status.textContent='Áudio da finalização indisponível';});
   }
   return active.size>0;
  }
  tick(game,match,paused=false){
   if(!this.started)return;
   const key=match||'local-'+this.epoch,initial=this.matchKey!==key;this.matchKey=key;
   const spec=scope.NativeStages?.get(game.stageId);
   const mkTrack=spec?.sourceGame==='umk3'?(Array.isArray(spec.musicTrack)?spec.musicTrack[game.round===1?0:1]:spec.musicTrack):null;
   if(game.mode==='bonus'&&!this.carAudio){
    this.carAudio=this.player.registerCombatManifest('../audio/ssf2t/car/manifesto.json')
     .catch(()=>{this.status.textContent='Efeitos do carro indisponíveis';return false;});
   }
   const cinema=this.syncSceneAudio(game.cinematics||[],key,paused);
   for(const offer of game.finishOffers||[]){const audio=this.sceneAudio.get(offer.profile);if(audio)this.sceneBuffer(audio.url).catch(()=>{});}
   const stage=cinema&&game.players.length===2?'cinema':game.mode==='bonus'?'bonus':mkTrack?'mk:'+mkTrack:spec?.sourceGame!=='umk3'&&Number.isInteger(game.nativeStageId)?'sf:'+game.nativeStageId:null;
   if(stage!==this.stageKey){
    this.stageKey=stage;const epoch=this.epoch;
    let play;
    if(stage==='cinema')play=this.player.stopMusic();
    else if(stage==='bonus')play=this.player.setStage('bonus');
    else if(mkTrack){
     this.player.stopMusic();
     this.mkMusic ||= this.player.registerMusicManifest('../audio/umk3/musicas-cenarios.json').catch(e=>{this.mkMusic=null;throw e;});
     play=this.mkMusic.then(()=>this.stageKey===stage&&this.epoch===epoch?this.player.playTrack(mkTrack,{loop:true}):false);
    }else play=stage?this.player.setNativeStage(game.nativeStageId):this.player.setStage(null);
    Promise.resolve(play).catch(()=>{this.status.textContent='Áudio indisponível';});
   }
   const events=game.events||[],context={match:key,characters:game.ids,initialSync:initial};
   const car=events.filter(event=>event.type==='carAudio');
   if(car.length)this.carAudio?.then(loaded=>loaded&&this.player.consume(car,context))
    .catch(()=>{this.status.textContent='Efeitos do carro indisponíveis';});
   this.player.consume(events.filter(event=>event.type!=='carAudio'),context).catch(()=>{this.status.textContent='Áudio indisponível';});
  }
 }
 scope.ArenaSound=ArenaSound;
})(typeof window==='undefined'?globalThis:window);
