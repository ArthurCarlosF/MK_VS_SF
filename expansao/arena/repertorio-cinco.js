/* Presence-complete UMK3 repertoire batch. Native art/routes; calibration pending. */
(function(s){
 'use strict';
 const packs=s.MK_FIVE_REPERTOIRE_PACKS,characters=s.FIGHT_DATA.characters;
 const aliases={scorpion:{'0xff9f38a0':'elbowFollow','0xff9f3910':'comboFrontKick',
   '0xff9f39f0':'comboBackKick','0xff9f3a60':'kneeFollow'}};
 const nameFor=(id,address)=>aliases[id]?.[address]||'nativeCombo_'+address.slice(2);
 const proof={};
 function register(packs){
 for(const [id,pack] of Object.entries(packs)){
  const d=characters[id],bank=s.ARENA_ASSETS.characters[id],fps=bank.fps;
  Object.assign(bank.assets,pack.assets);Object.assign(bank.clips,pack.clips);
  Object.assign(d.moves,pack.moves);
  if(id==='shao-kahn'){
   // The arcade boss is CPU-controlled. These crossover inputs expose his
   // original non-offensive actions without inventing boss fatalities.
   d.commands.unshift(
    {move:'kahnLaugh',sequence:[2,2],button:'punch2',allowNeutral:true,windowSeconds:.4},
    {move:'kahnTaunt',sequence:[2,2],button:'kick2',allowNeutral:true,windowSeconds:.4});
   proof[id]={actions:['kahnLaugh','kahnTaunt'],offensiveMoves:['punch','kick','kahnHammer','kahnZap','kahnCharge','kahnAirCharge']};
   continue;
  }
  if(id==='noob-saibot'){
   d.defaultThrow='nativeThrow';d.defaultVictimClip='hit';
   d.normalControls.punch.standing={...d.normalControls.punch.standing,near:'nativeThrow',nearRange:64};
   d.normalControls.punch2.standing={...d.normalControls.punch2.standing,near:'nativeNearHP',nearRange:64};
   for(const button of ['kick','kick2'])d.normalControls[button].standing={...d.normalControls[button].standing,near:'nativeNearKnee',nearRange:64};
   d.normalControls.punch2.crouch='nativeUppercut';
  }
  for(const record of Object.values(pack.records))if(record.callbackMove){
   const source=d.moves[record.callbackMove];
   d.moves[nameFor(id,record.address)]={...source,nativeCombo:{...record,attack:'0x1111',next:'0x'+record.next.toString(16)},nativeCallback:record.callbackMove};
  }
  const options=address=>{
   const result=[];let next=parseInt(address,16);
   for(let i=0;i<20;i++,next+=112){
    const record=pack.records['0x'+next.toString(16)];
    if(!record)break;
    result.push(record);
    // Records at consecutive addresses may belong to the next table. The
    // exporter retains an explicit end bit derived from c_time.
    if(record.lastOption)break;
   }
   return result;
  };
  const edgesFor=(address,move)=>{
   const gate=Math.ceil((move.startup+move.active)*fps);
   return options(address).filter(record=>record.requirement!==7).map(record=>{
    const to=nameFor(id,record.address),old=move.chainEdges?.find(e=>e.button===record.button&&e.to===to);
    return {...(old||{window:[1,gate+record.window+4],gate,contact:'any'}),
      button:record.button,to,requirement:record.requirement,
      nativeRecord:record.address,nativeTable:address,preserveStrike:true};
   });
  };
  for(const record of Object.values(pack.records)){
   const m=d.moves[nameFor(id,record.address)];
   m.nativeCombo=record.callbackMove?{...record,attack:'0x1111',next:'0x'+record.next.toString(16)}:pack.moves['nativeCombo_'+record.address.slice(2)].nativeCombo;
   m.nativeComboRoute=true;
   if(record.next>=0xff800000&&!record.callbackMove)m.chainEdges=edgesFor('0x'+record.next.toString(16),m);
   else m.chainEdges=[];
  }
  const hp=d.normalControls.punch2.standing.near;
  d.moves[hp].chainEdges=edgesFor(pack.roots.elbow,d.moves[hp]);
  d.moves[hp].nativeComboRoute=true;
  if(d.normalControls.kick2.standing.nearRange===0){
   d.normalControls.kick2.standing={...d.normalControls.kick2.standing,
    near:d.normalControls.kick.standing.near,nearRange:d.normalControls.kick.standing.nearRange};
  }
  const knees=[...new Set(['kick','kick2'].map(button=>d.normalControls[button])
   .filter(c=>c.standing.nearRange>0).map(c=>c.standing.near))];
  for(const knee of knees){
   d.moves[knee].chainEdges=edgesFor(pack.roots.knee,d.moves[knee]);
   d.moves[knee].nativeComboRoute=true;
  }
  if(id!=='scorpion'){
   for(const button of ['punch','punch2']){
    const control=d.normalControls[button],initial=control.standing.far;
    const alternate=button==='punch'?'nativeRapidLP':'nativeRapidHP';
    const base={family:[initial,alternate],buttons:['punch','punch2'],mode:'alternate',
     lastFrame:18,lateFrame:24,gateFrames:6,preserveStrike:true,
     initial,initialByButton:{punch:d.normalControls.punch.standing.far,punch2:d.normalControls.punch2.standing.far}};
    d.moves[initial].repeat={...base,next:alternate,nextByButton:{punch:'nativeRapidLP',punch2:'nativeRapidHP'}};
    d.moves[alternate].repeat={...base,next:initial,nextByButton:base.initialByButton};
   }
   for(const button of ['punch','punch2'])d.normalControls[button].airDirectional='nativeDirectionalPunch';
   for(const button of ['kick','kick2'])d.normalControls[button].airDirectional='nativeDirectionalKick';
   // Native route selection and punch repeats must precede generic full-
   // recovery combinations. Other uncalibrated normals retain that fallback.
   d.basicCombinations=d.basicCombinations.filter(name=>!d.moves[name].repeat&&!d.moves[name].nativeComboRoute);
   for(const names of Object.values(d.basicRepeat))for(let i=names.length-1;i>=0;i--)
    if(d.moves[names[i]].repeat||d.moves[names[i]].nativeComboRoute)names.splice(i,1);
  }
  if(id==='mk-1'){
   d.nativeBackNormals=true;
   d.normalControls.kick.back='nativeRoundhouse';
   d.normalControls.kick2.back='nativeSweep';
  }
  for(const [button,name] of Object.entries(pack.backNormals||{})){
   d.normalControls[button].back=name;d.nativeBackNormals=true;
  }
  proof[id]={roots:pack.roots,records:Object.keys(pack.records),initialMoves:[hp,...knees],
    specialMoves:d.commands.map(c=>c.move),airThrow:d.airThrow||null};
 }
 return proof;
 }
 register(packs);
 s.MKRegisterRepertoire=register;
 s.MK_FIVE_REPERTOIRE_STATUS={status:'IMPLEMENTED_FIDELITY_PENDING',characters:proof,
  criterion:'All original combat actions represented; art, contact and timing still require comparison.'};
 const words={punch:'Soco baixo',punch2:'Soco alto',kick:'Chute alto',kick2:'Chute baixo',block:'Bloqueio'};
 const label=e=>(e.requirement===1?'Trás + ':e.requirement===2?'Baixo, Frente + ':e.requirement===3?'Frente + ':e.requirement===4?'Baixo + ':e.requirement===6?'Cima + ':'')+words[e.button];
 s.MKRepertoireHelp={add(ids,anchor){
  for(const id of [...new Set(ids)].filter(id=>proof[id])){
   const detail=document.createElement('details');detail.className='prototype-note';
   const title=document.createElement('summary');title.textContent=s.ARENA_ASSETS.characters[id].name+' — golpes e sequências';detail.append(title);
   const lines=[];
   if(id==='shao-kahn')lines.push('Risada: Baixo, Baixo + Soco baixo.','Provocação: Baixo, Baixo + Chute baixo.');
   else{
    lines.push('Inicie os combos de perto. Solte e pressione novamente cada botão; as direções acompanham o lado do adversário.');
    const d=characters[id],seen=new Set();
    const visit=(name,path)=>{
     const edges=d.moves[name].chainEdges||[];
     if(!edges.length){const text=path.join(', ');if(!seen.has(text)){lines.push(text);seen.add(text);}return;}
     for(const edge of edges)visit(edge.to,[...path,label(edge)]);
    };
    visit(d.normalControls.punch2.standing.near,['Soco alto']);
    visit(d.normalControls.kick.standing.near,['Chute alto']);
    if(id==='mk-1')lines.push('Rasteira: Trás + Chute baixo.','Chute giratório: Trás + Chute alto.');
    const airNames={iceClone:'Clone de gelo',sektorUppercut:'Teletransporte com gancho',cyraxTeleport:'Teletransporte',
     gasBlast:'Bola de energia',highFireball:'Bola de fogo',smokeUppercut:'Teletransporte com soco',
     fanToss:'Leque',chargedSai:'Sai',ermacTeleport:'Soco com teletransporte',humanSmokeTeleport:'Soco com teletransporte',teleport:'Soco com teletransporte'};
    const dirs={2:'Baixo',4:'Trás',6:'Frente',8:'Cima'};
    for(const move of proof[id].airSpecials||[]){
     const command=d.commands.find(c=>c.move===move),name=airNames[move.replace('nativeAir_','')]||move;
     lines.push('No ar — '+name+': '+(command.chargeSeconds?'segure '+words[command.button]+' por cerca de '+command.chargeSeconds+' segundos, salte e solte o botão.':
      (command.sequence||[]).map(n=>dirs[n]||n).join(', ')+' + '+(command.buttons||[command.button]).map(b=>words[b]||b).join(' + ')+'.'));
    }
   }
   for(const text of lines){const row=document.createElement('p');row.textContent=text;detail.append(row);}
   anchor.after(detail);anchor=detail;
  }
 }};
})(typeof window==='undefined'?globalThis:window);
