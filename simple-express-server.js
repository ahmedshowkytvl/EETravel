const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

app.use(express.json());
app.use(express.static('client/dist'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sahara Journeys API Running' });
});

// Countries API
app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM countries WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Destinations API
app.get('/api/destinations', async (req, res) => {
  try {
    const query = `
      SELECT d.*, c.name as country_name 
      FROM destinations d 
      JOIN countries c ON d.country_id = c.id 
      WHERE d.active = true 
      ORDER BY c.name, d.name
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Tours API
app.get('/api/tours', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tours WHERE active = true ORDER BY title');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Hotels API
app.get('/api/hotels', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hotels WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Menu API for footer
app.get('/api/menus/location/footer', (req, res) => {
  const footerMenu = {
    menu: {
      id: 1,
      name: 'Footer Navigation',
      location: 'footer',
      active: true
    },
    items: [
      { id: 1, title: 'Home', url: '/', order: 1, active: true },
      { id: 2, title: 'Destinations', url: '/destinations', order: 2, active: true },
      { id: 3, title: 'Tours', url: '/tours', order: 3, active: true },
      { id: 4, title: 'Hotels', url: '/hotels', order: 4, active: true },
      { id: 5, title: 'Contact', url: '/contact', order: 5, active: true }
    ]
  };
  res.json(footerMenu);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Sahara Journeys server running on port ${port}`);
  console.log('Database:', process.env.DATABASE_URL ? 'Connected' : 'Not configured');
});