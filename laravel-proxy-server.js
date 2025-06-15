const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3001;

// Enable CORS for all requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));

// Start Laravel server
let laravelProcess;

function startLaravelServer() {
  console.log('🚀 Starting Laravel server...');
  
  laravelProcess = spawn('php', ['artisan', 'serve', '--host=127.0.0.1', '--port=8003'], {
    cwd: path.join(__dirname, 'laravel-backend'),
    stdio: ['ignore', 'pipe', 'pipe']
  });

  laravelProcess.stdout.on('data', (data) => {
    console.log(`[Laravel] ${data.toString().trim()}`);
  });

  laravelProcess.stderr.on('data', (data) => {
    console.error(`[Laravel] ${data.toString().trim()}`);
  });

  // Wait for Laravel server to start
  setTimeout(() => {
    console.log('✅ Laravel server started on port 8003');
  }, 3000);
}

// Proxy middleware configuration
const laravelProxy = createProxyMiddleware({
  target: 'http://127.0.0.1:8003',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api' // Keep /api prefix
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({ 
      error: 'Laravel backend connection failed',
      message: 'Please ensure Laravel server is running'
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to Laravel`);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Laravel proxy server is running',
    timestamp: new Date().toISOString(),
    laravel_target: 'http://127.0.0.1:8003'
  });
});

// Proxy all /api requests to Laravel
app.use('/api', laravelProxy);

// Fallback for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'This proxy server only handles /api routes'
  });
});

// Start Laravel server first
startLaravelServer();

// Start proxy server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🌐 Laravel proxy server running on http://127.0.0.1:${PORT}`);
  console.log(`📡 Proxying API requests to Laravel at http://127.0.0.1:8003`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  if (laravelProcess) {
    laravelProcess.kill();
  }
  process.exit();
});

process.on('SIGTERM', () => {
  if (laravelProcess) {
    laravelProcess.kill();
  }
  process.exit();
});