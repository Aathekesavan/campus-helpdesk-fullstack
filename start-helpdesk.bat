@echo off
title SRM IST Campus Helpdesk - Full Stack Launcher
color 0B
echo ===============================================================================
echo   SRM INSTITUTE OF SCIENCE AND TECHNOLOGY - TIRUCHIRAPPALLI CAMPUS
echo   Department of Computer Science and Engineering
echo   21CSE354T Full Stack Web Development - Task 4 Team Project
echo   Topic 1: Campus Helpdesk and Maintenance Request System
echo   Team: Aathekesavan R (RA2411003050015) - Lead Full-Stack
echo         Lino Joshwa (RA2411003050051)    - Frontend Specialist
echo         Praveen K (RA2411003050056)      - Microservices & QA
echo ===============================================================================
echo.
echo Launching Full Stack Architecture across 3 independent JVMs / processes:
echo   1. Core Backend API Service        (Port 8080)
echo   2. Notification SLA Microservice   (Port 8085)
echo   3. React Single Page Client        (Port 5173)
echo.
echo ===============================================================================

echo Starting Core Spring Boot Backend on Port 8080...
start "Helpdesk Core Backend API (Port 8080)" cmd /k "cd /d %~dp0backend && call start-backend.bat"

timeout /t 3 /nobreak > nul

echo Starting Notification & SLA Microservice on Port 8085...
start "Notification & SLA Microservice (Port 8085)" cmd /k "cd /d %~dp0microservice-notification && call start-microservice.bat"

timeout /t 2 /nobreak > nul

echo Starting React Vite Frontend Client on Port 5173...
start "React Frontend Client (Port 5173)" cmd /k "cd /d %~dp0frontend && call start-frontend.bat"

echo.
echo ===============================================================================
echo   All 3 services launched in separate windows!
echo   React Web Portal:       http://localhost:5173
echo   Core Backend API:       http://localhost:8080/api/tickets
echo   H2 SQL Console:         http://localhost:8080/h2-console
echo   Raw JDBC Endpoint:      http://localhost:8080/api/tickets/raw-jdbc
echo   Notification Service:   http://localhost:8085/api/notifications/health
echo ===============================================================================
echo.
pause
