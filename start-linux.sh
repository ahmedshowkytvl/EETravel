#!/bin/bash

# Linux Production Server Startup Script
# Handles port 80 access with proper permissions

echo "🌍 Starting Sahara Journeys on Linux Server"
echo "============================================"

# Check if running with appropriate permissions
USER_ID=$(id -u)
if [ "$USER_ID" -eq 0 ]; then
    echo "⚠️ Running as root - using port 8080"
    DEFAULT_PORT=8080
else
    echo "ℹ️ Running as regular user - using port 8080"
    DEFAULT_PORT=8080
fi

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-$DEFAULT_PORT}
export HOST=0.0.0.0

# Kill existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f "node server/index.js" 2>/dev/null || true
sleep 2

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Ensure drizzle-kit is available
if ! npm list drizzle-kit >/dev/null 2>&1; then
    echo "📦 Installing drizzle-kit..."
    npm install drizzle-kit
fi

# Check database connection
if [ -n "$DATABASE_URL" ]; then
    echo "✅ Database connection configured"
    echo "🔧 Testing database connectivity..."
    node init-database-simple.js || echo "⚠️ Database test failed - continuing anyway"
else
    echo "⚠️ DATABASE_URL not set - server may fail to start"
fi

echo "🚀 Starting server on port $PORT..."

# Start server
if [ "$PORT" = "80" ] && [ "$USER_ID" -ne 0 ]; then
    echo "❌ Port 80 requires root privileges"
    echo ""
    echo "Choose one option:"
    echo "1. Run with sudo: sudo ./start-linux.sh"
    echo "2. Use port 3000: PORT=3000 ./start-linux.sh"
    echo "3. Use port forwarding: sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000"
    exit 1
fi

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
    
    # Display access information
    echo "🌐 External access: http://74.179.85.9:$PORT"
    echo "⚙️ Admin panel: http://74.179.85.9:$PORT/admin"
    
    # Test connectivity
    if command -v curl &> /dev/null; then
        if curl -s --connect-timeout 5 "http://localhost:$PORT" > /dev/null; then
            echo "✅ Local connectivity confirmed"
        else
            echo "⚠️ Local connectivity test failed"
        fi
    fi
    
    # Show port status
    if command -v ss &> /dev/null; then
        ss -tlnp | grep ":$PORT " || echo "Port status check failed"
    elif command -v netstat &> /dev/null; then
        netstat -tlnp | grep ":$PORT " || echo "Port status check failed"
    fi
    
    echo ""
    echo "📋 Server Information:"
    echo "- PID: $SERVER_PID"
    echo "- Port: $PORT"
    echo "- Environment: $NODE_ENV"
    echo "- Log file: sahara-server.log"
    echo ""
    echo "To stop the server: kill $SERVER_PID"
    
else
    echo "❌ Server failed to start"
    echo "Check sahara-server.log for details:"
    tail -20 sahara-server.log
fi