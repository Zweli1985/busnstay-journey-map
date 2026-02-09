"""
Diagnostic tool to test if trades will execute
Run this to verify all trade conditions are met
"""

import sys
from src.utils.config_loader import get_config
from src.utils.logger import get_logger
from src.api.xm_connector import XMConnector
from src.risk.position_manager import PositionManager
from src.trading.profitability_filter import ProfitabilityFilter
from src.trading.volatility_analyzer import VolatilityAnalyzer
from src.trading.trade_executor import TradeExecutor

logger = get_logger()
config = get_config()

def main():
    print("\n" + "="*80)
    print("XM TRADING SYSTEM - TRADE EXECUTION DIAGNOSTIC")
    print("="*80 + "\n")
    
    # 1. Check API connection
    print("1️⃣  TESTING API CONNECTION...")
    api = XMConnector(config.xm_login, config.xm_password, config.xm_server)
    if not api.connect():
        print("❌ FAILED: Cannot connect to XM API")
        return
    print("✅ PASSED: Connected to XM\n")
    
    # 2. Get account info
    print("2️⃣  CHECKING ACCOUNT INFO...")
    account_info = api.get_account_info()
    print(f"   Account: {account_info.get('login')}")
    print(f"   Balance: ${account_info.get('balance', 0):.2f}")
    print(f"   Equity: ${account_info.get('equity', 0):.2f}")
    print(f"   Open Positions: {account_info.get('open_positions', 0)}\n")
    
    # 3. Check demo mode
    print("3️⃣  CHECKING DEMO MODE...")
    demo_mode = config.get("demo_mode", False)
    print(f"   Demo Mode: {'✅ ENABLED' if demo_mode else '❌ DISABLED'}\n")
    
    # 4. Test market scan
    print("4️⃣  TESTING MARKET SCAN...")
    symbols = config.get_all_symbols()
    print(f"   Symbols to scan: {len(symbols)}")
    if not symbols:
        print("   ❌ No symbols configured!")
        return
    
    for symbol in symbols[:2]:  # Test first 2
        quote = api.get_quote(symbol)
        if quote:
            print(f"   ✅ {symbol}: {quote.get('bid', 0):.4f}")
        else:
            print(f"   ❌ {symbol}: Failed to get quote")
    print()
    
    # 5. Test profitability filter
    print("5️⃣  TESTING PROFITABILITY FILTER...")
    position_manager = PositionManager(api)
    profitability_filter = ProfitabilityFilter(position_manager)
    can_trade, reason = profitability_filter.can_trade(account_info['balance'])
    if can_trade:
        print(f"   ✅ PASSED: {reason}\n")
    else:
        print(f"   ❌ FAILED: {reason}\n")
        print("   💡 FIX: This is blocking trades. Check your 24h stats or enable DEMO_MODE=true\n")
    
    # 6. Test volatility analysis
    print("6️⃣  TESTING VOLATILITY ANALYSIS...")
    volatility_analyzer = VolatilityAnalyzer()
    test_symbol = symbols[0] if symbols else "EURUSD"
    ohlc = api.get_ohlc(test_symbol, "5m", 100)
    if ohlc:
        metrics = volatility_analyzer.analyze_volatility(test_symbol, ohlc)
        should_enter, vol_reason = volatility_analyzer.should_enter_trade(metrics)
        if should_enter:
            print(f"   ✅ {test_symbol}: {vol_reason}\n")
        else:
            print(f"   ❌ {test_symbol}: {vol_reason}\n")
            print("   💡 FIX: Volatility filter is blocking. Enable DEMO_MODE=true\n")
    else:
        print(f"   ❌ Failed to get OHLC data for {test_symbol}\n")
    
    # 7. Summary
    print("="*80)
    if demo_mode:
        print("✅ DEMO MODE ENABLED - TRADES SHOULD EXECUTE")
        print("   Relaxed filters active for testing")
    else:
        print("⚠️  DEMO MODE DISABLED - STRICT FILTERS ACTIVE")
        print("   If no trades are executing:")
        print("   1. Add 'DEMO_MODE=true' to .env")
        print("   2. Restart the system")
        print("   3. Run this diagnostic again")
    print("="*80 + "\n")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Diagnostic error: {e}\n")
        import traceback
        traceback.print_exc()
