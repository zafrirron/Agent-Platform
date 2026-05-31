# Agent Platform Bootstrap - release script
#
# Cross-platform: runs on Windows PowerShell and Linux/macOS with PowerShell Core (pwsh).
# Install pwsh on Linux: https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-linux
#
# Usage:
#   .\tools\release.ps1 -Version 2.21.0       # Windows
#   pwsh ./tools/release.ps1 -Version 2.21.0  # Linux / macOS
#
# This script is for RELEASE ONLY. It is not a substitute for git commit or git push.
# Normal development workflow:
#   git commit  (often, as you work)
#   git push    (when you decide - independent of releasing)
#   .\tools\release.ps1 -Version X.Y.Z  (only when ready to publish a release)
#
# Pre-conditions (the script validates these and stops if not met):
#   1. Working tree is clean - all your work is already committed and pushed
#   2. CHANGELOG.md has a ## [X.Y.Z] entry for this version
#   3. gh CLI is authenticated (gh auth status)
#
# What this script does:
#   1. Validates preconditions
#   2. Bumps package.json + AGENT-PLATFORM-MANIFEST.json to the version
#   3. Runs the full test suite - blocks on failure
#   4. Commits the version bump (single commit: "chore(release): bump to vX.Y.Z")
#   5. Creates the git tag vX.Y.Z
#   6. Pushes the version bump commit + tag to origin
#   7. Creates the GitHub release page from TEMPLATE.md + CHANGELOG content

param(
    [Parameter(Mandatory)]
    [string]$Version
)

$ErrorActionPreference = "Stop"
$ROOT = git -C $PSScriptRoot rev-parse --show-toplevel
$REPO = "zafrirron/Agent-Platform"

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function OK($msg)   { Write-Host "    OK  $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "`n    BLOCKED  $msg" -ForegroundColor Red; exit 1 }

$GH   = try { (Get-Command gh -ErrorAction Stop).Source } catch {
    @("C:\Program Files\GitHub CLI\gh.exe","$env:ProgramFiles\GitHub CLI\gh.exe") |
    Where-Object { Test-Path $_ } | Select-Object -First 1
}
if (-not $GH) { Fail "gh CLI not found. Install from https://cli.github.com or add to PATH." }

# -- 1. Clean working tree ------------------------------------------------------

Step "Checking working tree is clean"

$dirty = git -C $ROOT status --porcelain
if ($dirty) {
    Write-Host ""
    Write-Host "    Uncommitted changes found:" -ForegroundColor Yellow
    $dirty | ForEach-Object { Write-Host "      $_" }
    Fail "Commit and push your work before running a release."
}

$ahead = git -C $ROOT rev-list "@{u}..HEAD" 2>$null
if ($ahead) {
    Fail "Local commits not yet pushed to origin. Push first, then release."
}
OK "Working tree clean and up to date with origin"

# -- 2. Validate CHANGELOG ------------------------------------------------------

Step "Checking CHANGELOG.md for v$Version"

$changelog = Get-Content "$ROOT\CHANGELOG.md" -Raw
if ($changelog -notmatch "\[${Version}\]") {
    Fail "CHANGELOG.md has no entry for [$Version]. Update CHANGELOG.md first."
}
OK "CHANGELOG.md covers v$Version"

# -- 3. Extract What's new from CHANGELOG --------------------------------------

Step "Extracting release notes from CHANGELOG.md"

$pattern = "(?s)## \[${Version}\][^\n]*\n(.+?)(?=\n---)"
if ($changelog -match $pattern) {
    $whatsNew = $Matches[1].Trim()
    OK "Extracted $(($whatsNew -split "`n").Count) lines"
} else {
    Fail "Could not extract content for [$Version] from CHANGELOG.md. Check the section format."
}

# -- 4. Bump versions -----------------------------------------------------------

Step "Bumping versions to $Version"

$pkg = Get-Content "$ROOT\package.json" -Raw
$currentPkg = "?"
if ($pkg -match '"version":\s*"([^"]+)"') { $currentPkg = $Matches[1] }
$pkg = $pkg -replace '"version":\s*"[^"]+"', """version"": ""$Version"""
Set-Content "$ROOT\package.json" $pkg -NoNewline
OK "package.json: $currentPkg -> $Version"

