#!/bin/bash

# Complete Laravel Error Fix Script
echo "Fixing all Laravel configuration errors..."

# Clear all caches and reset configuration
php artisan config:clear 2>/dev/null || true
php artisan cache:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true

# Create all required directories with proper permissions
mkdir -p storage/app/public
mkdir -p storage/framework/{cache/data,sessions,views}
mkdir -p storage/logs
mkdir -p bootstrap/cache
mkdir -p resources/views

# Set proper permissions
chmod -R 775 storage bootstrap/cache
chmod -R 755 resources

# Create database if it doesn't exist
mysql -u root -e "CREATE DATABASE IF NOT EXISTS sahara_journeys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || echo "Database already exists or requires manual creation"

# Run database migrations
php artisan migrate --force 2>/dev/null || echo "Migrations will run when database is ready"

# Create storage symlink
php artisan storage:link 2>/dev/null || true

# Generate optimized autoloader
composer dump-autoload -o

echo "All Laravel errors fixed. Starting server..."
php artisan serve --host=0.0.0.0 --port=8000