import { pool, db } from './server/db';
import * as schema from './shared/schema';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('Creating tables...');
  
  try {
    // Create tables one by one in the correct order
    
    // 1. Countries
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created countries table');
    
    // 2. Cities
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        country_id INTEGER NOT NULL REFERENCES countries(id),
        description TEXT,
        image_url TEXT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created cities table');
    
    // 3. Airports
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS airports (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        city_id INTEGER NOT NULL REFERENCES cities(id),
        code TEXT,
        description TEXT,
        image_url TEXT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created airports table');
    
    // 4. Users
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        display_name TEXT,
        first_name TEXT,
        last_name TEXT,
        phone_number TEXT,
        full_name TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        bio TEXT,
        avatar_url TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created users table');
    
    // 5. Destinations
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        country_id INTEGER REFERENCES countries(id),
        city_id INTEGER REFERENCES cities(id),
        description TEXT,
        image_url TEXT,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created destinations table');
    
    // 6. Packages with slug
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        discounted_price INTEGER,
        image_url TEXT,
        gallery_urls JSONB,
        duration INTEGER NOT NULL,
        rating INTEGER,
        review_count INTEGER DEFAULT 0,
        destination_id INTEGER REFERENCES destinations(id),
        country_id INTEGER REFERENCES countries(id),
        city_id INTEGER REFERENCES cities(id),
        featured BOOLEAN DEFAULT FALSE,
        type TEXT,
        inclusions JSONB,
        slug TEXT UNIQUE
      );
    `);
    console.log('Created packages table');
    
    // 7. Bookings
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        package_id INTEGER REFERENCES packages(id),
        booking_date TIMESTAMP NOT NULL DEFAULT NOW(),
        travel_date TIMESTAMP NOT NULL,
        number_of_travelers INTEGER NOT NULL,
        total_price INTEGER NOT NULL,
        status TEXT DEFAULT 'pending' NOT NULL
      );
    `);
    console.log('Created bookings table');
    
    // 8. Favorites
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS favorites (
        user_id INTEGER NOT NULL REFERENCES users(id),
        destination_id INTEGER NOT NULL REFERENCES destinations(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        PRIMARY KEY (user_id, destination_id)
      );
    `);
    console.log('Created favorites table');
    
    // 9. Tours
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS tours (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        gallery_urls JSONB,
        destination_id INTEGER REFERENCES destinations(id),
        trip_type TEXT,
        duration INTEGER NOT NULL,
        date TIMESTAMP,
        num_passengers INTEGER,
        price INTEGER NOT NULL,
        discounted_price INTEGER,
        included JSONB,
        excluded JSONB,
        itinerary TEXT,
        max_group_size INTEGER,
        featured BOOLEAN DEFAULT FALSE,
        rating DOUBLE PRECISION,
        review_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created tours table');
    
    // 10. Hotels
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS hotels (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        destination_id INTEGER REFERENCES destinations(id),
        address TEXT,
        city TEXT,
        country TEXT,
        postal_code TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        image_url TEXT,
        stars INTEGER,
        amenities JSONB,
        check_in_time TEXT,
        check_out_time TEXT,
        longitude DOUBLE PRECISION,
        latitude DOUBLE PRECISION,
        featured BOOLEAN DEFAULT FALSE,
        rating DOUBLE PRECISION,
        review_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created hotels table');
    
    // 11. Rooms
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        hotel_id INTEGER NOT NULL REFERENCES hotels(id),
        type TEXT NOT NULL,
        max_occupancy INTEGER NOT NULL,
        max_adults INTEGER NOT NULL,
        max_children INTEGER NOT NULL DEFAULT 0,
        max_infants INTEGER NOT NULL DEFAULT 0,
        price INTEGER NOT NULL,
        discounted_price INTEGER,
        image_url TEXT,
        size TEXT,
        bed_type TEXT,
        amenities JSONB,
        view TEXT,
        available BOOLEAN DEFAULT TRUE,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created rooms table');
    
    // 12. Room Combinations
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS room_combinations (
        id SERIAL PRIMARY KEY,
        room_id INTEGER NOT NULL REFERENCES rooms(id),
        adults_count INTEGER NOT NULL,
        children_count INTEGER NOT NULL DEFAULT 0,
        infants_count INTEGER NOT NULL DEFAULT 0,
        description TEXT,
        is_default BOOLEAN DEFAULT FALSE,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created room_combinations table');
    
    // 13. Menus
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        location TEXT NOT NULL,
        description TEXT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created menus table');
    
    // 14. Menu Items
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        menu_id INTEGER NOT NULL REFERENCES menus(id),
        parent_id INTEGER REFERENCES menu_items(id),
        title TEXT NOT NULL,
        url TEXT,
        icon TEXT,
        icon_type TEXT DEFAULT 'fas',
        item_type TEXT DEFAULT 'link',
        "order" INTEGER NOT NULL,
        target TEXT DEFAULT '_self',
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created menu_items table');
    
    // 15. Translations
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS translations (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        en_text TEXT NOT NULL,
        ar_text TEXT,
        context TEXT,
        category TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created translations table');
    
    // 16. Site Language Settings
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS site_language_settings (
        id SERIAL PRIMARY KEY,
        default_language TEXT NOT NULL DEFAULT 'en',
        available_languages JSONB DEFAULT '["en", "ar"]',
        rtl_languages JSONB DEFAULT '["ar"]',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created site_language_settings table');
    
    // 17. Dictionary Entries
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS dictionary_entries (
        id SERIAL PRIMARY KEY,
        word TEXT NOT NULL,
        english_definition TEXT NOT NULL,
        arabic_translation TEXT NOT NULL,
        part_of_speech TEXT,
        context TEXT,
        example TEXT,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created dictionary_entries table');
    
    // 18. Transport Locations
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS transport_locations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        location_type TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        popular BOOLEAN DEFAULT FALSE,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created transport_locations table');
    
    // 19. Transport Durations
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS transport_durations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        hours INTEGER NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created transport_durations table');
    
    // 20. Transport Types
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS transport_types (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        passenger_capacity INTEGER NOT NULL,
        baggage_capacity INTEGER NOT NULL,
        default_features JSONB,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created transport_types table');
    
    // 21. Transportation
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS transportation (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type_id INTEGER REFERENCES transport_types(id),
        destination_id INTEGER REFERENCES destinations(id),
        from_location_id INTEGER REFERENCES transport_locations(id),
        to_location_id INTEGER REFERENCES transport_locations(id),
        duration_id INTEGER REFERENCES transport_durations(id),
        passenger_capacity INTEGER NOT NULL,
        baggage_capacity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        discounted_price INTEGER,
        image_url TEXT,
        gallery_urls JSONB,
        features JSONB,
        with_driver BOOLEAN DEFAULT TRUE,
        available BOOLEAN DEFAULT TRUE,
        pickup_included BOOLEAN DEFAULT TRUE,
        featured BOOLEAN DEFAULT FALSE,
        rating DOUBLE PRECISION,
        review_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Created transportation table');
    
    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

migrate().catch(console.error);