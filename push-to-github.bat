@echo off
title Push Campus Helpdesk Live Web App to GitHub Pages
color 0b
echo ======================================================================
echo    SRM IST - Full Stack Web Development (21CSE354T)
echo    Deploying Live Working App to GitHub Pages
echo    Repository: https://github.com/Aathekesavan/campus-helpdesk-fullstack
echo    Live URL:   https://aathekesavan.github.io/campus-helpdesk-fullstack/
echo ======================================================================
echo.

cd /d "%~dp0"

echo Current Directory: %CD%
echo Current Branch:
git branch --show-current
echo.

echo 1. Pushing main branch (contains live web app at root and /docs)...
git push -u origin main

echo.
echo 2. Pushing gh-pages branch...
git push -u origin gh-pages --force

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================================
    echo [SUCCESS] Live Web App Pushed Successfully!
    echo.
    echo Your working site will update in ~30-60 seconds at:
    echo   https://aathekesavan.github.io/campus-helpdesk-fullstack/
    echo.
    echo (If needed, do a hard-refresh in browser: Ctrl + Shift + R)
    echo ======================================================================
) else (
    echo.
    echo ======================================================================
    echo [FAILED / AUTH REQUIRED]
    echo If GitHub asks for sign-in, complete the browser login prompt.
    echo ======================================================================
)

pause
