// Demo: генерация миниблока и сверка через P2P
function genMiniBlock(data, key) {
    // Простейший пример: создание “миниблока”
    let hash = btoa(data + key + (Date.now()));
    return {data: data, key: key, hash: hash, date: new Date().toISOString()};
}
function verifyMiniBlock(block, key) {
    let expect = btoa(block.data + key + new Date(block.date).getTime());
    return block.hash === expect;
}
