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
- **June 14, 2025:** Resolved critical compilation errors and database schema mismatches
- **June 14, 2025:** Fixed SSL configuration in drizzle.config.json
- **June 14, 2025:** Completed translation system implementation with proper key management

## Project Architecture
**Frontend Structure:**
- `/client/src/pages/` - All application pages including admin panel
- `/client/src/components/` - Reusable UI components
- `/client/src/hooks/` - Custom React hooks including useLanguage
- `/shared/schema.ts` - Database schema and type definitions

**Backend Structure:**
- `/server/routes.ts` - Main API routes
- `/server/admin-api-routes.ts` - Admin-specific endpoints
- `/server/db.ts` - Database connection and initialization

**Key Features:**
- Comprehensive admin panel with analytics dashboard
- Multi-language support (Arabic/English)
- Role-based access control
- Advanced booking management
- Tour creation and management
- Hotel and package management
- User management with audit tracking

## User Preferences
*To be updated based on user feedback and preferences*

## Known Issues
*Currently no known critical issues - all major compilation and database errors resolved*