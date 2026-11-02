/* Initial crossover calibration. Timings/boxes/damage are editable prototype
 * values, NOT recovered arcade frame data. Native sprite/movement evidence
 * lives in assets.js and engenharia-reversa/animacoes[-base]. */
(function(scope){
  const normal=(clip,damage,level,box,extra={})=>({clip,damage,level,box,startup:.1,active:.09,
    recovery:.22,hitstun:.32,blockstun:.16,push:85,hitstop:.055,kind:'strike',...extra});
  const moves=()=>({
    punch:normal('punch',8,'mid',{x:14,y:46,w:46,h:38},{cancel:['special']}),
    kick:normal('kick',12,'mid',{x:12,y:35,w:70,h:60},{startup:.16,recovery:.3,push:120}),
    crouchPunch:normal('crouchPunch',7,'mid',{x:12,y:18,w:43,h:32}),
    crouchKick:normal('crouchKick',10,'low',{x:10,y:4,w:68,h:27},{startup:.13,recovery:.27}),
    airPunch:normal('airPunch',9,'overhead',{x:10,y:30,w:45,h:42},{air:true}),
    airKick:normal('airKick',12,'overhead',{x:10,y:0,w:65,h:50},{air:true,push:110}),
    throw:{clip:'punch',kind:'throw',level:'throw',damage:16,startup:.08,active:.045,recovery:.42,
      box:{x:0,y:0,w:48,h:100},hitstun:.8,knockdown:true,push:150,hitstop:.08},
    projectile:{clip:'special',kind:'projectile',level:'mid',damage:13,chip:1,startup:.2,active:.025,
      recovery:.48,hitstun:.4,blockstun:.23,push:130,hitstop:.07,
      projectile:{speed:240,lifetime:1.6,y:49,radius:12}},
    spear:{clip:'special',kind:'projectile',level:'mid',damage:9,chip:0,startup:.24,active:.025,
      recovery:.65,hitstun:.7,blockstun:.25,push:0,hitstop:.06,pull:true,
      pullMotion:{hold:.18,speed:8*53.20494842529297,stopDistance:65,settleStun:.4},
      projectile:{speed:310,lifetime:1.3,y:105,radius:8,rope:true,socket:'spear'}},
    teleport:{clip:'teleport',kind:'teleport',level:'mid',damage:11,startup:.19,active:.1,
      recovery:.39,box:{x:7,y:20,w:53,h:65},hitstun:.38,push:120,hitstop:.06}
  });
  scope.FIGHT_DATA={
    rules:{roundSeconds:99,roundsToWin:2,introSeconds:1.1,betweenRounds:2.7,health:100,meter:100,
      bufferSeconds:.14,maximumProjectiles:1},
    characters:{
      scorpion:{guard:'button',body:{halfWidth:23,height:126,crouchHeight:66,airHeight:93},
        inputPolicy:{heldJump:true,minimumReleaseSeconds:2/53.20494842529297},
        special:'spear',teleport:'teleport',commands:[
          {sequence:[2,4],button:'punch2',move:'teleport',windowSeconds:.25},
          {sequence:[4,4],button:'punch',move:'spear',allowNeutral:true,windowSeconds:.25}],
        moves:moves()},
      ryu:{guard:'back',body:{halfWidth:23,height:114,crouchHeight:63,airHeight:88},
        inputPolicy:{heldJump:true,negativeEdge:true},
        special:'projectile',commands:[{sequence:[2,3,6],button:'punch',negativeEdge:true,move:'projectile',
          stageSeconds:[8/59.633331298828125,8/59.633331298828125],buttonSeconds:12/59.633331298828125}],
        moves:moves()}
    },
    validation:{movement:'measured samples',graphics:'native decoded sprites',
      combat:'prototype calibration; original boxes, damage, frame phases and cross-game rules still need validation'}
  };
  for(const [id,character] of Object.entries(scope.BASIC_CALIBRATION?.characters||{})){
    if(character.passiveHurt)scope.FIGHT_DATA.characters[id].passiveHurt=character.passiveHurt;
    for(const [name,observed] of Object.entries(character.moves)){
      const move=scope.FIGHT_DATA.characters[id]?.moves[name];
      if(!move)continue;
      Object.assign(move,{startup:observed.startup,active:observed.active,recovery:observed.recovery,
        damage:observed.damage,chip:observed.chip,sampleRate:observed.sampleRate,
        attackTimeline:observed.attackTimeline,calibration:observed});
      if(observed.level)move.level=observed.level;
    }
  }
  // Measured input-level repetition. Full contact combos/cancels are step 6.
  const mk=scope.FIGHT_DATA.characters.scorpion,sf=scope.FIGHT_DATA.characters.ryu;
  mk.moves.punch.repeat={mode:'alternate',preserveStrike:true,gateFrames:10,lastFrame:14,lateFrame:19,
    next:'punchFollow',initial:'punch',family:['punch','punchFollow','punchReturn']};
  mk.moves.punchFollow={...mk.moves.punch,clip:'punchFollow',startup:11/53.20494842529297,
    active:1/53.20494842529297,recovery:7/53.20494842529297,
    calibration:null,repeat:{...mk.moves.punch.repeat,next:'punchReturn',lateFrame:Infinity}};
  mk.moves.punchReturn={...mk.moves.punchFollow,clip:'punchReturn',repeat:{...mk.moves.punchFollow.repeat,next:'punchFollow'}};
  for(const name of ['punch','crouchPunch','crouchKick'])sf.moves[name].repeat={mode:'restart',gateFrames:3,
    latencyFrames:2,skipFrames:2,family:[name],next:name};
  // A same-button edge immediately before the last recovery sample is accepted;
  // other normals pressed during recovery are discarded, never stored for .14 s.
  sf.moves.kick.lateRepeatFrames=1;
  mk.moves.kick.lateRepeatFrames=0;
  sf.moves.crouchKick.repeat.gateFrames=5;
  // Standing MK jab targets the upper body. Its exact original rectangle
  // remains pending; this avoids the old waist-height placeholder hitting crouch.
  scope.FIGHT_DATA.characters.scorpion.moves.punch.box={x:14,y:88,w:46,h:24};
  for(const name of ['punch','punchFollow','punchReturn']){
    const m=mk.moves[name];m.box={...mk.moves.punch.box};m.hitstop=0;m.push=0;
  }
  // Step 4 adds native normal variants without replacing the verified default
  // jab timing and alternating-hand state machine from step 2/revision 2.1.
  for(const [id,pack] of Object.entries(scope.NORMAL_REPERTOIRE?.characters||{})){
    const def=scope.FIGHT_DATA.characters[id];def.normalControls=pack.controls;
    def.defaultThrow=pack.defaultThrow;def.defaultVictimClip=pack.defaultVictimClip;
    def.repertoire=pack;
    for(const [name,move] of Object.entries(pack.moves)){
      if(['punch','kick','crouchPunch','crouchKick'].includes(name)){
        // Preserve calibrated phases; update documented guard level only.
        if(name==='kick'&&id==='ryu')def.moves[name].level=move.level;
        continue;
      }
      def.moves[name]={...move};
    }
    def.moves.throw=def.moves[pack.defaultThrow];
  }
  for(const [id,pack] of Object.entries(scope.PHASE_CALIBRATION?.characters||{})){
    const def=scope.FIGHT_DATA.characters[id];
    for(const [name,patch] of Object.entries(pack.moves))Object.assign(def.moves[name],patch);
  }
  if(scope.REACTION_CALIBRATION){
    scope.FIGHT_DATA.reactions=scope.REACTION_CALIBRATION.profiles;
    for(const [id,pack] of Object.entries(scope.REACTION_CALIBRATION.characters)){
      const def=scope.FIGHT_DATA.characters[id];def.reactionCatalog=pack.catalog;
      for(const [name,patch] of Object.entries(pack.moves))Object.assign(def.moves[name],patch);
    }
  }
  if(scope.SEQUENCE_CALIBRATION){
    Object.assign(scope.FIGHT_DATA.reactions,scope.SEQUENCE_CALIBRATION.profiles||{});
    for(const [id,pack] of Object.entries(scope.SEQUENCE_CALIBRATION.characters)){
      const def=scope.FIGHT_DATA.characters[id];
      if(pack.controls)Object.assign(def.normalControls,pack.controls);
      for(const [name,patch] of Object.entries(pack.moves))def.moves[name]={...def.moves[name],...patch};
    }
  }
})(typeof window==='undefined'?globalThis:window);
