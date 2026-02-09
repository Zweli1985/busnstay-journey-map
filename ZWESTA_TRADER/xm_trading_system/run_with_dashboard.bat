@echo off
REM XM Trading System - Complete Launcher
REM Runs both the trading bot and web dashboard simultaneously

echo.
echo =========================================
echo  XM TRADING SYSTEM - LAUNCHER
echo =========================================
echo.

REM Install dependencies if needed
echo Step 1: Checking dependencies...
pip install -q flask flask-cors 2>nul

REM Start dashboard in a new window
echo Step 2: Starting Web Dashboard...
start "XM Trading Dashboard" cmd /k python dashboard.py

REM Wait a moment for dashboard to start
timeout /t 2 /nobreak

REM Start main trading system
echo Step 3: Starting Trading Bot...
echo.
echo =========================================
echo  Trading system started!
echo  Dashboard: http://localhost:5000
echo =========================================
echo.

python main.py

pause
