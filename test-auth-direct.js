const express = require('express');
const cors = require('cors');
const session = require('express-session');
const postgres = require('postgres');
const { scrypt, randomBytes, timingSafeEqual } = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(scrypt);

async function verifyPassword(password, hashedPassword) {
  const [storedHash, salt] = hashedPassword.split('.');
  if (!salt) return false;
  
  const buf = await scryptAsync(password, salt, 64);
  const derivedKey = buf.toString('hex');
  
  return timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(derivedKey, 'hex'));
}

const app = express();

app.use(cors({
  credentials: true,
  origin: true
}));

app.use(express.json());

app.use(session({
  secret: 'sahara-journeys-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.post("/api/login", async (req, res) => {
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

    const users = await client`
      SELECT id, username, email, password, full_name, role 
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

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ 
        message: "Invalid username or password" 
      });
    }

    await client.end();

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role
    };

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
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

app.get("/api/user", async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    
    if (!sessionUser) {
      return res.status(200).json(null);
    }

    res.status(200).json({
      id: sessionUser.id,
      username: sessionUser.username,
      email: sessionUser.email,
      fullName: sessionUser.fullName,
      role: sessionUser.role
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(200).json(null);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Test auth server running on port ${PORT}`);
});