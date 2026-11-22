/* Register the remaining twenty original arcade repertoires. */
(function(s){
 'use strict';
 const proof=s.MKRegisterRepertoire(s.MK_TWENTY_REPERTOIRE_PACKS);
 const variants={
  'mk-4':['iceClone'],'mk-7':['sektorUppercut'],'mk-8':['cyraxTeleport'],
  'mk-10':['gasBlast'],'mk-13':['highFireball'],'mk-14':['smokeUppercut'],
  'mk-15':['fanToss'],'mk-17':['chargedSai'],'mk-20':['ermacTeleport'],
  'human-smoke':['humanSmokeTeleport'],scorpion:['teleport']
 };
 for(const [id,names]of Object.entries(variants)){
  const d=s.FIGHT_DATA.characters[id],bank=s.ARENA_ASSETS.characters[id];
  for(const source of names){
   const art=s.MK_TWENTY_REPERTOIRE_PACKS[id]?.airVariants?.[source];
   const name=art?.name||'nativeAir_'+source,m={...d.moves[source],air:true,clip:art?.clip||d.moves[source].clip};
   if(m.motionTimeline)m.airToGround=true;
   if(art){
    const frames=bank.clips[art.clip].frames.length;
    m.startup=Math.min(m.startup,Math.max(1,frames-3)/bank.fps);
    m.recovery=Math.max(1/bank.fps,frames/bank.fps-m.startup-m.active);
   }
   d.moves[name]=m;
   d.commands.push(...d.commands.filter(c=>c.move===source&&!c.air).map(c=>({...c,move:name,air:true})));
  }
  if(proof[id])proof[id].airSpecials=names.map(n=>'nativeAir_'+n);
 }
 // Both native punch switch tables accept Kitana's fan command. Preserve the
 // existing two-button input while exposing each original single-button input.
 for(const air of [false,true])for(const button of ['punch','punch2']){
  const d=s.FIGHT_DATA.characters['mk-15'],base=d.commands.find(c=>c.move===(air?'nativeAir_fanToss':'fanToss'));
  const command={...base,button,air};delete command.buttons;d.commands.push(command);
 }
 // A simultaneous two-button native special must win over its one-button
 // sibling (Reptile's Forceball versus Acid Spit, for example).
 for(const id of Object.keys(s.MK_TWENTY_REPERTOIRE_PACKS)){
  const d=s.FIGHT_DATA.characters[id];
  d.commands=[...d.commands].sort((a,b)=>(b.buttons?.length||1)-(a.buttons?.length||1)||
   (b.sequence?.length||0)-(a.sequence?.length||0));
 }
 s.MK_TWENTY_REPERTOIRE_STATUS={status:'IMPLEMENTED_FIDELITY_PENDING',
  characters:Object.fromEntries(Object.keys(s.MK_TWENTY_REPERTOIRE_PACKS).map(id=>[id,proof[id]])),
  criterion:'Original moves and active combo branches represented; original fidelity remains to be compared.'};
})(typeof window==='undefined'?globalThis:window);
