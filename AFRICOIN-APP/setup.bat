@echo off
setlocal enabledelayedexpansion

cls
color 0A
title Africoin App - Installation & Setup

echo.
echo ========================================
echo   AFRICOIN APP - SETUP & LAUNCHER
echo ========================================
echo.

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js not found!
    echo Please download from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js: 
node --version

echo [OK] npm: 
npm --version

cd /d "%~dp0"

echo.
echo Current directory: %cd%
echo.

REM Clean install
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json del package-lock.json

echo.
echo Installing dependencies... This may take 2-5 minutes.
echo.

npm install --legacy-peer-deps --verbose

if !errorlevel! neq 0 (
    color 0C
    echo.
    echo [ERROR] npm install failed
    echo Exit code: !errorlevel!
    pause
    exit /b 1
)

color 0A
echo.
echo [OK] Dependencies installed successfully!
echo.

echo Starting development server...
echo Open your browser to: http://localhost:5173
echo.
echo Press Ctrl+C in this window to stop the server
echo.

npm run dev

pause

