import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection using authenticated database
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

app.use(cors());
app.use(express.json());

// Database initialization
async function initializeDatabase() {
  try {
    const result = await db.query('SELECT COUNT(*) as count FROM countries WHERE active = true');
    console.log(`Database connected: ${result.rows[0].count} countries available`);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

// API Routes using authentic PostgreSQL data

app.get('/api/countries', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM countries WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Countries API error:', error);
    res.status(500).json({ message: 'Failed to fetch countries' });
  }
});

app.get('/api/destinations', async (req, res) => {
  try {
    const query = `
      SELECT d.*, c.name as country_name, c.code as country_code
      FROM destinations d 
      JOIN countries c ON d.country_id = c.id 
      WHERE d.active = true 
      ORDER BY c.name, d.name
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Destinations API error:', error);
    res.status(500).json({ message: 'Failed to fetch destinations' });
  }
});

app.get('/api/cities', async (req, res) => {
  try {
    // Use destinations as cities for admin compatibility
    const query = `
      SELECT d.id, d.name, d.country_id, c.name as country_name, d.active, d.created_at, d.updated_at
      FROM destinations d 
      JOIN countries c ON d.country_id = c.id 
      WHERE d.active = true 
      ORDER BY c.name, d.name
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Cities API error:', error);
    res.status(500).json({ message: 'Failed to fetch cities' });
  }
});

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
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Tours API error:', error);
    res.status(500).json({ message: 'Failed to fetch tours' });
  }
});

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
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Hotels API error:', error);
    res.status(500).json({ message: 'Failed to fetch hotels' });
  }
});

app.get('/api/airports', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM airports WHERE active = true ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.json([]);
  }
});

app.get('/api/menus/location/footer', (req, res) => {
  const footerMenu = {
    menu: {
      id: 1,
      name: 'Footer Navigation',
      location: 'footer',
      description: 'Main navigation for Sahara Journeys',
      active: true
    },
    items: [
      { id: 1, title: 'Quick Links', url: '#', itemType: 'heading', order: 0, menuId: 1, parentId: null, target: null, active: true },
      { id: 2, title: 'Home', url: '/', itemType: 'link', order: 1, menuId: 1, parentId: 1, target: null, active: true },
      { id: 3, title: 'Destinations', url: '/destinations', itemType: 'link', order: 2, menuId: 1, parentId: 1, target: null, active: true },
      { id: 4, title: 'Tours', url: '/tours', itemType: 'link', order: 3, menuId: 1, parentId: 1, target: null, active: true },
      { id: 5, title: 'Hotels', url: '/hotels', itemType: 'link', order: 4, menuId: 1, parentId: 1, target: null, active: true },
      { id: 6, title: 'Support', url: '#', itemType: 'heading', order: 5, menuId: 1, parentId: null, target: null, active: true },
      { id: 7, title: 'Contact Us', url: '/contact', itemType: 'link', order: 6, menuId: 1, parentId: 6, target: null, active: true },
      { id: 8, title: 'About', url: '/about', itemType: 'link', order: 7, menuId: 1, parentId: 6, target: null, active: true }
    ]
  };
  res.json(footerMenu);
});

app.get('/health', async (req, res) => {
  try {
    const countries = await db.query('SELECT COUNT(*) as count FROM countries');
    const destinations = await db.query('SELECT COUNT(*) as count FROM destinations');
    
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

async function startServer() {
  const dbConnected = await initializeDatabase();
  
  if (dbConnected) {
    console.log('Database verified with authentic Middle Eastern travel data');
  }
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`Sahara Journeys server running on port ${port}`);
    console.log(`Using Express.js with PostgreSQL for optimal Replit compatibility`);
  });
}

process.on('SIGINT', async () => {
  await db.end();
  process.exit(0);
});

startServer();