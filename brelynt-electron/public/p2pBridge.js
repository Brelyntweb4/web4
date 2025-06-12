(function(){
  let active = false;
  const defaultAddr = "ws://localhost:9090";
  function start(){
    if(typeof startP2P === 'function'){
      startP2P(defaultAddr);
      active = true;
    }
  }
  function stop(){
    if(typeof ws !== 'undefined' && ws){
      try {
        ws.onclose = () => {};
        ws.close();
      } catch(e) {}
    }
    active = false;
  }
  window.p2pBridge = {
    toggle(){
      if(active){
        stop();
      } else {
        start();
      }
      return active;
    },
    start,
    stop
  };
})();
