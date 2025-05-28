import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Hardcoded database configuration
const DATABASE_URL = 'postgresql://postgres:a@localhost:5432/postgres';

// Create a postgres client connection with better error handling
let client: postgres.Sql;
let db: ReturnType<typeof drizzle>;

// Initialize database connection
async function initializeDatabase() {
  try {
    console.log('Attempting to connect with URL:', DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
    
    // Create a postgres client connection with connection pool
    client = postgres(DATABASE_URL, {
      ssl: false,
      max: 5, // Limit connection pool size
      idle_timeout: 10, // Lower idle timeout
      connection: {
        application_name: 'travel-app'
      }
    });
    
    // Test the connection
    await client`SELECT 1`;
    
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
