'use strict';
(()=>{
  const $=s=>document.querySelector(s),params=new URLSearchParams(location.search);let current=null;
  const fighters=window.FIGHTER_INDEX||[{id:'ryu',name:'Ryu',side:'sf'},{id:'scorpion',name:'Scorpion',side:'mk'}];
  $('#character').replaceChildren(...[['mk','Mortal Kombat'],['sf','Street Fighter']].map(([side,name])=>{
    const group=document.createElement('optgroup');group.label=name;
    group.append(...fighters.filter(c=>c.side===side&&!c.selectionOnly).map(c=>new Option(c.name+(c.status?' — '+c.status:''),c.id)));
    return group;
  }));
  $('#stage').add(new Option('Sala de treino','practice'));for(const s of window.NATIVE_STAGE_DATA?.stages||[])if(s.selectable)$('#stage').add(new Option(s.name,s.id));$('#stage').value='sf-ryu';
  const connection=new LanRoomConnection({onStatus:s=>$('#connection').textContent=s,onMessage:m=>{
    if(m.type==='error'){$('#message').textContent=m.message;return;}
    if(m.type==='joined'||m.type==='room')render(m.room);
    if(m.type==='match')location.href=NetworkArena.url(m);
    if(m.type==='left'){$('#entry').hidden=false;$('#room').hidden=true;current=null;}
    if(m.type==='lobby'){render(m.room);$('#message').textContent=m.message||'';}
  }});
  function render(r){
    current=r;$('#entry').hidden=true;$('#room').hidden=false;$('#room-name').textContent=r.name;$('#room-code').textContent=r.code;
    const mine=r.players.find(p=>p.id===connection.identity?.id),host=r.hostId===mine?.id;
    $('#members').replaceChildren();
    for(const p of r.players){const li=document.createElement('li'),left=document.createElement('span'),right=document.createElement('small');
      left.textContent=p.nick+(p.id===mine?.id?' (você)':'')+(p.id===r.hostId?' · anfitrião':'');right.textContent=(fighters.find(c=>c.id===p.character)?.name||p.character)+' · '+(!p.connected?'reconectando':p.ready?'PRONTO':'escolhendo');if(p.ready)right.className='ready';li.append(left,right);$('#members').append(li);}
    if(mine)$('#character').value=mine.character;$('#ready').textContent=mine?.ready?'Cancelar pronto':'Estou pronto';$('#ready').disabled=r.phase!=='lobby';$('#character').disabled=r.phase!=='lobby';
    $('#start').hidden=!host;$('#start').disabled=r.phase!=='lobby'||r.players.length<2||r.players.some(p=>!p.ready||!p.connected);
    $('#room-status').textContent=r.phase==='loading'?'Todos estão abrindo a arena…':r.players.length+' de '+r.capacity+' vagas · '+(host?'Inicie quando todos estiverem prontos.':'Aguarde o anfitrião iniciar.');
  }
  $('#create').onsubmit=e=>{e.preventDefault();$('#message').textContent='';connection.send({type:'create',name:$('#name').value,nick:$('#nick').value,capacity:Number($('#capacity').value),mode:$('#mode').value,stage:$('#stage').value});};
  $('#join').onsubmit=e=>{e.preventDefault();$('#message').textContent='';connection.send({type:'join',code:$('#code').value.trim().toUpperCase(),nick:$('#nick').value});};
  $('#character').onchange=e=>connection.send({type:'select',character:e.target.value});
  $('#ready').onclick=()=>connection.send({type:'ready',ready:!current?.players.find(p=>p.id===connection.identity?.id)?.ready});
  $('#start').onclick=()=>connection.send({type:'start'});
  $('#leave').onclick=()=>{connection.send({type:'leave'});sessionStorage.removeItem('mkvsf.sala.v1');connection.identity=null;};
  if(params.has('join'))$('#code').value=params.get('join');
  async function refresh(){try{const info=await(await fetch('/api/info')).json();$('#addresses').replaceChildren();
    for(const url of info.urls){const div=document.createElement('div');div.className='address';const a=document.createElement('a');a.href=url;a.textContent=url;const button=document.createElement('button');button.className='secondary';button.textContent='Copiar';button.onclick=async()=>{try{await navigator.clipboard.writeText(url);button.textContent='Copiado';}catch{$('#message').textContent='Endereço: '+url;}};div.append(a,button);$('#addresses').append(div);}
    if(!info.urls.length)$('#addresses').textContent='Nenhum endereço de rede encontrado. Confira a conexão deste PC.';
    $('#available').replaceChildren();for(const room of info.rooms){const row=document.createElement('div');row.className='room-item';const title=document.createElement('span');title.textContent=room.name+' · '+room.count+'/'+room.capacity;const button=document.createElement('button');button.textContent='Entrar';button.onclick=()=>{connection.send({type:'join',code:room.code,nick:$('#nick').value});};row.append(title,button);$('#available').append(row);}
  }catch{$('#addresses').textContent='Não foi possível consultar os endereços.';}}
  refresh();setInterval(refresh,4000);window.roomPage={connection,get room(){return current;}};
})();
