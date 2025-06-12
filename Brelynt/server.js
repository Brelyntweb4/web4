// Минимальный сервер (шаблон):
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname));
server.listen(3000, () => {
  console.log('Brelynt P2P Server запущен на http://localhost:3000');
});
