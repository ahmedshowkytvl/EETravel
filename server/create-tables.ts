import { pool, db } from './db';
import * as schema from '@shared/schema';

async function createTables() {
  console.log('Creating PostgreSQL tables...');
  
  try {
    // Create tables for all entities in the schema
    await pool.query(`
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

    await db.run(`
      CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        country_id INTEGER NOT NULL,
        description TEXT,
        image_url TEXT,
        active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (country_id) REFERENCES countries(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS airports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city_id INTEGER NOT NULL,
        code TEXT,
        description TEXT,
        image_url TEXT,
        active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (city_id) REFERENCES cities(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS destinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        country TEXT NOT NULL,
        country_id INTEGER,
        city_id INTEGER,
        description TEXT,
        image_url TEXT,
        featured INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (country_id) REFERENCES countries(id),
        FOREIGN KEY (city_id) REFERENCES cities(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        discounted_price INTEGER,
        image_url TEXT,
        gallery_urls TEXT,
        duration INTEGER NOT NULL,
        rating INTEGER,
        review_count INTEGER DEFAULT 0,
        destination_id INTEGER,
        featured INTEGER DEFAULT 0,
        type TEXT,
        inclusions TEXT,
        FOREIGN KEY (destination_id) REFERENCES destinations(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        package_id INTEGER,
        booking_date TEXT NOT NULL,
        travel_date TEXT NOT NULL,
        number_of_travelers INTEGER NOT NULL,
        total_price INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (package_id) REFERENCES packages(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS favorites (
        user_id INTEGER NOT NULL,
        destination_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (user_id, destination_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (destination_id) REFERENCES destinations(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS tours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        gallery_urls TEXT,
        destination_id INTEGER,
        trip_type TEXT,
        duration INTEGER NOT NULL,
        date TEXT,
        num_passengers INTEGER,
        price INTEGER NOT NULL,
        discounted_price INTEGER,
        included TEXT,
        excluded TEXT,
        itinerary TEXT,
        max_group_size INTEGER,
        featured INTEGER DEFAULT 0,
        rating REAL,
        review_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (destination_id) REFERENCES destinations(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        destination_id INTEGER,
        address TEXT,
        city TEXT,
        country TEXT,
        postal_code TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        image_url TEXT,
        stars INTEGER,
        amenities TEXT,
        check_in_time TEXT,
        check_out_time TEXT,
        longitude REAL,
        latitude REAL,
        featured INTEGER DEFAULT 0,
        rating REAL,
        review_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (destination_id) REFERENCES destinations(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        hotel_id INTEGER NOT NULL,
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
        amenities TEXT,
        view TEXT,
        available INTEGER DEFAULT 1,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (hotel_id) REFERENCES hotels(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS room_combinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER NOT NULL,
        adults_count INTEGER NOT NULL,
        children_count INTEGER NOT NULL DEFAULT 0,
        infants_count INTEGER NOT NULL DEFAULT 0,
        description TEXT,
        is_default INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (room_id) REFERENCES rooms(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        location TEXT NOT NULL,
        description TEXT,
        active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        menu_id INTEGER NOT NULL,
        parent_id INTEGER,
        title TEXT NOT NULL,
        url TEXT,
        icon TEXT,
        icon_type TEXT DEFAULT 'fas',
        item_type TEXT DEFAULT 'link',
        "order" INTEGER NOT NULL,
        target TEXT DEFAULT '_self',
        active INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (menu_id) REFERENCES menus(id),
        FOREIGN KEY (parent_id) REFERENCES menu_items(id)
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS translations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL,
        en_text TEXT NOT NULL,
        ar_text TEXT,
        context TEXT,
        category TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS site_language_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        default_language TEXT NOT NULL DEFAULT 'en',
        available_languages TEXT DEFAULT '["en", "ar"]',
        rtl_languages TEXT DEFAULT '["ar"]',
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS dictionary_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL,
        english_definition TEXT NOT NULL,
        arabic_translation TEXT NOT NULL,
        part_of_speech TEXT,
        context TEXT,
        example TEXT,
        notes TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS transport_locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        location_type TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        popular INTEGER DEFAULT 0,
        latitude REAL,
        longitude REAL,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS transport_durations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        hours INTEGER NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS transport_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        passenger_capacity INTEGER NOT NULL,
        baggage_capacity INTEGER NOT NULL,
        default_features TEXT,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `);

    await db.run(`
      CREATE TABLE IF NOT EXISTS transportation (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        type_id INTEGER,
        destination_id INTEGER,
        from_location_id INTEGER,
        to_location_id INTEGER,
        duration_id INTEGER,
        passenger_capacity INTEGER NOT NULL,
        baggage_capacity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        discounted_price INTEGER,
        image_url TEXT,
        gallery_urls TEXT,
        features TEXT,
        with_driver INTEGER DEFAULT 1,
        available INTEGER DEFAULT 1,
        pickup_included INTEGER DEFAULT 1,
        featured INTEGER DEFAULT 0,
        rating REAL,
        review_count INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT,
        FOREIGN KEY (type_id) REFERENCES transport_types(id),
        FOREIGN KEY (destination_id) REFERENCES destinations(id),
        FOREIGN KEY (from_location_id) REFERENCES transport_locations(id),
        FOREIGN KEY (to_location_id) REFERENCES transport_locations(id),
        FOREIGN KEY (duration_id) REFERENCES transport_durations(id)
      );
    `);

    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Execute the function
createTables().catch(console.error);