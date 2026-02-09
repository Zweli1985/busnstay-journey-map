"""
Test Trade Execution - Force a demo trade immediately
Useful for verifying that DEMO_MODE is working
"""

import sys
import time
from src.utils.config_loader import get_config
from src.utils.logger import get_logger
from src.api.xm_connector import XMConnector
from src.risk.position_manager import PositionManager
from src.trading.volatility_analyzer import VolatilityAnalyzer
from src.trading.profitability_filter import ProfitabilityFilter
from src.trading.trade_executor import TradeExecutor

logger = get_logger()
config = get_config()

def main():
    print("\n" + "="*80)
    print("XM TRADING SYSTEM - FORCE TEST TRADE")
    print("="*80 + "\n")
    
    # Check demo mode
    demo_mode = config.get("demo_mode", False)
    print(f"✓ Config Demo Mode: {demo_mode}")
    
    if not demo_mode:
        print("\n⚠️  WARNING: DEMO_MODE is NOT enabled!")
        print("Add 'DEMO_MODE=true' to .env and restart the system.\n")
        return
    
    # Connect to API
    print("Connecting to XM API...")
    api = XMConnector(config.xm_login, config.xm_password, config.xm_server)
    if not api.connect():
        print("❌ Failed to connect")
        return
    print("✓ Connected\n")
    
    # Get account info
    account_info = api.get_account_info()
    balance = account_info.get('balance', 10000)
    print(f"Account Balance: ${balance:.2f}\n")
    
    # Initialize components
    position_manager = PositionManager(api)
    volatility_analyzer = VolatilityAnalyzer()
    profitability_filter = ProfitabilityFilter(position_manager)
    trade_executor = TradeExecutor(api, position_manager, volatility_analyzer, profitability_filter)
    
    # Try to execute a test trade
    print("Attempting to execute test trade...")
    
    test_symbol = "EURUSD"
    quote = api.get_quote(test_symbol)
    ohlc = api.get_ohlc(test_symbol, "5m", 100)
    
    if not quote or not ohlc:
        print(f"❌ Failed to get market data for {test_symbol}")
        return
    
    print(f"\nMarket Data:")
    print(f"  Symbol: {test_symbol}")
    print(f"  Bid: {quote.get('bid', 0):.4f}")
    print(f"  Ask: {quote.get('ask', 0):.4f}\n")
    
    # Execute trade
    ticket = trade_executor.execute_trade(
        symbol=test_symbol,
        order_type="BUY",
        quote=quote,
        ohlc_data=ohlc,
        account_balance=balance
    )
    
    if ticket:
        print(f"✅ SUCCESS! Trade executed!")
        print(f"   Ticket: {ticket}")
        print(f"   Symbol: {test_symbol}")
        print(f"   Type: BUY")
        print(f"   Entry: {quote.get('ask', 0):.4f}\n")
        print("🎉 Trades are now executing!")
        print("   Check your dashboard at http://localhost:5000")
    else:
        print(f"❌ FAILED: Trade was not executed")
        print("\nDebugging info:")
        
        # Check filters
        can_trade, reason = profitability_filter.can_trade(balance)
        print(f"  Profitability Filter: {'✓' if can_trade else '✗'} {reason}")
        
        volatility_metrics = volatility_analyzer.analyze_volatility(test_symbol, ohlc)
        should_enter, vol_reason = volatility_analyzer.should_enter_trade(volatility_metrics)
        print(f"  Volatility Filter: {'✓' if should_enter else '✗'} {vol_reason}")
        
        if position_manager.can_open_position():
            print(f"  Position Limit: ✓ Can open positions")
        else:
            print(f"  Position Limit: ✗ Max positions reached")
    
    print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error: {e}\n")
        import traceback
        traceback.print_exc()
