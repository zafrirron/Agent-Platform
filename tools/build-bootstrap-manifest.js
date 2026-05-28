const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'AGENT-PLATFORM-TEMPLATES');
const OUT = path.join(ROOT, 'AGENT-PLATFORM-MANIFEST.json');

function walk(dir, base = '') {
  const entries = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const rel = path.join(base, name).replace(/\\/g, '/');
    if (fs.statSync(full).isDirectory()) entries.push(...walk(full, rel));
    else entries.push(rel);
  }
  return entries;
}

const all = walk(TEMPLATES).sort();
const files = all.map((template) => ({
  path: template,
  template,
  kind: template.includes('/tools/') ? 'tool' : template.includes('/playbooks/') ? 'playbook' : 'template',
}));

const manifest = {
  schema_version: 1,
  bootstrap_version: '2.1.0',
  description: 'Agent platform template manifest — pair with AGENT-PLATFORM-BOOTSTRAP.md',
  templates_root: 'AGENT-PLATFORM-TEMPLATES',
  apply_script: '.agent/bootstrap/apply.js',
  placeholders: ['PROJECT_NAME', 'PROJECT_DESCRIPTION', 'DATE', 'HIGH_CONFLICT_PATHS', 'TEST_RUNNER', 'BOOTSTRAP_VERSION'],
  frameworks: ['cursor', 'claude', 'antigravity', 'codex'],
  files,
};

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Manifest: ${files.length} templates`);
