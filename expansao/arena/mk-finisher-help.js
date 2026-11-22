(function(s){
 'use strict';
 const words={forward:'Frente',back:'Trás',up:'Cima',down:'Baixo',punch:'Soco baixo',punch2:'Soco alto',kick:'Chute alto',kick2:'Chute baixo',block:'Bloqueio',run:'Correr'};
 const names={fatality1:'Fatality 1',fatality2:'Fatality 2',animality:'Animality',babality:'Babality',friendship:'Friendship',stageFatality:'Finalização de cenário'};
 const distances={'Close':'de perto','Sweep':'na distância de rasteira','Outside Sweep':'além da rasteira','Past Sweep':'além da rasteira','Half Screen':'a meia tela','Full Screen':'de longe','Between Close and Sweep':'entre perto e a distância de rasteira'};
 s.MKFinisherHelp={add(ids,anchor){
  for(const id of [...new Set(ids)]){
   const row=s.MK_FINISHER_STATUS?.rows.find(c=>c.id===id);if(!row)continue;
   const details=document.createElement('details');details.className='prototype-note';
   const summary=document.createElement('summary');summary.textContent=s.ARENA_ASSETS.characters[id].name+' — finalizações';details.append(summary);
   const intro=document.createElement('p');intro.textContent=row.expected.length?'No duelo, use na rodada decisiva. Com vários jogadores, use após uma eliminação. As direções são relativas ao adversário; solte entre os toques repetidos.':'Este personagem não possui finalizações próprias no UMK3 arcade.';details.append(intro);
   const seen=new Set();
   for(const profile of Object.values(s.NATIVE_FINISHERS||{})){
    if(!profile.provenPairs.some(pair=>pair.owner===id)&&!profile.adaptOwners?.includes(id))continue;
    const t=profile.triggerByOwner?.[id]||profile.trigger;
    const kind=profile.finisherKind||(t.stages?'stageFatality':Object.keys(names).find(k=>profile.id.includes('-'+k+'-')));
    if(!kind||seen.has(kind))continue;seen.add(kind);
    const steps=t.inputSteps||t.steps.map(key=>({inputs:[key],action:'press'}));
    const line=document.createElement('p');line.textContent=names[kind]+': '+steps.map(step=>(step.action==='hold'?'segure ':step.action==='release'?'solte ':'')+step.inputs.map(key=>words[key]).join(' + ')).join(', ');
    if(t.distanceLabel)line.textContent+=' ('+(distances[t.distanceLabel]||t.distanceLabel)+')';
    if(t.blockHeldThroughout)line.textContent+='. Segure Bloqueio durante a sequência';
    if(t.holdBlockDirections)line.textContent+='. Segure Bloqueio nas direções e solte antes do último botão';
    if(t.requiresNoBlock)line.textContent+='. Não use Bloqueio durante a rodada';
    if(t.requiresMercy)line.textContent+='. Faça Mercy e nocauteie novamente';
    if(kind==='stageFatality')line.textContent+='. Disponível em Scorpion’s Lair, Subway, Bell Tower e Pit 3';
    details.append(line);
   }
   if(s.MK_FINISHER_STATUS.mercyOwners?.includes(id)){const mercy=document.createElement('p');mercy.textContent='Mercy: de longe, segure Correr por cerca de um segundo, toque Baixo duas vezes e solte Correr. No duelo, cada jogador precisa ter vencido uma rodada.';details.append(mercy);}
   anchor.after(details);anchor=details;
  }
 }};
})(typeof window==='undefined'?globalThis:window);
