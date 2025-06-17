#!/bin/bash

# Production deployment script for Sahara Journeys
# Configures and starts server on port 80

echo "🚀 Deploying Sahara Journeys to Production"

# Kill any existing processes
sudo pkill -f "tsx server/index.ts" 2>/dev/null || true
sudo pkill -f "node.*server" 2>/dev/null || true
sleep 3

# Create necessary directories
sudo mkdir -p /var/log/sahara-journeys
sudo mkdir -p /var/run/sahara-journeys

# Set ownership
sudo chown -R ahmed:ahmed /var/log/sahara-journeys
sudo chown -R ahmed:ahmed /var/run/sahara-journeys

echo "📊 Starting server on port 80..."

# Start server with proper environment
sudo -E NODE_ENV=production PORT=80 HOST=0.0.0.0 nohup npx tsx server/index.ts > /var/log/sahara-journeys/production.log 2>&1 &

SERVER_PID=$!
echo $SERVER_PID | sudo tee /var/run/sahara-journeys/server.pid > /dev/null

echo "Server PID: $SERVER_PID"
echo "Waiting for startup..."

# Monitor startup progress
for i in {1..30}; do
    sleep 2
    
    if ! sudo ps -p $SERVER_PID > /dev/null 2>&1; then
        echo "❌ Server process terminated"
        echo "📋 Last log entries:"
        sudo tail -20 /var/log/sahara-journeys/production.log
        exit 1
    fi
    
    # Check if server is responding
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 2>/dev/null | grep -q "200\|404\|302"; then
        echo "✅ Server is responding on port 80"
        break
    fi
    
    echo "⏳ Waiting for server startup... ($i/30)"
done

# Final status check
if sudo ps -p $SERVER_PID > /dev/null 2>&1; then
    echo ""
    echo "🎉 Sahara Journeys Production Deployment Complete!"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Main Site: http://74.179.85.9"
    echo "   Admin Panel: http://74.179.85.9/admin"
    echo ""
    echo "📊 Server Info:"
    echo "   PID: $SERVER_PID"
    echo "   Port: 80"
    echo "   Log: /var/log/sahara-journeys/production.log"
    echo ""
    echo "🔧 Management Commands:"
    echo "   View logs: sudo tail -f /var/log/sahara-journeys/production.log"
    echo "   Stop server: sudo kill $SERVER_PID"
    echo ""
else
    echo "❌ Server failed to start properly"
    echo "📋 Check logs: sudo tail -50 /var/log/sahara-journeys/production.log"
    exit 1
fi