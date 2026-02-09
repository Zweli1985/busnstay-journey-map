# XM Trading System - Troubleshooting Guide

## Issue: Duplicate Log Messages

**Symptom:** Every log message appears 7 times in the console.

**Cause:** The logger was adding multiple handlers each time `get_logger()` was called. With 7 modules initializing loggers, this resulted in 7x duplication.

**Solution:** ✅ **FIXED** - Modified logger to check if handlers already exist before adding new ones.

---

## Issue: MetaTrader5 Terminal Authorization Failed

**Error Message:**
```
ERROR: MetaTrader5 Terminal Authorization Failed
This typically means:
  1. MetaTrader5 terminal is NOT installed on this system
  2. MetaTrader5 terminal is not running
  3. You need to install MetaTrader5 from your broker (XM Global)
```

### Root Cause
The trading system requires the **MetaTrader5 Terminal** to be installed and running. This is a platform requirement, not a code issue.

### Solution: Installation Steps

#### Step 1: Install MetaTrader5
1. Go to **XM Global website**: https://www.xm.com/
2. Download MetaTrader5 for your platform (Windows/Mac/Linux)
3. Follow the installation wizard
4. Complete initial setup with your XM Global account

#### Step 2: Verify Installation
- MetaTrader5 should appear in your system applications
- Launch it at least once to verify it works
- You should see the terminal opening with market data

#### Step 3: Get Your Account Credentials
1. Open MetaTrader5 Terminal
2. You should see your login credentials somewhere in the interface
3. Note down:
   - **Account Number** (e.g., 168073503)
   - **Password** for the account
   - **Server** name (e.g., XMGlobal-MT5 10)

#### Step 4: Configure .env File
1. Edit the `.env` file in the project root
2. Fill in your actual credentials:
   ```
   XM_LOGIN=your_account_number
   XM_PASSWORD=your_password
   XM_SERVER=XMGlobal-MT5_10_OR_2
   ```
3. Save the file

#### Step 5: Run the System
```bash
python main.py
```

### If Still Getting Authorization Failed:
1. **Ensure MetaTrader5 is running** - The terminal must be open/running
2. **Check credentials** - Verify login, password, and server name are correct
3. **Check account status** - Ensure your account isn't locked or suspended with XM Global
4. **Try MT5 terminal directly** - Login to MT5 manually to verify credentials work
5. **Check firewall/network** - Ensure MT5 can connect to XM Global servers

---

## Issue: Missing .env File

**Symptom:** 
```
ERROR: MT5 credentials not configured!
Please create a .env file with the following variables:
  XM_LOGIN=your_account_number
  XM_PASSWORD=your_password
  XM_SERVER=XMGlobal-MT5 2
```

**Solution:**
1. Copy `.env.example` to `.env`
2. Edit `.env` with your real credentials
3. Re-run the system

---

## Issue: Module Import Errors

**Error:** `ModuleNotFoundError: No module named 'MetaTrader5'`

**Solution:**
```bash
pip install MetaTrader5
```

Or reinstall all dependencies:
```bash
pip install -r requirements.txt
```

---

## Issue: Permission Errors on Windows

**Symptom:** Access denied errors when accessing files or logs

**Solution:**
1. Run Python/terminal as Administrator
2. Or check file permissions in `logs/` directory

---

## Issue: Port Already in Use (Dashboard)

**Error:** `Address already in use: ('127.0.0.1', 5000)`

**Solution:**
```bash
# Kill the process using port 5000
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use a different port:
python dashboard.py --port 5001
```

---

## Testing Without MetaTrader5 (Demo/Backtest)

If you don't have MetaTrader5 installed, you can still test the system using the demo mode:

```bash
# Run the demo/test mode
python test_system.py
```

This uses simulated market data for backtesting.

---

## Quick Diagnostics Checklist

- [ ] MetaTrader5 terminal is installed
- [ ] MetaTrader5 terminal is running/open
- [ ] `.env` file exists with correct credentials
- [ ] Account login and password are correct
- [ ] Server name matches your account (demo vs live)
- [ ] Network connectivity is working
- [ ] Account is active and not locked/suspended

---

## Getting Help

1. Check the log files in `logs/` directory for detailed error messages
2. Review the `xm_connector.py` for connection debugging
3. Test MT5 connection manually in the terminal first
4. Consult XM Global support if account-related issues persist
