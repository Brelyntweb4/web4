function checkTX(txid, keyxl) {
  if(!txid || !keyxl) return 'Ошибка: заполните оба поля';
  // DEMO: эмулируем P2P-сверку и доступ к реестру BTC
  return 'TXID: '+txid+', Key: '+keyxl+' — Проверка успешна (Demo)';
}
