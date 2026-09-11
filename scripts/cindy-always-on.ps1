# cindy-always-on.ps1
# Supervises the Cindy Receptionist server: keeps it running 24/7.
# - If nothing is listening on the port, it starts node server.js (hidden).
# - If the server crashes, it restarts it within ~15 seconds.
# Run at login via the Startup folder shortcut created by setup-always-on.ps1.

param(
    [string]$Port = "3000"
)

$ErrorActionPreference = "SilentlyContinue"
$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Split-Path -Parent $scriptDir
$logDir     = Join-Path $scriptDir "logs"
$stdout     = Join-Path $logDir "cindy.out.log"
$stderr     = Join-Path $logDir "cindy.err.log"
$nodeExe    = "C:\Program Files\nodejs\node.exe"

if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
Add-Content -Path $stdout -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') Supervisor started (PID $PID)"

while ($true) {
    $listening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if (-not $listening) {
        Add-Content -Path $stdout -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') Port $Port free - starting node server.js"
        if (Test-Path $nodeExe) {
            $proc = Start-Process -FilePath $nodeExe -ArgumentList "server.js" `
                -WorkingDirectory $projectDir -WindowStyle Hidden -PassThru
        } else {
            $proc = Start-Process -FilePath "node" -ArgumentList "server.js" `
                -WorkingDirectory $projectDir -WindowStyle Hidden -PassThru
        }
        Add-Content -Path $stdout -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') Started node PID $($proc.Id)"
    }
    Start-Sleep -Seconds 15
}