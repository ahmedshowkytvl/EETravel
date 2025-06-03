import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupUnifiedAuth } from './server/unified-auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: false, limit: '25mb' }));

// Setup unified authentication
setupUnifiedAuth(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server running', 
    port: PORT,
    endpoints: ['/api/register', '/api/login', '/api/user', '/api/logout']
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Authentication server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/register - User registration');
  console.log('  POST /api/login - User login');
  console.log('  GET /api/user - Get current user');
  console.log('  POST /api/logout - User logout');
});

// Export for testing
export { app };