/* Explicit native PCM playback. Gameplay mappings must be proven separately. */
(function(scope){
 'use strict';
 class NativeAudioBank{
  constructor({manifestUrl,contextFactory,maxVoices=16,ownsContext=true,destinationFactory}={}){
   if(!manifestUrl)throw Error('A native audio manifest URL is required');
   if(!Number.isInteger(maxVoices)||maxVoices<1)throw Error('maxVoices must be a positive integer');
   this.manifestUrl=manifestUrl;this.contextFactory=contextFactory||(()=>new (scope.AudioContext||scope.webkitAudioContext)());
   this.ownsContext=ownsContext;this.destinationFactory=destinationFactory;this.maxVoices=maxVoices;this.context=null;this.manifest=null;this.samples=new Map();this.buffers=new Map();this.voices=[];this.volume=1;this.muted=false;
  }
  async load(){
   const response=await fetch(this.manifestUrl);if(!response.ok)throw Error('Native audio manifest unavailable');
   const m=await response.json();if(m.schema!==1||!Array.isArray(m.samples))throw Error('Unsupported native audio manifest');
   const entries=new Map();for(const sample of m.samples){if(!Number.isInteger(sample.id)||entries.has(sample.id)||!sample.file||sample.sampleRate<=0||sample.length<=0)throw Error('Invalid native sample metadata');entries.set(sample.id,sample);}
   this.manifest=m;this.samples=entries;return m;
  }
  async unlock(){
   this.context ||= this.contextFactory();
   if(!this.master){this.master=this.context.createGain();this.master.connect(this.destinationFactory?this.destinationFactory(this.context):this.context.destination);this.applyVolume();}
   if(this.context.state==='suspended')await this.context.resume();return this.context;
  }
  applyVolume(){if(this.master)this.master.gain.value=this.muted?0:this.volume;}
  setVolume(value){if(!Number.isFinite(value))throw Error('Invalid audio volume');this.volume=Math.max(0,Math.min(1,value));this.applyVolume();}
  setMuted(value){this.muted=!!value;this.applyVolume();}
  async buffer(id){
   if(!this.manifest)await this.load();const s=this.samples.get(id);if(!s)throw Error('Unknown native sample ID');
   if(!this.context)throw Error('Audio must be unlocked by a user gesture');
   if(!this.buffers.has(id))this.buffers.set(id,(async()=>{
    const url=new URL(s.file,new URL(this.manifestUrl,scope.location?.href||'http://localhost/'));
    const response=await fetch(url);if(!response.ok)throw Error('Native sample unavailable');
    return this.context.decodeAudioData(await response.arrayBuffer());
   })().catch(e=>{this.buffers.delete(id);throw e;}));
   return this.buffers.get(id);
  }
  async play(id,{gain=1,pan=0,playbackRate=1,loop=false,group=null,startTime}={}){
   if(startTime!==undefined&&(!Number.isFinite(startTime)||startTime<0))throw Error('Invalid audio start time');
   if(!Number.isFinite(playbackRate)||playbackRate<=0||!Number.isFinite(gain)||gain<0||!Number.isFinite(pan))throw Error('Invalid native playback parameters');
   const buffer=await this.buffer(id),sample=this.samples.get(id),ctx=this.context;
   while(this.voices.length>=this.maxVoices)this.stop(this.voices[0]);
   const source=ctx.createBufferSource(),level=ctx.createGain(),panner=ctx.createStereoPanner?ctx.createStereoPanner():null;
   source.buffer=buffer;source.playbackRate.value=playbackRate;level.gain.value=gain;
   source.loop=!!loop&&sample.loop;if(source.loop){source.loopStart=sample.loopStart/sample.sampleRate;source.loopEnd=sample.loopEnd/sample.sampleRate;}
   source.connect(level);if(panner){panner.pan.value=Math.max(-1,Math.min(1,pan));level.connect(panner);panner.connect(this.master);}else level.connect(this.master);
   const voice={source,level,panner,group,sampleId:id,ended:false};this.voices.push(voice);
   source.onended=()=>this.release(voice);source.start(startTime===undefined?0:startTime);return voice;
  }
  release(voice){if(voice.ended)return;voice.ended=true;this.voices=this.voices.filter(v=>v!==voice);voice.source.disconnect();voice.level.disconnect();voice.panner?.disconnect();}
  stop(voice){if(!voice||voice.ended)return;try{voice.source.stop();}finally{this.release(voice);}}
  stopGroup(group){for(const voice of [...this.voices])if(voice.group===group)this.stop(voice);}
  stopAll(){for(const voice of [...this.voices])this.stop(voice);}
  async playEvent(event,resolver){
   // An empty mapping is a real coverage gap, never a request for a random sound.
   const mapping=resolver?resolver(event,this.manifest):this.manifest?.eventMapping?.[event.type];
   if(!mapping)return null;return this.play(mapping.sampleId,mapping);
  }
  async close(){this.stopAll();this.buffers.clear();this.master?.disconnect();if(this.ownsContext)await this.context?.close();this.context=null;this.master=null;}
 }
 scope.NativeAudioBank=NativeAudioBank;
})(typeof window==='undefined'?globalThis:window);
