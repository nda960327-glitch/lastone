$protocol = "vocabmaster"
$root = $PSScriptRoot
$serverScript = Join-Path $root "server.ps1"
$psPath = "powershell.exe"
$command = "-WindowStyle Hidden -ExecutionPolicy Bypass -File `"$serverScript`""

# 레지스트리 프로토콜 스키마 등록
$regPath = "HKCU:\Software\Classes\$protocol"
if (Test-Path $regPath) { Remove-Item $regPath -Recurse -Force }

New-Item -Path $regPath -Force | Out-Null
New-ItemProperty -Path $regPath -Name "URL Protocol" -Value "" -PropertyType String -Force | Out-Null
New-Item -Path "$regPath\shell\open\command" -Force | Out-Null
Set-Item -Path "$regPath\shell\open\command" -Value "$psPath $command" -Force | Out-Null

Write-Host "VocabMaster 자동 실행 프로토콜이 등록되었습니다." -ForegroundColor Green
