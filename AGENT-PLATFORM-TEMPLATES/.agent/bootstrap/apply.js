#!/usr/bin/env node
/**
 * Apply AGENT-PLATFORM-MANIFEST.json templates (Node.js — Windows, Linux, macOS).
 *
 * Supports two separate roots:
 *   PACK_ROOT    — where AGENT-PLATFORM-MANIFEST.json + templates live
 *   INSTALL_ROOT — where files are written (the consumer repo)
 *
 * Resolution order for each root:
 *   1. CLI flag:  --pack=<path>   / --target=<path>
 *   2. Env var:   AP_PACK=<path>  / AP_TARGET=<path>
 *   3. Auto-detect (search for AGENT-PLATFORM-MANIFEST.json upward from CWD)
 *   4. process.cwd()
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  shouldInstallEntry,
  resolveTemplate,
  expandAddTokens,
} from './profile-filter.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ── CLI args ─────────────────────────────────────────────────────────────── */
const modeArg      = process.argv.find((a) => a.startsWith('--mode='));
const packArg      = process.argv.find((a) => a.startsWith('--pack='));
const targetArg    = process.argv.find((a) => a.startsWith('--target='));
const profileArg   = process.argv.find((a) => a.startsWith('--profile='));
const frameworkArg = process.argv.find((a) => a.startsWith('--framework='));
const addArg       = process.argv.find((a) => a.startsWith('--add='));
const listArg      = process.argv.find((a) => a.startsWith('--list='));

const MODE       = modeArg ? modeArg.split('=')[1] : 'install';
const CONFIRM    = process.argv.includes('--confirm');
const PROFILE    = profileArg ? profileArg.split('=')[1] : (MODE === 'add' ? 'lite' : 'full');
const FRAMEWORK  = frameworkArg ? frameworkArg.split('=')[1] : null;
const ADD_TOKENS = addArg
  ? expandAddTokens(addArg.split('=')[1].split(','))
  : null;

/* ── Root resolution ──────────────────────────────────────────────────────── */
function findManifestDir() {
  const candidates = [
    process.cwd(),
    path.resolve(__dirname, '../..'),
    path.resolve(__dirname, '../../..'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, 'AGENT-PLATFORM-MANIFEST.json'))) return c;
  }
  return process.cwd();
}

const PACK_ROOT    = packArg   ? packArg.split('=')[1]
                   : process.env.AP_PACK   || findManifestDir();
const INSTALL_ROOT = targetArg ? targetArg.split('=')[1]
                   : process.env.AP_TARGET || process.cwd();

/* ── Manifest ─────────────────────────────────────────────────────────────── */
const MANIFEST_PATH = path.join(PACK_ROOT, 'AGENT-PLATFORM-MANIFEST.json');
if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('Missing AGENT-PLATFORM-MANIFEST.json at', PACK_ROOT);
  process.exit(1);
}
const manifest     = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const templatesRoot = path.join(PACK_ROOT, manifest.templates_root || 'AGENT-PLATFORM-TEMPLATES');

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function sub(content, vars) {
  let out = content;
  for (const [k, v] of Object.entries(vars)) out = out.split(`{{${k}}}`).join(v);
  return out;
}

