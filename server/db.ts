import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Use environment variable for database configuration
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/travel_app';

// Create a postgres client connection with better error handling
let client: postgres.Sql;
let db: ReturnType<typeof drizzle>;

// Initialize database connection with fallback handling
async function initializeDatabase() {
  try {
    console.log('Attempting to connect with URL:', DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
    
    // Validate DATABASE_URL format
    if (!DATABASE_URL || DATABASE_URL === 'postgresql://postgres:a@localhost:5432/postgres') {
      console.warn('⚠️ Using default DATABASE_URL - connection may fail');
    }
    
    // Create a postgres client connection with connection pool
    client = postgres(DATABASE_URL, {
      ssl: DATABASE_URL.includes('localhost') ? false : 'require',
      max: 5, // Limit connection pool size
      idle_timeout: 10, // Lower idle timeout
      connect_timeout: 5, // 5 second connection timeout
      connection: {
        application_name: 'travel-app'
      }
    });
    
    // Test the connection with timeout
    await Promise.race([
      client`SELECT 1`,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      )
    ]);
    
    // Create a drizzle instance with PostgreSQL
    db = drizzle(client, { schema });
    
    console.log('Database connection established successfully');
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return false;
  }
}

// Initialize the database connection and export a promise
const dbPromise = initializeDatabase();

// Export the database connection
export { db, client, dbPromise };
