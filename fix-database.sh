#!/bin/bash

# Sahara Journeys Database Diagnostic and Repair Script
# This script checks for missing tables and fixes database schema issues

echo "🔧 Sahara Journeys Database Repair Tool"
echo "======================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please create .env file with DATABASE_URL"
    exit 1
fi

# Source environment variables
export $(grep -v '^#' .env | xargs)

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not set in .env file"
    exit 1
fi

echo "🔍 Checking database connection..."

# Create a temporary script to check and fix the database
cat > check_db.ts << 'EOF'
import { config } from 'dotenv';
import postgres from 'postgres';

config();

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function checkAndRepairDatabase() {
  console.log('📊 Running database diagnostics...');
  
  try {
    // Check database connection
    await sql`SELECT 1 as test`;
    console.log('✅ Database connection successful');
    
    // Get list of existing tables
    const existingTables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('\n📋 Existing tables:');
    const tableNames = existingTables.map(t => t.table_name);
    tableNames.forEach(name => console.log(`  - ${name}`));
    
    // Define required tables based on schema
    const requiredTables = [
      'countries', 'cities', 'airports', 'users', 'hero_slides', 'destinations', 
      'packages', 'bookings', 'favorites', 'tours', 'hotels', 'rooms', 
      'room_combinations', 'menus', 'menu_items', 'translations', 
      'site_language_settings', 'nationalities', 'visas', 
      'nationality_visa_requirements', 'package_categories', 'tour_categories',
      'hotel_categories', 'room_categories', 'hotel_facilities', 
      'hotel_highlights', 'cleanliness_features', 'transport_types',
      'transport_locations', 'transport_durations', 'cart_items',
      'dictionary_entries', 'hotel_faqs', 'hotel_restaurants',
      'hotel_landmarks', 'package_to_category', 'tour_to_category',
      'hotel_to_category', 'room_to_category', 'hotel_to_facilities',
      'hotel_to_highlights', 'hotel_to_cleanliness_features'
    ];
    
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.log('\n❌ Missing tables detected:');
      missingTables.forEach(table => console.log(`  - ${table}`));
      console.log('\n🔧 Creating missing tables...');
      
      // Create missing core tables
      if (missingTables.includes('users')) {
        console.log('Creating users table...');
        await sql`
          CREATE TABLE IF NOT EXISTS "users" (
            "id" SERIAL PRIMARY KEY,
            "username" TEXT NOT NULL UNIQUE,
            "password" TEXT NOT NULL,
            "email" TEXT NOT NULL UNIQUE,
            "display_name" TEXT,
            "first_name" TEXT,
            "last_name" TEXT,
            "phone_number" TEXT,
            "full_name" TEXT,
            "role" TEXT DEFAULT 'user' NOT NULL,
            "bio" TEXT,
            "avatar_url" TEXT,
            "status" TEXT DEFAULT 'active',
            "nationality" TEXT,
            "date_of_birth" TIMESTAMP,
            "passport_number" TEXT,
            "passport_expiry" TIMESTAMP,
            "emergency_contact" TEXT,
            "emergency_phone" TEXT,
            "dietary_requirements" TEXT,
            "medical_conditions" TEXT,
            "preferred_language" TEXT DEFAULT 'en',
            "email_notifications" BOOLEAN DEFAULT TRUE,
            "sms_notifications" BOOLEAN DEFAULT FALSE,
            "marketing_emails" BOOLEAN DEFAULT TRUE,
            "email_verified" BOOLEAN DEFAULT FALSE,
            "phone_verified" BOOLEAN DEFAULT FALSE,
            "last_login_at" TIMESTAMP,
            "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
            "updated_at" TIMESTAMP DEFAULT NOW()
          );
        `;
      }
      
      if (missingTables.includes('package_categories')) {
        console.log('Creating package_categories table...');
        await sql`
          CREATE TABLE IF NOT EXISTS "package_categories" (
            "id" SERIAL PRIMARY KEY,
            "name" TEXT NOT NULL UNIQUE,
            "description" TEXT,
            "active" BOOLEAN DEFAULT TRUE,
            "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
            "updated_at" TIMESTAMP DEFAULT NOW(),
            "created_by" INTEGER REFERENCES "users"("id"),
            "updated_by" INTEGER REFERENCES "users"("id")
          );
        `;
      }
      
      if (missingTables.includes('tour_categories')) {
        console.log('Creating tour_categories table...');
        await sql`
          CREATE TABLE IF NOT EXISTS "tour_categories" (
            "id" SERIAL PRIMARY KEY,
            "name" TEXT NOT NULL UNIQUE,
            "description" TEXT,
            "active" BOOLEAN DEFAULT TRUE,
            "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
            "updated_at" TIMESTAMP DEFAULT NOW(),
            "created_by" INTEGER REFERENCES "users"("id"),
            "updated_by" INTEGER REFERENCES "users"("id")
          );
        `;
      }
      
      if (missingTables.includes('hotel_categories')) {
        console.log('Creating hotel_categories table...');
        await sql`
          CREATE TABLE IF NOT EXISTS "hotel_categories" (
            "id" SERIAL PRIMARY KEY,
            "name" TEXT NOT NULL UNIQUE,
            "description" TEXT,
            "active" BOOLEAN DEFAULT TRUE,
            "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
            "updated_at" TIMESTAMP DEFAULT NOW(),
            "created_by" INTEGER REFERENCES "users"("id"),
            "updated_by" INTEGER REFERENCES "users"("id")
          );
        `;
      }
      
      if (missingTables.includes('room_categories')) {
        console.log('Creating room_categories table...');
        await sql`
          CREATE TABLE IF NOT EXISTS "room_categories" (
            "id" SERIAL PRIMARY KEY,
            "name" TEXT NOT NULL UNIQUE,
            "description" TEXT,
            "active" BOOLEAN DEFAULT TRUE,
            "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
            "updated_at" TIMESTAMP DEFAULT NOW(),
            "created_by" INTEGER REFERENCES "users"("id"),
            "updated_by" INTEGER REFERENCES "users"("id")
          );
        `;
      }
      
      // Check for missing columns in existing tables
      console.log('\n🔍 Checking for missing columns...');
      
      // Check countries table for audit columns
      if (tableNames.includes('countries')) {
        const countriesColumns = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'countries' AND table_schema = 'public';
        `;
        const countryColumnNames = countriesColumns.map(c => c.column_name);
        
        if (!countryColumnNames.includes('created_by')) {
          console.log('Adding created_by column to countries table...');
          await sql`ALTER TABLE "countries" ADD COLUMN IF NOT EXISTS "created_by" INTEGER REFERENCES "users"("id");`;
        }
        
        if (!countryColumnNames.includes('updated_by')) {
          console.log('Adding updated_by column to countries table...');
          await sql`ALTER TABLE "countries" ADD COLUMN IF NOT EXISTS "updated_by" INTEGER REFERENCES "users"("id");`;
        }
      }
      
      // Check destinations table for audit columns
      if (tableNames.includes('destinations')) {
        const destColumns = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'destinations' AND table_schema = 'public';
        `;
        const destColumnNames = destColumns.map(c => c.column_name);
        
        if (!destColumnNames.includes('created_by')) {
          console.log('Adding created_by column to destinations table...');
          await sql`ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "created_by" INTEGER REFERENCES "users"("id");`;
        }
        
        if (!destColumnNames.includes('updated_by')) {
          console.log('Adding updated_by column to destinations table...');
          await sql`ALTER TABLE "destinations" ADD COLUMN IF NOT EXISTS "updated_by" INTEGER REFERENCES "users"("id");`;
        }
      }
      
      console.log('✅ Database repair completed');
    } else {
      console.log('\n✅ All required tables exist');
    }
    
    // Final verification
    console.log('\n🔍 Running final verification...');
    
    // Test critical queries
    try {
      await sql`SELECT COUNT(*) FROM users;`;
      console.log('✅ Users table accessible');
    } catch (e) {
      console.log('❌ Users table issue:', e.message);
    }
    
    try {
      await sql`SELECT COUNT(*) FROM package_categories;`;
      console.log('✅ Package categories table accessible');
    } catch (e) {
      console.log('❌ Package categories table issue:', e.message);
    }
    
    try {
      await sql`SELECT COUNT(*) FROM countries;`;
      console.log('✅ Countries table accessible');
    } catch (e) {
      console.log('❌ Countries table issue:', e.message);
    }
    
    console.log('\n🎉 Database diagnostic complete!');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

checkAndRepairDatabase();
EOF

# Run the diagnostic script
echo "🚀 Running database diagnostic and repair..."
npx tsx check_db.ts

# Clean up temporary file
rm -f check_db.ts

echo ""
echo "🔧 Database repair complete!"
echo "You can now run: ./start.sh"
echo "======================================="