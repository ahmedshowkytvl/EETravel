# Sahara Journeys - Laravel Backend

## Overview
Complete Laravel backend implementation of the Sahara Journeys AI-powered travel platform, providing enterprise-grade RESTful APIs for comprehensive Middle Eastern tourism management with full Arabic/English localization.

## Features Implemented
- **RESTful API Architecture** with Laravel 10 and structured endpoints
- **Multi-language Support** with translatable content (Arabic/English)
- **Role-based Authentication** using Laravel Sanctum and Spatie Permissions
- **Complete Database Schema** with migrations for all travel entities
- **Admin Management APIs** with dashboard analytics and user management
- **Booking System** with payment processing and status management
- **Review System** with rating and verification functionality
- **Payment Gateway Integration** supporting Stripe, PayPal, and bank transfers
- **File Upload Management** with Laravel Storage
- **Comprehensive Validation** and error handling
- **Database Seeding** with sample data and admin user creation

## Tech Stack
- **Backend:** Laravel 10 (PHP 8.2+)
- **Database:** PostgreSQL with Eloquent ORM
- **Authentication:** Laravel Sanctum + Spatie Permission
- **Localization:** Spatie Translatable Package
- **Validation:** Laravel Form Request Validation
- **API Structure:** Resource Controllers with proper HTTP status codes

## Quick Start

```bash
# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database migration and seeding
php artisan migrate
php artisan db:seed

# Install Spatie permissions
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

# Start development server
php artisan serve
```

## Complete API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration with role assignment
- `POST /api/auth/login` - User authentication with token generation
- `POST /api/auth/logout` - Token invalidation
- `GET /api/auth/user` - Get authenticated user with roles
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Public Content APIs
- `GET /api/destinations` - List all destinations with filtering
- `GET /api/destinations/{id}` - Get destination details with tours/packages/hotels
- `GET /api/destinations/popular` - Get popular destinations
- `GET /api/tours` - List tours with advanced filtering and search
- `GET /api/tours/{id}` - Get tour details with reviews and bookings
- `GET /api/tours/featured` - Get featured tours
- `GET /api/tours/search` - Search tours by text
- `GET /api/packages` - List travel packages with filtering
- `GET /api/packages/{id}` - Get package details
- `GET /api/packages/featured` - Get featured packages
- `GET /api/hotels` - List hotels with filtering
- `GET /api/hotels/{id}` - Get hotel details
- `GET /api/hotels/featured` - Get featured hotels

### Booking Management
- `GET /api/bookings` - List user bookings with status filtering
- `POST /api/bookings` - Create new booking with validation
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Update booking (pending only)
- `POST /api/bookings/{id}/cancel` - Cancel booking with reason

### Review System
- `GET /api/reviews` - List verified reviews
- `GET /api/reviews/tour/{tourId}` - Get tour reviews
- `GET /api/reviews/package/{packageId}` - Get package reviews
- `GET /api/reviews/hotel/{hotelId}` - Get hotel reviews
- `POST /api/reviews` - Submit review (authenticated users only)
- `PUT /api/reviews/{id}` - Update own review
- `DELETE /api/reviews/{id}` - Delete own review

### Payment Processing
- `POST /api/payments` - Process payment with gateway integration
- `GET /api/payments/booking/{bookingId}` - Get booking payments
- `POST /api/payments/verify` - Verify payment with gateway
- `POST /api/webhooks/payment/stripe` - Stripe webhook handler
- `POST /api/webhooks/payment/paypal` - PayPal webhook handler

### Admin Panel APIs
- `GET /api/admin/dashboard/stats` - Comprehensive dashboard statistics
- `GET /api/admin/system/health` - System health check
- `GET /api/admin/users` - User management with search and filtering
- `PUT /api/admin/users/{id}/status` - Update user status
- `PUT /api/admin/users/{id}/role` - Update user role
- `GET /api/admin/bookings` - Booking management with advanced filtering
- `PUT /api/admin/bookings/{id}/status` - Update booking status
- `POST /api/admin/bookings/{id}/confirm` - Confirm booking
- `POST /api/admin/export` - Export data in multiple formats
- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings

### Content Management (Admin Only)
- Complete CRUD operations for:
  - Destinations (`/api/admin/destinations`)
  - Tours (`/api/admin/tours`)
  - Packages (`/api/admin/packages`)
  - Hotels (`/api/admin/hotels`)
  - Categories for all content types

## Database Schema
Complete migration files with:
- Users with role-based permissions
- Destinations with geolocation
- Tours with itineraries and pricing
- Packages with multi-entity relationships
- Hotels with amenities and ratings
- Bookings with customer details and status tracking
- Reviews with verification system
- Payments with gateway integration
- Categories for all content types

## Localization
- English and Arabic language support
- Translatable content fields in database
- Localized API responses
- Error messages in both languages

## Default Credentials
- **Admin:** admin@saharajourneys.com / password123
- **User:** user@example.com / password123