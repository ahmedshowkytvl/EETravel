#!/bin/bash

# Complete Sahara Journeys Database Schema Creation Script
# Creates all missing tables from the full schema

echo "🔧 Complete Database Schema Setup"
echo "================================="

# Check environment
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    exit 1
fi

export $(grep -v '^#' .env | xargs)

if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL not set"
    exit 1
fi

# Create comprehensive database setup script
cat > complete_schema.ts << 'EOF'
import { config } from 'dotenv';
import postgres from 'postgres';

config();

const sql = postgres(process.env.DATABASE_URL!, { max: 1 });

async function createCompleteSchema() {
  console.log('🏗️ Creating complete database schema...');
  
  try {
    // Create all remaining tables from schema
    
    // Airports table
    await sql`
      CREATE TABLE IF NOT EXISTS "airports" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "city_id" INTEGER REFERENCES "cities"("id"),
        "code" TEXT,
        "description" TEXT,
        "image_url" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        "created_by" INTEGER REFERENCES "users"("id"),
        "updated_by" INTEGER REFERENCES "users"("id")
      );
    `;
    console.log('✅ Airports table created');

    // Hero slides table
    await sql`
      CREATE TABLE IF NOT EXISTS "hero_slides" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "subtitle" TEXT,
        "description" TEXT,
        "image_url" TEXT NOT NULL,
        "button_text" TEXT,
        "button_link" TEXT,
        "secondary_button_text" TEXT,
        "secondary_button_link" TEXT,
        "order" INTEGER DEFAULT 0,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        "created_by" INTEGER REFERENCES "users"("id"),
        "updated_by" INTEGER REFERENCES "users"("id")
      );
    `;
    console.log('✅ Hero slides table created');

    // Bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS "bookings" (
        "id" SERIAL PRIMARY KEY,
        "booking_reference" TEXT NOT NULL UNIQUE,
        "user_id" INTEGER REFERENCES "users"("id"),
        "package_id" INTEGER REFERENCES "packages"("id"),
        "booking_date" TIMESTAMP NOT NULL DEFAULT NOW(),
        "travel_date" TIMESTAMP NOT NULL,
        "return_date" TIMESTAMP,
        "number_of_travelers" INTEGER NOT NULL,
        "adult_count" INTEGER NOT NULL,
        "child_count" INTEGER DEFAULT 0,
        "infant_count" INTEGER DEFAULT 0,
        "total_price" INTEGER NOT NULL,
        "base_price" INTEGER NOT NULL,
        "tax_amount" INTEGER DEFAULT 0,
        "discount_amount" INTEGER DEFAULT 0,
        "currency" TEXT DEFAULT 'EGP' NOT NULL,
        "status" TEXT DEFAULT 'pending' NOT NULL,
        "payment_status" TEXT DEFAULT 'pending' NOT NULL,
        "payment_method" TEXT,
        "payment_reference" TEXT,
        "special_requests" TEXT,
        "notes" TEXT,
        "confirmed_at" TIMESTAMP,
        "cancelled_at" TIMESTAMP,
        "cancellation_reason" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        "created_by" INTEGER REFERENCES "users"("id"),
        "updated_by" INTEGER REFERENCES "users"("id")
      );
    `;
    console.log('✅ Bookings table created');

    // Tours table
    await sql`
      CREATE TABLE IF NOT EXISTS "tours" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "image_url" TEXT,
        "gallery_urls" JSON,
        "destination_id" INTEGER REFERENCES "destinations"("id"),
        "trip_type" TEXT,
        "duration" INTEGER NOT NULL,
        "date" TIMESTAMP,
        "num_passengers" INTEGER,
        "price" INTEGER NOT NULL,
        "discounted_price" INTEGER,
        "currency" TEXT DEFAULT 'EGP' NOT NULL,
        "included" JSON,
        "excluded" JSON,
        "itinerary" TEXT,
        "max_group_size" INTEGER,
        "featured" BOOLEAN DEFAULT FALSE,
        "rating" DOUBLE PRECISION,
        "review_count" INTEGER DEFAULT 0,
        "status" TEXT DEFAULT 'active',
        "name_ar" TEXT,
        "description_ar" TEXT,
        "itinerary_ar" TEXT,
        "included_ar" JSON,
        "excluded_ar" JSON,
        "has_arabic_version" BOOLEAN DEFAULT FALSE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        "created_by" INTEGER REFERENCES "users"("id"),
        "updated_by" INTEGER REFERENCES "users"("id"),
        "category_id" INTEGER REFERENCES "tour_categories"("id")
      );
    `;
    console.log('✅ Tours table created');

    // Rooms table
    await sql`
      CREATE TABLE IF NOT EXISTS "rooms" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "hotel_id" INTEGER REFERENCES "hotels"("id") NOT NULL,
        "type" TEXT NOT NULL,
        "max_occupancy" INTEGER NOT NULL,
        "max_adults" INTEGER NOT NULL,
        "max_children" INTEGER NOT NULL DEFAULT 0,
        "max_infants" INTEGER NOT NULL DEFAULT 0,
        "price" INTEGER NOT NULL,
        "discounted_price" INTEGER,
        "currency" TEXT DEFAULT 'EGP' NOT NULL,
        "image_url" TEXT,
        "size" TEXT,
        "bed_type" TEXT,
        "amenities" JSON,
        "view" TEXT,
        "available" BOOLEAN DEFAULT TRUE,
        "status" TEXT DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        "created_by" INTEGER REFERENCES "users"("id"),
        "updated_by" INTEGER REFERENCES "users"("id")
      );
    `;
    console.log('✅ Rooms table created');

    // Translations table
    await sql`
      CREATE TABLE IF NOT EXISTS "translations" (
        "id" SERIAL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "en_text" TEXT NOT NULL,
        "ar_text" TEXT,
        "context" TEXT,
        "category" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        "created_by" INTEGER REFERENCES "users"("id"),
        "updated_by" INTEGER REFERENCES "users"("id")
      );
    `;
    console.log('✅ Translations table created');

    // Menus table
    await sql`
      CREATE TABLE IF NOT EXISTS "menus" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "location" TEXT NOT NULL,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Menus table created');

    // Menu items table
    await sql`
      CREATE TABLE IF NOT EXISTS "menu_items" (
        "id" SERIAL PRIMARY KEY,
        "menu_id" INTEGER REFERENCES "menus"("id") NOT NULL,
        "title" TEXT NOT NULL,
        "url" TEXT NOT NULL,
        "icon" TEXT,
        "icon_type" TEXT DEFAULT 'lucide',
        "item_type" TEXT DEFAULT 'link',
        "order" INTEGER DEFAULT 0,
        "target" TEXT DEFAULT '_self',
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Menu items table created');

    // Favorites table
    await sql`
      CREATE TABLE IF NOT EXISTS "favorites" (
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "destination_id" INTEGER NOT NULL REFERENCES "destinations"("id"),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        "created_by" INTEGER REFERENCES "users"("id"),
        "updated_by" INTEGER REFERENCES "users"("id"),
        PRIMARY KEY ("user_id", "destination_id")
      );
    `;
    console.log('✅ Favorites table created');

    // Hotel facilities table
    await sql`
      CREATE TABLE IF NOT EXISTS "hotel_facilities" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "icon" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Hotel facilities table created');

    // Site language settings table
    await sql`
      CREATE TABLE IF NOT EXISTS "site_language_settings" (
        "id" SERIAL PRIMARY KEY,
        "default_language" TEXT NOT NULL DEFAULT 'en',
        "enabled_languages" JSON DEFAULT '["en", "ar"]',
        "rtl_enabled" BOOLEAN DEFAULT TRUE,
        "auto_detect_language" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Site language settings table created');

    // Dictionary entries table
    await sql`
      CREATE TABLE IF NOT EXISTS "dictionary_entries" (
        "id" SERIAL PRIMARY KEY,
        "word" TEXT NOT NULL,
        "english_definition" TEXT NOT NULL,
        "arabic_translation" TEXT NOT NULL,
        "phonetic_transcription" TEXT,
        "part_of_speech" TEXT,
        "example_sentence" TEXT,
        "difficulty_level" TEXT DEFAULT 'beginner',
        "category" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log('✅ Dictionary entries table created');

    console.log('🎉 Complete schema creation finished!');
    
  } catch (error) {
    console.error('❌ Schema creation error:', error.message);
    throw error;
  } finally {
    await sql.end();
  }
}

createCompleteSchema();
EOF

echo "🚀 Creating complete database schema..."
npx tsx complete_schema.ts

# Clean up
rm -f complete_schema.ts

echo ""
echo "✅ Complete database setup finished!"
echo "Run ./start.sh to test the server"
echo "================================="