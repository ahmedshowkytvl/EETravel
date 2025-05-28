import { db } from './server/db';
import { sql } from 'drizzle-orm';

/**
 * This script ensures the database is properly set up
 * It runs automatically on first startup for remixed projects
 */
export async function setupDatabase() {
  console.log('🔄 Checking database setup...');
  
  try {
    // Add the slug column to packages table if it doesn't exist
    await db.execute(sql`
      ALTER TABLE packages ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
    `);
    console.log('✅ Ensured packages table has slug column');
    
    // Verify countries table existence
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS countries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Ensured countries table exists');
    
    // Verify visa-related tables
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS nationalities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Ensured nationalities table exists');
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS visas (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        target_country_id INTEGER REFERENCES countries(id),
        image_url TEXT,
        price INTEGER,
        processing_time TEXT,
        required_documents JSONB,
        validity_period TEXT,
        entry_type TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Ensured visas table exists');
    
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS nationality_visa_requirements (
        id SERIAL PRIMARY KEY,
        visa_id INTEGER REFERENCES visas(id) ON DELETE CASCADE,
        nationality_id INTEGER REFERENCES nationalities(id) ON DELETE CASCADE,
        requirement_details TEXT,
        additional_documents JSONB,
        fees INTEGER,
        processing_time TEXT,
        notes TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Ensured nationality_visa_requirements table exists');
    
    // Sample data already exists, no need to add more
    console.log('✅ All necessary visa tables are created');
    
    console.log('✅ Database setup complete!');
    return true;
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    return false;
  }
}

// This script is imported and run automatically on startup
// No need to check for direct execution in ESM context