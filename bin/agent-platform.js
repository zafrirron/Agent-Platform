#!/usr/bin/env node
/**
 * npx entry point for Agent Platform Bootstrap.
 *
 * Usage (no install needed):
 *   npx github:zafrirron/Agent-Platform              # install into cwd
 *   npx github:zafrirron/Agent-Platform --mode=upgrade
 *   npx github:zafrirron/Agent-Platform --mode=repair
 *   npx github:zafrirron/Agent-Platform --mode=force
 *   npx github:zafrirron/Agent-Platform#v2.2.0       # pin to a tag
 *
 * When run via npx, __dirname is the package directory (where templates live).
 * process.cwd() is the consumer repo (where files are written).
 * We inject --pack and --target so apply.js knows the difference.
 */
const path = require('path');

// Inject pack and target if not already provided by caller
if (!process.argv.some((a) => a.startsWith('--pack='))) {
  process.argv.push(`--pack=${__dirname}/..`);
}
if (!process.argv.some((a) => a.startsWith('--target='))) {
  process.argv.push(`--target=${process.cwd()}`);
}

require('../AGENT-PLATFORM-TEMPLATES/.agent/bootstrap/apply.js');
