#!/usr/bin/env node
/**
 * Cross-platform launcher — reads .agent/platform.json "launch" config.
 * Usage: node .agent/tools/launch.mjs
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const platformPath = path.join(root, '.agent/platform.json');

const defaults = {
  command: 'npm',
  args: ['start'],
  cwd: '.',
  env_unset: [],
};

function loadConfig() {
  if (!fs.existsSync(platformPath)) return defaults;
  const data = JSON.parse(fs.readFileSync(platformPath, 'utf8'));
  const key = process.platform === 'win32' ? 'windows' : 'unix';
  return { ...defaults, ...(data.launch?.[key] || data.launch?.default || {}) };
}

const cfg = loadConfig();
const env = { ...process.env };
for (const k of cfg.env_unset || []) delete env[k];

const cwd = path.resolve(root, cfg.cwd || '.');
const child = spawn(cfg.command, cfg.args || [], { cwd, env, stdio: 'inherit', shell: process.platform === 'win32' });

child.on('exit', (code) => process.exit(code ?? 0));