function isStub(t) {
  return !t.trim() || /\(\s*fill\b|\*\(fill|none yet|<fill-in/i.test(t);
}

/**
 * Replace only the <!-- PLATFORM:START --> … <!-- PLATFORM:END --> block
 * in existingContent with the equivalent block from newContent.
 * Returns the patched string, or null if either file lacks the markers.
 */
function patchPlatformSection(existingContent, newContent) {
  const START = '<!-- PLATFORM:START -->';
  const END   = '<!-- PLATFORM:END -->';

  const eStart = existingContent.indexOf(START);
  const eEnd   = existingContent.indexOf(END);
  const nStart = newContent.indexOf(START);
  const nEnd   = newContent.indexOf(END);

  if (eStart < 0 || eEnd < 0 || nStart < 0 || nEnd < 0) return null;

  const newBlock = newContent.slice(nStart, nEnd + END.length);
  return existingContent.slice(0, eStart) + newBlock + existingContent.slice(eEnd + END.length);
}

/**
 * Remove the PLATFORM:START/END block from content.
 * Returns the remaining content with surrounding whitespace cleaned up.
 */
function stripPlatformBlock(content) {
  const START = '<!-- PLATFORM:START -->';
  const END   = '<!-- PLATFORM:END -->';
  const start = content.indexOf(START);
  const end   = content.indexOf(END);
  if (start < 0 || end < 0) return content;
  const before = content.slice(0, start).trimEnd();
  const after  = content.slice(end + END.length).trimStart();
  if (!before && !after) return '';
  return (before ? before + '\n\n' : '') + after;
}

/**
 * Returns true if a global stub file has meaningful user content beyond
 * the platform markers, placeholder HTML comments, and YAML frontmatter.
 */
function hasRealUserContent(content) {
  const stripped = stripPlatformBlock(content);
  const noFrontmatter = stripped.replace(/^---[\s\S]*?---\n?/, '');
  const noComments    = noFrontmatter.replace(/<!--[\s\S]*?-->/g, '');
  return noComments.trim().length > 0;
}

/* ── Stack detection ──────────────────────────────────────────────────────── */
function detectTestRunner(root) {
  if (fs.existsSync(path.join(root, 'pyproject.toml')) ||
      fs.existsSync(path.join(root, 'pytest.ini')) ||
      fs.existsSync(path.join(root, 'setup.cfg')))          return 'pytest';
  if (fs.existsSync(path.join(root, 'go.mod')))             return 'go test ./...';
  if (fs.existsSync(path.join(root, 'Cargo.toml')))         return 'cargo test';
  if (fs.existsSync(path.join(root, 'package.json'))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
      if (pkg.scripts?.test) {
        if (pkg.scripts.test.includes('jest'))   return 'npx jest';
        if (pkg.scripts.test.includes('vitest')) return 'npx vitest';
        if (pkg.scripts.test.includes('mocha'))  return 'npx mocha';
      }
    } catch { /* ignore */ }
    return 'npm test';
  }
  const files = fs.readdirSync(root);
  if (files.some((f) => f.endsWith('.csproj') || f.endsWith('.sln'))) return 'dotnet test';
  if (fs.existsSync(path.join(root, 'Makefile')))           return 'make test';
  return '<fill-in test runner>';
}

function detectCoverageCmd(runner) {
  if (runner.startsWith('pytest'))      return 'pytest --cov';
  if (runner.includes('jest'))          return 'npx jest --coverage';
  if (runner.includes('vitest'))        return 'npx vitest --coverage';
  if (runner.startsWith('go test'))     return 'go test -cover ./...';
  if (runner.startsWith('cargo'))       return 'cargo tarpaulin';
  if (runner.startsWith('dotnet'))      return 'dotnet test /p:CollectCoverage=true';
  if (runner.startsWith('npm test'))    return 'npm test -- --coverage';
  return '<fill-in coverage command>';
}

/* ── Pack detection (suggest only — never auto-install) ───────────────────── */
function detectPacks(root) {
  const catalog = manifest.packs_catalog || [];
  if (catalog.length === 0) return [];
  // Gather dependency names from common manifests
  const deps = new Set();
  const readJson = (f) => { try { return JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')); } catch { return null; } };
  const pkg = readJson('package.json');
  if (pkg) {
    for (const k of Object.keys(pkg.dependencies || {})) deps.add(k.toLowerCase());
    for (const k of Object.keys(pkg.devDependencies || {})) deps.add(k.toLowerCase());
  }
  for (const f of ['requirements.txt', 'pyproject.toml']) {
    try {
      const txt = fs.readFileSync(path.join(root, f), 'utf8').toLowerCase();
      for (const name of ['django', 'flask', 'fastapi', 'stripe', 'plaid', 'braintree', 'adyen']) {
        if (txt.includes(name)) deps.add(name);
      }
    } catch { /* ignore */ }
  }
  let rootFiles = [];
  try { rootFiles = fs.readdirSync(root); } catch { /* ignore */ }

  // Shallow, bounded scan for source-file extensions and path globs (catches
  // packs with no dependency manifest, e.g. a C++ repo with only *.cpp/*.h, or a
  // React repo detected via **/*.tsx). Globs are precise, path-based signals —
  // unlike a bare "package.json" file signal, they do not fire on every repo.
  const catalogExts = new Set();
  for (const p of catalog) for (const e of ((p.detect || {}).extensions || [])) catalogExts.add(e.toLowerCase());
  const catalogGlobs = [];
  for (const p of catalog) for (const g of ((p.detect || {}).globs || [])) catalogGlobs.push(g);
  const globToRe = (g) => new RegExp('^' +
    g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*\//g, '(?:.*/)?').replace(/\*/g, '[^/]*') + '$');
  const globRes = catalogGlobs.map((g) => ({ g, re: globToRe(g) }));
  const presentExts = new Set();
  const presentGlobs = new Set();
  if (catalogExts.size > 0 || globRes.length > 0) {
    const SKIP = new Set(['node_modules', '.git', 'dist', 'build', 'out', 'vendor', 'target', '.venv', 'venv', '__pycache__', '.next', 'coverage']);
    const MAX_DEPTH = 2, MAX_FILES = 4000;
    let seen = 0;
    const walk = (dir, depth) => {
      if (depth > MAX_DEPTH || seen >= MAX_FILES) return;
      let entries = [];
      try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const ent of entries) {
        if (seen >= MAX_FILES) return;
        if (ent.isDirectory()) {
          if (!SKIP.has(ent.name) && !ent.name.startsWith('.')) walk(path.join(dir, ent.name), depth + 1);
        } else {
          seen++;
          const ext = path.extname(ent.name).toLowerCase();
          if (ext && catalogExts.has(ext)) presentExts.add(ext);
          if (globRes.length > 0) {
            const rel = path.relative(root, path.join(dir, ent.name)).split(path.sep).join('/');
            for (const { g, re } of globRes) if (!presentGlobs.has(g) && re.test(rel)) presentGlobs.add(g);
          }
        }
      }
    };
    walk(root, 0);
  }

  const suggested = [];
  for (const p of catalog) {
    const d = p.detect || {};
    let hit = false;
    for (const dep of (d.deps || [])) if (deps.has(dep.toLowerCase())) hit = true;
    for (const f of (d.files || [])) if (rootFiles.includes(f) || fs.existsSync(path.join(root, f))) hit = true;
    for (const e of (d.extensions || [])) if (presentExts.has(e.toLowerCase())) hit = true;
    for (const g of (d.globs || [])) if (presentGlobs.has(g)) hit = true;
    if (hit) suggested.push(p);
  }
  return suggested;
}

/* ── Discover ─────────────────────────────────────────────────────────────── */
function discover() {
  const name   = path.basename(INSTALL_ROOT);
  let description = 'Software project';
  const readme = path.join(INSTALL_ROOT, 'README.md');
  if (fs.existsSync(readme)) {
    const line = fs.readFileSync(readme, 'utf8').split('\n')
      .find((l) => l.trim() && !l.startsWith('#'));
    if (line) description = line.trim().slice(0, 200);
  }
  const runner = detectTestRunner(INSTALL_ROOT);
  return {
    PROJECT_NAME:        name,
    PROJECT_DESCRIPTION: description,
    DATE:                new Date().toISOString().slice(0, 10),
    HIGH_CONFLICT_PATHS: '(none yet — add after scan)',
    TEST_RUNNER:         runner,
    COVERAGE_CMD:        detectCoverageCmd(runner),
    COVERAGE_THRESHOLD:  '80',
    BOOTSTRAP_VERSION:   manifest.bootstrap_version || '2.2.0',
    PLATFORM_REPO:       manifest.platform_repo || 'zafrirron/Agent-Platform',
    PLATFORM_NPX:        manifest.platform_npx  || 'github:zafrirron/Agent-Platform',
  };
}

/* ── Pre-install artifact scan ────────────────────────────────────────────── */

/**
 * Platform-owned root files — backed up before install, restored on uninstall.
 */
const PLATFORM_ROOT_FILES = ['CLAUDE.md', 'AGENTS.md', 'SYNC-POINTS.md'];

/**
 * Framework-specific rule files users may have created before installing.
 * ADD AN ENTRY HERE when a new framework is added to the platform.
 */
const FW_RULE_PATTERNS = [
  // Cursor — user .mdc files (platform files excluded: platform-core, caveman, agent-sync)
  { folder: '.cursor/rules', ext: '.mdc',
    platformFiles: new Set(['platform-core.mdc', 'caveman.mdc', 'agent-sync.mdc']),
    label: 'Cursor rule' },
  // Windsurf — uncomment when framework is added:
  // { folder: '.windsurf/rules', ext: '.md', platformFiles: new Set([...]), label: 'Windsurf rule' },
];

/**
 * Legacy root-level AI config files — backed up and restored on uninstall.
 * ADD AN ENTRY HERE when a new framework with root-level configs is added.
 */
const LEGACY_ROOT_FILES = [
  { file: '.cursorrules',         label: 'Cursor rules (legacy root format)' },
  { file: '.clinerules',          label: 'Cline rules' },
  // { file: '.windsurfrules',    label: 'Windsurf rules (legacy root format)' },
];

/**
 * Individual framework config files — backed up if they exist.
 * Platform-owned files within these folders are excluded by the manifest during install.
 */
const FW_CONFIG_FILES = [
  { file: '.codex/instructions.md',     label: 'Codex instructions' },
  { file: '.claude/settings.local.json',label: 'Claude Code local settings' },
  { file: 'opencode.json',              label: 'OpenCode config' },
];

/**
 * Folders that the platform will install into — scan for pre-existing USER content.
 * Files listed here are noted (not backed up individually) so Step 1c can migrate them.
 * Platform-owned filenames are excluded.
 */
const CLAUDE_PLATFORM_COMMANDS = [
  'caveman.md', 'caveman-commit.md', 'caveman-compress.md', 'caveman-review.md', 'caveman-stats.md',
  'quick-ref.md', 'spec.md', 'plan.md', 'build.md', 'test.md', 'code-simplify.md',
  'ship.md', 'audit.md', 'review.md', 'release.md',
];
const CURSOR_PLATFORM_COMMANDS = [
  'quick-ref.md', 'spec.md', 'plan.md', 'build.md', 'test.md', 'code-simplify.md',
  'ship.md', 'audit.md', 'review.md', 'release.md', 'implement.md',
  'session-start.md', 'session-end.md', 'platform-help.md',
  'caveman.md', 'caveman-commit.md', 'caveman-compress.md', 'caveman-review.md', 'caveman-stats.md',
];
const OPENCODE_PLATFORM_COMMANDS = [
  'quick-ref.md', 'spec.md', 'plan.md', 'build.md', 'test.md', 'code-simplify.md',
  'webperf.md', 'context.md', 'verify.md', 'ship.md', 'audit.md', 'review.md', 'release.md',
];

const PLATFORM_FOLDER_SCANS = [
  { folder: '.claude/commands', ext: '.md',
    platformFiles: new Set(CLAUDE_PLATFORM_COMMANDS),
    label: 'Claude Code custom command' },
  { folder: '.cursor/commands', ext: '.md',
    platformFiles: new Set(CURSOR_PLATFORM_COMMANDS),
    label: 'Cursor slash command' },
  { folder: '.agents/prompts', ext: '.md',
    platformFiles: new Set(['session-start.md','session-end.md']),
    label: 'Antigravity prompt' },
  { folder: '.agents/rules', ext: '.md',
    platformFiles: new Set(['00-multi-framework-sync.md']),
    label: 'Antigravity rule' },
  { folder: '.opencode/commands', ext: '.md',
    platformFiles: new Set(OPENCODE_PLATFORM_COMMANDS),
    label: 'OpenCode command' },
  { folder: '.opencode/agents', ext: '.md',
    platformFiles: new Set(['critic.md']),
    label: 'OpenCode agent' },
];

function scanPreExistingArtifacts(root) {
  const toBackup = []; // backed up + restorable on uninstall
  const toNote   = []; // mentioned in migration notes only

  PLATFORM_ROOT_FILES.forEach(f => {
    if (fs.existsSync(path.join(root, f))) toBackup.push({ file: f, label: f });
  });

  LEGACY_ROOT_FILES.forEach(({ file, label }) => {
    if (fs.existsSync(path.join(root, file))) {
      toBackup.push({ file, label });
      toNote.push({ file, label });
    }
  });

  // All framework rule patterns — framework-agnostic, auto-extends when FW_RULE_PATTERNS grows
  FW_RULE_PATTERNS.forEach(({ folder, ext, platformFiles, label }) => {
    const dir = path.join(root, folder);
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir)
      .filter(f => f.endsWith(ext) && !platformFiles.has(f))
      .forEach(f => toBackup.push({ file: folder + '/' + f, label: label + ': ' + f }));
  });

  // Individual framework config files (e.g. Codex instructions, Claude settings)
  FW_CONFIG_FILES.forEach(({ file, label }) => {
    if (fs.existsSync(path.join(root, file))) toBackup.push({ file, label });
  });

  // Platform destination folders — scan for pre-existing user content before we install into them
  PLATFORM_FOLDER_SCANS.forEach(({ folder, ext, platformFiles, label }) => {
    const dir = path.join(root, folder);
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir)
      .filter(f => f.endsWith(ext) && !platformFiles.has(f))
      .forEach(f => toNote.push({ file: folder + '/' + f, label: label + ': ' + f }));
  });

  return { toBackup, toNote };
}

function backupArtifacts(root, toBackup) {
  if (toBackup.length === 0) return null;
  // Use datetime (not just date) — same-day reinstall must not overwrite prior backup
  const ts        = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
  const backupDir = path.join(root, `.agent/backup/pre-install-${ts}`);
  fs.mkdirSync(backupDir, { recursive: true });
  // manifest.json records original path of each file for accurate restore
  const manifest = {};
  toBackup.forEach(({ file }, i) => {
    const backupName = 'file_' + String(i).padStart(3, '0') + '_' + path.basename(file);
    manifest[backupName] = file;
    fs.copyFileSync(path.join(root, file), path.join(backupDir, backupName));
  });
  fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return backupDir;
}

function writeMigrationNotes(root, artifacts, backupDir) {
  const { toBackup, toNote } = artifacts;
  if (toBackup.length === 0 && toNote.length === 0) return;

  const backupName = backupDir ? path.basename(backupDir) : 'backup';
  const lines = [
    `# Platform Migration Notes\n`,
    `Generated: ${new Date().toISOString().slice(0, 10)}\n\n`,
    `Pre-existing AI configuration files were found in this repository.\n`,
    `**None were overwritten.** All are backed up and restored automatically if you remove the platform.\n`,
    `Backup location: \`.agent/backup/${backupName}/\`\n\n`,
    `Delete this file when you have finished reviewing.\n`,
    `\n---\n`,
  ];

  toBackup.forEach(({ file, label }) => {
    if (file === 'CLAUDE.md') {
      lines.push(`\n## CLAUDE.md — updated automatically\n`,
        `Your CLAUDE.md was kept intact. The platform injected the session-start trigger at the top.\n`,
        `Your existing instructions are preserved below it.\n`,
        `On first session start, the platform agent will automatically review your original rules and migrate any that are worth keeping.\n`);
    } else if (file === 'AGENTS.md') {
      lines.push(`\n## AGENTS.md — replaced (your original backed up)\n`,
        `AGENTS.md is the platform's routing control file — it must be in the platform's format for auto-routing and expert chaining to work.\n`,
        `Your original AGENTS.md has been backed up to \`.agent/backup/${backupName}/\`.\n`,
        `To preserve your custom rules: move them into the \`<!-- PROJECT:START -->\` sections of the relevant expert agent files in \`.agent/agents/\`.\n`);
    } else {
      lines.push(`\n## ${label} — preserved\n`,
        `Backed up. Continues to work alongside the platform.\n`);
    }
  });

  lines.push(`\n---\n\n`,
    `**Remove the platform** (restores all your backed-up AI config files automatically):\n`,
    `\`\`\`\nnpx ${manifest.platform_npx || 'github:zafrirron/Agent-Platform'} --mode=uninstall --confirm\n\`\`\`\n`,
  );

  const notesPath = path.join(root, '.agent/MIGRATION-NOTES.md');
  fs.mkdirSync(path.dirname(notesPath), { recursive: true });
  fs.writeFileSync(notesPath, lines.join(''));
}

/* ── Global install mode ──────────────────────────────────────────────────── */
if (MODE === 'global') {
  const HOME        = process.env.AP_HOME || os.homedir();
  const platformNpx  = manifest.platform_npx  || 'github:zafrirron/Agent-Platform';
  const platformRepo = manifest.platform_repo || 'zafrirron/Agent-Platform';
  const globalVars   = {
    PLATFORM_REPO:     platformRepo,
    PLATFORM_NPX:      platformNpx,
    BOOTSTRAP_VERSION: manifest.bootstrap_version || '2.0.0',
  };

  const LINE = '═'.repeat(62);
  const SEP  = '─'.repeat(62);
  console.log('');
  console.log(LINE);
  console.log(`  Agent Platform Bootstrap v${manifest.bootstrap_version} — Global Install`);
  console.log(LINE);
  console.log('');
  console.log('  Installing global stubs to: ' + HOME);
  console.log('');

  const globalFiles = manifest.files.filter(e => e.scope === 'global');
  const gCreated = [], gUpdated = [], gSkipped = [];

  for (const entry of globalFiles) {
    const target = path.join(HOME, entry.path);
    const src    = path.join(templatesRoot, entry.template);
    if (!fs.existsSync(src)) { gSkipped.push(entry.path + ' (template not found)'); continue; }

    const content = sub(fs.readFileSync(src, 'utf8'), globalVars);

    if (fs.existsSync(target)) {
      const existing = fs.readFileSync(target, 'utf8');
      const patched  = patchPlatformSection(existing, content);
      if (patched !== null) {
        // File has PLATFORM markers — patch only platform section, USER section preserved
        fs.writeFileSync(target, patched.endsWith('\n') ? patched : patched + '\n');
        gUpdated.push(entry.path);
      } else if (!content.includes('<!-- PLATFORM:START -->')) {
        // Pure platform file (commands, etc.) — safe to replace with latest
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
        gUpdated.push(entry.path);
      } else {
        // File exists but no markers — prepend platform block, preserve existing content below
        const sep = '\n\n---\n\n*(Your original content below — preserved by Agent Platform global install)*\n\n';
        const merged = content + sep + existing;
        fs.writeFileSync(target, merged.endsWith('\n') ? merged : merged + '\n');
        gUpdated.push(entry.path + ' (platform block prepended)');
      }
      continue;
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
    gCreated.push(entry.path);
  }

  // Write global version tracking
  const versionDir = path.join(HOME, '.agent-platform');
  fs.mkdirSync(versionDir, { recursive: true });
  fs.writeFileSync(
    path.join(versionDir, 'global-version'),
    JSON.stringify({ version: manifest.bootstrap_version, installed_at: new Date().toISOString(),
                     platform_repo: platformRepo, platform_npx: platformNpx }, null, 2) + '\n'
  );

  console.log(`  Files created : ${gCreated.length}   Updated: ${gUpdated.length}   Skipped: ${gSkipped.length}`);
  gCreated.forEach(f => console.log('  ✔ Created: ~/' + f));
  gUpdated.forEach(f => console.log('  ✔ Updated: ~/' + f));
  gSkipped.forEach(f => console.log('  ○ Skipped: ' + f));
  console.log('');
  console.log('  What was installed');
  console.log(SEP);
  console.log('  ~/.claude/CLAUDE.md              global activation + per-repo install offer');
  console.log('  ~/.claude/commands/              lifecycle + caveman slash commands');
  console.log('  ~/.cursor/commands/              lifecycle + caveman slash commands');
  console.log('  ~/.cursor/rules/                 agent-platform-global.mdc  (alwaysApply: true)');
  console.log('  ~/.codex/instructions.md         global activation stub');
  console.log('  ~/.agents/rules/                 agent-platform-global.md');
  console.log('  ~/.agent-platform/global-version version tracking');
  console.log('');
  console.log('  How it works');
  console.log(SEP);
  console.log('  · Any repo with AGENTS.md    → expert routing activates automatically');
  console.log('  · Any repo without AGENTS.md → one-time install offer at session start');
  console.log('  · Repos with .agent-platform-skip → offer suppressed for that repo');
  console.log('  · USER sections in stub files → yours, never overwritten by upgrades');
  console.log('');
  console.log('  To upgrade global stubs later:');
  console.log(`    npx ${platformNpx} --mode=global`);
  console.log('');
  console.log(LINE);
  console.log('');
  process.exit(0);
}

/* ── Guard: refuse to install into the platform repo itself ──────────────── */
// A platform repo contains BOTH AGENT-PLATFORM-MANIFEST.json AND AGENT-PLATFORM-TEMPLATES/
// Use path.resolve to normalise case and separators before comparing (Windows-safe)
const _installResolved = path.resolve(INSTALL_ROOT);
const _isPlatformRepo  = ['AGENT-PLATFORM-MANIFEST.json', 'AGENT-PLATFORM-TEMPLATES'].every(
  m => fs.existsSync(path.join(_installResolved, m))
);
const INSTALL_MODES = new Set(['install', 'upgrade', 'repair', 'force', 'install-guards', 'remove-guards', 'add']);

/* ── List catalog (--mode=list --list=skills|playbooks|commands) ─────────── */
if (MODE === 'list') {
  const kind = listArg ? listArg.split('=')[1] : 'skills';
  const catalog = manifest.skills_catalog || [];
  console.log('');
  console.log(`  Agent Platform — install catalog (${kind})`);
  console.log('─'.repeat(50));
  if (kind === 'skills') {
    for (const s of catalog) {
      console.log(`  skill:${s.id}  — ${s.description || s.id}`);
    }
    console.log('');
    console.log('  Install one: npx ' + (manifest.platform_npx || 'github:zafrirron/Agent-Platform') +
      ' --mode=add --add=skill:interview-me');
  } else if (kind === 'playbooks') {
    for (const e of manifest.files.filter((f) => f.kind === 'playbook')) {
      const id = e.path.split('/').pop().replace('.md', '');
      console.log(`  playbook:${id}`);
    }
  } else if (kind === 'commands') {
    const cmds = new Set();
    for (const e of manifest.files) {
      if (e.path.includes('/commands/') && e.path.endsWith('.md')) {
        cmds.add(e.path.split('/').pop().replace('.md', ''));
      }
    }
    [...cmds].sort().forEach((c) => console.log(`  /${c}`));
  } else if (kind === 'profiles') {
    console.log('  full   — complete platform (default)');
    console.log('  core   — full minus enterprise playbooks');
    console.log('  lite   — skills pack + core playbooks, no handoff layer');
  } else if (kind === 'packs') {
    for (const p of (manifest.packs_catalog || [])) {
      console.log(`  pack:${p.id}  [${p.kind}]  — ${p.description || p.display_name || p.id}`);
    }
    console.log('');
    console.log('  Add one: npx ' + (manifest.platform_npx || 'github:zafrirron/Agent-Platform') +
      ' --mode=add --add=pack:stack-react');
  }
  console.log('');
  process.exit(0);
}

if (MODE === 'add' && (!ADD_TOKENS || ADD_TOKENS.size === 0)) {
  console.error('  --mode=add requires --add=skill:id or --add=playbook:name (comma-separated)');
  process.exit(1);
}
const effectiveProfile = ['upgrade', 'repair', 'force'].includes(MODE) ? 'full' : PROFILE;
const filterOpts = {
  profile: effectiveProfile,
  framework: FRAMEWORK,
  addOnly: MODE === 'add' ? ADD_TOKENS : null,
};
if (_isPlatformRepo && INSTALL_MODES.has(MODE)) {
  process.stderr.write('\n');
  process.stderr.write('  ✗  ERROR: Target directory is the Agent Platform repo itself.\n');
  process.stderr.write('\n');
  process.stderr.write('  You are running the installer inside the platform source repo.\n');
  process.stderr.write('  The platform must be installed into a separate project folder.\n');
  process.stderr.write('\n');
  process.stderr.write('  To install into a project:\n');
  process.stderr.write('    cd /path/to/your-project\n');
  process.stderr.write('    npx ' + (manifest.platform_npx || 'github:zafrirron/Agent-Platform') + '\n');
  process.stderr.write('\n');
  process.exit(1);
}

/* ── uninstall-global mode ────────────────────────────────────────────────── */
if (MODE === 'uninstall-global') {
  const HOME        = process.env.AP_HOME || os.homedir();
  const platformNpx = manifest.platform_npx || 'github:zafrirron/Agent-Platform';
  const LINE        = '═'.repeat(62);

  const stubFiles = [
    path.join(HOME, '.claude/CLAUDE.md'),
    path.join(HOME, '.cursor/rules/agent-platform-global.mdc'),
    path.join(HOME, '.codex/instructions.md'),
    path.join(HOME, '.agents/rules/agent-platform-global.md'),
  ];
  const commandFiles = [
    ...CLAUDE_PLATFORM_COMMANDS.map(f => path.join(HOME, '.claude/commands', f)),
    ...CURSOR_PLATFORM_COMMANDS.map(f => path.join(HOME, '.cursor/commands', f)),
  ];
  const versionFile = path.join(HOME, '.agent-platform/global-version');

  console.log('');
  console.log(LINE);
  console.log('  Agent Platform Bootstrap — Uninstall Global Stubs');
  console.log(LINE);
  console.log('');

  const presentStubs = stubFiles.filter(f => fs.existsSync(f));
  const presentCmds  = commandFiles.filter(f => fs.existsSync(f));
  const versionExists = fs.existsSync(versionFile);

  if (!presentStubs.length && !presentCmds.length && !versionExists) {
    console.log('  ℹ  No global stubs found in ' + HOME + '.');
    console.log('  Nothing to remove.');
    console.log(LINE);
    console.log('');
    process.exit(0);
  }

  const toDelete = [];
  const toPatch  = [];
  const toIgnore = [];

  for (const f of presentStubs) {
    const content = fs.readFileSync(f, 'utf8');
    if (!content.includes('<!-- PLATFORM:START -->')) {
      toIgnore.push(f);
    } else if (hasRealUserContent(content)) {
      toPatch.push(f);
    } else {
      toDelete.push(f);
    }
  }

  if (!CONFIRM) {
    console.log('  ⚠️  DRY RUN — nothing deleted. Add --confirm to proceed.');
    console.log('');
    if (toDelete.length || presentCmds.length || versionExists) {
      console.log('  Will be DELETED (no user content):');
      [...toDelete, ...presentCmds, ...(versionExists ? [versionFile] : [])]
        .forEach(f => console.log('    ' + f.replace(HOME, '~')));
    }
    if (toPatch.length) {
      console.log('');
      console.log('  Will be PATCHED (PLATFORM block removed, your USER content kept):');
      toPatch.forEach(f => console.log('    ' + f.replace(HOME, '~')));
    }
    if (toIgnore.length) {
      console.log('');
      console.log('  Will be LEFT UNTOUCHED (no platform markers):');
      toIgnore.forEach(f => console.log('    ' + f.replace(HOME, '~')));
    }
    console.log('');
    console.log('  To confirm removal run:');
    console.log(`    npx ${platformNpx} --mode=uninstall-global --confirm`);
    console.log(LINE);
    console.log('');
    process.exit(0);
  }

  let removed = 0, patched = 0;

  for (const f of toDelete) { fs.rmSync(f, { force: true }); console.log('  ✔ Deleted : ' + f.replace(HOME, '~')); removed++; }
  for (const f of toPatch) {
    const stripped = stripPlatformBlock(fs.readFileSync(f, 'utf8'));
    fs.writeFileSync(f, stripped.endsWith('\n') ? stripped : stripped + '\n');
    console.log('  ✔ Patched : ' + f.replace(HOME, '~') + '  (PLATFORM block removed, USER content kept)');
    patched++;
  }
  for (const f of presentCmds) { fs.rmSync(f, { force: true }); console.log('  ✔ Deleted : ' + f.replace(HOME, '~')); removed++; }

  if (versionExists) {
    fs.rmSync(versionFile, { force: true });
    try { const dir = path.dirname(versionFile); if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir); } catch { /* ignore */ }
    console.log('  ✔ Deleted : ~/.agent-platform/global-version');
    removed++;
  }

  console.log('');
  console.log(`  Done — ${removed} file(s) deleted, ${patched} file(s) patched.`);
  if (patched > 0) console.log('  Your personal USER section content has been preserved.');
  console.log(LINE);
  console.log('');
  process.exit(0);
}

/* ── Apply ────────────────────────────────────────────────────────────────── */
const vars        = discover();
const created     = [];
const updated     = [];
const skipped     = [];
const noMarkers   = []; // upgrade skipped because file has no PLATFORM:START/END

// Run pre-install scan on fresh install only
const preArtifacts = (MODE === 'install') ? scanPreExistingArtifacts(INSTALL_ROOT) : { toBackup: [], toNote: [] };
const backupDir    = (MODE === 'install') ? backupArtifacts(INSTALL_ROOT, preArtifacts.toBackup) : null;
if (MODE === 'install') writeMigrationNotes(INSTALL_ROOT, preArtifacts, backupDir);

for (const entry of manifest.files) {
  if (entry.scope === 'global') continue; // global-only stubs — installed via --mode=global
  if (!shouldInstallEntry(entry, filterOpts)) continue;

  const target = path.join(INSTALL_ROOT, entry.path);
  const tpl    = resolveTemplate(entry, PROFILE);
  const src    = path.join(templatesRoot, tpl);
  if (!fs.existsSync(src)) continue;

  let content = sub(fs.readFileSync(src, 'utf8'), vars);

  // Platform control files that must always be installed even when pre-existing.
  // These are routing/coordination files with no user-customizable content —
  // user rules belong in expert PROJECT sections, not here.
  const ALWAYS_INSTALL = new Set(['AGENTS.md', 'SYNC-POINTS.md']);
  const alwaysInstall  = ALWAYS_INSTALL.has(path.basename(entry.path));

  if (fs.existsSync(target)) {
    if (MODE === 'force' || (MODE === 'install' && alwaysInstall)) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
      if (entry.path.endsWith('launch.sh')) {
        try { fs.chmodSync(target, 0o755); } catch { /* ignore on Windows FS */ }
      }
      updated.push(entry.path);
    } else if (MODE === 'upgrade') {
      // Smart upgrade: patch only the PLATFORM section, preserve PROJECT section
      const existing = fs.readFileSync(target, 'utf8');
      const patched  = patchPlatformSection(existing, content);
      if (patched !== null) {
        // File has PLATFORM markers — smart patch, PROJECT section preserved
        fs.writeFileSync(target, patched.endsWith('\n') ? patched : patched + '\n');
        updated.push(entry.path);
      } else if (!content.includes('<!-- PLATFORM:START -->')) {
        // No markers in template = pure platform file (session-start-shared, session-end-shared, etc.)
        // Safe to fully replace — nothing user-customizable to preserve
        fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
        updated.push(entry.path);
      } else if (!existing.includes('<!-- PROJECT:START -->')) {
        // Template has markers but installed file doesn't, AND installed file has no PROJECT
        // section — this is a migration from a pre-two-section-model install.
        // Safe to full replace: no user content exists yet to preserve.
        fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
        updated.push(entry.path + ' (migrated to two-section model)');
      } else {
        noMarkers.push(entry.path); // template has markers but installed file has PROJECT content without PLATFORM markers → warn user
        skipped.push(entry.path);
      }
    } else if (MODE === 'install' && path.basename(entry.path) === 'CLAUDE.md') {
      // CLAUDE.md exists — don't overwrite, but inject the session-start trigger if missing
      const existing = fs.readFileSync(target, 'utf8');
      if (!existing.includes('session-start.md')) {
        const trigger = 'Read `.agent/session-start.md` and execute it.\n\n';
        fs.writeFileSync(target, trigger + existing);
        updated.push(entry.path + ' (session-start trigger injected)');
      } else {
        skipped.push(entry.path);
      }
    } else if (MODE === 'repair' && isStub(fs.readFileSync(target, 'utf8'))) {
      fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
      updated.push(entry.path);
    } else {
      skipped.push(entry.path);
    }
    continue;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.endsWith('\n') ? content : content + '\n');
  if (entry.path.endsWith('launch.sh')) {
    try { fs.chmodSync(target, 0o755); } catch { /* ignore */ }
  }
  created.push(entry.path);
}

