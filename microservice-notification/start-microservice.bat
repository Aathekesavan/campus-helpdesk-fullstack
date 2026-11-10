@echo off
title Notification & SLA Alert Microservice (Port 8085)
color 0E
echo ===============================================================================
echo   Starting Notification & SLA Compliance Microservice (Port 8085 - Unit V / CO-5)
echo ===============================================================================
echo.
echo Service Port:   http://localhost:8085
echo Health Endpoint: http://localhost:8085/api/notifications/health
echo Ingest Dispatch: POST http://localhost:8085/api/notifications/dispatch
echo Audit Log Feed:  GET  http://localhost:8085/api/notifications/audit-log
echo.
echo Running Spring Boot via Maven...
call mvn spring-boot:run
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [NOTE] If Maven is not configured in system PATH, open this project
    echo        in IntelliJ IDEA / Eclipse / VS Code and run:
    echo        'com.campus.notification.NotificationApplication.java'
    echo.
)
pause
