// p2p-server.js — P2P сервер (Node.js)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 9090 });
let peers = [];

wss.on('connection', ws => {
    ws.on('message', message => {
        let msg = {};
        try { msg = JSON.parse(message); } catch { return; }
        if (msg.type === "join") {
            peers.push({ ws, name: msg.name });
            broadcast({ type: "peers", peers: peers.map(p => p.name) });
            // информируем остальных о новом участнике
            broadcast({ type: "handshake", name: msg.name }, ws);
        }
        if (msg.type === "tx") {
            broadcast({ type: "tx", tx: msg.tx }, ws);
        }
        if (msg.type === "handshake") {
            // пересылаем рукопожатие другим участникам
            broadcast({ type: "handshake", name: msg.name }, ws);
        }
    });
    ws.on('close', () => {
        peers = peers.filter(p => p.ws !== ws);
        broadcast({ type: "peers", peers: peers.map(p => p.name) });
    });
});

function broadcast(msg, except) {
    const raw = JSON.stringify(msg);
    for (const peer of peers) {
        if (peer.ws !== except && peer.ws.readyState === 1) {
            peer.ws.send(raw);
        }
    }
}
console.log("P2P сервер запущен на ws://localhost:9090");
