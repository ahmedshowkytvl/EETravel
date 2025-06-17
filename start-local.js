#!/usr/bin/env node

// Simple startup script for local development
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Sahara Journeys server...');

// Set environment variables for local development
process.env.NODE_ENV = 'development';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/travel_app';

// Start the server directly
const serverProcess = spawn('node', ['--loader', 'tsx/esm', 'server/index.ts'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
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