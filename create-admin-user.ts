import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';
import * as crypto from 'crypto';

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const hashedPassword = crypto.scryptSync(password, salt, 64);
  return salt.toString('hex') + ':' + hashedPassword.toString('hex');
}

async function createAdminUser() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL not found');
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  const username = 'admin';
  const password = 'AdminTest123123@#';
  const email = 'admin@saharajourneys.com';
  const fullName = 'Admin User';

  try {
    // Check if admin user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const hashedPassword = await hashPassword(password);

    if (existingUser.length > 0) {
      // Update existing user
      await db
        .update(users)
        .set({
          password: hashedPassword,
          email: email,
          fullName: fullName,
          role: 'admin'
        })
        .where(eq(users.username, username));
      
      console.log('Admin user updated successfully');
    } else {
      // Create new user
      await db.insert(users).values({
        username: username,
        password: hashedPassword,
        email: email,
        fullName: fullName,
        role: 'admin'
      });
      
      console.log('Admin user created successfully');
    }

    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Email: ${email}`);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.end();
  }
}

createAdminUser();