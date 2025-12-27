#!/usr/bin/env bash
# Start both server and client, picking a free server port if 5000 is in use.
set -e

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
fi

nvm use --lts >/dev/null 2>&1 || nvm install --lts

ROOT_DIR=$(pwd)
SERVER_DIR="$ROOT_DIR/server"
CLIENT_DIR="$ROOT_DIR/client"

# pick port: prefer 5000, if in use, try 5001
PORT=5000
if lsof -iTCP:${PORT} -sTCP:LISTEN -n -P >/dev/null 2>&1; then
  echo "Port ${PORT} is in use, trying 5001"
  PORT=5001
fi

export PORT

# start server in background
cd "$SERVER_DIR"
./start.sh &
SERVER_PID=$!

# wait for server health
echo "Waiting for server to become healthy on port ${PORT}..."
for i in {1..20}; do
  if curl -s "http://localhost:${PORT}/api/health" | grep -q '"ok":true'; then
    echo "Server healthy"
    break
  fi
  sleep 0.5
done

# start client with Vite env pointing to server
cd "$CLIENT_DIR"
# write a local .env file for Vite if not present
if [ ! -f .env ]; then
  echo "VITE_API_URL=http://localhost:${PORT}" > .env
else
  # ensure VITE_API_URL is set to chosen port
  grep -q '^VITE_API_URL=' .env && sed -i '' -e "s|^VITE_API_URL=.*|VITE_API_URL=http://localhost:${PORT}|" .env || echo "VITE_API_URL=http://localhost:${PORT}" >> .env
fi

npm install
npm run dev

# when client exits, kill server
kill $SERVER_PID || true
