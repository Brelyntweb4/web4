# System Architecture

This document outlines how the backend pieces of Brelynt/Web4 interact. The focus is on the minimal setup shipped in the `brelynt-electron` folder.

## Components

### P2P Server (`brelynt-electron/p2p-server.js`)
- Runs a WebSocket server on port **9090**.
- Each client connects and announces itself via a `join` message.
- Broadcasts peer lists, simple transactions and handshake messages.
- Acts as the main communication bus between nodes inside the local network.

### File Hub (`brelynt-electron/filehub.js`)
- HTTP API on port **3040**.
- Exposes `/api/tree`, `/api/file` and other endpoints for browsing and editing files under `brelynt-electron/public`.
- Used by the administrative interface to modify static pages and assets.

### Electron UI (`brelynt-electron`)
- Started through `main.js` or `start-services.sh`.
- Loads `public/index.html` which includes scripts (`p2pBridge.js`, wallet UI, etc.).
- Communicates with the P2P server through WebSockets and with File Hub through HTTP requests.

### Start Script (`brelynt-electron/start-services.sh`)
- Launches both backend servers and then runs the Electron application.
- When the Electron window is closed, the servers are stopped.

## Communication Flow

1. `start-services.sh` starts `filehub.js` and `p2p-server.js`.
2. Electron loads the frontend from `public/index.html`.
3. Frontend JavaScript connects to `ws://localhost:9090` for P2P messages.
4. File management requests are made to `http://localhost:3040`.
5. Nodes in the same LAN exchange transactions and handshake events via the P2P server.

## Extensibility

The backend is intentionally small so that new modules can be plugged in easily:

- **Additional Services.** New Node.js scripts can be launched alongside `filehub.js` and `p2p-server.js` from `start-services.sh` (e.g., a blockchain daemon or resource sharing service).
- **P2P Messages.** Custom message types can be added to `p2p-server.js` and handled in the frontend by extending `p2pBridge.js`.
- **HTTP API.** The File Hub can expose more routes for future features such as user data storage or media streaming.

Because all components communicate over local HTTP/WebSocket ports, each module remains loosely coupled and can be replaced or expanded without changing the core Electron UI.
