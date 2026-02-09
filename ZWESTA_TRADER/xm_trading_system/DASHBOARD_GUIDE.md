# 🎨 XM Trading System - Dashboard User Guide

## Overview
The XM Trading System now includes a **beautiful, real-time web dashboard** to monitor your automated trading bot. No more terminal logs – everything is displayed visually!

## 🚀 Quick Start

### Option 1: Automated Launch (Recommended)
Simply double-click:
```
run_with_dashboard.bat
```

This will:
1. ✅ Install required dependencies
2. ✅ Start the Web Dashboard
3. ✅ Start the Trading Bot

### Option 2: Manual Launch

**Terminal 1 - Start Dashboard:**
```bash
pip install flask flask-cors
python dashboard.py
```

**Terminal 2 - Start Trading Bot:**
```bash
python main.py
```

### Option 3: PowerShell Launch
```powershell
# Install dependencies
pip install flask flask-cors

# Run dashboard in background
Start-Process python -ArgumentList "dashboard.py"

# Run trading system
python main.py
```

---

## 📊 Dashboard Features

### 1. **Live Account Stats**
   - 💰 **Balance** – Your account balance
   - 📈 **Equity** – Current equity (balance + open P&L)
   - 💹 **Profit/Loss** – Total P&L with percentage
   - 📊 **Open Positions** – Number of active trades

### 2. **Trading Statistics**
   - 🎯 **Total Trades** – All-time trades executed
   - ✅ **Winning Trades** – Trades with profit
   - ❌ **Losing Trades** – Trades with losses
   - 💵 **Total Profit** – Total P&L and average per trade

### 3. **Real-Time Charts**
   - 📊 **P&L Trend** – Line chart showing cumulative profit/loss over time
   - 🥧 **Win Rate** – Pie chart showing win/loss ratio

### 4. **Open Positions**
   - Symbol name and type (BUY/SELL)
   - Entry price and current price
   - Current profit/loss with percentage
   - Volume on each position

### 5. **Recent Trades**
   - Historical trades table with:
     - Entry and exit prices
     - Profit/Loss amount
     - Status (Closed/Cancelled)
     - Timestamp

### 6. **System Status**
   - Connection status (🟢 Connected / 🔴 Disconnected)
   - Account number
   - Trading mode (paper/live)
   - Last update time

---

## 🌐 Accessing the Dashboard

Once running, open your web browser and go to:
```
http://localhost:5000
```

### Supported Browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (responsive design)

---

## 🔄 Auto-Refresh

The dashboard **automatically updates every 5 seconds** with:
- Latest account information
- Open positions
- Recent trades
- Statistics and charts

No manual refresh needed!

---

## 🎨 Design Features

### Dark Theme
- 🌙 Easy on the eyes during long trading sessions
- 💚 Green/Red theme for profit/loss
- Smooth animations and transitions

### Responsive Design
- 📱 Works on mobile phones
- 💻 Full desktop experience
- Adapts to any screen size

### Real-Time Updates
- ⚡ Live data streaming every 5 seconds
- 📊 Charts update automatically
- No page refresh needed

---

## 📝 Customizing the Dashboard

### Change Update Interval
Edit `templates/index.html`, line with:
```javascript
const UPDATE_INTERVAL = 5000; // milliseconds (change to 3000 for 3 seconds)
```

### Change Dashboard Color Theme
Modify the gradient colors in `templates/index.html`:
```css
background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
```

### Add More Metrics
Edit the `dashboard.py` API endpoints and add to `index.html` template.

---

## 🛠️ Troubleshooting

### Issue: "Port 5000 already in use"
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number shown)
taskkill /PID <PID> /F
```

### Issue: Dashboard shows "Connecting..."
- Ensure `python main.py` is running in another terminal
- Check that XM credentials in `.env` are correct
- Look for errors in the main terminal window

### Issue: No trades showing
- Dashboard loads from `logs/trading_log.json`
- System needs to execute at least one trade first
- Wait 5-10 minutes for trading signals

### Issue: Charts not updating
- Check browser console (F12) for errors
- Ensure Flask server is running on port 5000
- Try refreshing the page (Ctrl+R)

---

## 📊 Understanding the Data

### Profit/Loss Colors:
- 🟢 **Green** = Profit (positive P&L)
- 🔴 **Red** = Loss (negative P&L)
- 🟠 **Orange** = Neutral/No position

### Position Colors:
- 🔵 **Blue** = BUY position
- 🔴 **Red** = SELL position

### Win Rate:
```
Win Rate = (Winning Trades / Total Trades) × 100%
```

---

## 🔐 Security Notes

- ⚠️ Dashboard runs on `localhost` only (your machine)
- 🔒 Not accessible from other computers by default
- 📝 No authentication needed (local network only)

### To access from other machines:
Edit `dashboard.py`:
```python
app.run(debug=False, host='0.0.0.0', port=5000)
# Already configured this way - just access from any machine on your network
```

Then use: `http://<your-computer-ip>:5000`

---

## 📈 Best Practices

1. **Monitor Regularly** – Check dashboard every 30 minutes
2. **Review Stats** – Check win rate and average trade P&L
3. **Watch Circuit Breaker** – System stops after 3 losses
4. **Check Logs** – Review `logs/` folder for detailed information
5. **Risk Management** – Remember: max 2% per trade, max 5 positions

---

## 🚀 Advanced Features

### Enable SMS Alerts
Ensure you've added your phone number to `.env`:
```
SMS_ALERTS=+27659269311
```

### View Detailed Logs
```bash
cd logs
# View latest log file
```

### Export Trade Data
Trade data is stored in `logs/trading_log.json` - you can:
- Import to Excel
- Analyze with Python
- Share with others

---

## 📞 Support

If the dashboard isn't working:
1. ✅ Check that both `dashboard.py` and `main.py` are running
2. ✅ Verify port 5000 is not blocked by firewall
3. ✅ Check browser console (F12) for errors
4. ✅ Try `http://127.0.0.1:5000` instead of `localhost`

---

## 🎯 Next Steps

1. **Run the system** with `run_with_dashboard.bat`
2. **Open browser** to `http://localhost:5000`
3. **Monitor** your first trades in real-time
4. **Adjust settings** in `config/settings.yaml` as needed
5. **Track performance** over time with the dashboard

---

**Happy trading! 🚀📊**
