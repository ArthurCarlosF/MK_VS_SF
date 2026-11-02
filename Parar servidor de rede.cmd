@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0expansao\rede\Parar.ps1"
if errorlevel 1 pause
