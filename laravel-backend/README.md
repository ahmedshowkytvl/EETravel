# Sahara Journeys - Laravel Backend

## Overview
Laravel backend implementation of the Sahara Journeys AI-powered travel platform, providing enterprise-grade APIs for Middle Eastern tourism management.

## Features
- **RESTful API Architecture** with Laravel 10
- **Multi-language Support** (Arabic/English) with Laravel Localization
- **Role-based Authentication** using Laravel Sanctum
- **Database Management** with Laravel Migrations & Eloquent ORM
- **Admin Panel APIs** for comprehensive travel management
- **AI Integration** with Google Gemini for content generation
- **File Upload Management** with Laravel Storage
- **API Documentation** with Swagger/OpenAPI
- **Caching Layer** with Redis support
- **Queue System** for background processing

## Tech Stack
- **Backend:** Laravel 10 (PHP 8.2+)
- **Database:** PostgreSQL with Eloquent ORM
- **Authentication:** Laravel Sanctum
- **Caching:** Redis
- **Queue:** Laravel Queue with Redis driver
- **Storage:** Laravel Storage (local/S3)
- **API Documentation:** Laravel Swagger
- **Localization:** Laravel Lang with Arabic support

## Installation

```bash
# Clone and setup
composer install
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate
php artisan db:seed

# Storage setup
php artisan storage:link

# Development server
php artisan serve
```

## API Endpoints Structure

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get authenticated user

### Admin Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/bookings` - Booking management

### Travel Management
- `GET /api/destinations` - List destinations
- `GET /api/tours` - List tours
- `GET /api/packages` - List packages
- `GET /api/hotels` - List hotels

### Booking System
- `POST /api/bookings` - Create booking
- `GET /api/bookings/{id}` - Get booking details
- `PATCH /api/bookings/{id}` - Update booking