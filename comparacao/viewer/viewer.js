'use strict';
const data=window.COMPARACAO,gameSelect=document.querySelector('#game'),caseSelect=document.querySelector('#case'),slider=document.querySelector('#sample');
let current=0,playing=false,last=0,acc=0;
const fmt=v=>Number(v).toFixed(3);
for(const c of data.suite.cases){const o=document.createElement('option');o.value=c.id;o.textContent=c.label;caseSelect.append(o);}
function selected(){const game=gameSelect.value,id=caseSelect.value,all=data.games[game];return {game,id,all,a:all.native.cases.find(c=>c.id===id),b:all.prototype.cases.find(c=>c.id===id)};}
function stop(){playing=false;document.querySelector('#play').textContent='Reproduzir registros';}
function show(){const {game,id,all,a,b}=selected();slider.max=a.samples.length-1;slider.value=current;
 const x=a.samples[current],y=b.samples[current];document.querySelector('#time').textContent=`${current+1}/${a.samples.length} · ${(x.time_s*1000).toFixed(0)} ms`;
 const command=v=>{const names=[];if(v.x)names.push(v.x>0?'direita':'esquerda');for(const [key,label] of Object.entries({up:'cima',down:'baixo',punch:'soco',kick:'chute',guard:'defesa'}))if(v[key])names.push(label);return names.join(' + ')||'sem botão';};
 document.querySelector('#input').textContent='Comandos · 1P: '+command(x.input[0])+' · 2P: '+command(x.input[1]);
 document.querySelector('#raw-state').textContent='Original: estado '+JSON.stringify(x.after.state_raw)+'; pose '+x.after.pose+'. Protótipo: estado '+y.after.state_raw+'; pose '+(y.after.pose||'sem correspondência direta registrada')+'. Os identificadores não são automaticamente equivalentes.';
 for(const [key,trace] of [['original',a],['prototype',b]]){
  const frames=trace.samples.filter(s=>s.screenshot);const nearest=frames.reduce((best,s)=>Math.abs(s.sample-current)<Math.abs(best.sample-current)?s:best,frames[0]);
  document.querySelector('#'+key).src=`${key}/${game}/rep-1/${nearest.screenshot}`;
  document.querySelector('#'+key+'-caption').textContent=`Imagem da amostra ${nearest.sample+1} · ${(nearest.time_s*1000).toFixed(0)} ms`;
 }
 const rows=[['Deslocamento X',x.after.x-a.initial.x,y.after.x-b.initial.x],['Altura',Math.abs(x.after.y-a.initial.y),Math.abs(y.after.y-b.initial.y)],['Vida 1P (%)',x.after.life_percent[0],y.after.life_percent[0]],['Vida 2P (%)',x.after.life_percent[1],y.after.life_percent[1]]];
 document.querySelector('#values').innerHTML=rows.map(([label,v,w])=>`<tr><td>${label}</td><td>${fmt(v)}</td><td>${fmt(w)}</td><td>${fmt(w-v)}</td></tr>`).join('');
 const r=data.summary.differences.find(c=>c.game===game&&c.id===id);
 document.querySelector('#status').textContent=({difference_observed:'Diferença observada',context_mismatch:'Posição inicial de contato diferente',within_numeric_tolerances:'Valores dentro das tolerâncias numéricas'})[r.status];
 document.querySelector('#details').textContent=`Maior diferença: posição ${fmt(r.max_error.position)}, altura ${fmt(r.max_error.height)}, vida ${fmt(r.max_error.life)} ponto(s). Estas medidas não validam sozinhas animação ou aceitação de comandos.`;
 const repeat=data.summary.repeatability[game];document.querySelector('#repeat').textContent=`Repetições: original ${repeat.original.identical?'idêntico nos campos verificados':'com diferenças registradas'}; protótipo ${repeat.prototype.identical?'idêntico nos campos verificados':'com diferenças registradas'}.`;
}
for(const element of [gameSelect,caseSelect])element.onchange=()=>{current=0;stop();show();};
slider.oninput=()=>{current=+slider.value;stop();show();};
document.querySelector('#prev').onclick=()=>{current=Math.max(0,current-1);stop();show();};document.querySelector('#next').onclick=()=>{current=Math.min(+slider.max,current+1);stop();show();};
document.querySelector('#play').onclick=()=>{playing=!playing;if(playing&&current>=+slider.max)current=0;document.querySelector('#play').textContent=playing?'Pausar registros':'Reproduzir registros';};
function tick(now){if(playing){acc+=(last?(now-last)/1000:0)*+document.querySelector('#speed').value;const fps=selected().all.native.fps;while(acc>=1/fps){current++;acc-=1/fps;if(current>=+slider.max){current=+slider.max;stop();break;}}show();}else acc=0;last=now;requestAnimationFrame(tick);}show();requestAnimationFrame(tick);
window.comparisonViewer={selected,get sample(){return current},show};
