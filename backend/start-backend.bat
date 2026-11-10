@echo off
title Helpdesk Core Backend API (Port 8080)
color 0A
echo ===============================================================================
echo   Starting SRM Campus Helpdesk Core Backend (Spring Boot 3.2 on Port 8080)
echo ===============================================================================
echo.
echo REST API Base:        http://localhost:8080/api/tickets
echo Dashboard Stats:      http://localhost:8080/api/dashboard/stats
echo Raw JDBC Endpoint:    http://localhost:8080/api/tickets/raw-jdbc
echo H2 In-Memory Console: http://localhost:8080/h2-console  (JDBC URL: jdbc:h2:mem:helpdeskdb, User: sa, Pass: blank)
echo.
echo Running Spring Boot via Maven...
call mvn spring-boot:run
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [NOTE] If Maven is not configured in system PATH, open this project
    echo        in IntelliJ IDEA / Eclipse / VS Code and run:
    echo        'com.campus.helpdesk.CampusHelpdeskApplication.java'
    echo.
)
pause
