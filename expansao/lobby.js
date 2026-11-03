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
      select.replaceChildren(...fighters.map(c=>new Option(c.name+' — '+c.status,c.id)));select.value=config[i].id;
      select.onchange=()=>config[i].id=select.value;cpu.onchange=()=>config[i].cpu=cpu.checked;root.append(div);
    }
  }
  count.onchange=draw;draw();
  document.querySelector('#play').onclick=()=>{
    const slots=config.slice(0,Number(count.value));
    try{localStorage.setItem(key,JSON.stringify({count:slots.length,mode:mode.value,stage:stages.value,slots:config}));}catch{}
    const params=new URLSearchParams({players:slots.map(c=>c.id).join(','),cpu:slots.flatMap((c,i)=>c.cpu?[i]:[]).join(','),mode:mode.value,stage:stages.value});
    location.href='arena/index.html?'+params;
  };
  for(const c of window.ROSTER){
    const integrated=fighters.find(f=>f.rosterId===c.id),available=!!integrated,div=document.createElement('div');div.className='portrait'+(available?'':' pending');
    const img=document.createElement('img');img.src='../'+c.file;img.alt=c.name;
    const name=document.createElement('div');name.textContent=c.name;
    const status=document.createElement('small');status.textContent=available?integrated.status:'Combate pendente';
    div.append(img,name,status);document.querySelector('#'+c.side).append(div);
  }
  document.querySelector('#progress').textContent=fighters.length+' de 38 lutadores com alguma integração de combate. Consulte a situação de cada personagem; os repertórios completos continuam pendentes.';
})();
