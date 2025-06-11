#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Start the development server
const server = spawn('npm', ['run', 'dev'], {
  cwd: process.cwd(),
  stdio: ['inherit', 'pipe', 'pipe'],
  detached: false
});

server.stdout.on('data', (data) => {
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.kill();
  process.exit(0);
});