# Web4 Quick Start Guide

This guide explains how to launch BrelyntOS from the `web4.zip` archive and perform basic wallet actions.

## 1. Extract the archive
1. Download `web4.zip` from the releases page.
2. Unpack it to any directory. On Linux or macOS run:
   ```bash
   unzip web4.zip
   ```
   On Windows extract it using any archive manager.

## 2. Install dependencies
1. Open a terminal in the extracted folder and enter `brelynt-electron`:
   ```bash
   cd brelynt-electron
   npm install
   ```
   Node.js 16 or newer is required.

## 3. Start the application
- To launch background services and the Electron interface run:
  ```bash
  ./start-services.sh
  ```
  Alternatively you can use:
  ```bash
  npm start
  ```
  This starts FileHub, the P2P server and opens the Brelynt window.

## 4. Wallet basics
- Click the **Кошелёк** section in the main menu.
- **Баланс** displays your current token amounts.
- **Переводы** lets you send tokens; specify the address and amount and confirm.
- **История** shows previous transactions.
- **Покупка/Продажа** is used to top up or exchange tokens via crypto, card or PayPal.

Close the Electron window when finished; services started through `start-services.sh` shut down automatically.
