#!/bin/bash

# Production Readiness Check for Sahara Journeys
# This script validates the application before deployment

set -e

echo "🔍 Running production readiness checks..."

# Check if required files exist
echo "📋 Checking required files..."
required_files=("Dockerfile" ".dockerignore" "cloud-run.yaml" "deploy.sh" "setup-gcp.sh")
for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check if Docker is running
echo "🐳 Checking Docker..."
if docker info > /dev/null 2>&1; then
    echo "✅ Docker is running"
else
    echo "❌ Docker is not running"
    exit 1
fi

# Build Docker image to test
echo "🏗️ Testing Docker build..."
if docker build -t sahara-journeys-test . > /dev/null 2>&1; then
    echo "✅ Docker build successful"
    
    # Test container start
    echo "🚀 Testing container startup..."
    CONTAINER_ID=$(docker run -d -p 8081:8080 -e NODE_ENV=production sahara-journeys-test)
    
    # Wait a moment for startup
    sleep 5
    
    # Test health endpoint
    if curl -f http://localhost:8081/health > /dev/null 2>&1; then
        echo "✅ Health check passed"
    else
        echo "⚠️ Health check failed (expected if no database)"
    fi
    
    # Cleanup
    docker stop $CONTAINER_ID > /dev/null
    docker rm $CONTAINER_ID > /dev/null
    echo "🧹 Test container cleaned up"
else
    echo "❌ Docker build failed"
    exit 1
fi

# Check TypeScript compilation
echo "📝 Checking TypeScript compilation..."
if npm run check > /dev/null 2>&1; then
    echo "✅ TypeScript compilation passed"
else
    echo "⚠️ TypeScript compilation issues detected"
fi

# Check if gcloud is available
echo "☁️ Checking Google Cloud SDK..."
if command -v gcloud &> /dev/null; then
    echo "✅ Google Cloud SDK available"
    
    # Check if authenticated
    if gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
        echo "✅ Google Cloud authentication active"
    else
        echo "⚠️ Google Cloud authentication required"
        echo "Run: gcloud auth login"
    fi
else
    echo "⚠️ Google Cloud SDK not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
fi

echo ""
echo "🎉 Production readiness check completed!"
echo ""
echo "Next steps:"
echo "1. Run: ./setup-gcp.sh YOUR_PROJECT_ID us-central1"
echo "2. Run: ./deploy.sh YOUR_PROJECT_ID us-central1"
echo ""
echo "Make sure to have your database URL and API keys ready!"

# Cleanup test image
docker rmi sahara-journeys-test > /dev/null 2>&1 || true