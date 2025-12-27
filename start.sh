#!/usr/bin/env bash
# Helper script to start the server (sources nvm if available)
set -e

export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck source=/dev/null
  . "$NVM_DIR/nvm.sh"
fi

nvm use --lts >/dev/null 2>&1 || nvm install --lts

echo "Installing server dependencies (if needed)..."
npm install

echo "Starting server (nodemon if available)..."
# Respect PORT env if provided; npm scripts will pick it up via process.env
if command -v nodemon >/dev/null 2>&1; then
  # prefer nodemon for dev
  nodemon index.js --watch .
else
  node index.js
fi
