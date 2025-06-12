#!/bin/bash

# Google Cloud Run Deployment Script for Sahara Journeys
# Usage: ./deploy.sh [PROJECT_ID] [REGION]

set -e

# Configuration
PROJECT_ID=${1:-"your-project-id"}
REGION=${2:-"us-central1"}
SERVICE_NAME="sahara-journeys"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Deploying Sahara Journeys to Google Cloud Run"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK not found. Please install it first."
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install it first."
    exit 1
fi

# Set the project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the Docker image
echo "🏗️ Building Docker image..."
docker build -t $IMAGE_NAME:latest .

# Tag with timestamp for versioning
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
docker tag $IMAGE_NAME:latest $IMAGE_NAME:$TIMESTAMP

# Push to Google Container Registry
echo "📤 Pushing image to Google Container Registry..."
docker push $IMAGE_NAME:latest
docker push $IMAGE_NAME:$TIMESTAMP

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME:latest \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 100 \
    --concurrency 80 \
    --timeout 300 \
    --port 8080 \
    --set-env-vars "NODE_ENV=production,PORT=8080"

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

echo "✅ Deployment completed successfully!"
echo "🌐 Service URL: $SERVICE_URL"
echo "📊 Monitor your service: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME"

# Test the health endpoint
echo "🏥 Testing health endpoint..."
if curl -f "$SERVICE_URL/health" > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "⚠️ Health check failed. Check the logs for details."
fi

echo "🎉 Deployment complete! Your Sahara Journeys platform is now live."