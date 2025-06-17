#!/bin/bash

# Simple production server start for port 80
echo "Starting Sahara Journeys on port 80..."

# Kill existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
sleep 2

# Start server with sudo for port 80 access
sudo NODE_ENV=production PORT=80 HOST=0.0.0.0 nohup npx tsx server/index.ts > production.log 2>&1 &

SERVER_PID=$!
echo $SERVER_PID > server.pid

echo "Server started with PID: $SERVER_PID"
echo "Monitoring startup..."

# Wait for initialization
for i in {1..20}; do
    sleep 2
    if ! ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "Server process terminated - checking log:"
        tail -10 production.log
        exit 1
    fi
    
    # Test if server is responding
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 2>/dev/null | grep -q "200\|404\|302"; then
        echo "Server successfully running on port 80"
        echo "External access: http://74.179.85.9"
        echo "Admin panel: http://74.179.85.9/admin"
        exit 0
    fi
    
    echo "Waiting for server... ($i/20)"
done

if ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "Server running but taking longer to respond"
    echo "Check: tail -f production.log"
else
    echo "Server failed to start"
    tail -20 production.log
fi