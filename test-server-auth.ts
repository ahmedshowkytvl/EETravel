import express from 'express';
import cors from 'cors';
import { setupUnifiedAuth } from './server/unified-auth';

const app = express();
const PORT = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Setup authentication
setupUnifiedAuth(app);

// Start server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});