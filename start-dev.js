import { spawn } from 'child_process';

process.env.NODE_ENV = 'development';
process.env.PORT = '8080';

const server = spawn('npx', ['tsx', 'server/index.ts'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  detached: false
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});