#!/bin/bash

# Quick Start Script for Sahara Journeys
# Bypasses drizzle-kit issues and starts server directly

echo "🌍 Quick Start - Sahara Journeys"
echo "================================="

# Kill any existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
sleep 2

# Set environment variables
export NODE_ENV=production
export PORT=8080
export HOST=0.0.0.0

# Check if DATABASE_URL is available
if [ -n "$DATABASE_URL" ]; then
    echo "✅ Database configured"
else
    echo "⚠️ DATABASE_URL not found"
fi

echo "🚀 Starting server on port 8080..."

# Start server directly without database initialization
nohup npx tsx server/index.ts > sahara-server.log 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > server.pid

echo "Server started with PID: $SERVER_PID"
sleep 8

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server running successfully"
    echo "🌐 Access: http://74.179.85.9:8080"
    echo "⚙️ Admin: http://74.179.85.9:8080/admin"
    echo ""
    echo "To stop: kill $SERVER_PID"
else
    echo "❌ Server failed to start"
    echo "Log output:"
    tail -10 sahara-server.log
fi