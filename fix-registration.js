#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting development server...');

const server = spawn('npx', ['cross-env', 'NODE_ENV=development', 'tsx', 'server/index.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
  detached: false
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});

process.on('SIGINT', () => {
  server.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit();
});