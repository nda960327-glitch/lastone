@echo off
chcp 65001 > nul
echo VocabMaster 서버를 시작합니다...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
