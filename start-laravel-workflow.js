#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Laravel backend server...');

// Start Laravel server
const laravel = spawn('php', ['artisan', 'serve', '--host=0.0.0.0', '--port=8000'], {
  cwd: path.join(__dirname, 'laravel-backend'),
  stdio: 'inherit'
});

laravel.on('close', (code) => {
  console.log(`Laravel server exited with code ${code}`);
});

laravel.on('error', (err) => {
  console.error('Failed to start Laravel server:', err);
});

process.on('SIGINT', () => {
  laravel.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  laravel.kill();
  process.exit();
});