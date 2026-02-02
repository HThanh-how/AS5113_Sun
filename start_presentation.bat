@echo off
echo ===================================================
echo   AS5113 - STOICISM PRESENTATION LAUNCHER
echo ===================================================
echo.
echo Starting local web server...
echo This fixes the "blank slides" issue caused by browser security.
echo.
echo Please wait, the presentation will open in your default browser...
echo.

start "" "http://localhost:8000"
python -m http.server 8000

pause
