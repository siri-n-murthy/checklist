@echo off
REM Checklist App Quick Start for Windows
REM This script helps you run frontend and backend

echo.
echo ====================================
echo Checklist Application - Quick Start
echo ====================================
echo.

REM Check if Node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [X] Node.js not found. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    exit /b 1
)

echo [OK] Node.js found
node --version
echo.

REM Check MongoDB
echo Prerequisites:
echo [*] Ensure MongoDB is running (local or Atlas)
echo [*] Backend connects to: mongodb://localhost:27017/checklist
echo [*] Frontend runs on: http://localhost:5173
echo [*] Backend runs on: http://localhost:5000
echo.

REM Ask about installing dependencies
set /p install="Install/update dependencies? (y/n): "
if /i "%install%"=="y" (
    echo.
    echo [*] Installing frontend dependencies...
    call npm install
    
    echo.
    echo [*] Installing backend dependencies...
    cd server
    call npm install
    cd ..
)

echo.
echo ====================================
echo.
echo [!] Starting application...
echo.
echo In two separate Command Prompts, run:
echo.
echo Command Prompt 1 (Frontend):
echo   npm run dev
echo.
echo Command Prompt 2 (Backend):
echo   cd server
echo   npm run dev
echo.
echo Once both are running, open:
echo   http://localhost:5173
echo.
pause