/* ── Gitignore — add platform block ──────────────────────────────────────── */
const GI_START = '# Agent Platform Bootstrap — START';
const GI_END   = '# Agent Platform Bootstrap — END';
const GI_BLOCK = `${GI_START}
# Platform coordination files — gitignored by default so nothing is
# accidentally committed with your code. Remove this block if you want
# to track platform files in git (e.g. to share agent config with your team).
.agent/
.claude/
.cursor/
.agents/
.codex/
.opencode/
AGENTS.md
SYNC-POINTS.md
CLAUDE.md
opencode.json
${GI_END}`;

// Only add the gitignore block for project-modifying modes (not uninstall-global which uses HOME)
if (INSTALL_MODES.has(MODE)) {
  const giPath = path.join(INSTALL_ROOT, '.gitignore');
  if (!fs.existsSync(giPath) || !fs.readFileSync(giPath, 'utf8').includes(GI_START)) {
    const existing = fs.existsSync(giPath) ? fs.readFileSync(giPath, 'utf8') : '';
    const separator = existing.length > 0 && !existing.endsWith('\n') ? '\n\n' : '\n';
    fs.appendFileSync(giPath, separator + GI_BLOCK + '\n');
    created.push('.gitignore (platform block)');
  }
}

/* ── CHANGELOG.md — create starter if absent, never overwrite ────────────── */
const changelogPath = path.join(INSTALL_ROOT, 'CHANGELOG.md');
const changelogTemplate = path.join(templatesRoot, 'CHANGELOG.md');
if (INSTALL_MODES.has(MODE) && !fs.existsSync(changelogPath)) {
  if (fs.existsSync(changelogTemplate)) {
    const content = sub(fs.readFileSync(changelogTemplate, 'utf8'), vars);
    fs.writeFileSync(changelogPath, content.endsWith('\n') ? content : content + '\n');
    created.push('CHANGELOG.md');
  }
} else if (INSTALL_MODES.has(MODE) && fs.existsSync(changelogPath)) {
  skipped.push('CHANGELOG.md (already exists — preserved as-is)');
}

