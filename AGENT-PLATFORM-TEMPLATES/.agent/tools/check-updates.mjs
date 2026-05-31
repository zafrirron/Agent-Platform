#!/usr/bin/env node
/**
 * Check for Agent Platform Bootstrap updates.
 *
 * Usage (from consumer repo root):
 *   node .agent/tools/check-updates.mjs
 *
 * What it does:
 *   1. Reads current bootstrap_version from .agent/platform.json
 *   2. Fetches the latest release from GitHub
 *   3. Compares versions and prints upgrade instructions if newer
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const ROOT = process.cwd();

/* ── Read installed version and platform config ──────────────────────────── */
const platformFile = resolve(ROOT, '.agent/platform.json');
let currentVersion = null;
let REPO = '{{PLATFORM_REPO}}'; // substituted at install time; fallback is the source repo

if (existsSync(platformFile)) {
  try {
    const pj = JSON.parse(readFileSync(platformFile, 'utf8'));
    currentVersion = pj.bootstrap_version || null;
    if (pj.platform_repo) REPO = pj.platform_repo;
  } catch {
    console.error('Could not parse .agent/platform.json');
  }
}

if (!currentVersion) {
  console.log('⚠️  Could not determine installed version.');
  console.log('   .agent/platform.json is missing or has no bootstrap_version.');
  console.log('   Re-run the installer to initialise it.\n');
  process.exit(0);
}

console.log(`\nAgent Platform Bootstrap — update check`);
console.log(`Installed : ${currentVersion}`);
console.log('Checking  : https://github.com/' + REPO + '/releases\n');

/* ── Fetch latest release ────────────────────────────────────────────────── */
let release;
try {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { 'User-Agent': 'agent-platform-check-updates/1.0' },
  });
  if (res.status === 404) {
    console.log('✅ No releases published yet — you are on the latest code (main branch).\n');
    process.exit(0);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  release = await res.json();
} catch (err) {
  console.error(`Could not reach GitHub API: ${err.message}`);
  console.error('Check your internet connection and try again.');
  process.exit(1);
}

const latestTag     = release.tag_name || '';
const latestVersion = latestTag.replace(/^v/, '');
const releaseDate   = release.published_at
  ? new Date(release.published_at).toLocaleDateString()
  : 'unknown date';

console.log(`Latest    : ${latestVersion}  (released ${releaseDate})`);

/* ── Version comparison ──────────────────────────────────────────────────── */
function parseVer(v) {
  return String(v).split('.').map((n) => parseInt(n) || 0);
}
function isNewer(latest, current) {
  const l = parseVer(latest);
  const c = parseVer(current);
  for (let i = 0; i < 3; i++) {
    if ((l[i] ?? 0) > (c[i] ?? 0)) return true;
    if ((l[i] ?? 0) < (c[i] ?? 0)) return false;
  }
  return false;
}

if (!isNewer(latestVersion, currentVersion)) {
  console.log('\n✅ Already up to date.\n');
  process.exit(0);
}

/* ── Update available ────────────────────────────────────────────────────── */
console.log(`\n🆕 Update available: ${currentVersion} → ${latestVersion}\n`);

if (release.body) {
  const preview = release.body.trim().split('\n').slice(0, 20).join('\n');
  console.log('Release notes (preview):\n');
  console.log(preview);
  if (release.body.trim().split('\n').length > 20) {
    console.log(`  … (full notes: https://github.com/${REPO}/releases/tag/${latestTag})`);
  }
  console.log('');
}

console.log('─────────────────────────────────────────────────');
console.log('How to upgrade\n');
console.log('Option A — npx (recommended, no files to copy):');
console.log(`  npx github:${REPO}#${latestTag} --mode=upgrade\n`);
console.log('Option B — shell script:');
console.log('  # Linux / macOS');
console.log(`  curl -fsSL https://raw.githubusercontent.com/${REPO}/main/install.sh | AP_MODE=upgrade bash`);
console.log('  # Windows PowerShell');
console.log(`  iwr -useb https://raw.githubusercontent.com/${REPO}/main/install.ps1 | iex  # then -Mode upgrade\n`);
console.log('Option C — agent command (tell your agent):');
console.log('  Read .agent/tools/upgrade.md and execute it.\n');
console.log('Option D — manual (targeted file copy):');
console.log(`  See https://github.com/${REPO}/blob/main/CHANGELOG.md`);
console.log('  Look for the upgrade guide for your version.\n');
console.log('─────────────────────────────────────────────────\n');
