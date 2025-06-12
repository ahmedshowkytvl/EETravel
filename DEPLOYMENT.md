# Google Cloud Run Deployment Guide

This guide will help you deploy your Sahara Journeys travel platform to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account**: Create an account at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud SDK**: Install from [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Install from [docker.com](https://docs.docker.com/get-docker/)
4. **PostgreSQL Database**: Set up a cloud database (Google Cloud SQL, Neon, or similar)

## Quick Deployment

### Step 1: Setup Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (replace with your project ID)
gcloud projects create your-project-id
gcloud config set project your-project-id

# Enable billing (required for Cloud Run)
# Visit: https://console.cloud.google.com/billing
```

### Step 2: Run Setup Script

```bash
# Make scripts executable
chmod +x setup-gcp.sh deploy.sh

# Setup GCP resources and secrets
./setup-gcp.sh your-project-id us-central1
```

When prompted, provide:
- Your PostgreSQL database URL
- Your Google API key for maps/geocoding

### Step 3: Deploy Application

```bash
# Deploy to Cloud Run
./deploy.sh your-project-id us-central1
```

## Manual Deployment Steps

If you prefer manual deployment:

### 1. Enable APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

### 2. Create Secrets

```bash
# Database URL
echo -n "your-database-url" | gcloud secrets create database-url --data-file=-

# Session secret
echo -n "$(openssl rand -base64 32)" | gcloud secrets create session-secret --data-file=-

# Google API key
echo -n "your-google-api-key" | gcloud secrets create google-api-key --data-file=-
```

### 3. Build and Deploy

```bash
# Build Docker image
docker build -t gcr.io/your-project-id/sahara-journeys .

# Push to Container Registry
docker push gcr.io/your-project-id/sahara-journeys

# Deploy to Cloud Run
gcloud run deploy sahara-journeys \
  --image gcr.io/your-project-id/sahara-journeys \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 1 \
  --port 8080
```

## Environment Variables

Your application requires these environment variables:

- `NODE_ENV`: Set to "production"
- `PORT`: Set to "8080"
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Random string for session encryption
- `GOOGLE_API_KEY`: For maps and geocoding features

## Database Setup

Ensure your PostgreSQL database is accessible from Cloud Run:

1. **Cloud SQL**: Enable Cloud SQL Admin API and configure private IP
2. **External Database**: Ensure firewall allows Google Cloud IP ranges
3. **Connection Pooling**: Recommended for production workloads

## Monitoring and Logging

Access your application monitoring:

- **Logs**: `gcloud logs read "resource.type=cloud_run_revision"`
- **Metrics**: Google Cloud Console → Cloud Run → your-service
- **Health Check**: Your app includes `/health` endpoint

## Custom Domain

To use a custom domain:

```bash
# Map domain to service
gcloud run domain-mappings create \
  --service sahara-journeys \
  --domain your-domain.com \
  --region us-central1
```

## Scaling Configuration

Your service is configured with:
- **Min instances**: 0 (scales to zero when not in use)
- **Max instances**: 100
- **Concurrency**: 80 requests per instance
- **Memory**: 2GB per instance
- **CPU**: 1 vCPU per instance

## Security Features

- Non-root user in container
- Secrets managed via Google Secret Manager
- HTTPS enforced by Cloud Run
- Health checks for reliability

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Dockerfile and .dockerignore
2. **Database Connection**: Verify DATABASE_URL secret
3. **Memory Errors**: Increase memory allocation
4. **Cold Starts**: Consider min-instances > 0

### Debug Commands

```bash
# View service details
gcloud run services describe sahara-journeys --region us-central1

# View logs
gcloud logs tail "resource.type=cloud_run_revision"

# Test health endpoint
curl https://your-service-url/health
```

## Cost Optimization

- **Pay-per-use**: You're only charged when serving requests
- **Auto-scaling**: Scales to zero when idle
- **Resource limits**: Configured for optimal cost/performance
- **Regional deployment**: Choose region closest to users

## CI/CD with Cloud Build

The included `cloudbuild.yaml` enables automatic deployment:

```bash
# Setup Cloud Build trigger
gcloud builds triggers create github \
  --repo-name=your-repo \
  --repo-owner=your-username \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

## Support

For issues specific to:
- **Cloud Run**: [Google Cloud Support](https://cloud.google.com/support)
- **Application**: Check logs and health endpoints
- **Database**: Verify connection strings and permissions