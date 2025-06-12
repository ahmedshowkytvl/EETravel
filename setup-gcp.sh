#!/bin/bash

# Google Cloud Platform Setup Script for Sahara Journeys
# This script sets up the necessary GCP resources and secrets

set -e

PROJECT_ID=${1:-"your-project-id"}
REGION=${2:-"us-central1"}
SERVICE_NAME="sahara-journeys"

echo "Setting up Google Cloud Platform for Sahara Journeys"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable sql-component.googleapis.com

# Create secrets (you'll need to update these with actual values)
echo "Creating secrets in Secret Manager..."

# Database URL secret
echo "Creating database-url secret..."
echo "Please enter your PostgreSQL database URL:"
read -s DATABASE_URL
echo -n "$DATABASE_URL" | gcloud secrets create database-url --data-file=-

# Session secret
echo "Creating session-secret..."
SESSION_SECRET=$(openssl rand -base64 32)
echo -n "$SESSION_SECRET" | gcloud secrets create session-secret --data-file=-

# Google API Key secret
echo "Creating google-api-key secret..."
echo "Please enter your Google API Key:"
read -s GOOGLE_API_KEY
echo -n "$GOOGLE_API_KEY" | gcloud secrets create google-api-key --data-file=-

# Grant Cloud Run access to secrets
echo "Granting Cloud Run access to secrets..."
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud secrets add-iam-policy-binding database-url \
    --member="serviceAccount:${COMPUTE_SA}" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding session-secret \
    --member="serviceAccount:${COMPUTE_SA}" \
    --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding google-api-key \
    --member="serviceAccount:${COMPUTE_SA}" \
    --role="roles/secretmanager.secretAccessor"

echo "GCP setup completed successfully!"
echo "You can now run ./deploy.sh $PROJECT_ID $REGION to deploy your application."