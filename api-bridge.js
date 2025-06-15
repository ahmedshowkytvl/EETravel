const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());

// Helper function to execute Laravel commands
function executeLaravelCommand(command) {
  return new Promise((resolve, reject) => {
    const laravelPath = path.join(__dirname, 'laravel-backend');
    exec(`cd ${laravelPath} && php artisan tinker --execute="${command}"`, 
      { timeout: 10000 }, 
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout.trim());
      }
    );
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API bridge is running',
    timestamp: new Date().toISOString()
  });
});

// Countries endpoint
app.get('/api/countries', async (req, res) => {
  try {
    const command = `
      $controller = new \\App\\Http\\Controllers\\Api\\CountryController();
      $request = new \\Illuminate\\Http\\Request();
      $response = $controller->index($request);
      echo $response->getContent();
    `;
    
    const result = await executeLaravelCommand(command);
    const data = JSON.parse(result);
    res.json(data);
  } catch (error) {
    console.error('Countries API error:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// Destinations endpoint
app.get('/api/destinations', async (req, res) => {
  try {
    const command = `
      $controller = new \\App\\Http\\Controllers\\Api\\SimpleDestinationController();
      $request = new \\Illuminate\\Http\\Request();
      $response = $controller->index($request);
      echo $response->getContent();
    `;
    
    const result = await executeLaravelCommand(command);
    const data = JSON.parse(result);
    res.json(data);
  } catch (error) {
    console.error('Destinations API error:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// Menu endpoint
app.get('/api/menus/location/:location', async (req, res) => {
  try {
    const location = req.params.location;
    const command = `
      $controller = new \\App\\Http\\Controllers\\Api\\MenuController();
      $response = $controller->getByLocation('${location}');
      echo $response->getContent();
    `;
    
    const result = await executeLaravelCommand(command);
    const data = JSON.parse(result);
    res.json(data);
  } catch (error) {
    console.error('Menu API error:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`API bridge running on http://127.0.0.1:${PORT}`);
  console.log('Laravel backend accessible through direct PHP execution');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down API bridge...');
  process.exit();
});