# Sahara Journeys Laravel Backend

## Overview
Complete Laravel 9.52.20 backend implementation for the Sahara Journeys travel platform with full REST API functionality.

## Quick Start
```bash
# Start the Laravel server
cd laravel-backend
php artisan serve --host=0.0.0.0 --port=8000

# Or use the startup script
./start-laravel-server.sh
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (requires auth)
- `GET /api/auth/user` - Get current user (requires auth)

### Public Content
- `GET /api/health` - Health check
- `GET /api/destinations` - List all destinations
- `GET /api/destinations/{id}` - Get specific destination
- `GET /api/tours` - List all tours
- `GET /api/tours/{id}` - Get specific tour
- `GET /api/packages` - List all packages
- `GET /api/packages/{id}` - Get specific package
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/{id}` - Get specific hotel

### Protected Routes (requires authentication)
- `GET /api/bookings` - List user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/{id}` - Get specific booking
- `PUT /api/bookings/{id}` - Update booking

### Admin Routes (requires admin role)
- `POST /api/admin/destinations` - Create destination
- `PUT /api/admin/destinations/{id}` - Update destination
- `DELETE /api/admin/destinations/{id}` - Delete destination
- Similar CRUD operations for tours, packages, and hotels

## Database Models
- **User** - User authentication and profiles
- **Destination** - Travel destinations
- **Tour** - Individual tours
- **Package** - Travel packages
- **Hotel** - Accommodation
- **Booking** - User bookings
- **Country** - Countries reference
- **Payment** - Payment transactions

## Technical Stack
- **Framework:** Laravel 9.52.20
- **PHP:** 8.1 compatible
- **Database:** MySQL (sahara_journeys)
- **Authentication:** Laravel Sanctum
- **API:** REST with JSON responses

## Configuration
- Database: MySQL with `sahara_journeys` database
- Environment: Development mode with debug enabled
- Authentication: Sanctum tokens for API access
- Error handling: Comprehensive with proper HTTP status codes

## Testing
```bash
# Test all API endpoints
./test-api-endpoints.sh

# Manual health check
curl http://localhost:8000/api/health
```

## Admin Access
- Email: admin@saharajourneys.com
- Password: password123

## Features
✅ Complete REST API with 40+ routes
✅ Authentication with Laravel Sanctum
✅ Role-based access control
✅ Comprehensive error handling
✅ JSON API responses
✅ Database relationships
✅ Input validation
✅ Health monitoring