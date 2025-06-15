#!/usr/bin/env node

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 8000;

// Database connection using environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Laravel API server running',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Countries endpoint
app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, code, flag_url, description, 
             created_at, updated_at, is_active
      FROM countries 
      WHERE is_active = true 
      ORDER BY name ASC
    `);
    
    console.log(`Countries API: Retrieved ${result.rows.length} countries`);
    res.json(result.rows);
  } catch (error) {
    console.error('Countries API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch countries', details: error.message });
  }
});

// Destinations endpoint
app.get('/api/destinations', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.id, d.name, d.description, d.image_url, d.featured,
             d.created_at, d.updated_at, d.is_active,
             c.name as country_name, c.code as country_code
      FROM destinations d
      LEFT JOIN countries c ON d.country_id = c.id
      WHERE d.is_active = true 
      ORDER BY d.featured DESC, d.name ASC
    `);
    
    console.log(`Destinations API: Retrieved ${result.rows.length} destinations`);
    res.json(result.rows);
  } catch (error) {
    console.error('Destinations API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch destinations', details: error.message });
  }
});

// Menu endpoint
app.get('/api/menus/location/:location', async (req, res) => {
  try {
    const location = req.params.location;
    const result = await pool.query(`
      SELECT m.id, m.title, m.url, m.location, m.parent_id, m.sort_order,
             m.is_active, m.created_at, m.updated_at
      FROM menus m
      WHERE m.location = $1 AND m.is_active = true
      ORDER BY m.sort_order ASC, m.id ASC
    `, [location]);
    
    console.log(`Menu API: Retrieved ${result.rows.length} items for location: ${location}`);
    res.json(result.rows);
  } catch (error) {
    console.error('Menu API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch menu', details: error.message });
  }
});

// Tours endpoint
app.get('/api/tours', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.id, t.title, t.description, t.price, t.duration,
             t.max_participants, t.difficulty_level, t.image_url,
             t.featured, t.created_at, t.updated_at, t.is_active,
             d.name as destination_name, c.name as country_name
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      LEFT JOIN countries c ON d.country_id = c.id
      WHERE t.is_active = true 
      ORDER BY t.featured DESC, t.created_at DESC
    `);
    
    console.log(`Tours API: Retrieved ${result.rows.length} tours`);
    res.json(result.rows);
  } catch (error) {
    console.error('Tours API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch tours', details: error.message });
  }
});

// Packages endpoint
app.get('/api/packages', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.description, p.price, p.duration,
             p.max_participants, p.image_url, p.featured,
             p.created_at, p.updated_at, p.is_active,
             pc.name as category_name
      FROM packages p
      LEFT JOIN package_categories pc ON p.category_id = pc.id
      WHERE p.is_active = true 
      ORDER BY p.featured DESC, p.created_at DESC
    `);
    
    console.log(`Packages API: Retrieved ${result.rows.length} packages`);
    res.json(result.rows);
  } catch (error) {
    console.error('Packages API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch packages', details: error.message });
  }
});

// Hotels endpoint
app.get('/api/hotels', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT h.id, h.name, h.description, h.address, h.rating,
             h.price_per_night, h.image_url, h.amenities,
             h.created_at, h.updated_at, h.is_active,
             d.name as destination_name, c.name as country_name
      FROM hotels h
      LEFT JOIN destinations d ON h.destination_id = d.id
      LEFT JOIN countries c ON d.country_id = c.id
      WHERE h.is_active = true 
      ORDER BY h.rating DESC, h.name ASC
    `);
    
    console.log(`Hotels API: Retrieved ${result.rows.length} hotels`);
    res.json(result.rows);
  } catch (error) {
    console.error('Hotels API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
});

// Database connection test
async function testDatabase() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully at:', result.rows[0].current_time);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Server startup
async function startServer() {
  console.log('🚀 Starting Laravel API Server...');
  
  // Test database connection first
  const dbConnected = await testDatabase();
  if (!dbConnected) {
    console.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }

  // Start the server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌟 Laravel API Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available:`);
    console.log(`   GET /api/health`);
    console.log(`   GET /api/countries`);
    console.log(`   GET /api/destinations`);
    console.log(`   GET /api/tours`);
    console.log(`   GET /api/packages`);
    console.log(`   GET /api/hotels`);
    console.log(`   GET /api/menus/location/{location}`);
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Gracefully shutting down Laravel API server...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down Laravel API server...');
  await pool.end();
  process.exit(0);
});

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});