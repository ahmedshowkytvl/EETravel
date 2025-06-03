const express = require('express');
const { scrypt, randomBytes, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
const postgres = require('postgres');

require('dotenv').config();

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function verifyPassword(password, hashedPassword) {
  const [storedHash, salt] = hashedPassword.split('.');
  if (!salt) return false;
  
  const buf = await scryptAsync(password, salt, 64);
  const derivedKey = buf.toString('hex');
  
  return timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(derivedKey, 'hex'));
}

const app = express();
const PORT = 8080;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  let client = null;
  
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: "Username, email, and password are required" 
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ 
        message: "Username must be at least 3 characters long" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('Database configuration missing');
    }

    client = postgres(DATABASE_URL, { ssl: 'require' });

    // Check if username or email already exists
    const existingUsers = await client`
      SELECT username, email FROM users 
      WHERE username = ${username.toLowerCase()} OR email = ${email.toLowerCase()}
    `;

    if (existingUsers.length > 0) {
      const existing = existingUsers[0];
      if (existing.username === username.toLowerCase()) {
        return res.status(400).json({ 
          message: "Username already exists. Please choose a different username." 
        });
      }
      if (existing.email === email.toLowerCase()) {
        return res.status(400).json({ 
          message: "An account with this email already exists" 
        });
      }
    }

    const hashedPassword = await hashPassword(password);

    // Insert new user
    const [newUser] = await client`
      INSERT INTO users (username, email, password, full_name) 
      VALUES (${username.toLowerCase()}, ${email.toLowerCase()}, ${hashedPassword}, ${fullName || null})
      RETURNING id, username, email, full_name
    `;

    await client.end();

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.full_name,
      message: "Registration successful! Welcome to Sahara Travel."
    });

  } catch (error) {
    if (client) {
      try {
        await client.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
    
    console.error("Registration error:", error);
    
    if (error.message && error.message.includes('duplicate key')) {
      return res.status(400).json({ 
        message: "Username or email already exists" 
      });
    }
    
    res.status(500).json({ 
      message: "Registration failed. Please try again." 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  let client = null;
  
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        message: "Username and password are required" 
      });
    }

    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      throw new Error('Database configuration missing');
    }

    client = postgres(DATABASE_URL, { ssl: 'require' });

    // Find user by username or email
    const users = await client`
      SELECT id, username, email, password, full_name 
      FROM users 
      WHERE username = ${username.toLowerCase()} OR email = ${username.toLowerCase()}
      LIMIT 1
    `;

    if (users.length === 0) {
      return res.status(400).json({ 
        message: "Invalid username or password" 
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ 
        message: "Invalid username or password" 
      });
    }

    await client.end();

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      message: "Login successful"
    });

  } catch (error) {
    if (client) {
      try {
        await client.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
    
    console.error("Login error:", error);
    
    res.status(500).json({ 
      message: "Login failed. Please try again." 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Authentication server running', 
    port: PORT,
    endpoints: ['/api/register', '/api/login']
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Authentication server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/register - User registration');
  console.log('  POST /api/login - User login');
  console.log('  GET /health - Server health check');
});