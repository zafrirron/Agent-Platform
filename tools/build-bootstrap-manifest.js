/**
 * Rebuild AGENT-PLATFORM-MANIFEST.json files list from AGENT-PLATFORM-TEMPLATES/.
 *
 * Preserves manually curated `kind` values from the existing manifest.
 * Auto-infers kind for new files: tool → playbook → template.
 * All other manifest fields (bootstrap_version, placeholders, etc.) are preserved.
 *
 * Usage: node tools/build-bootstrap-manifest.js
 * WARNING: Review the diff before committing. Never run blind before a release.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'AGENT-PLATFORM-TEMPLATES');
const OUT       = path.join(ROOT, 'AGENT-PLATFORM-MANIFEST.json');

function walk(dir, base = '') {
  const entries = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel  = path.join(base, name).replace(/\\/g, '/');
    if (fs.statSync(full).isDirectory()) entries.push(...walk(full, rel));
    else entries.push(rel);
  }
  return entries;
}

function inferKind(template) {
  if (template.includes('/tools/'))     return 'tool';
  if (template.includes('/playbooks/')) return 'playbook';
  return 'template';
}

const existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));

// Build lookup from existing manifest: path → kind (preserves manual curation)
const existingKind = {};
for (const entry of (existing.files || [])) {
  existingKind[entry.path] = entry.kind;
}

const all   = walk(TEMPLATES).sort();
const files = all.map((template) => ({
  path:     template,
  template,
  // Preserve existing kind if set; fall back to inference for new files
  kind: existingKind[template] || inferKind(template),
}));

// Report new files (not previously in manifest)
const newFiles = files.filter(f => !existingKind[f.path]);
if (newFiles.length > 0) {
  console.log(`New files added to manifest (${newFiles.length}):`);
  newFiles.forEach(f => console.log(`  + ${f.path}  [${f.kind}]`));
}

// Report removed files (in old manifest but not on disk)
const removedPaths = Object.keys(existingKind).filter(p => !files.find(f => f.path === p));
if (removedPaths.length > 0) {
  console.log(`Files removed from manifest (${removedPaths.length}):`);
  removedPaths.forEach(p => console.log(`  - ${p}`));
}

const manifest = { ...existing, files };
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Manifest: ${files.length} files total`);
