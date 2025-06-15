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