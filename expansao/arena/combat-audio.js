/* Proven native combat cues; caller supplies semantic character identity. */
(function(scope){
 'use strict';
 function hash(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
 function semantic(character){
  if(character&&typeof character==='object'){
   if(character.game==='umk3'&&character.nativeCharacterId===18)return 'scorpion';
   character=character.name||character.id;
  }
  return typeof character==='string'?character.trim().toLowerCase():null;
 }
 class NativeCombatAudio{
  constructor({manifestUrl,contextProvider,destinationProvider,characterResolver=semantic,maxVoices=16}={}){
   if(typeof contextProvider!=='function'||typeof destinationProvider!=='function')throw Error('Combat audio requires shared audio providers');
   this.characterResolver=characterResolver;this.manifest=null;this.seen=new Set();
   this.bank=new scope.NativeAudioBank({manifestUrl,maxVoices,ownsContext:false,contextFactory:()=>{const c=contextProvider();if(!c)throw Error('Unlock main audio first');return c;},destinationFactory:()=>destinationProvider()});
  }
  async load(){
   const m=await this.bank.load();if(!m.cues||!Array.isArray(m.bindings))throw Error('Invalid combat cue manifest');
   for(const [id,cue] of Object.entries(m.cues)){
    if(!cue.groups?.length)throw Error('Empty native combat cue');
    for(const group of cue.groups)if(!group.variants?.length||group.variants.some(v=>!this.bank.samples.has(v.sampleId)||!Number.isFinite(v.gain)||v.gain<0||(v.playbackRate!==undefined&&(!Number.isFinite(v.playbackRate)||v.playbackRate<=0))))throw Error('Invalid native cue variants');
   }
   for(const b of m.bindings)if(!m.cues[b.cue]||!b.eventType||!Array.isArray(b.moves))throw Error('Invalid native event binding');
   this.manifest=m;return m;
  }
  async unlock(){await this.bank.unlock();if(!this.manifest)await this.load();await Promise.all(this.manifest.samples.map(s=>this.bank.buffer(s.id)));return this;}
  async playCue(id,{seed='local',group=null,startTime}={}){
   if(!this.manifest)await this.load();const cue=this.manifest.cues[id];if(!cue)throw Error('Unknown proven combat cue');
   const selected=cue.groups.map((g,i)=>g.variants[hash(String(seed)+':'+id+':'+i)%g.variants.length]);
   await Promise.all(selected.map(v=>this.bank.buffer(v.sampleId)));
   await Promise.all(selected.map(v=>this.bank.play(v.sampleId,{gain:v.gain,playbackRate:v.playbackRate,group,startTime})));
   return selected.map(v=>v.sampleId);
  }
  async consume(events,{match='local',characters=[],initialSync=false}={}){
   if(!this.manifest)await this.load();const played=[];
   for(const event of events||[]){
    if(event.id===undefined)continue;const key=String(match)+':'+event.id;if(this.seen.has(key))continue;
    this.seen.add(key);while(this.seen.size>1024)this.seen.delete(this.seen.values().next().value);if(initialSync)continue;
    const actor=this.characterResolver(characters[event.player]),target=this.characterResolver(characters[event.target]);
    const bindings=this.manifest.bindings.filter(b=>b.eventType===event.type&&b.moves.includes(event.move)&&(!b.actor||b.actor===actor)&&(!b.target||b.target===target));
    if(!bindings.length)continue;if(!this.bank.context)throw Error('Unlock combat audio before playing');
    const startTime=this.bank.context.currentTime+.005;
    played.push(...await Promise.all(bindings.map(async b=>({event:event.id,cue:b.cue,sampleIds:await this.playCue(b.cue,{seed:key,group:'actor:'+event.player,startTime})}))));
   }return played;
  }
  async close(){this.seen.clear();await this.bank.close();}
 }
 scope.NativeCombatAudio=NativeCombatAudio;
})(typeof window==='undefined'?globalThis:window);
