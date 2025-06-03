import postgres from 'postgres';
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [storedHash, salt] = hashedPassword.split('.');
  if (!salt) return false;
  
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  const derivedKey = buf.toString('hex');
  
  return timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(derivedKey, 'hex'));
}

async function testCompleteAuth() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL not found');
    }

    console.log('Testing complete authentication system...');
    const client = postgres(DATABASE_URL, { ssl: 'require' });

    // Test Registration
    console.log('\n1. Testing Registration:');
    const testUser = {
      username: 'completetest',
      email: 'completetest@example.com',
      password: 'password123',
      fullName: 'Complete Test User'
    };

    // Check if user exists and delete
    await client`DELETE FROM users WHERE username = ${testUser.username} OR email = ${testUser.email}`;

    // Hash password
    const hashedPassword = await hashPassword(testUser.password);

    // Insert user
    const [newUser] = await client`
      INSERT INTO users (username, email, password, full_name) 
      VALUES (${testUser.username}, ${testUser.email}, ${hashedPassword}, ${testUser.fullName})
      RETURNING id, username, email, full_name
    `;

    console.log('Registration successful:', {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.full_name
    });

    // Test Login
    console.log('\n2. Testing Login:');
    
    // Find user
    const [user] = await client`
      SELECT id, username, email, password, full_name 
      FROM users 
      WHERE username = ${testUser.username} OR email = ${testUser.username}
      LIMIT 1
    `;

    if (!user) {
      console.log('Login failed: User not found');
      return;
    }

    // Verify password
    const isValidPassword = await verifyPassword(testUser.password, user.password);
    
    if (!isValidPassword) {
      console.log('Login failed: Invalid password');
      return;
    }

    console.log('Login successful:', {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name
    });

    await client.end();
    console.log('\n✅ Complete authentication test passed!');

  } catch (error) {
    console.error('❌ Authentication test failed:', error);
  }
}

testCompleteAuth();