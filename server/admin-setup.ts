import { users } from '@shared/schema';
import { db } from './db';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function setupAdmin() {
  try {
    console.log('🔐 Setting up admin users...');
    
    // Check if the main admin user already exists
    const existingAdmin = await db.select().from(users)
      .where(eq(users.username, 'EETADMIN'));
    
    if (existingAdmin.length === 0) {
      // Hash the password
      const hashedPassword = await hashPassword('passW0rd');
      
      // Create main admin user
      await db.insert(users).values({
        username: 'EETADMIN',
        password: hashedPassword,
        email: 'admin@egyptexpress.com',
        displayName: 'Admin User',
        role: 'admin',
      });
      
      console.log('✅ Main admin user created successfully!');
    } else {
      console.log('✅ Main admin user already exists');
    }
    
    // Check if test admin user already exists
    const existingTestAdmin = await db.select().from(users)
      .where(eq(users.username, 'testadmin'));
    
    if (existingTestAdmin.length === 0) {
      // Hash the password
      const testAdminPassword = await hashPassword('test123');
      
      // Create test admin user
      await db.insert(users).values({
        username: 'testadmin',
        password: testAdminPassword,
        email: 'testadmin@egyptexpress.com',
        displayName: 'Test Admin',
        role: 'admin',
      });
      
      console.log('✅ Test admin user created successfully!');
    } else {
      console.log('✅ Test admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error setting up admin users:', error);
  }
}

export { setupAdmin };