#!/bin/bash

# Sahara Journeys - Port 8080 Startup Script
# Optimized for Linux systems using port 8080

echo "🌍 Starting Sahara Journeys on Port 8080"
echo "========================================"

# Kill existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f "node server/index.js" 2>/dev/null || true
sleep 2

# Set environment variables for port 8080
export NODE_ENV=production
export PORT=8080
export HOST=0.0.0.0

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Test database connection
if [ -n "$DATABASE_URL" ]; then
    echo "✅ Database connection configured"
    echo "🔧 Testing database connectivity..."
    node init-database-simple.js || echo "⚠️ Database test failed - continuing anyway"
else
    echo "⚠️ DATABASE_URL not set - server may fail to start"
fi

echo "🚀 Starting server on port 8080..."

# Start the application
nohup npx tsx server/index.ts > sahara-server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > server.pid

echo "Server started with PID: $SERVER_PID"
echo "Waiting for initialization..."
sleep 10

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server is running successfully"
    echo "🌐 External access: http://74.179.85.9:8080"
    echo "⚙️ Admin panel: http://74.179.85.9:8080/admin"
    
    # Test connectivity
    if command -v curl &> /dev/null; then
        if curl -s --connect-timeout 5 "http://localhost:8080" > /dev/null; then
            echo "✅ Local connectivity confirmed"
        else
            echo "⚠️ Local connectivity test failed"
        fi
    fi
    
    # Show port status
    if command -v ss &> /dev/null; then
        ss -tlnp | grep ":8080 " || echo "Port status check failed"
    elif command -v netstat &> /dev/null; then
        netstat -tlnp | grep ":8080 " || echo "Port status check failed"
    fi
    
    echo ""
    echo "📋 Server Information:"
    echo "- PID: $SERVER_PID"
    echo "- Port: 8080"
    echo "- Environment: $NODE_ENV"
    echo "- Log file: sahara-server.log"
    echo ""
    echo "To stop the server: kill $SERVER_PID"
    
else
    echo "❌ Server failed to start"
    echo "Check sahara-server.log for details:"
    tail -20 sahara-server.log
fi