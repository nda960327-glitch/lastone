Set shell = CreateObject("WScript.Shell")
currentDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptPosition)

' 1. 백그라운드로 로컬 파워쉘 서버 조용히 구동 (검은 창 숨김: 0)
shell.Run "powershell.exe -WindowStyle Hidden -ExecutionPolicy Bypass -File """ & currentDir & "\server.ps1""", 0, false

' 2. 잠시 대기 후 기본 웹 브라우저로 index.html 열기 (동작 편의성 극대화)
WScript.Sleep 500
shell.Run """" & currentDir & "\index.html"""
