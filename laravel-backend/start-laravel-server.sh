#!/bin/bash

# Start Laravel Backend Server
echo "Starting Sahara Journeys Laravel Backend..."

# Navigate to Laravel directory
cd laravel-backend

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# Set proper permissions
chmod -R 775 storage bootstrap/cache

# Start the server
echo "Laravel Backend Server starting on http://0.0.0.0:8000"
php artisan serve --host=0.0.0.0 --port=8000