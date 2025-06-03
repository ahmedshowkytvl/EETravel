import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { setupUnifiedAuth } from './server/unified-auth';

dotenv.config();

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: false, limit: '25mb' }));

// Serve static files
app.use(express.static(path.join(process.cwd(), 'client/dist')));

// Setup unified authentication
setupUnifiedAuth(app);

// Serve the main app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(process.cwd(), 'client/dist/index.html'));
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sahara Journeys server running on port ${PORT}`);
  console.log('Authentication endpoints available:');
  console.log('  POST /api/register - User registration');
  console.log('  POST /api/login - User login');
  console.log('  GET /api/user - Get current user');
  console.log('  POST /api/logout - User logout');
});

// Handle server errors
server.on('error', (err: any) => {
  console.error('Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log('Port 8080 is already in use. Please check for running processes.');
  }
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { app };