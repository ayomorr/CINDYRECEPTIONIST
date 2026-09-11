# stop-cindy.ps1
# Stops the Cindy Receptionist server and the always-on supervisor.
# (The server will start again next login unless you remove the Startup shortcut
# or delete it via:  Remove-Item "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\Cindy Receptionist - Always On.lnk")

$ErrorActionPreference = "SilentlyContinue"

# Stop the node server listening on port 3000
$conn = Get-NetTCPConnection -LocalPort 3000 -State Listen
foreach ($c in $conn) {
    $p = Get-Process -Id $c.OwningProcess
    if ($p -and $p.ProcessName -eq "node") {
        Write-Output "Stopping node server (PID $($p.Id))"
        Stop-Process -Id $p.Id -Force
    }
}

# Stop any supervisor scripts
Get-CimInstance Win32_Process -Filter "Name='powershell.exe'" |
    Where-Object { $_.CommandLine -like "*cindy-always-on.ps1*" } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

Write-Output "Cindy Receptionist server stopped. It will return on next login."