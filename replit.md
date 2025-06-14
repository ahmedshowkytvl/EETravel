# Sahara Journeys - Travel Platform

## Overview

Sahara Journeys is a comprehensive travel booking platform specializing in Middle Eastern and North African destinations. The application provides a full-stack solution for managing travel packages, tours, hotels, bookings, and user interactions with both customer-facing and administrative interfaces.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI components with Tailwind CSS for styling
- **Form Management**: React Hook Form with Zod validation
- **State Management**: Local component state with React hooks
- **Routing**: React Router for client-side navigation
- **Maps Integration**: Google Maps API for location services

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety
- **Database ORM**: Drizzle ORM for PostgreSQL
- **Authentication**: Custom session-based authentication with scrypt password hashing
- **File Uploads**: Built-in file handling for images and documents
- **API Structure**: RESTful endpoints with admin-specific routes

### Database Design
- **Primary Database**: PostgreSQL (via Neon.tech cloud service)
- **Schema Management**: Drizzle ORM with migration support
- **Key Tables**: Users, Countries, Cities, Hotels, Tours, Packages, Bookings, Reviews, Payments
- **Relationships**: Properly normalized with foreign key constraints

## Key Components

### Core Entities
1. **Travel Management**: Countries, cities, destinations, airports
2. **Accommodation**: Hotels with detailed facilities and room management
3. **Tour Operations**: Tours with itineraries, packages, and booking capabilities
4. **User System**: Multi-role user management (admin, manager, user)
5. **Booking Engine**: Complete booking lifecycle with payment tracking
6. **Review System**: User feedback and rating management

### Authentication System
- Session-based authentication with Express sessions
- Role-based access control (admin, manager, user)
- Password hashing using Node.js crypto scrypt
- Admin user setup and management

### Admin Dashboard
- Comprehensive management interface
- Advanced analytics and reporting
- CRUD operations for all entities
- User management and role assignment
- System monitoring and health checks

### API Endpoints
- `/api/auth/*` - Authentication and user management
- `/api/admin/*` - Administrative operations
- `/api/packages/*` - Travel package management
- `/api/tours/*` - Tour operations
- `/api/hotels/*` - Hotel and accommodation services
- `/api/bookings/*` - Booking management

## Data Flow

### User Journey
1. User browses packages/tours on the frontend
2. Authentication handled via session cookies
3. Booking requests processed through API
4. Database updates managed via Drizzle ORM
5. Admin users can manage all aspects through admin panel

### Admin Operations
1. Admin authentication with elevated permissions
2. CRUD operations on all business entities
3. Analytics data aggregation from multiple tables
4. Real-time system monitoring and health checks

## External Dependencies

### Database
- **Neon.tech PostgreSQL**: Cloud-hosted PostgreSQL database
- **Connection**: SSL-required connection string
- **Pooling**: Built-in connection pooling for performance

### APIs and Services
- **Google Maps API**: For location services and mapping
- **Gemini AI**: For content generation and assistance
- **File Upload**: Local file handling for images

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production
- **Tailwind CSS**: Utility-first CSS framework
- **FontAwesome**: Icon library for UI components

## Deployment Strategy

### Container Setup
- **Docker**: Multi-stage build with Node.js Alpine base
- **Production Image**: Optimized with minimal dependencies
- **Port Configuration**: Configurable port (default 8080)

### Cloud Deployment
- **Target Platform**: Google Cloud Run
- **Build Process**: Cloud Build with automatic deployments
- **Environment**: Production-ready with secret management
- **Scaling**: Automatic scaling based on traffic

### Configuration Management
- **Environment Variables**: Separate configs for development/production
- **Secrets**: Google Secret Manager for sensitive data
- **Database**: Cloud-hosted PostgreSQL with SSL
- **Session Management**: Configurable session secrets

### Deployment Scripts
- `setup-gcp.sh`: Google Cloud Platform initialization
- `deploy.sh`: Automated deployment to Cloud Run
- `production-check.sh`: Pre-deployment validation

## Changelog
- June 14, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.