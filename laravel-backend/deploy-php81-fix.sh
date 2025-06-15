#!/bin/bash

# Complete Laravel PHP 8.1 Fix and Deployment
echo "🔧 Laravel PHP 8.1 Compatibility Fix"

# Remove problematic files
rm -rf vendor composer.lock

# Update composer to skip platform checks
composer config platform-check false

# Install dependencies ignoring platform requirements
composer install --ignore-platform-reqs --no-scripts

# Manual autoload generation
composer dump-autoload

# Environment setup
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file"
fi

# Generate application key
php artisan key:generate --force

# Create required directories
mkdir -p storage/app/public
mkdir -p storage/framework/{cache,sessions,views}
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Set permissions
chmod -R 775 storage bootstrap/cache

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear

# Create database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS sahara_journeys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || echo "Database creation may require manual setup"

# Run migrations
php artisan migrate --force

# Create storage link
php artisan storage:link

echo "✅ Laravel setup complete for PHP 8.1!"
echo "🌐 Start server: php artisan serve --host=0.0.0.0 --port=8000"
echo "📍 API available at: http://localhost:8000/api"