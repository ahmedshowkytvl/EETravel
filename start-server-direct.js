#!/usr/bin/env node

// Direct server startup script that bypasses Vite configuration issues
import { spawn } from 'child_process';
import path from 'path';

console.log('Starting Sahara Journeys server directly...');

// Ensure correct environment variables
process.env.NODE_ENV = 'development';

// Start the server using tsx directly
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  serverProcess.kill('SIGTERM');
});