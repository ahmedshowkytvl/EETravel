#!/bin/bash

echo "Starting Sahara Journeys travel booking platform..."

# Kill any existing server processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
sleep 2

# Start the server
cross-env NODE_ENV=development npx tsx server/index.ts &

# Wait for server to start
sleep 15

# Test connection
echo "Testing server connection..."
if curl -s -I http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Server is running successfully on port 8080"
else
    echo "❌ Server connection failed"
fi