/* ── Update platform.json ─────────────────────────────────────────────────── */
const platformPath = path.join(INSTALL_ROOT, '.agent/platform.json');
if (fs.existsSync(platformPath)) {
  try {
    const pj = JSON.parse(fs.readFileSync(platformPath, 'utf8'));
    pj.bootstrap_version  = manifest.bootstrap_version;
    pj.profile            = PROFILE;
    pj.updated_at         = new Date().toISOString();
    pj.updated_by         = 'bootstrap-apply';
    pj.test_runner        = vars.TEST_RUNNER;
    pj.coverage_cmd       = vars.COVERAGE_CMD;
    pj.coverage_threshold = vars.COVERAGE_THRESHOLD;
    // Packs (technology-stack / domain overlays) — additive, opt-in
    if (!Array.isArray(pj.active_packs)) pj.active_packs = [];
    if (MODE === 'add' && ADD_TOKENS) {
      for (const token of ADD_TOKENS) {
        if (token.startsWith('pack:')) {
          const id = token.slice('pack:'.length);
          if (!pj.active_packs.includes(id)) pj.active_packs.push(id);
        }
      }
    }
    // preserve last_update_check if already set
    if (!pj.last_update_check) pj.last_update_check = null;
    if (!pj.last_update_status) pj.last_update_status = null;
    fs.writeFileSync(platformPath, JSON.stringify(pj, null, 2) + '\n');
  } catch { /* ignore */ }
}

