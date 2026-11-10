@echo off
title SRM Campus Helpdesk React Client (Port 5173)
color 0B
echo ===============================================================================
echo   Starting SRM Campus Helpdesk React Client (Vite Dev Server on Port 5173)
echo ===============================================================================
echo.
echo Launching React Single Page Application...
echo Local URL: http://localhost:5173
echo.
call npx vite --host 0.0.0.0 --port 5173
pause
