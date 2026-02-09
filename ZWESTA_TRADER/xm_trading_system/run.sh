#!/bin/bash
# XM Global Trading System - Quick Start Script
# Linux/Mac Script

echo ""
echo "========================================"
echo "XM Global Trading System"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from python.org"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Edit .env with your XM Global credentials:"
    echo "  - XM_LOGIN: Your demo account number"
    echo "  - XM_PASSWORD: Your demo password"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Activate virtual environment or create it
if [ ! -d venv ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing dependencies..."
pip install -q -r requirements.txt

echo ""
echo "========================================"
echo "SYSTEM CHECK"
echo "========================================"
python3 test_system.py

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: System check failed"
    exit 1
fi

echo ""
echo "========================================"
echo "STARTING TRADING SYSTEM"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop trading and close all positions"
echo ""

python3 main.py
