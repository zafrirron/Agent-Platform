const fs = require('fs');
const path = require('path');

const CURRENT_PATH = path.join(__dirname, '../handoff/CURRENT.md');
const ARCHIVE_PATH = path.join(__dirname, '../handoff/CURRENT.archive.md');
const KEEP_RECENT = Number(process.argv[2] || process.env.HANDOFF_KEEP_RECENT || 12);

if (!fs.existsSync(CURRENT_PATH)) process.exit(0);

try {
    const raw = fs.readFileSync(CURRENT_PATH, 'utf8');
    const parts = raw.split(/^---\s*$/m);
    const header = (parts.shift() || '# Handoff log').trimEnd();
    const entries = parts.map(part => part.trim()).filter(Boolean);

    if (entries.length <= KEEP_RECENT) {
        console.log("Handoff log within limits. No rotation needed.");
        process.exit(0);
    }

    const keep = [];
    const archive = [];

    entries.forEach((entry, index) => {
        const inProgress = /\*\*Status:\*\*\s*in_progress/i.test(entry);
        if (index < KEEP_RECENT || inProgress) keep.push(entry);
        else archive.push(entry);
    });

    if (archive.length === 0) {
        console.log("No stale completed entries to archive.");
        process.exit(0);
    }

    fs.writeFileSync(CURRENT_PATH, `${header}\n\n---\n\n${keep.join('\n\n---\n\n')}\n`);

    const existingArchive = fs.existsSync(ARCHIVE_PATH)
        ? fs.readFileSync(ARCHIVE_PATH, 'utf8').replace(/^# Handoff Archive\s*/i, '').trim()
        : '';
    const archiveBody = archive.join('\n\n---\n\n');
    const combined = existingArchive
        ? `# Handoff Archive\n\n${archiveBody}\n\n---\n\n${existingArchive}\n`
        : `# Handoff Archive\n\n${archiveBody}\n`;

    fs.writeFileSync(ARCHIVE_PATH, combined);
    console.log(`Pruned CURRENT.md. Moved ${archive.length} entries to CURRENT.archive.md.`);
} catch (err) {
    console.error("Failed to prune log:", err.message);
    process.exit(1);
}
