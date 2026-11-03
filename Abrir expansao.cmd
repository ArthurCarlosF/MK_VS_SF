@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0expansao\rede\Iniciar.ps1" -AbrirLocal
if errorlevel 1 pause
