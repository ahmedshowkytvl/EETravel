#!/bin/bash

# Sahara Journeys Auto-Start Script
# This script automatically starts the travel booking platform server

echo "🏜️ Starting Sahara Journeys Travel Platform..."
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js and try again"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install npm and try again"
    exit 1
fi

# Display Node.js version
echo "Node.js version: $(node --version)"

# Check if tsx is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx is not available"
    exit 1
fi

# Kill any existing server processes on port 8080
echo "🔍 Checking for existing server processes..."
if lsof -ti:8080 > /dev/null 2>&1; then
    echo "⚠️ Stopping existing server on port 8080..."
    pkill -f "tsx server/index.ts" 2>/dev/null || true
    sleep 2
fi

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️ Warning: .env file not found"
    echo "Database connection may fail without proper environment variables"
fi

# Start the server
echo "🚀 Starting Sahara Journeys server..."
echo "Server will be available at: http://localhost:8080"
echo "Admin panel: http://localhost:8080/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=============================================="

# Start the server with tsx
npx tsx server/index.ts