/* ── Uninstall mode ───────────────────────────────────────────────────────── */
if (MODE === 'uninstall') {
  const LINE = '═'.repeat(62);
  const managedDirs  = ['.agent', '.claude', '.cursor', '.agents', '.codex', '.opencode'];
  const managedFiles = ['AGENTS.md', 'SYNC-POINTS.md', 'CLAUDE.md', 'opencode.json'];
  const all = [...managedDirs, ...managedFiles];

  console.log('');
  console.log(LINE);
  console.log('  Agent Platform Bootstrap — Uninstall');
  console.log(LINE);
  console.log('');

  if (!CONFIRM) {
    console.log('  ⚠️  DRY RUN — nothing deleted. Add --confirm to proceed.');
    console.log('');
    console.log('  The following will be permanently removed from:');
    console.log('  ' + INSTALL_ROOT);
    console.log('');
    all.forEach((p) => {
      const full = path.join(INSTALL_ROOT, p);
      if (fs.existsSync(full)) console.log('    ' + p);
    });
    console.log('');
    console.log('  To confirm removal run:');
    console.log(`  npx ${manifest.platform_npx || 'github:zafrirron/Agent-Platform'} --mode=uninstall --confirm`);
    console.log(LINE);
    console.log('');
    process.exit(0);
  }

  // Check for pre-install backup to restore
  // IMPORTANT: stage to os.tmpdir() BEFORE deleting .agent/ — the backup lives inside it.
  const backupsRoot = path.join(INSTALL_ROOT, '.agent/backup');
  let staged = null; // { stagingDir, manifest } or { stagingDir, files[] } for legacy
  if (fs.existsSync(backupsRoot)) {
    const backupDirs = fs.readdirSync(backupsRoot)
      .filter(d => d.startsWith('pre-install-'))
      .sort().reverse(); // most recent first
    if (backupDirs.length > 0) {
      const backupDir  = path.join(backupsRoot, backupDirs[0]);
      const stagingDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ap-restore-'));
      const manifestPath = path.join(backupDir, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        for (const backupName of Object.keys(manifest)) {
          fs.copyFileSync(path.join(backupDir, backupName), path.join(stagingDir, backupName));
        }
        staged = { stagingDir, manifest };
      } else {
        // Legacy backup without manifest (pre-v2.15.1)
        const files = fs.readdirSync(backupDir);
        files.forEach(f => fs.copyFileSync(path.join(backupDir, f), path.join(stagingDir, f)));
        staged = { stagingDir, files };
      }
    }
  }

  if (!CONFIRM && staged) {
    console.log('  ℹ  Pre-install backup found — original files will be restored after removal.');
  }

  console.log('  Removing platform files from: ' + INSTALL_ROOT);
  console.log('');
  let removed = 0;
  all.forEach((p) => {
    const full = path.join(INSTALL_ROOT, p);
    if (fs.existsSync(full)) {
      fs.rmSync(full, { recursive: true, force: true });
      console.log('  ✔ Removed: ' + p);
      removed++;
    }
  });

  // Remove platform gitignore block
  const giPath2 = path.join(INSTALL_ROOT, '.gitignore');
  const GI_S = '# Agent Platform Bootstrap — START';
  const GI_E = '# Agent Platform Bootstrap — END';
  if (fs.existsSync(giPath2)) {
    const gi = fs.readFileSync(giPath2, 'utf8');
    if (gi.includes(GI_S)) {
      const start = gi.indexOf(GI_S);
      const end   = gi.indexOf(GI_E);
      if (end > start) {
        const cleaned = gi.slice(0, start).trimEnd() + gi.slice(end + GI_E.length);
        fs.writeFileSync(giPath2, cleaned.trimStart() ? cleaned : '');
        console.log('  ✔ Removed: .gitignore platform block');
        removed++;
      }
    }
  }

  // Restore original files from staging (safe — .agent/ already deleted above)
  let restored = 0;
  if (staged) {
    console.log('');
    console.log('  ──────────────────────────────────────────────────────────────');
    console.log('  Restoring your original AI configuration files from backup...');
    console.log('  ──────────────────────────────────────────────────────────────');
    if (staged.manifest) {
      for (const [backupName, originalPath] of Object.entries(staged.manifest)) {
        const dest = path.join(INSTALL_ROOT, originalPath);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(path.join(staged.stagingDir, backupName), dest);
        console.log('  ✅ Restored: ' + originalPath + '  ← your original file is back');
        restored++;
      }
    } else {
      // Legacy: flat backup files, filename == original filename
      staged.files.forEach(backupFile => {
        const dest = path.join(INSTALL_ROOT, backupFile);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(path.join(staged.stagingDir, backupFile), dest);
        console.log('  ✅ Restored: ' + backupFile + '  ← your original file is back');
        restored++;
      });
    }
    fs.rmSync(staged.stagingDir, { recursive: true }); // clean up temp
    console.log('');
  }

  console.log('');
  console.log(`  ✅ Done — ${removed} platform AI coordination file(s) removed${restored > 0 ? `, ${restored} original AI config(s) restored` : ''}.`);
  console.log('  The platform coordination layer is removed. Your code improvements made with the platform are yours to keep.');
  console.log(LINE);
  console.log('');
  process.exit(0);
}

