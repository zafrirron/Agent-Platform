<#
.SYNOPSIS
  Launches the app using .agent/platform.json launch config (Windows).
#>
param(
    [string]$ConfigPath = (Join-Path $PSScriptRoot "..\platform.json")
)

function Get-LaunchConfig {
    if (-not (Test-Path $ConfigPath)) {
        return @{ command = "npm"; args = @("start"); cwd = "."; env_unset = @() }
    }
    $json = Get-Content $ConfigPath -Raw | ConvertFrom-Json
    if ($json.launch.windows) { return $json.launch.windows }
    if ($json.launch.default) { return $json.launch.default }
    return @{ command = "npm"; args = @("start"); cwd = "."; env_unset = @() }
}

$cfg = Get-LaunchConfig
$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")

foreach ($key in @($cfg.env_unset)) {
    if ($key -and (Test-Path "Env:$key")) {
        Write-Host "Unsetting env: $key" -ForegroundColor Yellow
        Remove-Item "Env:$key" -ErrorAction SilentlyContinue
    }
}

$workDir = if ($cfg.cwd -and $cfg.cwd -ne ".") { Join-Path $root $cfg.cwd } else { $root }
Set-Location $workDir
$cmd = $cfg.command
$args = @($cfg.args)
Write-Host "Launching: $cmd $($args -join ' ') in $workDir" -ForegroundColor Green
& $cmd @args
exit $LASTEXITCODE
