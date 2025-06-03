import postgres from 'postgres';
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function testRegistration() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL not found');
    }

    console.log('Connecting to database...');
    const client = postgres(DATABASE_URL, { ssl: 'require' });

    // Test data
    const username = 'directtest';
    const email = 'directtest@example.com';
    const password = 'password123';
    const fullName = 'Direct Test User';

    // Hash password
    const hashedPassword = await hashPassword(password);
    console.log('Password hashed successfully');

    // Check for existing users
    const existing = await client`
      SELECT username, email FROM users 
      WHERE username = ${username} OR email = ${email}
    `;

    if (existing.length > 0) {
      console.log('User already exists, deleting first...');
      await client`DELETE FROM users WHERE username = ${username} OR email = ${email}`;
    }

    // Insert new user
    const [newUser] = await client`
      INSERT INTO users (username, email, password, full_name) 
      VALUES (${username}, ${email}, ${hashedPassword}, ${fullName})
      RETURNING id, username, email, full_name
    `;

    console.log('User created successfully:', newUser);

    await client.end();
    console.log('Registration test completed successfully');

  } catch (error) {
    console.error('Registration test failed:', error);
  }
}

testRegistration();