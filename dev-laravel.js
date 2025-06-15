#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Sahara Journeys with Laravel backend...');

// Start Laravel backend server
const laravel = spawn('php', ['artisan', 'serve', '--host=127.0.0.1', '--port=8000'], {
  cwd: path.join(__dirname, 'laravel-backend'),
  stdio: ['ignore', 'pipe', 'pipe']
});

laravel.stdout.on('data', (data) => {
  console.log(`[Laravel] ${data.toString().trim()}`);
});

laravel.stderr.on('data', (data) => {
  console.error(`[Laravel Error] ${data.toString().trim()}`);
});

// Start Vite frontend server
const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
  cwd: path.join(__dirname, 'client'),
  stdio: ['ignore', 'pipe', 'pipe']
});

vite.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data.toString().trim()}`);
});

vite.stderr.on('data', (data) => {
  console.error(`[Frontend Error] ${data.toString().trim()}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  laravel.kill();
  vite.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  laravel.kill();
  vite.kill();
  process.exit();
});

console.log('Laravel backend: http://127.0.0.1:8000');
console.log('React frontend: http://localhost:5173');