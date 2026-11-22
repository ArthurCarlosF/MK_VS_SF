'use strict';
(()=>{
  const key='mkvsf.expansao8.partida',root=document.querySelector('#slots');
  const fighters=window.FIGHTER_INDEX,byId=new Map(fighters.map(c=>[c.id,c]));
  let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{}
  let config=Array.from({length:8},(_,i)=>({id:byId.has(saved.slots?.[i]?.id)?saved.slots[i].id:'scorpion',cpu:!!saved.slots?.[i]?.cpu}));
  if(!saved.slots)config=config.map((c,i)=>({id:i%2?'ryu':'scorpion',cpu:i>1}));
  const count=document.querySelector('#players'),mode=document.querySelector('#mode');
  for(let n=2;n<=8;n++)count.add(new Option(n+' jogadores',n));
  count.value=String(Math.max(2,Math.min(8,Number(saved.count)||2)));
  mode.value=['versus','training','bonus'].includes(saved.mode)?saved.mode:'versus';
  const stages=document.querySelector('#stage');stages.add(new Option('Sala de treino','practice'));
  for(const s of window.NATIVE_STAGE_DATA?.stages||[])if(s.selectable)stages.add(new Option(s.name,s.id));
  stages.value=[...stages.options].some(o=>o.value===saved.stage)?saved.stage:'sf-ryu';
  function draw(){
    root.replaceChildren();
    for(let i=0;i<Number(count.value);i++){
      const div=document.createElement('div');div.className='slot';
      div.innerHTML=`<b>JOGADOR ${i+1}</b><label>Personagem<select aria-label="Personagem do jogador ${i+1}"><option value="scorpion">Scorpion — UMK3</option><option value="ryu">Ryu — Super Turbo</option></select></label><label><input type="checkbox"> Controlado pelo computador</label>`;
      const select=div.querySelector('select'),cpu=div.querySelector('input');select.value=config[i].id;cpu.checked=config[i].cpu;
      select.replaceChildren(...[['mk','Mortal Kombat'],['sf','Street Fighter']].map(([side,name])=>{
        const group=document.createElement('optgroup');group.label=name;
        group.append(...fighters.filter(c=>c.side===side).map(c=>new Option(c.name+' — '+c.status,c.id)));
        return group;
      }));select.value=config[i].id;
      select.onchange=()=>config[i].id=select.value;cpu.onchange=()=>config[i].cpu=cpu.checked;root.append(div);
    }
  }
  count.onchange=draw;draw();
  document.querySelector('#play').onclick=()=>{
    const slots=config.slice(0,Number(count.value));
    if(slots.some(c=>byId.get(c.id)?.selectionOnly)){document.querySelector('#message').textContent=slots.filter(c=>byId.get(c.id)?.selectionOnly).map(c=>byId.get(c.id).name).join(', ')+' — seleção disponível. A entrada na arena e os movimentos ainda estão pendentes.';return;}
    try{localStorage.setItem(key,JSON.stringify({count:slots.length,mode:mode.value,stage:stages.value,slots:config}));}catch{}
    const params=new URLSearchParams({players:slots.map(c=>c.id).join(','),cpu:slots.flatMap((c,i)=>c.cpu?[i]:[]).join(','),mode:mode.value,stage:stages.value});
    location.href='arena/index.html?'+params;
  };
  const arcadeRoster=window.ROSTER.map(c=>({...c,portrait:'../'+c.file}));
  const extraPortraits=fighters.filter(c=>c.portrait).map(c=>({id:c.rosterId,name:c.name,side:c.side,portrait:c.portrait}));
  const portraits=[...arcadeRoster,...extraPortraits,...fighters.filter(c=>c.selectionOnly&&!c.portrait).map(c=>({id:c.rosterId,name:c.name,side:c.side}))];
  for(const c of portraits){
    const integrated=fighters.find(f=>f.rosterId===c.id),available=!!integrated,div=document.createElement('div');div.className='portrait'+(available?'':' pending');
    const img=document.createElement('img');if(c.portrait)img.src=c.portrait;img.alt=c.name;
    const name=document.createElement('div');name.textContent=c.name;
    const status=document.createElement('small');status.textContent=available?integrated.status:'Combate pendente';
    if(c.portrait)div.append(img);div.append(name,status);
    if(integrated?.selectionOnly){div.tabIndex=0;div.setAttribute('role','button');div.setAttribute('aria-label','Selecionar '+c.name);const choose=()=>{config[0].id=integrated.id;draw();document.querySelector('#message').textContent=c.name+' selecionado para 1P. Combate e movimentos pendentes.';};div.onclick=choose;div.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}};}
    document.querySelector('#'+c.side).append(div);
  }
  document.querySelector('#progress').textContent=fighters.length+' de '+portraits.length+' lutadores catalogados com alguma integração de combate. Consulte a situação de cada personagem.';
})();