$man = Get-Content "$ROOT\AGENT-PLATFORM-MANIFEST.json" -Raw
$currentMan = "?"
if ($man -match '"bootstrap_version":\s*"([^"]+)"') { $currentMan = $Matches[1] }
$man = $man -replace '"bootstrap_version":\s*"[^"]+"', """bootstrap_version"": ""$Version"""
Set-Content "$ROOT\AGENT-PLATFORM-MANIFEST.json" $man -NoNewline
OK "AGENT-PLATFORM-MANIFEST.json: $currentMan -> $Version"

$readme = Get-Content "$ROOT\README.md" -Raw
$currentReadme = "?"
if ($readme -match '\*\*v([0-9]+\.[0-9]+\.[0-9]+)\*\*') { $currentReadme = $Matches[1] }
$readme = $readme -replace '\*\*v[0-9]+\.[0-9]+\.[0-9]+\*\*', "**v$Version**"
Set-Content "$ROOT\README.md" $readme -NoNewline
OK "README.md: $currentReadme -> $Version"

$pres = Get-Content "$ROOT\presentation\agent-platform-beta.html" -Raw -ErrorAction SilentlyContinue
if ($pres) {
    $pres = $pres -replace 'v[0-9]+\.[0-9]+\.[0-9]+', "v$Version"
    Set-Content "$ROOT\presentation\agent-platform-beta.html" $pres -NoNewline
    OK "presentation/agent-platform-beta.html -> v$Version"
}

# -- 5. Run tests ---------------------------------------------------------------

Step "Running full test suite"

Push-Location $ROOT
try {
    npm test
    if ($LASTEXITCODE -ne 0) { Fail "Tests failed. Fix before releasing." }
    OK "All tests passed"
} finally {
    Pop-Location
}

# -- 6. Commit version bump -----------------------------------------------------

Step "Committing version bump"

git -C $ROOT add package.json AGENT-PLATFORM-MANIFEST.json README.md presentation/agent-platform-beta.html

$staged = git -C $ROOT diff --cached --name-only
if ($staged) {
    git -C $ROOT commit -m "chore(release): bump to v$Version"
    OK "Committed version bump"
} else {
    OK "Versions already at $Version - nothing to commit"
}

# -- 7. Tag ---------------------------------------------------------------------

Step "Creating tag v$Version"

$existingTag = git -C $ROOT tag --list "v$Version"
if ($existingTag) {
    Write-Host "    Tag v$Version already exists - skipping" -ForegroundColor Yellow
} else {
    git -C $ROOT tag "v$Version"
    OK "Created tag v$Version"
}

# -- 8. Push version bump commit + tag -----------------------------------------

Step "Pushing version bump commit and tag to origin"

git -C $ROOT push
git -C $ROOT push origin "v$Version"
OK "Pushed"

# -- 9. GitHub release page -----------------------------------------------------

Step "Creating GitHub release page for v$Version"

$action = "create"
$ErrorActionPreference = "SilentlyContinue"
& $GH release view "v$Version" --repo $REPO | Out-Null
if ($LASTEXITCODE -eq 0) { $action = "edit" }
$ErrorActionPreference = "Stop"

$template = Get-Content "$ROOT\tools\release-notes-TEMPLATE.md" -Raw
$releaseNotes = $template `
    -replace "vX\.Y\.Z", "v$Version" `
    -replace "<!-- Describe the main changes here -->", $whatsNew

$tmp = [System.IO.Path]::GetTempFileName() + ".md"
Set-Content $tmp $releaseNotes -Encoding UTF8

try {
    if ($action -eq "create") {
        & $GH release create "v$Version" --repo $REPO `
            --title "Agent Platform Bootstrap v$Version" `
            --notes-file $tmp --latest
    } else {
        & $GH release edit "v$Version" --repo $REPO `
            --title "Agent Platform Bootstrap v$Version" `
            --notes-file $tmp --latest
    }
    if ($LASTEXITCODE -ne 0) { Fail "gh release $action failed." }
    OK "https://github.com/$REPO/releases/tag/v$Version"
} finally {
    Remove-Item $tmp -ErrorAction SilentlyContinue
}

# -- Done -----------------------------------------------------------------------

Write-Host ""
Write-Host "==================================================" -ForegroundColor Green
Write-Host "  Released: Agent Platform Bootstrap v$Version"    -ForegroundColor Green
Write-Host "  https://github.com/$REPO/releases/tag/v$Version" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host ""