/* ── Guards: helpers ─────────────────────────────────────────────────────── */

function ciSetupForRunner(runner) {
  if (runner.includes('jest') || runner.includes('vitest') || runner.includes('mocha') || runner.startsWith('npm'))
    return `      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci`;
  if (runner.startsWith('pytest') || runner.startsWith('python'))
    return `      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt`;
  if (runner.startsWith('go'))
    return `      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'`;
  if (runner.startsWith('cargo'))
    return `      - uses: dtolnay/rust-toolchain@stable`;
  if (runner.startsWith('dotnet'))
    return `      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'`;
  return `      # WARNING: Stack not auto-detected. Add your dependency install step here
      # before this workflow will work (e.g. actions/setup-node, pip install, etc.)
      # Then remove this warning comment.`;
}

function generatePreCommitHook(runner, threshold) {
  const hasRunner = runner && !runner.startsWith('<fill');
  return `#!/usr/bin/env node
// Agent Platform Bootstrap — pre-commit guard
// Installed by: npx ${manifest.platform_npx || 'github:zafrirron/Agent-Platform'} --mode=install-guards
// Remove with:  npx ${manifest.platform_npx || 'github:zafrirron/Agent-Platform'} --mode=remove-guards
// @agent-platform-guard

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const pass = (m) => console.log('  ✅ ' + m);
const fail = (m) => { console.error('  ❌ BLOCKED: ' + m); process.exit(1); };
const skip = (m) => console.log('  ⟳  ' + m + ' (skipped)');

console.log('\\nAgent Platform — pre-commit guards');

// Guard 1 — Secrets scan
const PATTERN = /password|api_key|apikey|secret_key|token|private_key|bearer|BEGIN RSA|BEGIN EC PRIVATE/i;
try {
  const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' })
    .split('\\n').filter(f => f.trim() && fs.existsSync(f));
  const hits = staged.filter(f => PATTERN.test(fs.readFileSync(f, 'utf8')));
  if (hits.length) {
    console.error('  Potential secrets in:');
    hits.forEach(f => console.error('    ' + f));
    fail('Secrets detected. Remove sensitive values before committing.');
  }
  pass('Secrets scan clean');
} catch(e) { if (e.message.includes('BLOCKED')) throw e; skip('secrets scan'); }

${hasRunner ? `// Guard 2 — Test suite (source files only)
const RUNNER = '${runner}';
try {
  const staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });
  const hasSrc = /\\.(js|ts|mjs|jsx|tsx|py|go|rs|cs|java|rb|php|swift|kt)$/.test(staged);
  if (hasSrc) {
    console.log('  Running: ' + RUNNER);
    const r = spawnSync(RUNNER, { shell: true, stdio: 'inherit', cwd: ROOT });
    if (r.status !== 0) fail('Test suite failed. Fix all tests before committing.');
    pass('Test suite passed');
  } else { skip('test suite (no source files staged)'); }
} catch(e) { if (e.message.includes('BLOCKED')) throw e; skip('test suite'); }` : `// Guard 2 — Test suite skipped (test_runner not configured)`}

