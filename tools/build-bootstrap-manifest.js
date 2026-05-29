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

const all   = walk(TEMPLATES).sort();
const files = all.map((template) => ({
  path: template,
  template,
  kind: template.includes('/tools/')     ? 'tool'
      : template.includes('/playbooks/') ? 'playbook'
      : 'template',
}));

const existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));

const manifest = {
  ...existing,
  files,
};

fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Manifest: ${files.length} templates`);
