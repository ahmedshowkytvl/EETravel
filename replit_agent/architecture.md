# Architecture Documentation

## Overview

Sahara Journeys is a travel booking platform specializing in Middle Eastern tourism. The application is built as a full-stack web application with a React frontend and Node.js backend. It provides features for users to browse and book various travel services including flights, hotels, tours, packages, transportation, and visas.

The architecture follows a client-server model with a RESTful API interface between the frontend and backend. The system uses PostgreSQL for data persistence through the Drizzle ORM.

## System Architecture

### High-Level Architecture

The system follows a modern web application architecture with:

1. **Client-side Application**: A React-based single-page application (SPA)
2. **Server-side API**: An Express.js REST API server
3. **Database**: PostgreSQL database accessed via Drizzle ORM
4. **Authentication System**: Custom authentication using Passport.js

### Directory Structure

The codebase is organized into the following main directories:

- `/client`: Contains the React frontend application
  - `/src`: React source code
    - `/components`: Reusable UI components
    - `/pages`: Page components representing different routes
    - `/hooks`: Custom React hooks
    - `/data`: Mock data for development
    - `/lib`: Utility functions and configuration
    - `/styles`: CSS stylesheets
- `/server`: Contains the Node.js backend
  - Express API routes and middleware
  - Database and authentication configuration
- `/shared`: Contains code shared between frontend and backend
  - Database schema definitions
- `/migrations`: Database migration files (generated by Drizzle)

## Key Components

### Frontend

The frontend is built with:

1. **React**: Core UI library
2. **Wouter**: Lightweight routing library
3. **Shadcn UI**: Component library based on Radix UI
4. **TanStack Query**: Data fetching and state management
5. **React Hook Form**: Form handling
6. **Zod**: Schema validation
7. **Tailwind CSS**: Utility-first CSS framework
8. **Lucide React**: Icon library

The frontend is organized around:
- Page components that represent different routes
- Reusable UI components that make up the interface
- Custom hooks for shared logic

Key features include:
- Authentication system (login/registration)
- Booking interfaces for different travel services
- Admin dashboard for managing content
- User profiles
- Search functionality

### Backend

The backend is built with:

1. **Node.js**: Runtime environment
2. **Express.js**: Web server framework
3. **Passport.js**: Authentication middleware
4. **Drizzle ORM**: Database ORM
5. **PostgreSQL**: Database

The backend provides:
- RESTful API endpoints for all application features
- Authentication and session management
- Data validation and business logic

### Database Schema

The database schema is defined using Drizzle ORM and includes the following main entities:

1. **Users**: User accounts and profiles
2. **Countries**: Available travel destinations at country level
3. **Cities**: Cities within countries
4. **Airports**: Airports within cities
5. **Destinations**: Featured travel destinations
6. **Packages**: Travel packages that may include multiple services
7. **Bookings**: User bookings of packages or individual services
8. **Tours**: Guided tour offerings
9. **Hotels**: Hotel listings
10. **Rooms**: Hotel room types
11. **Transportation**: Transport options
12. **Favorites**: User's favorite destinations

Relations between these entities are established through foreign keys and Drizzle's relation helpers.

## Data Flow

### Authentication Flow

1. User submits login/registration credentials
2. Server validates credentials
3. On success, creates a session and returns user data
4. Frontend stores session cookie for subsequent requests
5. Protected routes check for valid session

### Booking Flow

1. User searches for available services (flights, hotels, etc.)
2. API returns matching options
3. User selects and configures their booking
4. User submits booking request
5. Server validates and processes the booking
6. Confirmation is sent to the user

### Admin Management Flow

1. Admin users can access a dedicated dashboard
2. Dashboard provides interfaces for managing all aspects of the system:
   - User management
   - Content management (destinations, packages, etc.)
   - Booking oversight

## External Dependencies

### Frontend Dependencies

- **@radix-ui/react-*****: UI component primitives
- **@tanstack/react-query**: Data fetching and caching
- **@hookform/resolvers**: Form validation with Zod
- **@react-google-maps/api**: Google Maps integration
- **class-variance-authority**: Component style variants
- **clsx/tailwind-merge**: CSS class utilities

### Backend Dependencies

- **express**: Web server
- **passport**: Authentication
- **drizzle-orm**: Database ORM
- **pg**: PostgreSQL client
- **bcryptjs**: Password hashing
- **express-session**: Session management

### External Services

- **Google Maps API**: For maps and location services

## Deployment Strategy

The application uses a multi-stage deployment approach:

1. **Development**: Local development environment using Vite's dev server
2. **Build**: Assets are compiled with Vite (frontend) and esbuild (backend)
3. **Production**: Runs the compiled application with optimized settings

The application is designed to be deployed to [Replit](https://replit.com), as evidenced by the `.replit` configuration file, which provides:

- Node.js runtime
- PostgreSQL database
- Web server configuration
- Auto-deployment settings

The deployment process:
1. Builds the frontend with Vite
2. Bundles the backend with esbuild
3. Serves the static frontend files from the backend
4. Connects to a provisioned PostgreSQL database

### Environment Configuration

The application requires the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Application environment (development/production)

## Security Considerations

- Password hashing using bcrypt
- Session-based authentication
- Role-based access control (admin vs. user)
- Input validation using Zod schemas
- Protected API routes requiring authentication

## Future Architecture Considerations

Areas for potential architectural evolution:

1. **Microservices**: Splitting the monolithic backend into domain-specific services
2. **Serverless**: Moving certain functionality to serverless functions for better scaling
3. **Caching Layer**: Implementing Redis for session and data caching
4. **CDN Integration**: For faster asset delivery
5. **Internationalization**: Supporting multiple languages