const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../handoff/sync/registry.yaml');
const CURRENT_FRAMEWORK = process.argv[2] || process.env.ACTIVE_FRAMEWORK;
const PLANNED_FILES = process.argv.slice(3);

if (!fs.existsSync(REGISTRY_PATH)) {
    console.log("Sync registry not found. Assuming clean state.");
    process.exit(0);
}

function cleanValue(value) {
    return value.trim().replace(/^["']|["']$/g, '');
}

function normalizePath(value) {
    return value.replace(/\\/g, '/').replace(/^\.?\//, '').toLowerCase();
}

function parseRegistry(content) {
    const frameworks = {};
    let inFrameworks = false;
    let current = null;
    let inFiles = false;

    for (const line of content.split(/\r?\n/)) {
        if (/^frameworks:\s*$/.test(line)) {
            inFrameworks = true;
            continue;
        }

        if (inFrameworks && /^\S/.test(line) && !/^frameworks:/.test(line)) {
            break;
        }

        const frameworkMatch = line.match(/^  ([A-Za-z0-9_-]+):\s*$/);
        if (inFrameworks && frameworkMatch) {
            current = frameworkMatch[1];
            frameworks[current] = { status: 'idle', files: [] };
            inFiles = false;
            continue;
        }

        if (!current) continue;

        const statusMatch = line.match(/^    status:\s*(.+?)\s*$/);
        if (statusMatch) {
            frameworks[current].status = cleanValue(statusMatch[1]);
            inFiles = false;
            continue;
        }

        const filesMatch = line.match(/^    files:\s*(.*)$/);
        if (filesMatch) {
            inFiles = true;
            if (filesMatch[1].trim() === '[]') inFiles = false;
            continue;
        }

        if (inFiles) {
            const itemMatch = line.match(/^      -\s*(.+?)\s*$/);
            if (itemMatch) {
                frameworks[current].files.push(cleanValue(itemMatch[1]));
                continue;
            }
            if (!/^      /.test(line)) inFiles = false;
        }
    }

    return frameworks;
}

function pathsOverlap(a, b) {
    const left = normalizePath(a).replace(/\/\*\*$/, '').replace(/\/$/, '');
    const right = normalizePath(b).replace(/\/\*\*$/, '').replace(/\/$/, '');
    return left === right || left.startsWith(`${right}/`) || right.startsWith(`${left}/`);
}

try {
    const frameworks = parseRegistry(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    const active = Object.entries(frameworks)
        .filter(([id, fw]) => id !== CURRENT_FRAMEWORK && fw.status === 'active');

    const conflicts = [];
    for (const [id, fw] of active) {
        if (PLANNED_FILES.length === 0) {
            console.warn(`Active session found: ${id}; no planned files supplied, so overlap was not checked.`);
            continue;
        }
        const overlaps = fw.files.filter(locked => PLANNED_FILES.some(file => pathsOverlap(locked, file)));
        if (overlaps.length > 0) conflicts.push({ id, overlaps });
    }

    if (conflicts.length > 0) {
        for (const conflict of conflicts) {
            console.error(`Lock conflict with ${conflict.id}: ${conflict.overlaps.join(', ')}`);
        }
        process.exit(1);
    }

    console.log("No overlapping lock conflicts detected.");
    process.exit(0);
} catch (err) {
    console.error("Error reading registry:", err.message);
    process.exit(1);
}
