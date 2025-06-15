#!/bin/bash

# Test Laravel Backend API Endpoints
echo "Testing Sahara Journeys Laravel Backend API..."

# Start server in background
cd laravel-backend
php artisan serve --host=0.0.0.0 --port=8000 &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "Testing API endpoints..."

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s -X GET http://localhost:8000/api/health | jq .

# Test destinations endpoint
echo "2. Testing destinations endpoint..."
curl -s -X GET http://localhost:8000/api/destinations | jq .

# Test tours endpoint
echo "3. Testing tours endpoint..."
curl -s -X GET http://localhost:8000/api/tours | jq .

# Test packages endpoint
echo "4. Testing packages endpoint..."
curl -s -X GET http://localhost:8000/api/packages | jq .

# Test hotels endpoint
echo "5. Testing hotels endpoint..."
curl -s -X GET http://localhost:8000/api/hotels | jq .

# Test authentication registration
echo "6. Testing user registration..."
curl -s -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }' | jq .

echo "Laravel Backend API testing completed!"

# Stop the server
kill $SERVER_PID

echo "Server stopped."