import { Express, Request, Response } from "express";
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

export function setupUnifiedAuth(app: Express) {
  // Registration endpoint
  app.post("/api/register", async (req: Request, res: Response) => {
    let client: any = null;
    
    try {
      const { username, email, password, fullName } = req.body;

      // Validate required fields
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
        INSERT INTO users (username, email, password, full_name, role) 
        VALUES (${username.toLowerCase()}, ${email.toLowerCase()}, ${hashedPassword}, ${fullName || null}, 'user')
        RETURNING id, username, email, full_name, role
      `;

      await client.end();

      // Store user data in session
      (req as any).session.user = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
        role: newUser.role
      };

      // Ensure session is saved before responding
      (req as any).session.save((err: any) => {
        if (err) {
          console.error('Session save error during registration:', err);
          return res.status(500).json({ message: "Registration failed - session error" });
        }

        console.log('Session saved successfully for new user:', newUser.username);
        res.status(201).json({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.full_name,
          role: newUser.role,
          message: "Registration successful! Welcome to Sahara Travel."
        });
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
      
      if (error instanceof Error && error.message.includes('duplicate key')) {
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
  app.post("/api/login", async (req: Request, res: Response) => {
    let client: any = null;
    
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

      // Verify password
      const isValidPassword = await verifyPassword(password, user.password);

      if (!isValidPassword) {
        return res.status(400).json({ 
          message: "Invalid username or password" 
        });
      }

      await client.end();

      // Store user data in session
      (req as any).session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      };

      // Ensure session is saved before responding
      (req as any).session.save((err: any) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: "Login failed - session error" });
        }

        console.log('Session saved successfully for user:', user.username);
        res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          message: "Login successful"
        });
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

  // Get current user endpoint
  app.get("/api/user", async (req: Request, res: Response) => {
    try {
      const sessionUser = (req as any).session?.user;
      
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

  // Logout endpoint
  app.post("/api/logout", async (req: Request, res: Response) => {
    try {
      // Destroy the session
      (req as any).session.destroy((err: any) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        
        res.status(200).json({ message: "Logout successful" });
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Logout failed" });
    }
  });
}