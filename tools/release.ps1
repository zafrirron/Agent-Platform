# Agent Platform Bootstrap — release automation
#
# Usage:
#   .\tools\release.ps1 -Version 2.21.0
#
# What it does (in order):
#   1. Validates CHANGELOG.md has an entry for the version
#   2. Bumps package.json + AGENT-PLATFORM-MANIFEST.json to the version
#   3. Runs full test suite
#   4. Commits the version bump
#   5. Creates and pushes the git tag
#   6. Pushes the branch
#   7. Creates the GitHub release page from CHANGELOG content + template
#
# Prerequisites:
#   - CHANGELOG.md must already have a ## [X.Y.Z] entry for this version
#   - gh CLI must be authenticated (gh auth status)
#   - Working tree must be clean (or only have the version bump staged)

param(
    [Parameter(Mandatory)]
    [string]$Version
)

$ErrorActionPreference = "Stop"
$ROOT  = "e:\Agent Platfrom"
$GH    = "C:\Program Files\GitHub CLI\gh.exe"
$REPO  = "zafrirron/Agent-Platform"

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function OK($msg)   { Write-Host "    OK  $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "`n    FAIL  $msg" -ForegroundColor Red; exit 1 }

# ── 1. Validate CHANGELOG has an entry ───────────────────────────────────────

Step "Checking CHANGELOG.md for v$Version"

$changelog = Get-Content "$ROOT\CHANGELOG.md" -Raw
if ($changelog -notmatch "\[${Version}\]") {
    Fail "CHANGELOG.md has no entry for [$Version]. Add it first, then run this script."
}
OK "CHANGELOG.md covers v$Version"

# ── 2. Extract "What's new" content from CHANGELOG ───────────────────────────

Step "Extracting release notes from CHANGELOG.md"

# Find the section for this version: from ## [X.Y.Z] to the next --- separator
$pattern = "(?s)## \[${Version}\][^\n]*\n(.+?)(?=\n---)"
if ($changelog -match $pattern) {
    $whatsNew = $Matches[1].Trim()
    OK "Extracted $(($whatsNew -split "`n").Count) lines of release notes"
} else {
    Fail "Could not extract content for [$Version] from CHANGELOG.md. Check the format."
}

# ── 3. Bump versions ──────────────────────────────────────────────────────────

Step "Bumping versions to $Version"

# package.json
$pkg = Get-Content "$ROOT\package.json" -Raw
$currentPkg = if ($pkg -match '"version":\s*"([^"]+)"') { $Matches[1] } else { "unknown" }
$pkg = $pkg -replace '"version":\s*"[^"]+"', """version"": ""$Version"""
Set-Content "$ROOT\package.json" $pkg -NoNewline
OK "package.json: $currentPkg → $Version"

# AGENT-PLATFORM-MANIFEST.json
$manifest = Get-Content "$ROOT\AGENT-PLATFORM-MANIFEST.json" -Raw
$currentManifest = if ($manifest -match '"bootstrap_version":\s*"([^"]+)"') { $Matches[1] } else { "unknown" }
$manifest = $manifest -replace '"bootstrap_version":\s*"[^"]+"', """bootstrap_version"": ""$Version"""
Set-Content "$ROOT\AGENT-PLATFORM-MANIFEST.json" $manifest -NoNewline
OK "AGENT-PLATFORM-MANIFEST.json: $currentManifest → $Version"

# ── 4. Run tests ──────────────────────────────────────────────────────────────

Step "Running test suite"

Push-Location $ROOT
try {
    npm test
    if ($LASTEXITCODE -ne 0) { Fail "Tests failed. Fix before releasing." }
    OK "All tests passed"
} finally {
    Pop-Location
}

# ── 5. Commit ─────────────────────────────────────────────────────────────────

Step "Committing version bump"

git -C $ROOT add package.json AGENT-PLATFORM-MANIFEST.json
$status = git -C $ROOT status --porcelain
if ($status) {
    git -C $ROOT commit -m "chore(release): bump to v$Version"
    OK "Committed"
} else {
    OK "Nothing to commit (versions already at $Version)"
}

# ── 6. Tag + push ─────────────────────────────────────────────────────────────

Step "Tagging v$Version and pushing"

$existingTag = git -C $ROOT tag --list "v$Version"
if ($existingTag) {
    OK "Tag v$Version already exists — skipping tag creation"
} else {
    git -C $ROOT tag "v$Version"
    OK "Created tag v$Version"
}

git -C $ROOT push
git -C $ROOT push origin "v$Version"
OK "Pushed branch and tag"

# ── 7. GitHub release ─────────────────────────────────────────────────────────

Step "Creating GitHub release v$Version"

# Check if release already exists
$existing = & $GH release view "v$Version" --repo $REPO 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "    Release v$Version already exists. Updating content..." -ForegroundColor Yellow
    $action = "edit"
} else {
    $action = "create"
}

# Build release notes from template
$template = Get-Content "$ROOT\tools\release-notes-TEMPLATE.md" -Raw

# Substitute placeholders
$releaseNotes = $template `
    -replace "vX\.Y\.Z", "v$Version" `
    -replace "<!-- Describe the main changes here -->", $whatsNew

# Write to temp file (gh requires a file or stdin — use temp, delete immediately)
$tmpFile = [System.IO.Path]::GetTempFileName() + ".md"
Set-Content $tmpFile $releaseNotes -Encoding UTF8

try {
    if ($action -eq "create") {
        & $GH release create "v$Version" `
            --repo $REPO `
            --title "Agent Platform Bootstrap v$Version" `
            --notes-file $tmpFile `
            --latest
    } else {
        & $GH release edit "v$Version" `
            --repo $REPO `
            --title "Agent Platform Bootstrap v$Version" `
            --notes-file $tmpFile `
            --latest
    }
    if ($LASTEXITCODE -ne 0) { Fail "gh release $action failed." }
    OK "GitHub release v$Version live at https://github.com/$REPO/releases/tag/v$Version"
} finally {
    Remove-Item $tmpFile -ErrorAction SilentlyContinue
}

# ── Done ──────────────────────────────────────────────────────────────────────

Write-Host "`n══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  Released: Agent Platform Bootstrap v$Version" -ForegroundColor Green
Write-Host "  https://github.com/$REPO/releases/tag/v$Version" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════`n" -ForegroundColor Green
