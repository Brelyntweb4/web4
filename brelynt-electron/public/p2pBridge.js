(function(){
  const DEFAULT_ADDR = "ws://localhost:9090";
  let ws = null;
  let reconnectTimer = null;
  let shouldReconnect = false;
  let peers = [];
  const handshaked = new Set();
  const myName = localStorage.getItem('brelynt-name') || 'User';

  function connect(addr){
    ws = new WebSocket(addr);

    ws.onopen = () => {
      console.log('P2P: соединение установлено.');
      ws.send(JSON.stringify({type:'join', name: myName}));
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if(msg.type === 'peers'){
        peers = msg.peers;
        console.log('Список пиров:', peers);
      }
      if(msg.type === 'tx'){
        addRemoteTx(msg.tx);
      }
      if(msg.type === 'handshake'){
        console.log('Handshake от', msg.name);
        if(msg.name !== myName && !handshaked.has(msg.name)){
          handshaked.add(msg.name);
          ws.send(JSON.stringify({type:'handshake', name: myName}));
        }
      }
    };

    ws.onclose = () => {
      console.warn('P2P: соединение потеряно.');
      ws = null;
      if(shouldReconnect){
        reconnectTimer = setTimeout(() => connect(addr), 5000);
      }
    };

    ws.onerror = (e) => {
      console.error('P2P: ошибка соединения:', e);
    };
  }

  function start(addr = DEFAULT_ADDR){
    if(ws) return;
    shouldReconnect = true;
    connect(addr);
    return true;
  }

  function stop(){
    shouldReconnect = false;
    if(reconnectTimer){
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if(ws){
      ws.close();
      ws = null;
    }
    return false;
  }

  function toggle(addr){
    return ws ? stop() : start(addr);
  }

  function sendTx(tx){
    if(ws && ws.readyState === 1){
      ws.send(JSON.stringify({type:'tx', tx}));
    }
  }

  function addRemoteTx(tx){
    const key = 'brelynt-tx';
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    list.push(tx);
    localStorage.setItem(key, JSON.stringify(list));
    if(window.renderMenu) window.renderMenu();
  }

  window.p2pBridge = { start, stop, toggle, sendTx, isRunning: () => !!ws };
})();
