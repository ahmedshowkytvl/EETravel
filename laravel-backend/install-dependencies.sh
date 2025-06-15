#!/bin/bash

# Comprehensive dependency installer for Laravel backend
echo "📦 Installing Laravel Dependencies"

# Function to check command availability
check_command() {
    if command -v "$1" &> /dev/null; then
        echo "✅ $1 is available"
        return 0
    else
        echo "❌ $1 is not installed"
        return 1
    fi
}

# Check PHP
if ! check_command php; then
    echo "Please install PHP 8.1 or higher"
    echo "Download from: https://www.php.net/downloads.php"
    exit 1
fi

# Check PHP version
php_version=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
echo "PHP version: $php_version"

# Check Composer
if ! check_command composer; then
    echo "Installing Composer..."
    
    # Download and install Composer
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php --install-dir=. --filename=composer
    php -r "unlink('composer-setup.php');"
    
    # Make composer executable
    chmod +x composer
    
    echo "✅ Composer installed locally"
    COMPOSER_CMD="./composer"
else
    COMPOSER_CMD="composer"
fi

# Install dependencies
echo "Installing Laravel dependencies..."
$COMPOSER_CMD install --optimize-autoloader --no-dev

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    echo "Trying alternative installation..."
    $COMPOSER_CMD install --no-scripts --optimize-autoloader
fi

# Verify installation
if [ -d "vendor" ] && [ -f "vendor/autoload.php" ]; then
    echo "✅ Vendor directory created successfully"
    echo "✅ Laravel is ready to use!"
    
    # Test artisan
    echo "Testing artisan command..."
    php artisan --version
    
    if [ $? -eq 0 ]; then
        echo "✅ Artisan is working correctly"
    else
        echo "⚠️ Artisan test failed, but dependencies are installed"
    fi
else
    echo "❌ Installation verification failed"
    exit 1
fi

echo ""
echo "🎉 Installation complete!"
echo "Next steps:"
echo "1. Copy .env.example to .env"
echo "2. Run: php artisan key:generate"
echo "3. Configure database in .env"
echo "4. Run: php artisan migrate"