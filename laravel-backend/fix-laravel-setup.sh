#!/bin/bash

# Comprehensive Laravel setup and error fix script
echo "🔧 Fixing Laravel Configuration Issues"

# Generate application key if missing
echo "Generating application key..."
php artisan key:generate --force

# Clear all caches to resolve configuration issues
echo "Clearing Laravel caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Create storage directories if missing
echo "Creating storage directories..."
mkdir -p storage/app/public
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/testing
mkdir -p storage/framework/views
mkdir -p storage/logs

# Set proper permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Create database if it doesn't exist
echo "Setting up database..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS sahara_journeys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || echo "Database setup may require manual creation"

# Run migrations
echo "Running database migrations..."
php artisan migrate --force

# Seed database with initial data
echo "Seeding database..."
php artisan db:seed --force

# Create storage link
echo "Creating storage link..."
php artisan storage:link

echo "✅ Laravel setup complete!"
echo "🌐 Start server with: php artisan serve --host=0.0.0.0 --port=8000"