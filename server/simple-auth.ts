import { Express, Request, Response } from "express";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import postgres from 'postgres';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export function setupSimpleAuth(app: Express) {
  // Simple registration endpoint using SQL execution
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      console.log('Registration attempt started');

      const { username, email, password, fullName } = req.body;

      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ 
          message: "Username, email, and password are required" 
        });
      }

      // Validate field lengths
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

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: "Please provide a valid email address" 
        });
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Prepare user data for database insertion
      const cleanUsername = username.trim().toLowerCase();
      const cleanEmail = email.trim().toLowerCase();
      const cleanFullName = fullName?.trim() || null;

      // Create direct database connection
      const DATABASE_URL = process.env.DATABASE_URL;
      if (!DATABASE_URL) {
        throw new Error('Database configuration missing');
      }

      const client = postgres(DATABASE_URL, { ssl: 'require' });

      try {
        // Check if username or email already exists
        const existingUsers = await client`
          SELECT username, email FROM users 
          WHERE username = ${cleanUsername} OR email = ${cleanEmail}
        `;

        if (existingUsers.length > 0) {
          const existing = existingUsers[0];
          if (existing.username === cleanUsername) {
            return res.status(400).json({ 
              message: "Username already exists. Please choose a different username." 
            });
          }
          if (existing.email === cleanEmail) {
            return res.status(400).json({ 
              message: "An account with this email already exists" 
            });
          }
        }

        // Insert new user
        const [newUser] = await client`
          INSERT INTO users (username, email, password, full_name) 
          VALUES (${cleanUsername}, ${cleanEmail}, ${hashedPassword}, ${cleanFullName})
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

      } catch (dbError) {
        await client.end();
        throw dbError;
      }

    } catch (error) {
      console.error("Registration error details:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
        detail: error.detail,
        constraint: error.constraint,
        requestBody: req.body
      });
      
      // Handle specific database errors
      if (error.message?.includes('UNIQUE constraint failed') || 
          error.message?.includes('duplicate key') ||
          error.code === '23505') {
        return res.status(400).json({ 
          message: "Username or email already exists" 
        });
      }

      // Handle missing column errors
      if (error.message?.includes('column') && error.message?.includes('does not exist')) {
        console.error("Database schema mismatch detected:", error.message);
        return res.status(500).json({ 
          message: "Database configuration error. Please contact support." 
        });
      }
      
      res.status(500).json({ 
        message: "Registration failed. Please try again." 
      });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      console.log('Login attempt started');

      const { username, password } = req.body;

      // Validate required fields
      if (!username || !password) {
        return res.status(400).json({ 
          message: "Username and password are required" 
        });
      }

      // Create direct database connection
      const DATABASE_URL = process.env.DATABASE_URL;
      if (!DATABASE_URL) {
        throw new Error('Database configuration missing');
      }

      const client = postgres(DATABASE_URL, { ssl: 'require' });

      try {
        // Find user by username or email
        const users = await client`
          SELECT id, username, email, password, full_name 
          FROM users 
          WHERE username = ${username.toLowerCase()} OR email = ${username.toLowerCase()}
          LIMIT 1
        `;
        
        const user = users[0];

        if (!user) {
          return res.status(400).json({ 
            message: "Invalid username or password" 
          });
        }

        // Verify password
        const [storedHash, salt] = user.password.split('.');
        if (!salt) {
          return res.status(400).json({ 
            message: "Invalid username or password" 
          });
        }

        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        const derivedKey = buf.toString('hex');

        if (!timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(derivedKey, 'hex'))) {
          return res.status(400).json({ 
            message: "Invalid username or password" 
          });
        }

        await client.end();

        // Return user data (without password)
        res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          message: "Login successful"
        });

      } catch (dbError) {
        await client.end();
        throw dbError;
      }

    } catch (error) {
      console.error("Login error details:", error);
      
      return res.status(500).json({ 
        message: "Login failed. Please try again." 
      });
    }
  });

  // Get current user endpoint
  app.get("/api/user", async (req: Request, res: Response) => {
    // For now, return null since we don't have session management
    res.status(200).json(null);
  });

  // Logout endpoint
  app.post("/api/logout", async (req: Request, res: Response) => {
    res.status(200).json({ message: "Logout successful" });
  });
}