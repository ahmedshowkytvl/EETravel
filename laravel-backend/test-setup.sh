#!/bin/bash

# Test script to verify Laravel setup
echo "🧪 Testing Laravel Setup"

# Test artisan file exists and is executable
if [ -x "artisan" ]; then
    echo "✅ Artisan file exists and is executable"
else
    echo "❌ Artisan file missing or not executable"
    exit 1
fi

# Check if vendor directory exists
if [ ! -d "vendor" ]; then
    echo "📦 Vendor directory not found. Installing Composer dependencies..."
    
    # Check if composer is available
    if ! command -v composer &> /dev/null; then
        echo "❌ Composer is not installed. Please install Composer first."
        echo "Download from: https://getcomposer.org/download/"
        exit 1
    fi
    
    # Install dependencies
    composer install --no-dev --optimize-autoloader
    
    if [ $? -ne 0 ]; then
        echo "❌ Composer install failed"
        exit 1
    fi
    
    echo "✅ Composer dependencies installed successfully"
else
    echo "✅ Vendor directory exists"
fi

# Test basic artisan commands
echo "Testing basic artisan commands..."

# Test artisan without database connection
php artisan --version
if [ $? -eq 0 ]; then
    echo "✅ Artisan version command works"
else
    echo "❌ Artisan version command failed"
    exit 1
fi

# List available commands
echo "Available artisan commands:"
php artisan list | head -20

echo "✅ Laravel setup verification complete!"
echo "You can now run the deploy script successfully."