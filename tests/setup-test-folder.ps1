# Agent Platform E2E Test Setup
# Resets E:\Test to a clean todo-app starting state (pre-existing AI configs included)
# Run this before every E2E test run.
#
# Usage: .\tests\setup-test-folder.ps1

$TEST_DIR = "E:\Test"
$SOURCE   = "$PSScriptRoot\todo-app"

Write-Host "`n==> Clearing E:\Test" -ForegroundColor Cyan
if (Test-Path $TEST_DIR) {
    Remove-Item $TEST_DIR -Recurse -Force
}
New-Item -ItemType Directory -Path $TEST_DIR | Out-Null

Write-Host "==> Copying todo-app source files" -ForegroundColor Cyan
Copy-Item -Path "$SOURCE\*" -Destination $TEST_DIR -Recurse

Write-Host "==> Initialising git repo" -ForegroundColor Cyan
git -C $TEST_DIR init -q
git -C $TEST_DIR add -A
git -C $TEST_DIR commit -q -m "chore: initial todo app (pre-platform)"

Write-Host "==> Clearing npx cache" -ForegroundColor Cyan
Remove-Item "$env:LOCALAPPDATA\npm-cache\_npx" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`n  E:\Test is ready:" -ForegroundColor Green
Get-ChildItem $TEST_DIR | Select-Object Name
Write-Host "`n  Pre-existing AI configs present:" -ForegroundColor Yellow
Write-Host "    CLAUDE.md  : $(Test-Path "$TEST_DIR\CLAUDE.md")"
Write-Host "    AGENTS.md  : $(Test-Path "$TEST_DIR\AGENTS.md")"
Write-Host "`n  Run the install:" -ForegroundColor Cyan
Write-Host "    cd E:\Test"
Write-Host "    npx github:zafrirron/Agent-Platform"
Write-Host ""
