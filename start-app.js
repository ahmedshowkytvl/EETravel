import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting development server...');

const child = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
});

child.on('error', (err) => {
  console.error('Failed to start development server:', err);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Received SIGINT. Graceful shutdown...');
  child.kill('SIGINT');
  process.exit(0);
});