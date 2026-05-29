# Agent Platform Bootstrap — PowerShell installer
#
# One-liner install (always latest):
#   iwr -useb https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.ps1 | iex
#
# With options (save locally first):
#   .\install.ps1 -Version v2.2.0 -Mode upgrade
#
# Parameters:
#   -Version   tag to install (default: latest release)
#   -Mode      install | upgrade | repair | force  (default: install)
#
# Requirements: PowerShell 5+, node >=18

param(
  [string]$Version = "latest",
  [string]$Mode    = "install"
)

$Repo = "zafrirron/Agent-Platform"

function Write-Ok($msg)   { Write-Host "  $([char]0x2714) $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "  $([char]0x26A0)  $msg" -ForegroundColor Yellow }
function Write-Fail($msg) { Write-Host "  $([char]0x2716) $msg" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "Agent Platform Bootstrap — installer" -ForegroundColor White

# ── Check Node.js ─────────────────────────────────────────────────────────────
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) { Write-Fail "Node.js 18+ is required. Install from https://nodejs.org" }

$nodeVersion = (node -e "process.stdout.write(process.versions.node)")
$nodeMajor   = [int]($nodeVersion.Split('.')[0])
if ($nodeMajor -lt 18) { Write-Fail "Node.js 18+ required (found $nodeVersion)" }
Write-Ok "Node.js $nodeVersion"

# ── Resolve version ───────────────────────────────────────────────────────────
if ($Version -eq "latest") {
  Write-Host "  Fetching latest release..."
  try {
    $release = Invoke-RestMethod "https://api.github.com/repos/$Repo/releases/latest" -ErrorAction Stop
    $Version = $release.tag_name
  } catch {
    Write-Warn "Could not fetch latest release; falling back to main branch"
    $Version = "main"
  }
}
Write-Ok "Version: $Version"

# ── Download ──────────────────────────────────────────────────────────────────
$tmp = Join-Path $env:TEMP "agent-platform-$([System.Guid]::NewGuid().ToString('N').Substring(0,8))"
New-Item -ItemType Directory -Force -Path $tmp | Out-Null

$zipUrl = if ($Version -eq "main") {
  "https://github.com/$Repo/archive/refs/heads/main.zip"
} else {
  "https://github.com/$Repo/archive/refs/tags/$Version.zip"
}

try {
  Write-Host "  Downloading pack..."
  $zipPath = Join-Path $tmp "pack.zip"
  Invoke-WebRequest $zipUrl -OutFile $zipPath -ErrorAction Stop
  Expand-Archive $zipPath -DestinationPath $tmp -Force

  $pack = Get-ChildItem -Path $tmp -Directory |
    Where-Object { $_.Name -like "Agent-Platform*" } |
    Select-Object -First 1

  if (-not $pack) { Write-Fail "Could not find extracted pack directory in $tmp" }
  Write-Ok "Downloaded"

  # ── Apply ──────────────────────────────────────────────────────────────────
  $target = (Get-Location).Path
  Write-Host "  Applying templates (mode=$Mode) -> $target"

  & node (Join-Path $pack.FullName "AGENT-PLATFORM-APPLY.js") `
    "--mode=$Mode" `
    "--pack=$($pack.FullName)" `
    "--target=$target"

  # ── Done ───────────────────────────────────────────────────────────────────
  Write-Host ""
  Write-Host "Agent Platform Bootstrap $Version installed." -ForegroundColor Green
  Write-Host ""
  Write-Host "  Next — tell your agent to fill project-specific stubs:"
  Write-Host ""
  Write-Host "  Read .agent/README.md and fill all stub files for this project." -ForegroundColor Cyan
  Write-Host ""
  Write-Host "  Or start a full session:"
  Write-Host "    Claude Code : Read .claude/prompts/session-start.md and execute it."
  Write-Host "    Cursor      : Read .cursor/prompts/session-start.md and execute it."
  Write-Host ""

} finally {
  Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
}
