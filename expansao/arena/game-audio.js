/* Catalog music with explicit semantic IDs; unproven fight SFX remain unmapped. */
(function(scope){
 'use strict';
 const stages={'sf-0':'ryu','sf-1':'e-honda','sf-2':'blanka','sf-3':'guile','sf-4':'t-hawk','sf-5':'fei-long','sf-6':'balrog','sf-7':'sagat','sf-8':'ken','sf-9':'chun-li','sf-10':'zangief','sf-11':'dhalsim','sf-12':'cammy','sf-13':'dee-jay','sf-14':'vega','sf-15':'m-bison',ryu:'ryu',ken:'ken',akuma:'akuma'};
 const nativeStages=['ryu','e-honda','blanka','guile','ken','chun-li','zangief','dhalsim','m-bison','sagat','balrog','vega','cammy','t-hawk','fei-long','dee-jay'];
 class NativeGameAudio{
  constructor({baseUrl='audio/ssf2t/',contextFactory,maxVoices=16,characterResolver}={}){
   this.baseUrl=new URL(baseUrl,scope.location?.href||'http://localhost/');
   this.bank=new scope.NativeAudioBank({manifestUrl:new URL('manifesto.json',this.baseUrl).href,contextFactory,maxVoices});
   this.combatBanks=[];this.characterResolver=characterResolver;this.music=null;this.musicBuffers=new Map();this.musicSource=null;this.stageId=null;this.currentTrack=null;this.musicGeneration=0;this.seen=new Set();
  }
  async load(){
   if(!this.music){const r=await fetch(new URL('musicas-manifesto.json',this.baseUrl));if(!r.ok)throw Error('Native music manifest unavailable');const m=await r.json();if(m.schema!==1||!Array.isArray(m.tracks))throw Error('Unsupported music manifest');this.music=new Map(m.tracks.map(t=>[t.id,t]));}
   if(!this.bank.manifest)await this.bank.load();return this;
  }
  async registerMusicManifest(url){
   await this.load();const base=new URL(url,scope.location?.href||'http://localhost/'),r=await fetch(base);if(!r.ok)throw Error('Additional music manifest unavailable');
   const m=await r.json();if(m.schema!==1||!Array.isArray(m.tracks))throw Error('Unsupported additional music manifest');
   const ids=new Set();for(const t of m.tracks){if(typeof t.id!=='string'||typeof t.file!=='string'||ids.has(t.id)||this.music.has(t.id))throw Error('Invalid or colliding additional music ID');ids.add(t.id);}
   for(const t of m.tracks)this.music.set(t.id,{...t,resolvedFileUrl:new URL(t.file,base).href});return m;
  }
  async registerCombatManifest(url){
   if(!scope.NativeCombatAudio)throw Error('Load combat-audio.js before registering native cues');
   const manifestUrl=new URL(url,scope.location?.href||'http://localhost/').href;
   const existing=this.combatBanks.find(c=>c.bank.manifestUrl===manifestUrl);if(existing)return existing.manifest;
   const combat=new scope.NativeCombatAudio({manifestUrl,contextProvider:()=>this.bank.context,destinationProvider:()=>this.bank.master,characterResolver:this.characterResolver});
   await combat.load();if(this.bank.context)await combat.unlock();this.combatBanks.push(combat);return combat.manifest;
  }
  async unlock(){await this.bank.unlock();for(const c of this.combatBanks)await c.unlock();return this.load();}
  resume(){return this.unlock();}
  setVolume(v){this.bank.setVolume(v);}
  setMuted(v){this.bank.setMuted(v);}
  stopMusic(){this.musicGeneration++;if(this.musicSource){try{this.musicSource.stop();}catch{}this.musicSource.disconnect();this.musicSource=null;}this.currentTrack=null;}
  async musicBuffer(id){
   if(!this.music)await this.load();const track=this.music.get(id);if(!track)throw Error('Unknown native music ID');if(!this.bank.context)throw Error('Audio requires a user gesture');
   if(!this.musicBuffers.has(id)){
    while(this.musicBuffers.size>=2)this.musicBuffers.delete(this.musicBuffers.keys().next().value);
    this.musicBuffers.set(id,(async()=>{const r=await fetch(track.resolvedFileUrl||new URL(track.file,this.baseUrl));if(!r.ok)throw Error('Native music asset unavailable');return this.bank.context.decodeAudioData(await r.arrayBuffer());})().catch(e=>{this.musicBuffers.delete(id);throw e;}));
   }return this.musicBuffers.get(id);
  }
  async playTrack(id,{loop=false,restart=false}={}){
   if(!restart&&this.currentTrack===id&&this.musicSource)return true;
   const generation=++this.musicGeneration,buffer=await this.musicBuffer(id);if(generation!==this.musicGeneration)return false;
   if(this.musicSource){try{this.musicSource.stop();}catch{}this.musicSource.disconnect();}
   const track=this.music.get(id),source=this.bank.context.createBufferSource();source.buffer=buffer;source.loop=!!loop;
   if(source.loop&&track.loopStartSeconds!==null&&track.loopStartSeconds!==undefined){
    const begin=track.loopStartSeconds,end=track.loopEndSeconds;
    if(!Number.isFinite(begin)||!Number.isFinite(end)||begin<0||end<=begin||end>buffer.duration+.001)throw Error('Invalid native music loop metadata');
    source.loopStart=begin;source.loopEnd=end;
   }
   source.connect(this.bank.master);this.musicSource=source;this.currentTrack=id;
   source.onended=()=>{if(this.musicSource===source){source.disconnect();this.musicSource=null;this.currentTrack=null;}};source.start();return true;
  }
  async setStage(id,{phase='I',nativeStageId}={}){
   if(nativeStageId!==undefined&&(!Number.isInteger(nativeStageId)||!nativeStages[nativeStageId]))throw Error('Unknown native SF stage ID');
   const name=nativeStageId!==undefined?nativeStages[nativeStageId]:(stages[id]||(nativeStages.includes(id)?id:null));let track;
   if(name)track='ssf2t-'+name+'-stage-'+String(phase).toLowerCase();
   else if(id==='bonus'||id==='car')track='ssf2t-bonus-stage';
   else if(id==='selection')track='ssf2t-player-select-1';
   else if(String(id).startsWith('ssf2t-'))track=id;
   else{this.stopMusic();this.stageId=null;return false;}
   await this.load();if(!this.music.has(track))throw Error('Missing explicitly selected native stage track');this.stageId=id;return this.playTrack(track,{loop:true});
  }
  setNativeStage(id,options={}){return this.setStage(null,{...options,nativeStageId:id});}
  async consume(events,{match='local',characters=[],initialSync=false}={}){
   const played=[];
   for(const event of events||[]){
    if(event.id===undefined)continue;const key=String(match)+':'+event.id;if(this.seen.has(key))continue;
    this.seen.add(key);while(this.seen.size>1024)this.seen.delete(this.seen.values().next().value);
    if(initialSync)continue;
    // These names correspond to explicit embedded catalog titles. Character
    // attacks/voices are absent until native command-to-sample mapping exists.
    const cues={versus:'ssf2t-vs',newChallenger:'ssf2t-here-comes-a-new-challenger',gameOver:'ssf2t-game-over',continue:'ssf2t-continue',stageEnd:'ssf2t-stage-end'};
    const cue=cues[event.type];if(cue){await this.playTrack(cue,{restart:true});played.push({event:event.id,track:cue});continue;}
    for(const combat of this.combatBanks)played.push(...await combat.consume([event],{match,characters}));
    const mapped=this.bank.manifest?.eventMapping?.[event.type];
    if(mapped){await this.bank.play(mapped.sampleId,mapped);played.push({event:event.id,sample:mapped.sampleId});}
   }return played;
  }
  async close(){this.stopMusic();this.musicBuffers.clear();this.seen.clear();for(const c of this.combatBanks)await c.close();this.combatBanks=[];await this.bank.close();}
 }
 scope.NativeGameAudio=NativeGameAudio;
})(typeof window==='undefined'?globalThis:window);
