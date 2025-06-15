#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Sahara Journeys with Laravel Backend...');

// Start Laravel backend
const laravelProcess = spawn('php', ['artisan', 'serve', '--host=127.0.0.1', '--port=8000'], {
  cwd: path.join(__dirname, 'laravel-backend'),
  stdio: ['ignore', 'pipe', 'pipe']
});

laravelProcess.stdout.on('data', (data) => {
  console.log(`[Laravel] ${data.toString().trim()}`);
});

laravelProcess.stderr.on('data', (data) => {
  console.error(`[Laravel] ${data.toString().trim()}`);
});

// Start Vite frontend
const viteProcess = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '3000'], {
  cwd: path.join(__dirname, 'client'),
  stdio: ['ignore', 'pipe', 'pipe']
});

viteProcess.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data.toString().trim()}`);
});

viteProcess.stderr.on('data', (data) => {
  console.error(`[Frontend] ${data.toString().trim()}`);
});

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  laravelProcess.kill();
  viteProcess.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  laravelProcess.kill();
  viteProcess.kill();
  process.exit();
});

console.log('📡 Laravel API: http://127.0.0.1:8000');
console.log('🌐 React Frontend: http://localhost:3000');
console.log('✅ Express.js fully replaced with Laravel backend');