// Guard 3 — New doc file registration (warn, does not block)
try {
  const newMd = execSync('git diff --cached --name-only --diff-filter=A', { encoding: 'utf8' })
    .split('\\n')
    .filter(f => f.endsWith('.md') && !f.startsWith('.agent/') && f.trim());
  if (newMd.length > 0) {
    const registryPath = path.join(ROOT, '.agent/context/docs-registry.md');
    const registry = fs.existsSync(registryPath) ? fs.readFileSync(registryPath, 'utf8') : '';
    const unregistered = newMd.filter(f => !registry.includes(path.basename(f)) && !registry.includes(f));
    if (unregistered.length > 0) {
      console.log('  ⚠️  New doc file(s) not in docs-registry.md:');
      unregistered.forEach(f => console.log('       ' + f));
      console.log('     Add them to .agent/context/docs-registry.md before your next release.');
    } else {
      pass('New doc files registered in docs-registry.md');
    }
  }
} catch(e) { skip('doc registry check'); }

console.log('  ✅ All guards passed\\n');
`;
}

function generateCIWorkflow(runner, coverageCmd, threshold, setup) {
  const hasRunner = runner && !runner.startsWith('<fill');
  const hasCoverage = coverageCmd && !coverageCmd.startsWith('<fill');
  return `# Agent Platform Bootstrap — CI guards
# Installed by: npx ${manifest.platform_npx || 'github:zafrirron/Agent-Platform'} --mode=install-guards
# Remove with:  npx ${manifest.platform_npx || 'github:zafrirron/Agent-Platform'} --mode=remove-guards
# @agent-platform-guard

name: Platform Guards

on:
  push:
    branches: [main, master]
  pull_request:

jobs:
  guards:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

${setup}

      - name: Secrets scan
        run: |
          echo "Scanning staged/changed files for secrets..."
          git diff --name-only HEAD~1 HEAD 2>/dev/null | xargs -I{} sh -c '[ -f "{}" ] && grep -lE "password|api_key|apikey|secret_key|private_key|bearer|BEGIN RSA" "{}" || true' | grep -v "^$" && echo "❌ Secrets found" && exit 1 || true
          echo "✅ Secrets scan passed"
${hasRunner ? `
      - name: Test suite
        run: ${runner}
` : ''}${hasCoverage ? `
      - name: Coverage check
        run: ${coverageCmd}
` : ''}
      - name: Platform guard summary
        run: echo "✅ All Agent Platform guards passed"
