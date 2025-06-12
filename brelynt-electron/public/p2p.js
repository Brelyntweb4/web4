// p2p.js — клиентская часть P2P-обмена

let peers = [];
let ws = null;
let myName = localStorage.getItem('brelynt-name') || 'User';
const handshaked = new Set();

function startP2P(serverAddr = "ws://localhost:9090") {
    ws = new WebSocket(serverAddr);

    ws.onopen = () => {
        console.log("P2P: соединение установлено.");
        ws.send(JSON.stringify({ type: "join", name: myName }));
    };

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.type === "peers") {
            peers = msg.peers;
            console.log("Список пиров:", peers);
        }
        if (msg.type === "tx") {
            addRemoteTx(msg.tx);
        }
        if (msg.type === "handshake") {
            console.log("Handshake от", msg.name);
            if (msg.name !== myName && !handshaked.has(msg.name)) {
                handshaked.add(msg.name);
                ws.send(JSON.stringify({ type: "handshake", name: myName }));
            }
        }
    };

    ws.onclose = () => {
        console.warn("P2P: соединение потеряно.");
        setTimeout(() => startP2P(serverAddr), 5000);
    };

    ws.onerror = (e) => {
        console.error("P2P: ошибка соединения:", e);
    };
}

function sendTx(tx) {
    if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ type: "tx", tx }));
    }
}

function addRemoteTx(tx) {
    let txs = JSON.parse(localStorage.getItem('brelynt-tx') || '[]');
    txs.push(tx);
    localStorage.setItem('brelynt-tx', JSON.stringify(txs));
    if (window.renderMenu) renderMenu();
}

// Тестовая функция для ручной отправки транзакции всем пирами:
window.sendP2PTx = function() {
    const tx = {
        date: (new Date()).toLocaleString(),
        type: Math.random() > 0.5 ? "Приход" : "Расход",
        amount: (Math.random() * 100).toFixed(2),
        address: "0xTEST" + Math.floor(Math.random() * 10000),
        comment: "P2P-Тест"
    };
    sendTx(tx);
    addRemoteTx(tx);
    alert("Транзакция отправлена всем пирами");
};
