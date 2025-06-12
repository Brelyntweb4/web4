#!/bin/sh
# Start Brelynt services and Electron UI
DIR="$(dirname "$(realpath "$0")")"
cd "$DIR"

# Start FileHub server
node filehub.js &
FILEHUB_PID=$!

echo "FileHub started with PID $FILEHUB_PID"

# Start P2P server
node p2p-server.js &
P2P_PID=$!

echo "P2P server started with PID $P2P_PID"

# Give servers a moment to initialize
sleep 2

# Launch Electron application
npx electron .

# When Electron exits, stop background services
kill $FILEHUB_PID $P2P_PID
