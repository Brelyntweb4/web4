// blhub-server.js
const express = require('express');
const path = require('path');
const app = express();

const FRONTEND_DIR = path.join(__dirname, 'public'); // путь к public

app.use(express.static(FRONTEND_DIR));

const PORT = 3040;
app.listen(PORT, () => {
  console.log(`BL Hub сервер запущен: http://localhost:${PORT}`);
});
