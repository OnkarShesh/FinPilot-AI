@echo off
title FinPilot AI Launcher
color 0A
echo ======================================================================
echo                     FINPILOT AI - ONE-CLICK LAUNCHER
echo ======================================================================
echo.

set ROOT_DIR=%~dp0

echo [1/3] Starting Python AI Service (Port 8000)...
start "FinPilot - AI Service" cmd /k "cd /d "%ROOT_DIR%finpilot-ai-service" && if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat) && python app.py"

echo [2/3] Starting Spring Boot Backend (Port 8080)...
start "FinPilot - Backend" cmd /k "cd /d "%ROOT_DIR%finpilot-backend" && java -jar target\finpilot-0.0.1-SNAPSHOT.jar"

echo [3/3] Starting React Frontend (Port 5173)...
start "FinPilot - Frontend" cmd /k "cd /d "%ROOT_DIR%finpilot-frontend" && npm run dev"

echo.
echo Waiting for services to initialize (10 seconds)...
ping 127.0.0.1 -n 11 >nul

echo Opening FinPilot AI in your default browser...
start http://localhost:5173

echo.
echo ======================================================================
echo  FinPilot AI is running:
echo    - Frontend:   http://localhost:5173
echo    - Backend:    http://localhost:8080
echo    - AI Service: http://localhost:8000
echo.
echo  To stop all services, run 'stop.bat'.
echo ======================================================================
pause
