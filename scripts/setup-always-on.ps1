# setup-always-on.ps1
# Registers the Cindy Receptionist server to start at every login.
# Creates a shortcut in the Windows Startup folder that runs the supervisor hidden.
# Run once, with:  powershell -ExecutionPolicy Bypass -File scripts\setup-always-on.ps1

$ErrorActionPreference = "Stop"

$scriptDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Split-Path -Parent $scriptDir
$supervisor = Join-Path $scriptDir "cindy-always-on.ps1"
$startup    = [Environment]::GetFolderPath('Startup')
$shortcut   = Join-Path $startup "Cindy Receptionist - Always On.lnk"

$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($shortcut)
$sc.TargetPath       = "powershell.exe"
$sc.Arguments        = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$supervisor`""
$sc.WorkingDirectory = $projectDir
$sc.Description      = "Keeps the Ayomorr Cravings receptionist server running at all times."
$sc.Save()

Write-Output "Autostart registered: $shortcut"
Write-Output "The server will now start automatically whenever you log in."