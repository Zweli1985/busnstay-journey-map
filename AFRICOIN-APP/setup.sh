#!/bin/bash

# Africoin App Installation and Setup Script for Unix/Mac

echo ""
echo "=========================================="
echo "  AFRICOIN APP SETUP & RUN"
echo "=========================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[OK] Node.js detected:"
node --version

# Navigate to script directory
cd "$(dirname "$0")"

echo ""
echo "[Step 1] Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "[INFO] node_modules not found, installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[WARNING] Standard install failed, trying legacy-peer-deps..."
        npm install --legacy-peer-deps
    fi
else
    echo "[OK] Dependencies already installed"
fi

echo ""
echo "[Step 2] Starting development server..."
echo "[INFO] Opening http://localhost:5173"
echo ""
npm run dev
