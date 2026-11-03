'use strict';
(()=>{
  const KEY='mkvsf.sala.v1';
  class RoomConnection{
    constructor({onMessage=()=>{},onStatus=()=>{},resume=true}={}){
      this.onMessage=onMessage;this.onStatus=onStatus;this.resume=resume;this.closed=false;this.retry=0;this.pending=[];
      try{this.identity=JSON.parse(sessionStorage.getItem(KEY)||'null');}catch{this.identity=null;}
      this.connect();
    }
    connect(){
      if(this.closed)return;
      this.onStatus('Conectando…');this.ws=new WebSocket((location.protocol==='https:'?'wss:':'ws:')+'//'+location.host+'/ws');
      this.ws.onopen=()=>{
        this.retry=0;this.onStatus('Conectado');
        if(this.resume&&this.identity)this.send({type:'join',code:this.identity.code,token:this.identity.token});
        for(const m of this.pending.splice(0))this.send(m);
      };
      this.ws.onmessage=e=>{
        let m;try{m=JSON.parse(e.data);}catch{return;}
        if(m.type==='joined'){
          this.identity={code:m.room.code,token:m.token,id:m.playerId};sessionStorage.setItem(KEY,JSON.stringify(this.identity));
          this.slot=m.slot;this.room=m.room;
        }
        if(m.type==='room')this.room=m.room;
        if(m.type==='left'){sessionStorage.removeItem(KEY);this.identity=null;this.room=null;}
        this.onMessage(m);
      };
      this.ws.onclose=e=>{
        if(this.closed)return;
        if(e.code===4001){this.closed=true;this.onStatus('Esta participação foi aberta em outra janela.');return;}
        this.onStatus('Conexão interrompida. Reconectando…');
        this.retryTimer=setTimeout(()=>this.connect(),Math.min(5000,500*2**this.retry++));
      };
      this.ws.onerror=()=>{};
    }
    send(value){if(this.ws.readyState===WebSocket.OPEN)this.ws.send(JSON.stringify(value));else if(!this.closed&&['create','join'].includes(value.type))this.pending.push(value);}
    leave(){this.send({type:'leave'});this.identity=null;sessionStorage.removeItem(KEY);this.close();}
    close(){this.closed=true;clearTimeout(this.retryTimer);this.ws.close();}
    get connected(){return this.ws?.readyState===WebSocket.OPEN;}
  }
  class NetworkArena{
    constructor({room,match,ids,onStatus=()=>{},onSlot=()=>{}}){
      this.code=room;this.match=match;this.ids=ids;this.slot=-1;this.seq=0;this.frames=[];this.onStatus=onStatus;this.rtt=null;this.loaded=false;
      this.conn=new RoomConnection({onStatus:s=>{this.connectedStatus=s;onStatus(s);},onMessage:m=>{
        if(m.type==='error'){onStatus(m.message);return;}
        if(m.type==='joined'){this.slot=m.slot;this.seq=0;onSlot(m.slot);}
        if(m.type==='match'){
          if(m.match!==this.match||m.ids.join(',')!==ids.join(',')){location.replace(NetworkArena.url(m));return;}
          this.slot=m.slot;onSlot(m.slot);if(this.loaded)this.conn.send({type:'loaded',match:this.match});
        }
        if(m.type==='room'){this.room=m.room;onStatus(this.status());}
        if(m.type==='frame'&&m.match===this.match){this.latest=m;this.frames.push(m);if(this.frames.length>12)this.frames.shift();}
        if(m.type==='pong'){this.rtt=Math.max(0,Math.round(performance.now()-m.at));onStatus(this.status());}
        if(m.type==='lobby')location.replace('/salas.html');
      }});
      if(!this.conn.identity||this.conn.identity.code!==room){this.conn.close();location.replace('/salas.html?join='+encodeURIComponent(room));return;}
      this.pingTimer=setInterval(()=>{if(this.conn.connected)this.conn.send({type:'ping',at:performance.now()});},2000);
    }
    static url(m){return '/expansao/arena/index.html?'+new URLSearchParams({players:m.ids.join(','),mode:m.mode,stage:m.stage||'practice',room:m.room,match:m.match});}
    ready(){this.loaded=true;this.conn.send({type:'loaded',match:this.match});}
    status(){
      if(!this.conn.connected)return this.connectedStatus||'Reconectando…';
      if(this.room?.phase==='loading')return 'Esperando todos carregarem a arena…';
      return 'Rede local · você é '+(this.slot+1)+'P'+(this.rtt===null?'':' · '+this.rtt+' ms');
    }
    input(input,force=false){
      const now=performance.now(),text=JSON.stringify(input);
      if(this.slot<0||!this.loaded)return;
      if(force||text!==this.lastInput||now-(this.sentAt||0)>100){this.lastInput=text;this.sentAt=now;this.conn.send({type:'input',match:this.match,seq:++this.seq,input});}
    }
    apply(game){
      if(!this.latest||this.applied===this.latest.tick)return;
      this.applied=this.latest.tick;Object.assign(game,this.latest.state);
    }
    rematch(){if(this.conn.room?.hostId===this.conn.identity?.id)this.conn.send({type:'rematch'});else this.onStatus('Aguarde o anfitrião voltar à sala.');}
    leave(){clearInterval(this.pingTimer);this.conn.leave();location.href='/salas.html';}
    get isHost(){return this.conn.room?.hostId===this.conn.identity?.id;}
  }
  window.LanRoomConnection=RoomConnection;window.NetworkArena=NetworkArena;
})();
