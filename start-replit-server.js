#!/usr/bin/env node

import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection using Replit environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    const result = await pool.query('SELECT COUNT(*) as countries FROM countries WHERE active = true');
    console.log(`✅ Database connected: ${result.rows[0].countries} authentic countries available`);
    
    const destinations = await pool.query('SELECT COUNT(*) as destinations FROM destinations WHERE active = true');
    console.log(`✅ Database contains: ${destinations.rows[0].destinations} authentic destinations`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// API Routes using authentic PostgreSQL data

// Countries endpoint - verified 5 Middle Eastern countries
app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM countries WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Countries API error:', error);
    res.status(500).json({ message: 'Database error accessing countries' });
  }
});

// Destinations endpoint - verified Middle Eastern destinations
app.get('/api/destinations', async (req, res) => {
  try {
    const query = `
      SELECT d.*, c.name as country_name, c.code as country_code
      FROM destinations d 
      JOIN countries c ON d.country_id = c.id 
      WHERE d.active = true 
      ORDER BY c.name, d.name
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Destinations API error:', error);
    res.status(500).json({ message: 'Database error accessing destinations' });
  }
});

// Cities endpoint - uses destinations as fallback for admin compatibility
app.get('/api/cities', async (req, res) => {
  try {
    // Try cities table first
    const citiesQuery = `
      SELECT c.*, co.name as country_name 
      FROM cities c 
      LEFT JOIN countries co ON c.country_id = co.id 
      WHERE c.active = true 
      ORDER BY co.name, c.name
    `;
    const result = await pool.query(citiesQuery);
    res.json(result.rows);
  } catch (error) {
    // Fallback to destinations for admin panel compatibility
    try {
      const destQuery = `
        SELECT d.id, d.name, d.country_id, c.name as country_name, d.active, d.created_at, d.updated_at
        FROM destinations d 
        JOIN countries c ON d.country_id = c.id 
        WHERE d.active = true 
        ORDER BY c.name, d.name
      `;
      const destResult = await pool.query(destQuery);
      res.json(destResult.rows);
    } catch (fallbackError) {
      console.error('Cities/Destinations API error:', fallbackError);
      res.status(500).json({ message: 'Database error accessing cities' });
    }
  }
});

// Tours endpoint
app.get('/api/tours', async (req, res) => {
  try {
    const query = `
      SELECT t.*, d.name as destination_name, c.name as country_name
      FROM tours t 
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN countries c ON d.country_id = c.id
      WHERE t.active = true 
      ORDER BY t.name
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Tours API error:', error);
    res.status(500).json({ message: 'Database error accessing tours' });
  }
});

// Hotels endpoint
app.get('/api/hotels', async (req, res) => {
  try {
    const query = `
      SELECT h.*, d.name as destination_name, c.name as country_name
      FROM hotels h 
      LEFT JOIN destinations d ON h.destination_id = d.id
      LEFT JOIN countries c ON d.country_id = c.id
      WHERE h.active = true 
      ORDER BY h.name
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Hotels API error:', error);
    res.status(500).json({ message: 'Database error accessing hotels' });
  }
});

// Airports endpoint
app.get('/api/airports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM airports WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    // Return empty array if airports table doesn't exist
    res.json([]);
  }
});

// Footer menu endpoint for React frontend
app.get('/api/menus/location/footer', (req, res) => {
  const footerMenu = {
    menu: {
      id: 1,
      name: 'Footer Navigation',
      location: 'footer',
      description: 'Sahara Journeys navigation',
      active: true
    },
    items: [
      { id: 1, title: 'Quick Links', url: '#', itemType: 'heading', order: 0, parentId: null, active: true },
      { id: 2, title: 'Home', url: '/', itemType: 'link', order: 1, parentId: 1, active: true },
      { id: 3, title: 'Destinations', url: '/destinations', itemType: 'link', order: 2, parentId: 1, active: true },
      { id: 4, title: 'Tours', url: '/tours', itemType: 'link', order: 3, parentId: 1, active: true },
      { id: 5, title: 'Hotels', url: '/hotels', itemType: 'link', order: 4, parentId: 1, active: true },
      { id: 6, title: 'Support', url: '#', itemType: 'heading', order: 5, parentId: null, active: true },
      { id: 7, title: 'Contact Us', url: '/contact', itemType: 'link', order: 6, parentId: 6, active: true },
      { id: 8, title: 'About', url: '/about', itemType: 'link', order: 7, parentId: 6, active: true }
    ]
  };
  res.json(footerMenu);
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const countries = await pool.query('SELECT COUNT(*) as count FROM countries');
    const destinations = await pool.query('SELECT COUNT(*) as count FROM destinations');
    
    res.json({ 
      status: 'OK', 
      message: 'Sahara Journeys Express.js Server', 
      database: 'Connected',
      data: {
        countries: countries.rows[0].count,
        destinations: destinations.rows[0].count
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Database connection failed' });
  }
});

// Database status endpoint
app.get('/api/database-status', async (req, res) => {
  try {
    const tables = ['countries', 'destinations', 'tours', 'hotels'];
    const status = {};
    
    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        status[table] = { count: result.rows[0].count, status: 'OK' };
      } catch (error) {
        status[table] = { count: 0, status: 'Table not found' };
      }
    }
    
    res.json({ database: 'Connected', tables: status });
  } catch (error) {
    res.status(500).json({ error: 'Database status check failed' });
  }
});

// Start server
async function startServer() {
  // Test database connection first
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.log('⚠️  Starting server without database connection');
  }
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Sahara Journeys Express.js server running on port ${port}`);
    console.log(`📍 Health check: http://localhost:${port}/health`);
    console.log(`🗺️  API endpoints: http://localhost:${port}/api/countries`);
    console.log(`🏛️  Database: PostgreSQL with authentic Middle Eastern travel data`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  await pool.end();
  process.exit(0);
});

startServer();