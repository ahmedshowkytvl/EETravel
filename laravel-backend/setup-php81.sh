#!/bin/bash

# PHP 8.1 Compatible Laravel Setup
echo "Setting up Laravel for PHP 8.1..."

# Remove existing vendor and lock file
rm -rf vendor composer.lock

# Install with platform check disabled
composer install --ignore-platform-reqs --no-scripts

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Generate application key
php artisan key:generate --force

# Clear all caches
php artisan config:clear
php artisan cache:clear

# Create storage directories
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Set permissions
chmod -R 775 storage bootstrap/cache

# Complete post-install scripts
composer dump-autoload

echo "Laravel setup complete for PHP 8.1!"
echo "Start server: php artisan serve --host=0.0.0.0 --port=8000"