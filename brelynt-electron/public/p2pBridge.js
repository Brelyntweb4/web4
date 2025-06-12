(function(){
  let ws = null;
  let isOn = false;
  const server = "ws://localhost:9090";

  function start(){
    if(isOn) return;
    ws = new WebSocket(server);
    ws.onopen = () => console.log("[p2pBridge] node connected");
    ws.onclose = () => console.log("[p2pBridge] connection closed");
    ws.onerror = (e) => console.error("[p2pBridge] error", e);
    isOn = true;
  }

  function stop(){
    if(!isOn) return;
    if(ws){
      ws.close();
      ws = null;
    }
    isOn = false;
    console.log("[p2pBridge] node stopped");
  }

  window.p2pBridge = {
    toggle(){
      if(isOn){
        stop();
      } else {
        start();
      }
      return isOn;
    }
  };
})();
