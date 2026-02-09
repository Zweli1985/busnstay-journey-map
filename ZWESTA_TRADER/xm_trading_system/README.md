# XM Global Automated Trading System

Professional automated trading bot for XM Global with volatility-based scalping, risk management, and profitability controls.

## Features

### 🎯 Trading Strategy
- **Volatility-Based Entry**: Uses ATR (Average True Range) for volatility-aware position sizing
- **Scalping**: Fast entry and exit targeting 1% profit per trade
- **Multiple Assets**: Gold (XAUUSD), Forex (EURUSD, GBPUSD, USDJPY, USDCAD), Crypto (BTCUSD, ETHUSD)

### 🛡️ Risk Management
- **Dynamic Stop Loss**: Based on volatility (1.5x ATR)
- **Automatic Take Profit**: Scalping targets at 1% profit
- **Position Sizing**: 2% risk per trade with automatic lot calculation
- **Max Consecutive Losses**: Stops trading after 3 losses
- **Maximum Positions**: Limits to 5 concurrent trades

### 💰 Profitability Filters
- **24-Hour Profitability Check**: Only trades if conditions are met
- **Win Rate Monitoring**: Minimum 50% win rate requirement
- **Equity Protection**: Tracks daily profit/loss
- **Slippage Control**: Max 2 pips slippage tolerance

### 📊 Advanced Features
- **Market Scanner**: Monitors multiple symbols simultaneously
- **Volatility Analysis**: Bollinger Bands, ATR, volatility trends
- **Trade Tracking**: Detailed position management and history
- **Session Statistics**: 24-hour performance metrics
- **Comprehensive Logging**: File and console logging with rotation

## Project Structure

```
xm_trading_system/
├── main.py                 # Main application entry point
├── requirements.txt        # Python dependencies
├── config/
│   └── settings.yaml       # Trading configuration
├── .env.example            # Environment variables template
├── src/
│   ├── __init__.py
│   ├── utils/
│   │   ├── logger.py       # Logging configuration
│   │   └── config_loader.py # Configuration management
│   ├── api/
│   │   └── xm_connector.py # XM Global API integration
│   ├── risk/
│   │   └── position_manager.py # Position and risk management
│   └── trading/
│       ├── profitability_filter.py # 24h profitability rules
│       ├── volatility_analyzer.py  # Volatility-based analysis
│       ├── trade_executor.py       # Trade execution engine
│       └── market_scanner.py       # Multi-symbol market scanner
└── logs/
    └── trading.log       # Trading logs
```

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your XM Global credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```
XM_LOGIN=your_demo_account_number
XM_PASSWORD=your_demo_password
XM_SERVER=demo.trader.xm.com
TRADING_MODE=paper
```

### 3. Configure Trading Settings
Edit `config/settings.yaml` to customize:
- Trading symbols
- Position size and risk per trade
- Stop loss and take profit levels
- Profitability thresholds
- Trading hours and session filters

## Running the Bot

### Start Trading
```bash
python main.py
```

### Expected Output
```
================================================================================
XM GLOBAL TRADING SYSTEM - INITIALIZING
================================================================================
Account: [YOUR_ACCOUNT] | Balance: $10000.00 | Currency: USD
Trading Mode: paper
Symbols: [GOLD, XAUUSD, EURUSD, GBPUSD, USDJPY, USDCAD, BTCUSD, ETHUSD]
...
================================================================================
System initialized successfully
================================================================================
Starting trading loop...
```

## Key Components

### API Connector (src/api/xm_connector.py)
- Authenticates with XM Global
- Fetches market quotes and OHLC data
- Executes and manages trades
- Rate-limited requests with retry logic

### Position Manager (src/risk/position_manager.py)
- Calculates position sizing using risk management rules
- Computes volatility-based stop losses
- Tracks open positions and trade history
- Calculates 24-hour trading statistics

### Volatility Analyzer (src/trading/volatility_analyzer.py)
- Calculates ATR (Average True Range)
- Analyzes Bollinger Bands
- Determines volatility levels (VERY_LOW, LOW, NORMAL, HIGH, EXTREME)
- Provides entry/exit signals based on volatility

### Trade Executor (src/trading/trade_executor.py)
- Validates profitability conditions
- Executes trades with full risk management
- Monitors positions for TP/SL hits
- Manages trade lifecycle

### Profitability Filter (src/trading/profitability_filter.py)
- Checks 24-hour profit/loss requirements
- Enforces minimum win rate (50%)
- Limits consecutive losses (max 3)
- Blocks trading during unfavorable conditions

## Trading Rules

### Trade Entry
1. ✓ Account passed 24-hour profitability check
2. ✓ Position limit not exceeded (< 5 open trades)
3. ✓ Volatility is in suitable range (not too high, not too low)
4. ✓ Risk/Reward ratio ≥ 1.0
5. ✓ Position size calculated with 2% risk per trade

### Stop Loss
- Dynamic based on 1.5x ATR
- Maximum 2% loss per trade
- Automatically manages trailing stops

### Take Profit
- Scalping target: 1% profit
- Auto-closes at target for quick profits
- Breakeven offset: 0.3% (moves SL to breakeven)

### Position Management
- Max 5 concurrent positions
- Closes at TP or SL automatically
- Tracks all trades for statistics

## Configuration Examples

### Aggressive Scalping
```yaml
trading:
  position_size_percent: 3
  
risk_management:
  stop_loss:
    atr_multiplier: 1.0
  take_profit:
    target_profit_percent: 0.5
```

### Conservative Trading
```yaml
trading:
  position_size_percent: 1
  max_positions: 3
  
risk_management:
  stop_loss:
    atr_multiplier: 2.0
  take_profit:
    target_profit_percent: 2.0
    
profitability:
  min_win_rate: 55
  max_consecutive_losses: 2
```

## Monitoring & Logging

### Log Levels
- **ERROR**: Critical issues requiring attention
- **WARNING**: Trade blocked or risky conditions
- **INFO**: Trade executions and important events
- **DEBUG**: Detailed analysis and calculations

### Log File
- Location: `logs/trading.log`
- Rotation: 10MB max, keeps 5 backups
- Auto-archival of logs > 30 days old

## Safety Features

1. **Demo Account Default**: Initially configured for demo trading
2. **Trade Review**: All trades logged with entry/exit details
3. **Risk Controls**: Automatic position limits and profit checks
4. **Graceful Shutdown**: Closes all positions on exit
5. **Signal Handlers**: Responds to Ctrl+C for clean shutdown

## Next Steps

1. **Test with Demo Account**: Verify all features work correctly
2. **Optimize Parameters**: Adjust based on your preferred strategy
3. **Live Testing**: Migrate to live trading when confident
4. **Monitor Performance**: Review logs and statistics regularly

## Troubleshooting

### "Connection failed"
- Verify XM_LOGIN and XM_PASSWORD in `.env`
- Check internet connection
- Ensure account is active on XM Global

### "Insufficient data for volatility analysis"
- System needs at least 20 candles for analysis
- Wait for more data to accumulate

### "24h profitability check failed"
- Recent trades had < 50% win rate
- Too many consecutive losses (> 3)
- Allow time for recovery before resuming

## Support & Contributions

For issues, feature requests, or contributions, please contact the development team.

## License

This system is provided as-is for educational and trading purposes on XM Global platform.

---

**Disclaimer**: Trading and investment involve substantial risk of loss. Past performance does not guarantee future results. This system is for educational purposes and should be thoroughly tested before live trading.
