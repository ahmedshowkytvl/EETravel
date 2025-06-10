import express from 'express';
import session from 'express-session';
import { setupUnifiedAuth } from './server/unified-auth';

const app = express();

// Setup middleware
app.use(express.json());
app.use(session({
  secret: 'test-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Setup auth
setupUnifiedAuth(app);

// Test endpoint to check session
app.get('/api/test-session', (req: any, res) => {
  res.json({
    hasSession: !!req.session,
    user: req.session?.user || null,
    sessionID: req.sessionID
  });
});

// Test admin endpoint
app.post('/api/test-admin', (req: any, res) => {
  const sessionUser = req.session?.user;
  
  if (!sessionUser) {
    return res.status(401).json({ message: 'No session user found' });
  }
  
  if (sessionUser.role !== 'admin') {
    return res.status(403).json({ message: 'Not admin role', role: sessionUser.role });
  }
  
  res.json({ message: 'Admin access granted', user: sessionUser });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Test auth server running on port ${port}`);
  console.log('Test login with: curl -X POST http://localhost:3001/api/login -H "Content-Type: application/json" -d \'{"username":"EETAdmin","password":"PassW0rd"}\'');
});