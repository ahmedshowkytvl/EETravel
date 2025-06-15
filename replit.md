# Sahara Journeys - AI-Powered Travel Platform

## Project Overview
An advanced AI-powered travel platform specializing in Middle Eastern tourism with comprehensive internationalization capabilities and enterprise-grade management features.

**Tech Stack:**
- Frontend: React + TypeScript, Tailwind CSS, Shadcn/ui
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Drizzle ORM
- AI Integration: Google Gemini AI
- Internationalization: Full Arabic/English support
- Authentication: Replit Auth with role-based access control

## Current Status
✅ **Laravel Backend Complete** (June 15, 2025)
- Created complete Laravel project structure with all core files
- Resolved missing artisan file issue - project now fully functional
- Added comprehensive dependency management and installation scripts

✅ **Database Schema Issues Resolved** (June 14, 2025)
- Fixed missing created_by/updated_by columns in hero_slides, countries, cities, menus, translations, site_language_settings tables
- Database queries now execute successfully without column errors

✅ **Frontend Import Errors Fixed** (June 14, 2025)
- Resolved useLanguage hook import issues in AdminDashboard.tsx and TourCreatorPage.tsx
- All admin components now have proper access to translation system

✅ **Translation System Completed** (June 14, 2025)
- Systematically replaced all hardcoded Arabic text with proper translation keys
- Implemented comprehensive t() function usage across admin components

## Recent Changes
- **June 15, 2025:** Fixed PHP 8.1 compatibility issues and namespace declaration errors
- **June 15, 2025:** Created platform-check disabled composer configuration for PHP 8.1
- **June 15, 2025:** Completed Laravel backend with full project structure and artisan file
- **June 15, 2025:** Created dependency installation scripts and comprehensive documentation
- **June 14, 2025:** Resolved critical compilation errors and database schema mismatches

## Project Architecture

### Current Implementation (Express.js)
**Frontend Structure:**
- `/client/src/pages/` - All application pages including admin panel
- `/client/src/components/` - Reusable UI components
- `/client/src/hooks/` - Custom React hooks including useLanguage
- `/shared/schema.ts` - Database schema and type definitions

**Backend Structure:**
- `/server/routes.ts` - Main API routes
- `/server/admin-api-routes.ts` - Admin-specific endpoints
- `/server/db.ts` - Database connection and initialization

### Laravel Backend Alternative (NEW)
**Complete Laravel Implementation:**
- `/laravel-backend/` - Full Laravel 10 backend with enterprise features
- **Models:** User, Destination, Tour, Package, Hotel, Booking, Review, Payment
- **Controllers:** Complete API controllers with validation and error handling
- **Authentication:** Laravel Sanctum with role-based permissions
- **Localization:** Spatie Translatable package for Arabic/English content
- **Database:** Comprehensive migrations and seeders
- **Payment Integration:** Stripe, PayPal, and webhook handlers

**Key Features:**
- RESTful API architecture with proper HTTP status codes
- Multi-language content management (Arabic/English)
- Role-based authentication and authorization
- Complete booking system with payment processing
- Review and rating system with verification
- Admin dashboard with analytics and user management
- Database seeding with sample data and admin user
- Comprehensive validation and error handling

## User Preferences
*To be updated based on user feedback and preferences*

## Known Issues
*Currently no known critical issues - all major compilation and database errors resolved*