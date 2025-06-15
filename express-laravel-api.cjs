const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Laravel API is running',
    timestamp: new Date().toISOString()
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
    
    res.json(result.rows);
  } catch (error) {
    console.error('Countries error:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
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
    
    res.json(result.rows);
  } catch (error) {
    console.error('Destinations error:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
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
    
    res.json(result.rows);
  } catch (error) {
    console.error('Menu error:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
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
    
    res.json(result.rows);
  } catch (error) {
    console.error('Tours error:', error);
    res.status(500).json({ error: 'Failed to fetch tours' });
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
    
    res.json(result.rows);
  } catch (error) {
    console.error('Packages error:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
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
    
    res.json(result.rows);
  } catch (error) {
    console.error('Hotels error:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Laravel API server running on port ${PORT}`);
  await testConnection();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down Laravel API server...');
  pool.end();
  process.exit();
});