`;
}

/* ── install-guards mode ──────────────────────────────────────────────────── */
if (MODE === 'install-guards') {
  const GLINE = '═'.repeat(66);
  const gsep  = '  ' + '─'.repeat(62);
  const vars2 = discover();
  const runner   = vars2.TEST_RUNNER;
  const coverage = vars2.COVERAGE_CMD;
  const threshold = vars2.COVERAGE_THRESHOLD;
  const setup    = ciSetupForRunner(runner);

  console.log('');
  console.log(GLINE);
  console.log('  Agent Platform Bootstrap — Install Guards');
  console.log(GLINE);
  console.log('');
  console.log(`  Project: ${vars2.PROJECT_NAME}  |  Test runner: ${runner}`);
  console.log('');

  // 1. Pre-commit hook
  const gitHooksDir = path.join(INSTALL_ROOT, '.git/hooks');
  const hookPath    = path.join(gitHooksDir, 'pre-commit');
  if (fs.existsSync(gitHooksDir)) {
    if (fs.existsSync(hookPath) && !fs.readFileSync(hookPath, 'utf8').includes('@agent-platform-guard')) {
      console.log('  ⚠️  A pre-commit hook already exists and was NOT installed by Agent Platform.');
      console.log('     Manual merge required: ' + hookPath);
    } else {
      fs.writeFileSync(hookPath, generatePreCommitHook(runner, threshold));
      try { fs.chmodSync(hookPath, 0o755); } catch { /* Windows FS */ }
      console.log('  ✔ Pre-commit hook    →  .git/hooks/pre-commit');
      console.log('     Guards: secrets scan' + (runner && !runner.startsWith('<') ? ' + test suite' : ''));
    }
  } else {
    console.log('  ⚠️  No .git directory found — pre-commit hook not installed.');
    console.log('     Run from inside a git repository.');
  }

  // 2. GitHub Actions workflow
  const ciDir  = path.join(INSTALL_ROOT, '.github/workflows');
  const ciPath = path.join(ciDir, 'platform-guards.yml');
  fs.mkdirSync(ciDir, { recursive: true });
  fs.writeFileSync(ciPath, generateCIWorkflow(runner, coverage, threshold, setup));
  console.log('  ✔ GitHub Actions CI  →  .github/workflows/platform-guards.yml');
  console.log('     Guards: secrets scan' +
    (runner && !runner.startsWith('<') ? ' + test suite' : '') +
    (coverage && !coverage.startsWith('<') ? ' + coverage' : ''));

  // 3. Update platform.json
  const platformPath = path.join(INSTALL_ROOT, '.agent/platform.json');
  if (fs.existsSync(platformPath)) {
    try {
      const pj = JSON.parse(fs.readFileSync(platformPath, 'utf8'));
      pj.guards_installed = true;
      pj.guards_installed_at = new Date().toISOString();
      fs.writeFileSync(platformPath, JSON.stringify(pj, null, 2) + '\n');
    } catch { /* ignore */ }
  }

  console.log('');
  console.log(gsep);
  console.log('  Enforcement is now WIRED — not just aspired to.');
  console.log('');
  console.log('  Pre-commit: blocks commits with secrets or red tests');
  console.log('  CI:         blocks PRs with failing tests or secrets');
  console.log('');
  console.log('  Commit .github/workflows/platform-guards.yml to activate CI.');
  console.log(GLINE);
  console.log('');
  process.exit(0);
}

/* ── remove-guards mode ───────────────────────────────────────────────────── */
if (MODE === 'remove-guards') {
  const GLINE = '═'.repeat(66);
  const hookPath = path.join(INSTALL_ROOT, '.git/hooks/pre-commit');
  const ciPath   = path.join(INSTALL_ROOT, '.github/workflows/platform-guards.yml');
  let removed = 0;

  console.log('');
  console.log(GLINE);
  console.log('  Agent Platform Bootstrap — Remove Guards');
  console.log(GLINE);
  console.log('');

  if (fs.existsSync(hookPath) && fs.readFileSync(hookPath, 'utf8').includes('@agent-platform-guard')) {
    fs.rmSync(hookPath);
    console.log('  ✔ Removed: .git/hooks/pre-commit');
    removed++;
  } else if (fs.existsSync(hookPath)) {
    console.log('  ⚠️  Pre-commit hook exists but was not installed by Agent Platform — not removed.');
  }

  if (fs.existsSync(ciPath) && fs.readFileSync(ciPath, 'utf8').includes('@agent-platform-guard')) {
    fs.rmSync(ciPath);
    console.log('  ✔ Removed: .github/workflows/platform-guards.yml');
    removed++;
  }

  const platformPath = path.join(INSTALL_ROOT, '.agent/platform.json');
  if (fs.existsSync(platformPath)) {
    try {
      const pj = JSON.parse(fs.readFileSync(platformPath, 'utf8'));
      delete pj.guards_installed;
      delete pj.guards_installed_at;
      fs.writeFileSync(platformPath, JSON.stringify(pj, null, 2) + '\n');
    } catch { /* ignore */ }
  }

  console.log('');
  console.log(`  Done — ${removed} guard(s) removed.`);
  console.log(GLINE);
  console.log('');
  process.exit(0);
}

/* ── Install summary ──────────────────────────────────────────────────────── */
// Guard: apply.js can be loaded via two module URLs (bin/ vs AGENT-PLATFORM-APPLY.js).
// Prevent duplicate install banners if both resolve in one process.
if (globalThis.__AP_INSTALL_SUMMARY_DONE) process.exit(0);
globalThis.__AP_INSTALL_SUMMARY_DONE = true;

const LINE = '═'.repeat(66);
const SEP  = '  ' + '─'.repeat(62);
const fw = ['claude', 'cursor', 'agents', 'codex', 'opencode'];
const fwLabel = { claude: 'Claude Code', cursor: 'Cursor', agents: 'Antigravity', codex: 'Codex (VS Code)', opencode: 'OpenCode' };
const modeLabel = { install: 'Installed', upgrade: 'Upgraded', repair: 'Repaired', force: 'Reset', add: 'Added' };

console.log('');
console.log(LINE);
const profileNote = effectiveProfile !== 'full' ? ` (profile: ${effectiveProfile})` : '';
console.log(`  Agent Platform Bootstrap v${manifest.bootstrap_version} — ${modeLabel[MODE] || 'Done'}${profileNote} on ${vars.PROJECT_NAME}`);
console.log(LINE);
console.log('');
console.log('  What was installed');
console.log(SEP);
console.log('  .agent/          shared hub — conventions, playbooks, agents, context');
fw.forEach((f) => {
  if (fs.existsSync(path.join(INSTALL_ROOT, `.${f}`))) {
    console.log(`  .${f}/`.padEnd(18) + fwLabel[f]);
  }
});
console.log('  AGENTS.md        framework router');
console.log('  SYNC-POINTS.md   cross-IDE switch cheat sheet');
console.log('');
console.log(`  Files created: ${created.length}   Updated: ${updated.length}   Skipped: ${skipped.length}`);
if (MODE === 'upgrade' && noMarkers.length > 0) {
  console.log('');
  console.log('  ⚠  Some files were skipped — installed before v2.7 (no PLATFORM markers):');
  noMarkers.slice(0, 5).forEach(f => console.log('     ' + f));
  if (noMarkers.length > 5) console.log(`     ... and ${noMarkers.length - 5} more`);
  console.log(`  To get the latest expert rules, run: npx ${vars.PLATFORM_NPX} --mode=force`);
  console.log('  (force resets all templates — back up any project-specific content first)');
}
console.log('');
console.log('  Capabilities');
console.log(SEP);
const playbookCount = manifest.files.filter((f) => f.kind === 'playbook').length;
console.log('  ✔  5 IDE frameworks    Claude Code · Cursor · Antigravity · Codex · OpenCode');
console.log('  ✔  9 expert agents     Architect · Backend · Frontend · DevOps · Critic');
console.log('                         Test · Docs · Security · Data');
console.log(`  ✔  ${playbookCount} playbooks        see .agent/QUICK-REF.md for full inventory`);
console.log('                         references · NFR · compliance · deprecation gates');
const runnerDisplay = vars.TEST_RUNNER.startsWith('<') ? 'not detected — set in .agent/CONVENTIONS.md' : vars.TEST_RUNNER;
console.log(`  ✔  Test enforcement    runner: ${runnerDisplay}  |  coverage gate: ${vars.COVERAGE_THRESHOLD}%`);
console.log('  ✔  Token compression   "caveman mode" — ~65% output reduction');
console.log('  ✔  Quick reference     .agent/QUICK-REF.md — say "show quick reference"');
console.log('  ✔  Update check        node .agent/tools/check-updates.mjs');
console.log('  ✔  Context docs        api-contracts · adr-log · known-issues · dependencies');
console.log('  ✔  Zero code impact     platform files gitignored — your source code is untouched');

// Pre-existing artifact report
const totalArtifacts = preArtifacts.toBackup.length;
if (totalArtifacts > 0) {
  console.log('');
  console.log('  Pre-existing AI configuration detected');
  console.log(SEP);
  if (preArtifacts.toBackup.length > 0) {
    preArtifacts.toBackup.forEach(({ file, label }) => {
      console.log(`  ⚠  ${file.padEnd(30)} preserved + backed up → .agent/backup/`);
    });
    console.log('');
    console.log('  See .agent/MIGRATION-NOTES.md to connect your existing AI configs to the platform.');
  }
}
console.log(`  ○  Enforcement guards  not installed — run: npx ${vars.PLATFORM_NPX} --mode=install-guards`);
// Global stubs check — only shown on fresh install, not upgrade/repair
if (MODE === 'install') {
  const globalVersionFile = path.join(os.homedir(), '.agent-platform/global-version');
  if (fs.existsSync(globalVersionFile)) {
    try {
      const gv = JSON.parse(fs.readFileSync(globalVersionFile, 'utf8'));
      console.log(`  ✔  Global stubs         installed (v${gv.version || '?'}) — platform activates in all your repos`);
    } catch {
      console.log('  ✔  Global stubs         installed — platform activates in all your repos');
    }
  } else {
    console.log(`  ○  Global stubs         not installed — run: npx ${vars.PLATFORM_NPX} --mode=global`);
    console.log('     (activates platform in every repo you open — install once, works everywhere)');
  }
}
console.log('');
console.log('  References');
console.log(SEP);
console.log(`  Full guide  →  https://github.com/${vars.PLATFORM_REPO}/blob/main/AGENT-PLATFORM-FRAMEWORK-README.md`);
console.log(`  Repository  →  https://github.com/${vars.PLATFORM_REPO}`);
console.log(`  Changelog   →  https://github.com/${vars.PLATFORM_REPO}/blob/main/CHANGELOG.md`);
console.log('');
console.log('  Next step — open your AI agent and send this message:');
console.log('');
console.log('  ┌─────────────────────────────────────────────────────────────┐');
console.log('  │  Read .agent/session-start.md and execute it.              │');
console.log('  └─────────────────────────────────────────────────────────────┘');
console.log('');
console.log('  Works in: Claude Code · Cursor · Antigravity · Codex · OpenCode');
console.log('  ⚠  This is an agent chat message — do not run it in the terminal.');
console.log('');
if (['install', 'upgrade'].includes(MODE)) {
  try {
    const suggestedPacks = detectPacks(INSTALL_ROOT);
    if (suggestedPacks.length > 0) {
      console.log('  Suggested packs (detected in your project — opt-in, not installed)');
      console.log(SEP);
      for (const p of suggestedPacks) {
        console.log(`  • ${p.display_name} — npx ${vars.PLATFORM_NPX} --mode=add --add=pack:${p.id}`);
      }
      console.log('     Packs add curated stack/domain knowledge. List all: --mode=list --list=packs');
      console.log('');
    }
  } catch { /* detection is best-effort */ }
}
console.log('  Notes');
console.log(SEP);
console.log('  ℹ  Rules are guidance — not deterministic enforcement.');
console.log('     Platform rules are read by your AI agent and followed most of the time,');
console.log('     but agents are probabilistic. For gates that must ALWAYS fire (tests,');
console.log('     secrets, coverage): npx ' + vars.PLATFORM_NPX + ' --mode=install-guards');
console.log('');
console.log('  To REMOVE all platform files: npx ' + vars.PLATFORM_NPX + ' --mode=uninstall');
console.log('');
console.log(LINE);
console.log('');
process.exit(0);
