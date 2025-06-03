import { spawn } from 'child_process';
import { createServer } from 'http';

console.log('🚀 Starting Sahara Journeys development server...');

// Function to check if port is available
function checkPort(port, callback) {
  const server = createServer();
  server.listen(port, (err) => {
    if (err) {
      callback(false);
    } else {
      server.close(() => {
        callback(true);
      });
    }
  });
  server.on('error', () => {
    callback(false);
  });
}

// Start the main server
function startServer() {
  const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  });

  serverProcess.on('error', (err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    if (code !== 0) {
      console.log('🔄 Restarting server...');
      setTimeout(startServer, 2000);
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down development server...');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  });
}

// Check if port 8080 is available, then start
checkPort(8080, (available) => {
  if (!available) {
    console.log('⚠️  Port 8080 is in use, attempting to start anyway...');
  }
  startServer();
});