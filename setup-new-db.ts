import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { users } from './shared/schema';
import bcrypt from 'bcryptjs';
import { sql } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:a@localhost:5432/postgres';

async function setupNewDatabase() {
  const client = postgres(DATABASE_URL, {
    ssl: DATABASE_URL.includes('localhost') ? false : 'require',
    max: 1
  });
  
  const db = drizzle(client);
  
  try {
    console.log('Creating essential tables...');
    
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        bio TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create packages table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        discounted_price INTEGER,
        image_url TEXT,
        gallery_urls JSON,
        rating INTEGER,
        review_count INTEGER DEFAULT 0,
        destination_id INTEGER,
        country_id INTEGER,
        city_id INTEGER,
        category_id INTEGER,
        featured BOOLEAN DEFAULT false,
        type TEXT,
        inclusions JSON,
        slug TEXT UNIQUE,
        route TEXT,
        ideal_for JSON,
        tour_selection JSON,
        included_features JSON,
        optional_excursions JSON,
        excluded_features JSON,
        itinerary JSON,
        what_to_pack JSON,
        travel_route JSON,
        accommodation_highlights JSON,
        transportation_details JSON,
        pricing_mode TEXT DEFAULT 'per_booking',
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        adult_count INTEGER DEFAULT 2,
        children_count INTEGER DEFAULT 0,
        infant_count INTEGER DEFAULT 0,
        max_group_size INTEGER DEFAULT 15,
        language TEXT DEFAULT 'english',
        best_time_to_visit TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP
      )
    `);
    
    console.log('Essential tables created successfully');
    
    console.log('Seeding admin user...');
    
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await db.execute(sql`
      INSERT INTO users (username, email, password, full_name, role, bio)
      VALUES ('admin', 'admin@saharajourneys.com', ${hashedPassword}, 'System Administrator', 'admin', 'System administrator for Sahara Journeys')
      ON CONFLICT (username) DO NOTHING
    `);
    
    console.log('Admin user seeded successfully');
    console.log('Database setup complete!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

setupNewDatabase();