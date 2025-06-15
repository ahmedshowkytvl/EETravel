#!/bin/bash

# Simple deployment script that avoids cloud complexity
echo "🚀 Simple Laravel Backend Setup"

# Check for required tools
command -v php >/dev/null 2>&1 || { echo "PHP is required but not installed."; exit 1; }
command -v composer >/dev/null 2>&1 || { echo "Composer is required but not installed."; exit 1; }

# Setup environment
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file - update database credentials if needed"
fi

# Install dependencies
composer install --optimize-autoloader

# Generate application key
php artisan key:generate

# Run database setup
echo "Setting up database..."
php artisan migrate --force
php artisan db:seed --force

# Optimize for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage symlink
php artisan storage:link

echo "✅ Setup complete!"
echo "Start server with: php artisan serve --host=0.0.0.0 --port=8000"
echo "API will be available at: http://localhost:8000/api"
echo ""
echo "Default credentials:"
echo "Admin: admin@saharajourneys.com / password123"
echo "User: user@example.com / password123"