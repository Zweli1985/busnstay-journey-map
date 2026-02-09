# XM Global Trading System - Setup Guide

## 📋 System Requirements

- **Python**: 3.8 or higher
- **OS**: Windows, macOS, or Linux
- **Memory**: 512MB minimum
- **Disk Space**: 500MB for dependencies
- **XM Global Account**: Demo account (free)

## 🚀 Installation

### Option 1: Quick Start (Recommended)

**Windows:**
```bash
run.bat
```

**macOS/Linux:**
```bash
chmod +x run.sh
./run.sh
```

### Option 2: Manual Setup

1. **Clone or extract the project**
```bash
cd xm_trading_system
```

2. **Create virtual environment**
```bash
python -m venv venv
```

3. **Activate virtual environment**

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Configure XM Global account**
```bash
cp .env.example .env
# Edit .env with your credentials
```

6. **Test the system**
```bash
python test_system.py
```

## 🔧 Configuration

### Create XM Global Demo Account

1. Go to [XM Global Sign Up](https://www.xm-global.com/en/register)
2. Complete the registration form
3. Create a demo account (1 account = 1 year free)
4. Receive login credentials via email

### Setup .env File

Copy `.env.example` to `.env`:
```
XM_LOGIN=1234567          # Your demo account number
XM_PASSWORD=password      # Your demo password  
XM_SERVER=demo.trader.xm.com  # Do not change
TRADING_MODE=paper        # paper (demo) or live
RISK_PER_TRADE=2         # Percentage per trade
```

### Customize Settings

Edit `config/settings.yaml`:

```yaml
# Change trading symbols
trading:
  symbols:
    gold:
      - "GOLD"
      - "XAUUSD"
    forex:
      - "EURUSD"
      - "GBPUSD"
    crypto:
      - "BTCUSD"

# Adjust risk per trade
trading:
  position_size_percent: 2  # 1% conservative, 3% aggressive

# Volatility settings
risk_management:
  stop_loss:
    atr_multiplier: 1.5   # 1.0=tight, 2.0=wide

# Profitability filters
profitability:
  min_win_rate: 50        # Minimum 50% wins
  max_consecutive_losses: 3  # Stop after 3 losses
```

## ▶️ Running the System

### Start Trading

**Quick:**
```bash
python main.py
```

**With virtual environment:**
```bash
# Activate first
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Then run
python main.py
```

### Stop Trading

Press `Ctrl+C` - system will:
- Close all open positions
- Save session statistics
- Exit gracefully

## 📊 Monitoring

### Console Output
- Real-time trade executions
- Position openings/closings
- Warning messages

### Log Files
- **Location**: `logs/trading.log`
- **Content**: Detailed trade history
- **Rotation**: Auto-rotates at 10MB

### Session Statistics (Every 5 minutes)
```
================================================================================
SESSION STATISTICS
================================================================================
Account Balance: $10045.23
Open Positions: 2
24h Trading: 12 trades, 8 wins, 4 losses
24h Performance: 66.7% win rate, $45.23 profit, $3.77 avg per trade
================================================================================
```

## 🔍 Testing

Verify the system is working:

```bash
python test_system.py
```

Expected output:
```
============================================================
TEST SUMMARY: 5/5 tests passed
============================================================

✓ All systems ready! You can start trading with: python main.py
```

## 🛠️ Troubleshooting

### "ModuleNotFoundError: No module named 'requests'"
```bash
pip install -r requirements.txt
```

### "Connection failed"
- Check internet connection
- Verify XM credentials in `.env`
- Verify account is active on XM Global

### "Configuration file not found"
- Ensure `config/settings.yaml` exists
- Run from project root directory

### "Permission denied on run.sh"
```bash
chmod +x run.sh
./run.sh
```

## 📈 Upgrading

To get the latest code updates:

```bash
git pull origin main
pip install -r requirements.txt --upgrade
```

## 🔐 Security Notes

- Never commit `.env` file with real credentials
- Use demo account first
- Keep `requirements.txt` updated
- Review logs regularly
- Start with small position sizes

## 📚 Documentation

- **README.md**: Full feature documentation
- **QUICKSTART.md**: Quick start guide
- **config/settings.yaml**: All configuration options
- **logs/trading.log**: Detailed trading history

## 💡 Tips

1. **Start with Demo**: Don't use live money immediately
2. **Test First**: Run `test_system.py` to verify setup
3. **Read Logs**: Check `logs/trading.log` for detailed info
4. **Start Conservative**: Use low risk per trade
5. **Monitor Performance**: Review statistics daily

## 🆘 Getting Help

1. Check logs for error messages
2. Review configuration settings
3. Run test suite again
4. Check XM Global's trading hours

## 📝 Version Info

- **Version**: 1.0.0
- **Last Updated**: February 8, 2026
- **Python**: 3.8+
- **Platform**: Windows, macOS, Linux

---

You're ready! Run the system and start monitoring trades. Good luck! 📈
