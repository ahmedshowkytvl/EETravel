#!/usr/bin/env node

/**
 * Simple database setup script that can be run manually if needed
 * Usage: node setup-database.js
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function setupDatabase() {
  console.log('🔧 Setting up database for travel booking platform...');
  
  try {
    console.log('📋 Creating database schema...');
    await execAsync('npm run db:push');
    console.log('✅ Database schema created successfully');
    
    console.log('🌱 Starting application to complete setup...');
    console.log('ℹ️  The application will automatically seed data on startup');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('💡 Try running: npm run db:push manually');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase };