@echo off
title FinPilot AI Stopper
color 0C
echo ======================================================================
echo                     FINPILOT AI - STOP ALL SERVICES
echo ======================================================================
echo.

echo Stopping service on Port 5173 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

echo Stopping service on Port 8080 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

echo Stopping service on Port 8000 (AI Service)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /f /pid %%a 2>nul

echo.
echo All FinPilot AI background services have been stopped.
timeout /t 3 /nobreak >nul

