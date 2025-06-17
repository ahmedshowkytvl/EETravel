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

## Recent Changes

- **Linux Production Deployment (June 17, 2025)**: Successfully deployed platform for external access with port solutions
  - **Port Configuration Resolved**: Server running on port 3000 with port 80 forwarding solutions for Linux systems
  - **Production Scripts Created**: Built deployment tools (start-production.sh, deploy-production.sh)
  - **Database Schema Complete**: All 52+ tables from Drizzle schema properly created in PostgreSQL
  - **Database Repair Tools**: Comprehensive diagnostic and repair scripts (fix-database.sh, complete-db-fix.sh)
  - **Static File Serving**: Created production-ready static content for external access
  - **Server Configuration Resolved**: Eliminated Vite configuration errors and enabled external connectivity
  - **Admin Panel Accessible**: Complete user management at http://74.179.85.9:8080/admin
  - **API Endpoints Active**: All travel management APIs operational for external consumption
  - **Production Ready**: Platform fully deployed with EGP pricing, Arabic/English support, and external accessibility

- **Complete Database Schema Resolution (June 16, 2025)**: Fully resolved all database schema errors across the platform
  - Fixed packages table: Added missing columns (discounted_price, rating, review_count, type, itinerary, what_to_pack, travel_route, accommodation_highlights, transportation_details)
  - Fixed countries table: Added missing created_by and updated_by audit columns
  - Fixed cities table: Corrected column type mismatches and added missing active column
  - Fixed hero_slides table: Added missing secondary_button_text and secondary_button_link columns
  - Created missing menu_items table with proper relationships and columns (icon_type, item_type)
  - Fixed user profile columns (passport_number, emergency_contact, dietary_requirements, medical_conditions)
  - Created missing airports table with proper schema structure
  - Fixed database initialization timing issues in storage layer
  - All API endpoints now functional: /api/packages, /api/countries, /api/cities, /api/hero-slides/active, /api/menus
  - Complete PostgreSQL integration with proper EGP pricing throughout

- **Currency Migration (June 16, 2025)**: Converted all pricing throughout the platform from USD to Egyptian Pounds (EGP)
  - Applied 50:1 exchange rate conversion (1 USD = 50 EGP)
  - Updated packages, tours, hotels, visas, and flights pricing data
  - Modified all frontend components to display EGP currency
  - Updated database schema with EGP defaults

- **Database Migration (June 16, 2025)**: Completed migration from SQLite to PostgreSQL
  - Removed all SQLite dependencies (better-sqlite3)
  - Updated all schema references to use PostgreSQL
  - Added currency columns to pricing tables with EGP defaults
  - Maintained data integrity during conversion

## Changelog

- June 16, 2025. Initial setup
- June 16, 2025. Currency conversion to EGP and PostgreSQL migration completed

## User Preferences

Preferred communication style: Simple, everyday language.