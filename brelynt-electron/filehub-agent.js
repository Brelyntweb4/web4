// filehub-agent.js
// Usage: run `node filehub-agent.js` to expose a minimal file API on port 3040
// limited to the `public` directory.
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const ROOT_DIR = path.resolve(__dirname, 'public'); // Корневая директория
const app = express();
app.use(cors());
app.use(express.json());

// Получить дерево файлов
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

// Получить дерево файлов
app.get('/api/tree', (req, res) => {
    res.json(getTree(ROOT_DIR));
});

// Прочитать файл
app.get('/api/file', (req, res) => {

    res.send(fs.readFileSync(filePath, 'utf-8'));
});

// Записать (изменить или создать) файл
app.post('/api/file', (req, res) => {

    if (!filePath.startsWith(ROOT_DIR)) {
        return res.status(400).send('Invalid path');
    }
    fs.writeFileSync(filePath, req.body.content, 'utf-8');
    res.send('OK');
});

// Удалить файл
app.delete('/api/file', (req, res) => {

    fs.unlinkSync(filePath);
    res.send('Deleted');
});

app.listen(3040, () => {
    console.log('FileHub Agent работает на http://localhost:3040');
});
