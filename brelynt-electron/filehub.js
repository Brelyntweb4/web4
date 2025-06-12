// filehub.js
// Usage: run `node filehub.js` to start a small HTTP API on port 3040
// for browsing and editing files inside the `public` directory.
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const ROOT_DIR = path.resolve(__dirname, 'public');
const app = express();
app.use(cors());
app.use(express.json());

// Рекурсивно строим дерево файлов и папок
function getTree(dir) {
    const stats = fs.statSync(dir);
    if (!stats.isDirectory()) return null;
    return {
        name: path.basename(dir),
        path: path.relative(ROOT_DIR, dir),
        type: 'folder',
        children: fs.readdirSync(dir).map(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                return getTree(fullPath);
            }
            return {
                name: file,
                path: path.relative(ROOT_DIR, fullPath),
                type: 'file'
            };
        })
    };
}

// --- API: дерево файлов ---
app.get('/api/tree', (req, res) => {
    try {
        const tree = getTree(ROOT_DIR);
        res.json(tree);
    } catch (e) {
        res.status(500).send('Ошибка сервера: ' + e.message);
    }
});

// --- API: получить файл ---
app.get('/api/file', (req, res) => {
    const filePath = path.resolve(ROOT_DIR, req.query.path || '');
    if (!filePath.startsWith(ROOT_DIR)) {
        return res.status(400).send('Invalid path');
    }
    res.send(fs.readFileSync(filePath, 'utf-8'));
});

// --- API: сохранить файл ---
app.post('/api/file', (req, res) => {
    const filePath = path.resolve(ROOT_DIR, req.body.path || '');
    if (!filePath.startsWith(ROOT_DIR)) {
        return res.status(400).send('Invalid path');
    }
    fs.writeFileSync(filePath, req.body.content);
    res.send('OK');
});

// Раздача статики (HTML-редактор)
app.use(express.static(ROOT_DIR));

// --- Запуск сервера ---
app.listen(3040, () => {
    console.log('BL Hub API работает на http://localhost:3040');
});

