import { execSync, spawn } from 'node:child_process';
import { rmSync } from 'node:fs';

const LIVE_PORT = 5174;
const KNOWN_DEV_PORTS = [5173, 5174];

function killPort(port) {
  try {
    const out = execSync(`lsof -ti tcp:${port}`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (!out) return;

    const pids = out.split(/\s+/).filter(Boolean);
    for (const pid of pids) {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      } catch {
        // Ignore already-exited or unauthorized pids.
      }
    }
  } catch {
    // No process on this port.
  }
}

for (const port of KNOWN_DEV_PORTS) {
  killPort(port);
}

rmSync('node_modules/.vite', { recursive: true, force: true });
rmSync('dist', { recursive: true, force: true });

const vite = spawn('npx', ['vite', '--port', String(LIVE_PORT), '--strictPort'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

vite.on('exit', (code) => process.exit(code ?? 0));
