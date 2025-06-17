#!/bin/bash

# Production Deployment Script for Sahara Journeys
# Configures server for external access and production environment

echo "🚀 Deploying Sahara Journeys to Production"
echo "=========================================="

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
   echo "⚠️ Running as root - production deployment"
else
   echo "ℹ️ Running as regular user"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Creating sample .env file..."
    cat > .env << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Server Configuration
NODE_ENV=production
PORT=8080
HOST=0.0.0.0

# Session Configuration
SESSION_SECRET=your-super-secret-session-key-here

# Application Configuration
APP_NAME="Sahara Journeys"
APP_URL=http://74.179.85.9:8080
EOF
    echo "⚠️ Please update .env with your actual configuration"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

# Set production environment
export NODE_ENV=production
export PORT=${PORT:-8080}
export HOST=${HOST:-0.0.0.0}

echo "🔍 Configuration:"
echo "- Environment: $NODE_ENV"
echo "- Port: $PORT"
echo "- Host: $HOST"

# Kill any existing processes
echo "🔄 Stopping existing server processes..."
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f "node server/index.js" 2>/dev/null || true

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check database connection
if [ -n "$DATABASE_URL" ]; then
    echo "🔍 Testing database connection..."
    npx tsx -e "
import postgres from 'postgres';
const sql = postgres('$DATABASE_URL', { max: 1 });
sql\`SELECT 1 as test\`.then(() => {
  console.log('✅ Database connection successful');
  process.exit(0);
}).catch(err => {
  console.log('❌ Database connection failed:', err.message);
  process.exit(1);
}).finally(() => sql.end());
"
    if [ $? -ne 0 ]; then
        echo "❌ Database connection failed. Please check DATABASE_URL"
        exit 1
    fi
else
    echo "⚠️ DATABASE_URL not set"
fi

# Configure firewall (if ufw is available)
if command -v ufw &> /dev/null; then
    echo "🔧 Configuring firewall..."
    sudo ufw allow $PORT/tcp 2>/dev/null || echo "ℹ️ Could not configure firewall (may need sudo)"
fi

# Start server in production mode
echo "🚀 Starting production server..."
echo "Server will be available at:"
echo "- Local: http://localhost:$PORT"
echo "- Network: http://74.179.85.9:$PORT"
echo "- Admin: http://74.179.85.9:$PORT/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="

# Start with proper logging
exec npx tsx server/index.ts 2>&1 | tee production.log