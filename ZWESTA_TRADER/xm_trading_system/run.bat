@echo off
REM XM Global Trading System - Quick Start Script
REM Windows Batch Script

echo.
echo ========================================
echo XM Global Trading System
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from python.org
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo Creating .env from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit .env with your XM Global credentials:
    echo   - XM_LOGIN: Your demo account number
    echo   - XM_PASSWORD: Your demo password
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

REM Check if venv is activated, if not try to activate it
if not defined VIRTUAL_ENV (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
    if errorlevel 1 (
        echo Creating virtual environment...
        python -m venv venv
        call venv\Scripts\activate.bat
    )
)

echo Installing dependencies...
pip install -q -r requirements.txt

echo.
echo ========================================
echo SYSTEM CHECK
echo ========================================
python test_system.py

if errorlevel 1 (
    echo.
    echo ERROR: System check failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo STARTING TRADING SYSTEM
echo ========================================
echo.
echo Press Ctrl+C to stop trading and close all positions
echo.

python main.py

pause
