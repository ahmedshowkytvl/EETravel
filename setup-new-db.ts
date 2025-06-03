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
    console.log('Creating users table...');
    
    // Create users table directly with SQL
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
    
    console.log('Users table created successfully');
    
    console.log('Seeding admin user...');
    
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    await db.insert(users).values({
      username: 'admin',
      email: 'admin@saharajourneys.com',
      password: hashedPassword,
      fullName: 'System Administrator',
      role: 'admin',
      bio: 'System administrator for Sahara Journeys',
    }).onConflictDoNothing();
    
    console.log('Admin user seeded successfully');
    console.log('Database setup complete!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

setupNewDatabase();