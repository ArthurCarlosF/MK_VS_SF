(function(scope){
 'use strict';
 class ArenaSound{
  constructor({toggle,volume,status}){
   this.player=new scope.NativeGameAudio({baseUrl:'../audio/ssf2t/'});this.toggle=toggle;this.status=status;this.started=false;this.pending=null;this.stageKey=undefined;this.matchKey=null;this.epoch=0;
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
  tick(game,match){
   if(!this.started)return;
   const key=match||'local-'+this.epoch,initial=this.matchKey!==key;this.matchKey=key;
   const spec=scope.NativeStages?.get(game.stageId);
   const mkTrack=spec?.sourceGame==='umk3'?spec.musicTrack:null;
   const stage=game.mode==='bonus'?'bonus':mkTrack?'mk:'+mkTrack:spec?.sourceGame!=='umk3'&&Number.isInteger(game.nativeStageId)?'sf:'+game.nativeStageId:null;
   if(stage!==this.stageKey){
    this.stageKey=stage;const epoch=this.epoch;
    let play;
    if(stage==='bonus')play=this.player.setStage('bonus');
    else if(mkTrack){
     this.player.stopMusic();
     this.mkMusic ||= this.player.registerMusicManifest('../audio/umk3/musicas-confirmadas.json').catch(e=>{this.mkMusic=null;throw e;});
     play=this.mkMusic.then(()=>this.stageKey===stage&&this.epoch===epoch?this.player.playTrack(mkTrack,{loop:true}):false);
    }else play=stage?this.player.setNativeStage(game.nativeStageId):this.player.setStage(null);
    Promise.resolve(play).catch(()=>{this.status.textContent='Áudio indisponível';});
   }
   this.player.consume(game.events||[],{match:key,characters:game.ids,initialSync:initial}).catch(()=>{this.status.textContent='Áudio indisponível';});
  }
 }
 scope.ArenaSound=ArenaSound;
})(typeof window==='undefined'?globalThis:window);
