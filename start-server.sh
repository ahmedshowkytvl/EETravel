#!/bin/bash

# Kill any existing server processes
pkill -f "npx tsx server/index.ts" 2>/dev/null || true
sleep 2

# Start the server
echo "Starting development server..."
cd "$(dirname "$0")"
cross-env NODE_ENV=development npx tsx server/index.ts