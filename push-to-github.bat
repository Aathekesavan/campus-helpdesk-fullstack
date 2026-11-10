@echo off
title Push Campus Helpdesk Code to GitHub
color 0b
echo ======================================================================
echo    SRM IST - Full Stack Web Development (21CSE354T)
echo    Pushing Clean Source Code to GitHub
echo    Repository: https://github.com/Aathekesavan/campus-helpdesk-fullstack
echo ======================================================================
echo.

cd /d "%~dp0"

echo Current Directory: %CD%
echo Current Branch:
git branch --show-current
echo.

echo Staging and verifying clean status...
git status
echo.

echo Pushing source code to remote origin (main)...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo [SUCCESS] Code pushed successfully to:
    echo https://github.com/Aathekesavan/campus-helpdesk-fullstack
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo [FAILED / AUTH REQUIRED]
    echo If GitHub asks for sign-in, complete the browser login prompt.
    echo Alternatively, run:
    echo   git push -u origin main
    echo with your GitHub Personal Access Token (PAT).
    echo ======================================================================
)

pause
