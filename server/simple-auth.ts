import { Express, Request, Response } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export function setupSimpleAuth(app: Express) {
  // Simple registration endpoint
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
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

      // Check if username already exists
      const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ 
          message: "Username already exists. Please choose a different username." 
        });
      }

      // Check if email already exists
      const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingEmail.length > 0) {
        return res.status(400).json({ 
          message: "An account with this email already exists" 
        });
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const userData = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        fullName: fullName?.trim() || null,
        role: 'user',
        status: 'active',
        displayName: username.trim(),
        firstName: fullName?.trim().split(' ')[0] || null,
        lastName: fullName?.trim().split(' ').slice(1).join(' ') || null,
        phoneNumber: null,
        bio: null,
        avatarUrl: null
      };

      const [newUser] = await db.insert(users).values(userData).returning();

      // Don't send password to client
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json({
        ...userWithoutPassword,
        message: "Registration successful! Welcome to Sahara Travel."
      });

    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific database errors
      if (error.message?.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ 
          message: "Username or email already exists" 
        });
      }
      
      res.status(500).json({ 
        message: "Registration failed. Please try again." 
      });
    }
  });
}