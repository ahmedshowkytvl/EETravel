# Sahara Journeys - Travel Booking Platform

## Overview

Sahara Journeys is a comprehensive travel booking platform specializing in Middle Eastern and North African destinations. The application provides a full-stack solution for managing travel packages, tours, hotels, bookings, and customer interactions with both customer-facing and administrative interfaces.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom theme configuration
- **Form Management**: React Hook Form with Zod validation
- **State Management**: React hooks and context API
- **Icons**: FontAwesome icon library
- **Maps Integration**: React Google Maps API

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Database ORM**: Drizzle ORM for PostgreSQL
- **Authentication**: Session-based authentication with Passport.js
- **Password Security**: Scrypt hashing algorithm
- **File Uploads**: Multer middleware for handling file uploads
- **API Design**: RESTful API endpoints with structured error handling

## Key Components

### Database Schema
The application uses a comprehensive PostgreSQL schema with the following core entities:

1. **User Management**: Users with role-based access (admin, manager, user)
2. **Geographic Data**: Countries, cities, destinations, airports
3. **Travel Services**: 
   - Packages (travel bundles)
   - Tours (guided experiences)
   - Hotels (accommodations)
   - Rooms (hotel room types)
4. **Booking System**: Bookings, travelers, payments, coupons
5. **Content Management**: Reviews, notifications, menu system
6. **Transportation**: Types, locations, durations
7. **Categorization**: Package, tour, hotel, and room categories

### Authentication System
- Session-based authentication with secure cookie management
- Role-based access control (admin, manager, user)
- Password hashing using scrypt algorithm with salt
- Admin user setup and management capabilities

### Administrative Interface
- Comprehensive dashboard with analytics and metrics
- Entity management for all travel-related data
- Data export/import functionality
- Menu management system
- User and role management
- System monitoring and settings

### Data Management
- Storage abstraction layer for database operations
- Comprehensive seeding system for initial data
- Export/import capabilities for data migration
- File upload handling for images and documents

## Data Flow

1. **User Registration/Login**: Users authenticate through session-based system
2. **Browse Services**: Customers browse packages, tours, and hotels
3. **Booking Process**: Customers create bookings with traveler information
4. **Payment Processing**: Integration-ready payment system
5. **Content Management**: Admins manage all travel content through admin interface
6. **Data Analytics**: Dashboard provides insights on bookings, revenue, and user activity

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with Neon serverless hosting
- **UI Components**: Radix UI primitives
- **Validation**: Zod schema validation
- **Development**: TSX for TypeScript execution
- **Build**: Vite with React plugin

### Optional Integrations
- **AI Content**: Google Generative AI for content enhancement
- **Maps**: Google Maps API for location services
- **Faker.js**: For generating test data during development

## Deployment Strategy

### Development Environment
- Uses TSX for direct TypeScript execution
- Hot reload with Vite development server
- Session-based authentication for development
- SQLite fallback for local development (PostgreSQL preferred)

### Production Considerations
- PostgreSQL database with SSL connections
- Express.js server with proper error handling
- Static file serving for built React application
- Environment variable configuration for sensitive data

### Database Migration
- Drizzle ORM handles schema migrations
- Seeding scripts for initial data population
- Export/import functionality for data backup and migration

## Changelog

- June 16, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.