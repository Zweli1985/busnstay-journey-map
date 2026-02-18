@echo off
echo ========================================
echo AFRICOIN App - Development Server Setup
echo ========================================
echo.

cd /d %~dp0

echo [1/3] Cleaning old installation...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
echo Done.
echo.

echo [2/3] Installing dependencies...
call npm install --legacy-peer-deps
if errorlevel 1 (
  echo ERROR: npm install failed
  pause
  exit /b 1
)
echo Done.
echo.

echo [3/3] Starting development server...
echo.
echo ========================================
echo Open browser: http://localhost:5173/
echo Press Ctrl+C to stop server
echo ========================================
echo.

call npm run dev

pause
