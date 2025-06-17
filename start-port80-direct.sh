#!/bin/bash

# Direct port 80 startup script
# Run with: sudo ./start-port80-direct.sh

if [ "$EUID" -ne 0 ]; then
    echo "This script must be run with sudo"
    echo "Usage: sudo ./start-port80-direct.sh"
    exit 1
fi

echo "Starting Sahara Journeys on port 80..."

# Kill any existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f "node server/index.js" 2>/dev/null || true
sleep 2

# Set environment variables
export NODE_ENV=production
export PORT=80
export HOST=0.0.0.0

# Start server
nohup npx tsx server/index.ts > /var/log/sahara-journeys.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > /var/run/sahara-journeys.pid

echo "Server started with PID: $SERVER_PID"
echo "External access: http://74.179.85.9"
echo "Admin panel: http://74.179.85.9/admin"
echo "Log file: /var/log/sahara-journeys.log"

# Wait for startup
sleep 8

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server running successfully on port 80"
else
    echo "❌ Server failed to start"
    echo "Check log: tail /var/log/sahara-journeys.log"
fi