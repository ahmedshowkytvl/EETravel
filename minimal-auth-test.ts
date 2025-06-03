import express from 'express';
import dotenv from 'dotenv';
import { setupUnifiedAuth } from './server/unified-auth';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());

// Setup unified authentication
setupUnifiedAuth(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Authentication server ready', port: PORT });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Minimal auth server running on port ${PORT}`);
  console.log('Testing authentication endpoints...');
});

export { app };