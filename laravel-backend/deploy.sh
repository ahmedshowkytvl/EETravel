#!/bin/bash

# Laravel Backend Deployment Script
# This script provides multiple deployment options to avoid Docker complexity

set -e

echo "🚀 Sahara Journeys Laravel Backend Deployment"
echo "============================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your database credentials"
fi

# Function for local development setup
setup_local() {
    echo "🔧 Setting up local development environment..."
    
    # Install dependencies
    composer install
    
    # Generate application key
    php artisan key:generate
    
    # Run migrations
    php artisan migrate --force
    
    # Seed database
    php artisan db:seed --force
    
    # Cache optimization
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    
    # Create storage link
    php artisan storage:link
    
    echo "✅ Local setup complete!"
    echo "🌐 Run: php artisan serve --host=0.0.0.0 --port=8000"
}

# Function for production setup
setup_production() {
    echo "🏭 Setting up production environment..."
    
    # Install production dependencies
    composer install --no-dev --optimize-autoloader
    
    # Generate application key
    php artisan key:generate --force
    
    # Run migrations
    php artisan migrate --force
    
    # Seed database
    php artisan db:seed --force
    
    # Cache everything for performance
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache
    
    # Optimize autoloader
    composer dump-autoload --optimize
    
    # Create storage link
    php artisan storage:link
    
    echo "✅ Production setup complete!"
}

# Function for Docker setup (alternative approach)
setup_docker_simple() {
    echo "🐳 Setting up simplified Docker environment..."
    
    # Create simple docker-compose for local development
    cat > docker-compose.simple.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: sahara_journeys
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
EOF

    echo "✅ Simple Docker setup created!"
    echo "🐳 Run: docker-compose -f docker-compose.simple.yml up -d"
    echo "🔧 Then run: ./deploy.sh local"
}

# Function for Heroku deployment
setup_heroku() {
    echo "☁️  Setting up Heroku deployment..."
    
    # Create Procfile
    cat > Procfile << EOF
web: vendor/bin/heroku-php-apache2 public/
worker: php artisan queue:work --verbose --tries=3 --timeout=90
EOF

    # Create app.json for Heroku
    cat > app.json << EOF
{
  "name": "Sahara Journeys API",
  "description": "Laravel backend for Sahara Journeys travel platform",
  "keywords": ["laravel", "travel", "api"],
  "addons": [
    "heroku-postgresql:mini",
    "heroku-redis:mini"
  ],
  "env": {
    "APP_KEY": {
      "generator": "secret"
    },
    "APP_ENV": {
      "value": "production"
    },
    "APP_DEBUG": {
      "value": "false"
    },
    "LOG_CHANNEL": {
      "value": "errorlog"
    }
  },
  "scripts": {
    "postdeploy": "php artisan migrate --force && php artisan db:seed --force"
  }
}
EOF

    echo "✅ Heroku configuration created!"
    echo "☁️  Deploy with: git push heroku main"
}

# Function for Railway deployment
setup_railway() {
    echo "🚂 Setting up Railway deployment..."
    
    # Create railway.json
    cat > railway.json << EOF
{
  "\$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=\$PORT",
    "restartPolicyType": "always"
  }
}
EOF

    echo "✅ Railway configuration created!"
    echo "🚂 Connect your GitHub repo to Railway"
}

# Performance optimization
optimize_performance() {
    echo "⚡ Optimizing Laravel performance..."
    
    # Enable OPcache in production
    cat > opcache.ini << EOF
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.revalidate_freq=0
opcache.validate_timestamps=0
opcache.save_comments=1
opcache.fast_shutdown=1
EOF
    
    # Create optimized PHP-FPM config
    cat > php-fpm-optimized.conf << EOF
[www]
pm = dynamic
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 20
pm.max_requests = 1000
EOF
    
    echo "✅ Performance configurations created!"
}

# Main menu
case "${1:-menu}" in
    "local")
        setup_local
        ;;
    "production")
        setup_production
        ;;
    "docker-simple")
        setup_docker_simple
        ;;
    "heroku")
        setup_heroku
        ;;
    "railway")
        setup_railway
        ;;
    "optimize")
        optimize_performance
        ;;
    "menu"|*)
        echo "Choose deployment option:"
        echo "1. ./deploy.sh local          - Local development setup"
        echo "2. ./deploy.sh production     - Production server setup"
        echo "3. ./deploy.sh docker-simple  - Simplified Docker setup"
        echo "4. ./deploy.sh heroku         - Heroku deployment"
        echo "5. ./deploy.sh railway        - Railway deployment"
        echo "6. ./deploy.sh optimize       - Performance optimization"
        ;;
esac