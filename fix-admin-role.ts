import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from './shared/schema';
import { eq } from 'drizzle-orm';

async function fixAdminRole() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL not found');
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  try {
    // Check admin user current data
    const adminUser = await db
      .select()
      .from(users)
      .where(eq(users.username, 'admin'))
      .limit(1);

    if (adminUser.length > 0) {
      console.log('Current admin user data:', {
        id: adminUser[0].id,
        username: adminUser[0].username,
        email: adminUser[0].email,
        fullName: adminUser[0].fullName,
        role: adminUser[0].role
      });

      // Ensure admin has proper role
      if (adminUser[0].role !== 'admin') {
        await db
          .update(users)
          .set({ role: 'admin' })
          .where(eq(users.username, 'admin'));
        
        console.log('Updated admin user role to "admin"');
      } else {
        console.log('Admin user already has correct role');
      }
    } else {
      console.log('Admin user not found');
    }
    
  } catch (error) {
    console.error('Error checking admin role:', error);
  } finally {
    await client.end();
  }
}

fixAdminRole();