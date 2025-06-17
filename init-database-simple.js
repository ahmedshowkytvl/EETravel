#!/usr/bin/env node

/**
 * Simple database initialization script that doesn't rely on drizzle-kit
 * This ensures the server can start even without drizzle-kit being available
 */

const { Pool } = require('pg');

async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ DATABASE_URL not set - skipping database initialization');
    return false;
  }

  try {
    console.log('🔍 Testing database connection...');
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    // Test connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    
    console.log('✅ Database connection successful');
    await pool.end();
    return true;
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Database initialization error:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };