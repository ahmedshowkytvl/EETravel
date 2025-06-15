const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Database connection using authentic PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('client/dist'));

// Health check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as country_count FROM countries');
    res.json({ 
      status: 'OK', 
      message: 'Sahara Journeys Express.js Server',
      database: 'Connected',
      countries: result.rows[0].country_count 
    });
  } catch (error) {
    res.status(500).json({ status: 'Error', message: 'Database connection failed' });
  }
});

// Countries API - using authentic data from PostgreSQL
app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM countries WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Countries API error:', error);
    res.status(500).json({ message: 'Failed to fetch countries' });
  }
});

// Destinations API - using authentic data
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
    res.status(500).json({ message: 'Failed to fetch destinations' });
  }
});

// Tours API - using authentic data (if available)
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
    res.status(500).json({ message: 'Failed to fetch tours' });
  }
});

// Hotels API - using authentic data (if available)
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
    res.status(500).json({ message: 'Failed to fetch hotels' });
  }
});

// Cities API - fallback to destinations for compatibility
app.get('/api/cities', async (req, res) => {
  try {
    // First try cities table if it exists
    const query = `
      SELECT c.*, co.name as country_name 
      FROM cities c 
      LEFT JOIN countries co ON c.country_id = co.id 
      WHERE c.active = true 
      ORDER BY co.name, c.name
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    // Fallback to destinations as cities for admin panel compatibility
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
      console.error('Cities API error:', fallbackError);
      res.status(500).json({ message: 'Failed to fetch cities' });
    }
  }
});

// Airports API - empty response if table doesn't exist
app.get('/api/airports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM airports WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Airports API note:', 'Table not found, returning empty array');
    res.json([]);
  }
});

// Menu API for footer - static authentic navigation
app.get('/api/menus/location/footer', (req, res) => {
  const footerMenu = {
    menu: {
      id: 1,
      name: 'Footer Navigation',
      location: 'footer',
      description: 'Main footer navigation for Sahara Journeys',
      active: true
    },
    items: [
      {
        id: 1,
        title: 'Quick Links',
        url: '#',
        icon: null,
        itemType: 'heading',
        order: 0,
        menuId: 1,
        parentId: null,
        target: null,
        active: true
      },
      {
        id: 2,
        title: 'Home',
        url: '/',
        icon: null,
        itemType: 'link',
        order: 1,
        menuId: 1,
        parentId: 1,
        target: null,
        active: true
      },
      {
        id: 3,
        title: 'Destinations',
        url: '/destinations',
        icon: null,
        itemType: 'link',
        order: 2,
        menuId: 1,
        parentId: 1,
        target: null,
        active: true
      },
      {
        id: 4,
        title: 'Tours',
        url: '/tours',
        icon: null,
        itemType: 'link',
        order: 3,
        menuId: 1,
        parentId: 1,
        target: null,
        active: true
      },
      {
        id: 5,
        title: 'Hotels',
        url: '/hotels',
        icon: null,
        itemType: 'link',
        order: 4,
        menuId: 1,
        parentId: 1,
        target: null,
        active: true
      },
      {
        id: 6,
        title: 'Support',
        url: '#',
        icon: null,
        itemType: 'heading',
        order: 5,
        menuId: 1,
        parentId: null,
        target: null,
        active: true
      },
      {
        id: 7,
        title: 'Contact Us',
        url: '/contact',
        icon: null,
        itemType: 'link',
        order: 6,
        menuId: 1,
        parentId: 6,
        target: null,
        active: true
      },
      {
        id: 8,
        title: 'About',
        url: '/about',
        icon: null,
        itemType: 'link',
        order: 7,
        menuId: 1,
        parentId: 6,
        target: null,
        active: true
      }
    ]
  };
  res.json(footerMenu);
});

// Database test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const countryCount = await pool.query('SELECT COUNT(*) as count FROM countries');
    const destinationCount = await pool.query('SELECT COUNT(*) as count FROM destinations');
    const tourCount = await pool.query('SELECT COUNT(*) as count FROM tours');
    const hotelCount = await pool.query('SELECT COUNT(*) as count FROM hotels');
    
    res.json({
      database: 'Connected',
      tables: {
        countries: countryCount.rows[0].count,
        destinations: destinationCount.rows[0].count,
        tours: tourCount.rows[0].count,
        hotels: hotelCount.rows[0].count
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Database test failed', details: error.message });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// Start server
app.listen(port, '0.0.0.0', async () => {
  console.log(`Sahara Journeys Express.js server running on port ${port}`);
  
  // Test database connection
  try {
    const result = await pool.query('SELECT COUNT(*) as countries FROM countries WHERE active = true');
    console.log(`Database connected: ${result.rows[0].countries} countries available`);
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
});