import { spawn } from 'child_process';

// Start the development server
const dev = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

dev.on('error', (error) => {
  console.error('Failed to start dev server:', error);
});

dev.on('exit', (code) => {
  console.log(`Dev server exited with code ${code}`);
});