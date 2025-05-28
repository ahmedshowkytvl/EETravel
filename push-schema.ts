import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './shared/schema';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Connecting to database...');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
  }
  
  const client = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(client);
  
  console.log('Creating tables from schema...');
  
  try {
    // Create tables using SQL for PostgreSQL
    
    // Countries
    await client`
      CREATE TABLE IF NOT EXISTS "countries" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "code" TEXT NOT NULL,
        "description" TEXT,
        "image_url" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Cities
    await client`
      CREATE TABLE IF NOT EXISTS "cities" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "country_id" INTEGER NOT NULL REFERENCES "countries"("id"),
        "description" TEXT,
        "image_url" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Airports
    await client`
      CREATE TABLE IF NOT EXISTS "airports" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "city_id" INTEGER NOT NULL REFERENCES "cities"("id"),
        "code" TEXT,
        "description" TEXT,
        "image_url" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Users
    await client`
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
        "role" TEXT NOT NULL DEFAULT 'user',
        "bio" TEXT,
        "avatar_url" TEXT,
        "status" TEXT DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Destinations
    await client`
      CREATE TABLE IF NOT EXISTS "destinations" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "country" TEXT NOT NULL,
        "country_id" INTEGER REFERENCES "countries"("id"),
        "city_id" INTEGER REFERENCES "cities"("id"),
        "description" TEXT,
        "image_url" TEXT,
        "featured" BOOLEAN DEFAULT FALSE,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Menus
    await client`
      CREATE TABLE IF NOT EXISTS "menus" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "location" TEXT NOT NULL,
        "description" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Menu Items
    await client`
      CREATE TABLE IF NOT EXISTS "menu_items" (
        "id" SERIAL PRIMARY KEY,
        "menu_id" INTEGER NOT NULL REFERENCES "menus"("id"),
        "parent_id" INTEGER REFERENCES "menu_items"("id"),
        "title" TEXT NOT NULL,
        "url" TEXT,
        "icon" TEXT,
        "order" INTEGER NOT NULL,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Translations
    await client`
      CREATE TABLE IF NOT EXISTS "translations" (
        "id" SERIAL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "en_text" TEXT NOT NULL,
        "ar_text" TEXT,
        "context" TEXT,
        "category" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Site Language Settings
    await client`
      CREATE TABLE IF NOT EXISTS "site_language_settings" (
        "id" SERIAL PRIMARY KEY,
        "default_language" TEXT NOT NULL DEFAULT 'en',
        "available_languages" JSONB DEFAULT '["en", "ar"]',
        "rtl_languages" JSONB DEFAULT '["ar"]',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Dictionary entries
    await client`
      CREATE TABLE IF NOT EXISTS "dictionary_entries" (
        "id" SERIAL PRIMARY KEY,
        "word" TEXT NOT NULL,
        "english_definition" TEXT NOT NULL,
        "arabic_translation" TEXT NOT NULL,
        "part_of_speech" TEXT,
        "context" TEXT,
        "example" TEXT,
        "notes" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Transport locations
    await client`
      CREATE TABLE IF NOT EXISTS "transport_locations" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "country" TEXT NOT NULL,
        "type" TEXT,
        "location_type" TEXT NOT NULL DEFAULT 'both',
        "description" TEXT,
        "image_url" TEXT,
        "popular" BOOLEAN DEFAULT FALSE,
        "latitude" DOUBLE PRECISION,
        "longitude" DOUBLE PRECISION,
        "status" TEXT DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Transport durations
    await client`
      CREATE TABLE IF NOT EXISTS "transport_durations" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "hours" INTEGER NOT NULL,
        "description" TEXT,
        "status" TEXT DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Transport types
    await client`
      CREATE TABLE IF NOT EXISTS "transport_types" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "image_url" TEXT,
        "passenger_capacity" INTEGER NOT NULL,
        "baggage_capacity" INTEGER NOT NULL,
        "default_features" TEXT,
        "status" TEXT DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Hotels
    await client`
      CREATE TABLE IF NOT EXISTS "hotels" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "destination_id" INTEGER REFERENCES "destinations"("id"),
        "address" TEXT,
        "city" TEXT,
        "country" TEXT,
        "postal_code" TEXT,
        "phone" TEXT,
        "email" TEXT,
        "website" TEXT,
        "image_url" TEXT,
        "stars" INTEGER,
        "amenities" TEXT,
        "check_in_time" TEXT,
        "check_out_time" TEXT,
        "longitude" DOUBLE PRECISION,
        "latitude" DOUBLE PRECISION,
        "featured" BOOLEAN DEFAULT FALSE,
        "rating" DOUBLE PRECISION,
        "review_count" INTEGER DEFAULT 0,
        "status" TEXT DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Rooms
    await client`
      CREATE TABLE IF NOT EXISTS "rooms" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "hotel_id" INTEGER NOT NULL REFERENCES "hotels"("id"),
        "type" TEXT NOT NULL,
        "max_occupancy" INTEGER NOT NULL,
        "max_adults" INTEGER NOT NULL,
        "max_children" INTEGER DEFAULT 0,
        "max_infants" INTEGER DEFAULT 0,
        "price" INTEGER NOT NULL,
        "discounted_price" INTEGER,
        "image_url" TEXT,
        "size" TEXT,
        "bed_type" TEXT,
        "amenities" TEXT,
        "view" TEXT,
        "available" BOOLEAN DEFAULT TRUE,
        "status" TEXT DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Room combinations
    await client`
      CREATE TABLE IF NOT EXISTS "room_combinations" (
        "id" SERIAL PRIMARY KEY,
        "room_id" INTEGER NOT NULL REFERENCES "rooms"("id"),
        "adults_count" INTEGER NOT NULL,
        "children_count" INTEGER DEFAULT 0,
        "infants_count" INTEGER DEFAULT 0,
        "description" TEXT,
        "is_default" BOOLEAN DEFAULT FALSE,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Packages
    await client`
      CREATE TABLE IF NOT EXISTS "packages" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "price" INTEGER NOT NULL,
        "discounted_price" INTEGER,
        "image_url" TEXT,
        "gallery_urls" JSONB,
        "duration" INTEGER NOT NULL,
        "rating" INTEGER,
        "review_count" INTEGER DEFAULT 0,
        "destination_id" INTEGER REFERENCES "destinations"("id"),
        "country_id" INTEGER REFERENCES "countries"("id"),
        "city_id" INTEGER REFERENCES "cities"("id"),
        "featured" BOOLEAN DEFAULT FALSE,
        "type" TEXT,
        "inclusions" JSONB,
        "slug" TEXT UNIQUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Bookings
    await client`
      CREATE TABLE IF NOT EXISTS "bookings" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "users"("id"),
        "package_id" INTEGER REFERENCES "packages"("id"),
        "booking_date" TIMESTAMP NOT NULL,
        "travel_date" TIMESTAMP NOT NULL,
        "number_of_travelers" INTEGER NOT NULL,
        "total_price" INTEGER NOT NULL,
        "status" TEXT DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Favorites
    await client`
      CREATE TABLE IF NOT EXISTS "favorites" (
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "destination_id" INTEGER NOT NULL REFERENCES "destinations"("id"),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("user_id", "destination_id")
      );
    `;
    
    // Tours
    await client`
      CREATE TABLE IF NOT EXISTS "tours" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "image_url" TEXT,
        "gallery_urls" TEXT,
        "destination_id" INTEGER REFERENCES "destinations"("id"),
        "trip_type" TEXT,
        "duration" INTEGER NOT NULL,
        "date" TIMESTAMP,
        "num_passengers" INTEGER,
        "price" INTEGER NOT NULL,
        "discounted_price" INTEGER,
        "included" TEXT,
        "excluded" TEXT,
        "itinerary" TEXT,
        "max_group_size" INTEGER,
        "featured" BOOLEAN DEFAULT FALSE,
        "rating" DOUBLE PRECISION,
        "review_count" INTEGER DEFAULT 0,
        "status" TEXT DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Transportation
    await client`
      CREATE TABLE IF NOT EXISTS "transportation" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "type_id" INTEGER REFERENCES "transport_types"("id"),
        "destination_id" INTEGER REFERENCES "destinations"("id"),
        "from_location_id" INTEGER REFERENCES "transport_locations"("id"),
        "to_location_id" INTEGER REFERENCES "transport_locations"("id"),
        "duration_id" INTEGER REFERENCES "transport_durations"("id"),
        "passenger_capacity" INTEGER NOT NULL,
        "baggage_capacity" INTEGER NOT NULL,
        "price" INTEGER NOT NULL,
        "discounted_price" INTEGER,
        "image_url" TEXT,
        "gallery_urls" TEXT,
        "features" TEXT,
        "with_driver" BOOLEAN DEFAULT TRUE,
        "available" BOOLEAN DEFAULT TRUE,
        "pickup_included" BOOLEAN DEFAULT TRUE,
        "featured" BOOLEAN DEFAULT FALSE,
        "rating" DOUBLE PRECISION,
        "review_count" INTEGER DEFAULT 0,
        "status" TEXT DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Package Categories
    await client`
      CREATE TABLE IF NOT EXISTS "package_categories" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "icon" TEXT,
        "image_url" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Package To Category (Many-to-Many)
    await client`
      CREATE TABLE IF NOT EXISTS "package_to_category" (
        "package_id" INTEGER NOT NULL REFERENCES "packages"("id"),
        "category_id" INTEGER NOT NULL REFERENCES "package_categories"("id"),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("package_id", "category_id")
      );
    `;
    
    // Hotel Categories
    await client`
      CREATE TABLE IF NOT EXISTS "hotel_categories" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "icon" TEXT,
        "image_url" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Hotel To Category (Many-to-Many)
    await client`
      CREATE TABLE IF NOT EXISTS "hotel_to_category" (
        "hotel_id" INTEGER NOT NULL REFERENCES "hotels"("id"),
        "category_id" INTEGER NOT NULL REFERENCES "hotel_categories"("id"),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("hotel_id", "category_id")
      );
    `;
    
    // Room Categories
    await client`
      CREATE TABLE IF NOT EXISTS "room_categories" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "icon" TEXT,
        "image_url" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Room To Category (Many-to-Many)
    await client`
      CREATE TABLE IF NOT EXISTS "room_to_category" (
        "room_id" INTEGER NOT NULL REFERENCES "rooms"("id"),
        "category_id" INTEGER NOT NULL REFERENCES "room_categories"("id"),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("room_id", "category_id")
      );
    `;
    
    // Tour Categories
    await client`
      CREATE TABLE IF NOT EXISTS "tour_categories" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "icon" TEXT,
        "image_url" TEXT,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Tour To Category (Many-to-Many)
    await client`
      CREATE TABLE IF NOT EXISTS "tour_to_category" (
        "tour_id" INTEGER NOT NULL REFERENCES "tours"("id"),
        "category_id" INTEGER NOT NULL REFERENCES "tour_categories"("id"),
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY ("tour_id", "category_id")
      );
    `;
    
    // Hotel Features for Facilities
    await client`
      CREATE TABLE IF NOT EXISTS "hotel_facilities" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "icon" TEXT,
        "category" TEXT,
        "display_order" INTEGER DEFAULT 0,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Hotel Features for Highlights
    await client`
      CREATE TABLE IF NOT EXISTS "hotel_highlights" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "icon" TEXT,
        "display_order" INTEGER DEFAULT 0,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    // Cleanliness Features
    await client`
      CREATE TABLE IF NOT EXISTS "cleanliness_features" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "icon" TEXT,
        "display_order" INTEGER DEFAULT 0,
        "active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `;
    
    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    // Close the database connection
    await client.end();
  }
}

// Execute the function
main().catch(console.error);