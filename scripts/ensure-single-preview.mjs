#!/usr/bin/env node
/**
 * Ensure exactly one Vite preview for this project on port 5174.
 * Foreground by default; pass --background for session hook / detached start.
 */
import { execSync, spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, openSync } from 'node:fs';
import { join } from 'node:path';

const PORT = 5174;
const HOST = '127.0.0.1';
const PREVIEW_URL = `http://${HOST}:${PORT}/`;
const PROJECT_DIR = process.cwd();
const CURSOR_DIR = join(PROJECT_DIR, '.cursor');
const PID_FILE = join(CURSOR_DIR, 'vite-dev.pid');
const LOG_FILE = join(CURSOR_DIR, 'vite-dev.log');
const background = process.argv.includes('--background');

function getListenerPids(port) {
  try {
    const out = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out ? out.split(/\s+/).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function getProcessCommand(pid) {
  try {
    return execSync(`ps -p ${pid} -o command=`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function getProcessCwd(pid) {
  try {
    return execSync(`lsof -a -p ${pid} -d cwd -Fn`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split('\n')
      .find((line) => line.startsWith('n'))
      ?.slice(1)
      ?.trim();
  } catch {
    return '';
  }
}

function isProjectVite(pid) {
  const cmd = getProcessCommand(pid);
  if (!/\bvite\b/i.test(cmd)) return false;
  if (!cmd.includes(String(PORT))) return false;
  const cwd = getProcessCwd(pid);
  return cwd === PROJECT_DIR;
}

function killPid(pid, signal = 'TERM') {
  try {
    execSync(`kill -${signal} ${pid}`, { stdio: 'ignore' });
  } catch {
    // Already exited or not permitted.
  }
}

function findProjectViteListeners() {
  return getListenerPids(PORT).filter(isProjectVite);
}

function startVite() {
  mkdirSync(CURSOR_DIR, { recursive: true });

  if (background) {
    const logFd = openSync(LOG_FILE, 'a');
    const child = spawn(
      process.platform === 'win32' ? 'npx.cmd' : 'npx',
      ['vite', '--host', HOST, '--port', String(PORT), '--strictPort'],
      {
        cwd: PROJECT_DIR,
        detached: true,
        stdio: ['ignore', logFd, logFd],
      },
    );
    child.unref();
    writeFileSync(PID_FILE, String(child.pid));
    console.log(`Preview started at ${PREVIEW_URL} (pid ${child.pid})`);
    return;
  }

  const vite = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', '--host', HOST, '--port', String(PORT), '--strictPort'],
    { cwd: PROJECT_DIR, stdio: 'inherit' },
  );
  vite.on('exit', (code) => process.exit(code ?? 0));
}

const listeners = findProjectViteListeners();

if (listeners.length > 1) {
  for (const pid of listeners.slice(0, -1)) {
    killPid(pid);
  }
}

const active = findProjectViteListeners();
if (active.length === 1) {
  const pid = active[0];
  writeFileSync(join(CURSOR_DIR, 'vite-dev.pid'), pid);
  console.log(`Preview already running at ${PREVIEW_URL} (pid ${pid})`);
  process.exit(0);
}

if (getListenerPids(PORT).length > 0) {
  console.error(
    `Port ${PORT} is in use by another process. Stop it or use a different port.`,
  );
  process.exit(1);
}

startVite();
