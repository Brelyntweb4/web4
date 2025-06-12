const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3040;

// Абсолютный путь к вашей папке public
const ROOT = path.resolve(__dirname, 'public');

// Это строка для отдачи статических файлов
app.use(express.static(ROOT));

app.use(express.json());

// Просмотр файла через API
app.get('/file', (req, res) => {
    const { filename } = req.query;
    if (!filename) return res.status(400).json({ error: 'No filename' });
    const filePath = path.resolve(ROOT, filename);
    if (!filePath.startsWith(ROOT)) return res.status(403).json({ error: 'Forbidden' });
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });
    res.sendFile(filePath);
});

// Сохранить файл (заменить всё содержимое)
app.post('/file', (req, res) => {
    const { filename, content } = req.body;
    if (!filename || typeof content !== 'string') return res.status(400).json({ error: 'Invalid data' });
    const filePath = path.resolve(ROOT, filename);
    if (!filePath.startsWith(ROOT)) return res.status(403).json({ error: 'Forbidden' });

    // Бэкап — копия до изменений
    if (fs.existsSync(filePath)) {
        const backupPath = filePath + '.' + Date.now() + '.bak';
        fs.copyFileSync(filePath, backupPath);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    res.json({ ok: true });
});

// Список файлов (только в public)
app.get('/list', (req, res) => {
    fs.readdir(ROOT, { withFileTypes: true }, (err, files) => {
        if (err) return res.status(500).json({ error: 'Read error' });
        res.json(files.map(f => ({
            name: f.name,
            type: f.isDirectory() ? 'dir' : 'file'
        })));
    });
});

app.listen(PORT, () => {
    console.log('FileHub API и статика запущены на http://localhost:' + PORT);
});

