@echo off
set "MKVSF_ROOT=%~dp0"
start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --user-data-dir="%MKVSF_ROOT%dados\navegador" --no-first-run --app="file:///%MKVSF_ROOT%index.html"
