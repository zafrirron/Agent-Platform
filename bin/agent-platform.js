#!/usr/bin/env node
/**
 * npx entry point for Agent Platform Bootstrap.
 *
 * Usage (no install needed):
 *   npx github:zafrirron/Agent-Platform              # install into cwd
 *   npx github:zafrirron/Agent-Platform --mode=upgrade
 *   npx github:zafrirron/Agent-Platform --mode=repair
 *   npx github:zafrirron/Agent-Platform --mode=force
 *   npx github:zafrirron/Agent-Platform --mode=uninstall
 *   npx github:zafrirron/Agent-Platform#v2.5.0       # pin to a tag
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.argv.some((a) => a.startsWith('--pack='))) {
  process.argv.push(`--pack=${path.resolve(__dirname, '..')}`);
}
if (!process.argv.some((a) => a.startsWith('--target='))) {
  process.argv.push(`--target=${process.cwd()}`);
}

await import('../AGENT-PLATFORM-TEMPLATES/.agent/bootstrap/apply.js');
