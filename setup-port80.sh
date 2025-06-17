#!/bin/bash

# Port 80 Setup Script for Linux
# Provides multiple options for accessing the server on port 80

echo "🔧 Port 80 Configuration for Sahara Journeys"
echo "============================================="

# Check current user
if [ "$EUID" -eq 0 ]; then
    echo "✅ Running as root - all options available"
    ROOT_ACCESS=true
else
    echo "ℹ️ Running as regular user - some options require sudo"
    ROOT_ACCESS=false
fi

echo ""
echo "Available options for port 80 access:"
echo ""

# Option 1: Direct port 80 with sudo
echo "1️⃣ Run server directly on port 80 (requires sudo)"
echo "   Command: sudo PORT=80 ./start-linux.sh"
echo ""

# Option 2: Port forwarding
echo "2️⃣ Use port forwarding (recommended)"
echo "   Server runs on port 3000, forwards to port 80"
echo "   Command: sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000"
echo ""

# Option 3: setcap (advanced)
echo "3️⃣ Grant port binding privileges to Node.js (advanced)"
echo "   Command: sudo setcap 'cap_net_bind_service=+ep' \$(which node)"
echo ""

read -p "Select option (1-3) or press Enter to start on port 3000: " choice

case $choice in
    1)
        echo "Starting server on port 80 with sudo..."
        if [ "$ROOT_ACCESS" = false ]; then
            echo "This will prompt for sudo password:"
            sudo PORT=80 NODE_ENV=production HOST=0.0.0.0 npx tsx server/index.ts &
        else
            PORT=80 NODE_ENV=production HOST=0.0.0.0 npx tsx server/index.ts &
        fi
        echo "Server starting on port 80..."
        echo "Access: http://74.179.85.9"
        ;;
    2)
        echo "Setting up port forwarding..."
        if [ "$ROOT_ACCESS" = false ]; then
            echo "Setting up iptables rule (requires sudo):"
            sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
        else
            iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000
        fi
        echo "Starting server on port 3000..."
        PORT=3000 NODE_ENV=production HOST=0.0.0.0 npx tsx server/index.ts &
        echo "Access: http://74.179.85.9 (forwarded to port 3000)"
        ;;
    3)
        echo "Granting capabilities to Node.js..."
        if [ "$ROOT_ACCESS" = false ]; then
            echo "This requires sudo:"
            sudo setcap 'cap_net_bind_service=+ep' $(which node)
        else
            setcap 'cap_net_bind_service=+ep' $(which node)
        fi
        echo "Starting server on port 80..."
        PORT=80 NODE_ENV=production HOST=0.0.0.0 npx tsx server/index.ts &
        echo "Access: http://74.179.85.9"
        ;;
    *)
        echo "Starting server on port 3000 (no special privileges needed)..."
        PORT=3000 NODE_ENV=production HOST=0.0.0.0 npx tsx server/index.ts &
        echo "Access: http://74.179.85.9:3000"
        ;;
esac

SERVER_PID=$!
echo $SERVER_PID > server.pid
echo "Server PID: $SERVER_PID"
echo "Log output will appear below..."

# Wait a moment for startup
sleep 5

# Show server status
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server is running"
else
    echo "❌ Server failed to start"
fi