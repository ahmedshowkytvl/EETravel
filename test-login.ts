import postgres from 'postgres';
import { scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function testLogin() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL not found');
    }

    console.log('Connecting to database...');
    const client = postgres(DATABASE_URL, { ssl: 'require' });

    const username = 'authtest';
    const password = 'password123';

    console.log('Querying user...');
    
    const users = await client`
      SELECT id, username, email, password, full_name 
      FROM users 
      WHERE username = ${username.toLowerCase()} OR email = ${username.toLowerCase()}
      LIMIT 1
    `;
    
    console.log('Query result:', users);
    
    if (users.length === 0) {
      console.log('No user found');
      await client.end();
      return;
    }

    const user = users[0];
    console.log('User found:', { id: user.id, username: user.username, email: user.email });

    // Verify password
    const [storedHash, salt] = user.password.split('.');
    if (!salt) {
      console.log('Invalid password format');
      await client.end();
      return;
    }

    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    const derivedKey = buf.toString('hex');

    const isValidPassword = timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(derivedKey, 'hex'));
    console.log('Password valid:', isValidPassword);

    await client.end();
    console.log('Login test completed successfully');

  } catch (error) {
    console.error('Login test failed:', error);
  }
}

testLogin();