#!/bin/bash

# Production server startup script for external access
echo "Starting Sahara Journeys Production Server..."

# Kill any existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
sleep 2

# Set production environment
export NODE_ENV=production
export PORT=80
export HOST=0.0.0.0

# Start server in background with nohup for persistence
nohup npx tsx server/index.ts > server_output.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > server.pid

echo "Server started with PID: $SERVER_PID"
echo "Waiting for server to initialize..."

# Wait for server to start
sleep 15

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server is running"
    echo "🌐 External access: http://74.179.85.9"
    echo "⚙️ Admin panel: http://74.179.85.9/admin"
    
    # Test local connectivity
    if curl -s --connect-timeout 5 "http://localhost" > /dev/null; then
        echo "✅ Local connectivity confirmed"
    else
        echo "❌ Local connectivity failed"
    fi
    
    # Show server status
    netstat -tlnp 2>/dev/null | grep :80 || ss -tlnp 2>/dev/null | grep :80
    
else
    echo "❌ Server failed to start"
    echo "Check server_output.log for details"
    cat server_output.log | tail -20
fi