import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Initialize the database by pushing the schema and then running setup
 * This ensures tables exist before any seeding operations
 */
export async function initializeDatabase(): Promise<void> {
  console.log('🔧 Initializing database...');
  
  try {
    // First, push the schema to create all tables
    console.log('📋 Creating database schema...');
    await execAsync('npm run db:push');
    console.log('✅ Database schema created successfully');
    
    // Now run the setup scripts that depend on tables existing
    const { setupDatabase } = await import('../setup-for-remix');
    await setupDatabase();
    
    const adminSetup = await import('./admin-setup');
    await adminSetup.setupAdmin();
    
    const packageCategoriesSetup = await import('./seed-package-categories');
    await packageCategoriesSetup.seedPackageCategories();
    
    const seedModule = await import('./seed');
    await seedModule.seed();
    
    console.log('✅ Database initialization complete!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Don't exit the process, just log the error
    // The app can still run even if seeding fails
  }
}