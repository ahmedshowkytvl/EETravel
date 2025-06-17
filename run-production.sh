#!/bin/bash

# Production server runner for port 80
# Usage: sudo ./run-production.sh

echo "Starting Sahara Journeys Production Server"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Error: This script requires sudo for port 80 access"
    echo "Usage: sudo ./run-production.sh"
    exit 1
fi

# Kill existing processes
pkill -f "tsx server/index.ts" 2>/dev/null
sleep 3

# Set production environment
export NODE_ENV=production
export PORT=80
export HOST=0.0.0.0

# Ensure log directory exists
mkdir -p /var/log/sahara-journeys

# Start server with proper logging
echo "Starting server on port 80..."
nohup su ahmed -c "cd $(pwd) && NODE_ENV=production PORT=80 HOST=0.0.0.0 npx tsx server/index.ts" > /var/log/sahara-journeys/server.log 2>&1 &

SERVER_PID=$!
echo $SERVER_PID > /var/run/sahara-journeys.pid

echo "Server starting with PID: $SERVER_PID"
echo "Waiting for initialization..."

# Monitor startup
for i in {1..20}; do
    sleep 1
    if ps -p $SERVER_PID > /dev/null; then
        if grep -q "serving on port 80" /var/log/sahara-journeys/server.log 2>/dev/null; then
            echo "Server successfully started on port 80"
            echo "Access: http://74.179.85.9"
            echo "Admin: http://74.179.85.9/admin"
            exit 0
        fi
    else
        echo "Server process terminated during startup"
        echo "Check log: tail /var/log/sahara-journeys/server.log"
        exit 1
    fi
done

# If we get here, startup took too long
if ps -p $SERVER_PID > /dev/null; then
    echo "Server is running but startup taking longer than expected"
    echo "Check log: tail -f /var/log/sahara-journeys/server.log"
else
    echo "Server failed to start"
    echo "Check log: tail /var/log/sahara-journeys/server.log"
    exit 1
fi