# install-buy-module.ps1 — Windows PowerShell 5.x совместимость

$AppDir    = "D:\BrelyntApp\brelynt-electron"
$Frontend  = "$AppDir\index.html"
$BuyJS     = "$AppDir\buyToken.js"
$BuyCSS    = "$AppDir\buyToken.css"
$BackupDir = "$AppDir\_backup"
$Date      = Get-Date -Format "yyyyMMdd_HHmmss"

# Коды файлов
$buyJS = @"
document.addEventListener('DOMContentLoaded', () => {
  const payBtns = document.querySelectorAll('.pay-method');
  let currentPay = 'PayPal';
  payBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      payBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPay = btn.textContent.trim();
    });
  });
  const form = document.getElementById('buyForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const sum = form.querySelector('input[type=""number""]').value;
      alert(`Отправлен запрос на покупку ${sum} BRY через ${currentPay}. (Заглушка — интеграция позже)`);
    });
  }
});
"@

$buyCSS = @"
.wallet-module {
  background: #222; border-radius: 18px; padding: 28px 32px 22px 32px; margin-bottom: 18px; width: 400px; max-width: 96vw; box-shadow: 0 0 24px #1118;
}
.module-header { display: flex; justify-content: space-between; align-items: center; }
.module-title { font-size: 1.16em; font-weight: 800; color: #f1f1f1; }
.module-settings { background: #232323; color: #fff; border: none; font-size: 1.25em; border-radius: 7px; cursor: pointer; padding: 4px 10px; transition: background 0.15s; }
.module-settings:hover { background: #444; }
.module-desc { color: #bbb; margin: 12px 0 16px 0; font-size: 0.98em; }
.pay-methods { display: flex; gap: 12px; margin: 10px 0 6px 0; flex-wrap: wrap; }
.pay-method { background: #252c34; color: #f1f1f1; border: none; border-radius: 10px; padding: 8px 18px; font-size: 1.08em; font-weight: 600; cursor: pointer; transition: background 0.15s, color 0.15s; outline: none; min-width: 90px; }
.pay-method.active, .pay-method:focus { background: #1697f6; color: #fff; }
.main-action-btn { background: #1697f6; color: #fff; border: none; border-radius: 12px; padding: 8px 28px; font-size: 1.1em; cursor: pointer; font-weight: 700; margin-top: 8px; transition: background 0.18s; }
.main-action-btn:hover { background: #1276be; }
"@

$mainMenuHTML = @"
<div class=""main-menu"" id=""mainMenu"">
  <div class=""wallet-module"">
    <div class=""module-header"">
      <span class=""module-title"">Покупка токена</span>
      <button class=""module-settings"" style=""display:none"" onclick=""openSettings('buy')"">&#9881;</button>
    </div>
    <div class=""module-desc"">
      Купите BRY токены за рубли, криптовалюту, PayPal и другие методы.
    </div>
    <form id=""buyForm"">
      <label>Сумма (BRY):<br>
        <input type=""number"" min=""1"" max=""10000"" value=""100"" style=""width:140px"">
      </label>
      <br>
      <div class=""pay-methods"">
        <button type=""button"" class=""pay-method active"">PayPal</button>
        <button type=""button"" class=""pay-method"">Revolut</button>
        <button type=""button"" class=""pay-method"">BTC/ETH/TON</button>
        <button type=""button"" class=""pay-method"">Банковская карта</button>
      </div>
      <br>
      <button type=""submit"" class=""main-action-btn"">Купить</button>
    </form>
  </div>
</div>
<script src=""buyToken.js""></script>
<link rel=""stylesheet"" href=""buyToken.css"">
"@

# 1. Создать папку для backup, если нет
if (!(Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir | Out-Null }

# 2. Сохранить старые версии
if (Test-Path $Frontend) { Copy-Item $Frontend "$BackupDir\index_$Date.html" }
if (Test-Path $BuyJS)   { Copy-Item $BuyJS    "$BackupDir\buyToken_$Date.js" }
if (Test-Path $BuyCSS)  { Copy-Item $BuyCSS   "$BackupDir\buyToken_$Date.css" }

# 3. Удалить старые файлы (не важно есть или нет)
Remove-Item $Frontend, $BuyJS, $BuyCSS -ErrorAction SilentlyContinue

# 4. Создать новые файлы
Set-Content -Path $BuyJS -Value $buyJS
Set-Content -Path $BuyCSS -Value $buyCSS

$baseHTML = @"
<!DOCTYPE html>
<html lang='ru'>
<head>
  <meta charset='UTF-8'>
  <title>BrelyntOS</title>
  <style>body { background: #191919; color: #f1f1f1; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; }</style>
</head>
<body>
$mainMenuHTML
</body>
</html>
"@
Set-Content -Path $Frontend -Value $baseHTML

Write-Host "Модуль 'Покупка токена' установлен ЧИСТО. Старые версии в папке _backup."

