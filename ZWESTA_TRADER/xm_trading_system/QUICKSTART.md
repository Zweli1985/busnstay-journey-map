# Quick Start Guide - XM Global Trading System

## 1. Initial Setup (5 minutes)

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Configure XM Global Credentials
Create `.env` file from template:
```bash
cp .env.example .env
```

Edit `.env` with your XM Global demo account:
```
XM_LOGIN=1234567
XM_PASSWORD=your_password
XM_SERVER=demo.trader.xm.com
TRADING_MODE=paper
```

**Where to find these:**
- Login to [XM Global Trading Platform](https://www.xm-global.com)
- Navigate to Account Settings
- For Demo: Use demo account number and password
- Server: Default is `demo.trader.xm.com` (no change needed)

## 2. Configuration (Optional)

Edit `config/settings.yaml` to customize trading behavior:

### Adjust Risk per Trade
```yaml
trading:
  position_size_percent: 2  # Change to 1 for conservative, 3 for aggressive
```

### Change Trading Symbols
```yaml
trading:
  symbols:
    gold:
      - "GOLD"
      - "XAUUSD"
    forex:
      - "EURUSD"  # Add/remove symbols here
    crypto:
      - "BTCUSD"
```

### Modify Stop Loss Settings
```yaml
risk_management:
  stop_loss:
    atr_multiplier: 1.5  # Lower = tighter stops, Higher = wider stops
```

### Adjust Profitability Filters
```yaml
profitability:
  min_win_rate: 50  # Only trade if 50%+ of last trades were winners
  max_consecutive_losses: 3  # Stop after 3 losses in a row
```

## 3. Running the Bot

### Start Trading
```bash
python main.py
```

### Expected First-Time Output
```
================================================================================
XM GLOBAL TRADING SYSTEM - INITIALIZING
================================================================================
Account: 1234567 | Balance: $10000.00 | Currency: USD
Trading Mode: paper
Symbols: [GOLD, XAUUSD, EURUSD, GBPUSD, USDJPY, USDCAD, BTCUSD, ETHUSD]
Max Positions: 5
Position Size: 2% per trade
Volatility-based SL: 1.5x ATR
Scalping Target: 1.0%
24h Profitability Check: True
Min Win Rate: 50%
================================================================================
System initialized successfully
================================================================================
Starting trading loop...

[Cycle #1] Time: 2025-02-08 10:30:45 | Open Positions: 0 | Balance: $10000.00
[Cycle #2] Time: 2025-02-08 10:30:50 | Open Positions: 0 | Balance: $10000.00
```

### Monitor in Real-Time
- Check `logs/trading.log` for detailed activity
- System prints positions opened/closed to console
- Every 5 minutes: Full session statistics

## 4. Understanding the Logs

### When a Trade Opens (✓)
```
✓ TRADE EXECUTED #1707392851234: BUY 0.5 EURUSD @ 1.08500 | SL: 1.08200 | TP: 1.09500 | RR: 1.33 | NORMAL
```
- Ticket number: for tracking
- Direction & symbol: what's being traded
- Entry price: where you entered
- SL/TP: stop loss and take profit
- RR: reward-to-risk ratio (should be ≥ 1.0)
- Volatility level: condition of entry

### When a Trade Closes (✓)
```
✓ POSITION CLOSED #1707392851234: EURUSD @ 1.09500 | Reason: TAKE_PROFIT | Profit: $45.50
```
- Closed at take profit or stop loss
- Profit/loss amount shown

### When Trading is Blocked (⚠)
```
WARNING - Trading blocked: Win rate 40.0% below minimum 50%
```
- Recent trades haven't met profitability threshold
- System automatically pauses until conditions improve

## 5. Daily Workflow

### Morning (Market Open)
```bash
python main.py
```
System starts automatically monitoring

### Monitor
- Keep an eye on the terminal for trade activity
- Check logs/trading.log for detailed history
- Session statistics printed every 5 minutes

### Evening (Before Sleep)
- Ctrl+C to shut down bot
- All open positions automatically closed
- Final statistics logged

## 6. Reviewing Performance

### Check Today's Stats
```
================================================================================
SESSION STATISTICS
================================================================================
Account Balance: $10045.23
Open Positions: 0
24h Trading: 12 trades, 8 wins, 4 losses
24h Performance: 66.7% win rate, $45.23 profit, $3.77 avg per trade
```

### Review Trade History
Open `logs/trading.log` and search for:
- `TRADE EXECUTED` - all entries
- `POSITION CLOSED` - all exits
- `WARNING` - blocked trades

## 7. Common Adjustments

### "System blocked trading for 2 hours"
**Problem**: Win rate dropped below 50%
**Solution**: 
1. Check recent trades in logs
2. Lower `atr_multiplier` for tighter stops
3. Increase `target_profit_percent` for bigger target
4. Add more symbols to diversify

### "No trades executed all day"
**Problem**: Market conditions not favorable or profitability filter blocking
**Solution**:
1. Check volatility analysis in logs
2. Verify trading hours (Asia/London/NY sessions)
3. Confirm XM account has sufficient margin

### "Too many losing trades"
**Problem**: Strategy needs adjustment
**Solution**:
1. Increase `atr_multiplier` (better stops)
2. Lower `position_size_percent` (less risk)
3. Increase `target_profit_percent` (easier targets)

## 8. Safety Checklist

- [ ] Using DEMO account (not live money)
- [ ] XM login is correct
- [ ] Risk per trade ≤ 2%
- [ ] Max positions ≤ 5
- [ ] Windows firewall allows Python
- [ ] Backup of config files made

## 9. Transitioning to Live (When Ready)

1. **Paper Trade for 2 Weeks First**
   - Verify all signals match your expectations
   - Check that profitability filters work

2. **Start with Micro Account**
   - Smallest position sizes
   - Real money, but minimal risk

3. **Update .env for Live**
   ```
   TRADING_MODE=live
   XM_SERVER=live.trader.xm.com
   ```

4. **Start Small**
   ```yaml
   trading:
     position_size_percent: 0.5  # Start with 0.5%
   ```

## 10. Getting Help

### Common Issues

**"Connection failed: Connection timeout"**
- Check internet connection
- Verify XM server is accessible
- Check firewall settings

**"Configuration file not found"**
- Ensure `config/settings.yaml` exists
- Run from project root directory

**"Module not found: requests"**
- Re-run: `pip install -r requirements.txt`

**"Invalid credentials"**
- Double-check .env file
- Verify demo account is active on XM

### Logs for Debugging
All system messages go to:
- **Console**: Real-time updates
- **logs/trading.log**: Permanent record
- Search for `ERROR` or `WARNING` for issues

## 11. Next Steps

1. ✓ Run demo for 1 week
2. ✓ Analyze trading statistics
3. ✓ Optimize parameters based on results
4. ✓ Consider custom strategies (see `example_strategies.py`)
5. ✓ Move to micro account when confident
6. ✓ Scale up gradually

---

**Pro Tips**:
- Start with fewer symbols to master one first
- Don't change settings every day, give them time to work
- Review trade history weekly
- Keep detailed notes on what works

Happy Trading! 📈
