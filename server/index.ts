import express, { type Request, Response, NextFunction } from "express";
import dotenv from 'dotenv'; // استيراد dotenv
import cors from 'cors'; // استيراد cors
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import { dbPromise } from './db'; // استيراد dbPromise
import session from 'express-session'; // استيراد session
import { setupAdmin } from './admin-setup'; // استيراد setupAdmin
import { setupUnifiedAuth } from './unified-auth'; // استيراد setupUnifiedAuth

// Load environment variables first
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // استخدام cors
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: false, limit: '25mb' }));

// Session setup (example using default settings, configure as needed)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-default-secret', // Replace with a strong secret
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        // Limit the size of the logged JSON response
        const jsonString = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${jsonString.length > 200 ? jsonString.substring(0, 197) + '...' : jsonString}`;
      }

      if (logLine.length > 150) { // Increase limit to accommodate JSON
        logLine = logLine.slice(0, 147) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Try to initialize database, but continue with fallback if it fails
    console.log('⏳ Waiting for database initialization...');
    let dbInitialized = false;
    
    try {
      dbInitialized = await dbPromise;
    } catch (error: any) {
      console.warn('⚠️ Database connection failed, continuing with fallback storage:', error?.message || 'Unknown error');
      dbInitialized = false;
    }

    if (dbInitialized) {
      console.log('✅ Database initialized.');
    } else {
      console.log('📦 Using fallback storage due to database connection issues.');
    }

    // Setup admin users after database is initialized
    await setupAdmin();

    // Setup unified authentication (including registration)
    setupUnifiedAuth(app);

    // Start the server and register routes
    const server = await registerRoutes(app);

    // Serve the admin test page
    app.get('/admin-test', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'client', 'public', 'admin-test.html'));
    });

    // Run first-time setup and seeding in background after server starts
    // Don't await this to prevent blocking server startup
    (async () => {
      try {
        const { initializeDatabase } = await import('./init-database');
        await initializeDatabase();
      } catch (error) {
        console.error('Failed to run initial database setup and seeding:', error);
      }
    })();

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      // Consider logging the error here instead of throwing to prevent crashing
      console.error('Error:', err);
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn\'t interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 8080
    // this serves both the API and the client.
    // Using port 8080 as discussed previously
    const port = parseInt(process.env.PORT || "8080"); // Use PORT environment variable, fallback to 8080
    server.listen(port, () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
})();
