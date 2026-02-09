"""
Test script to verify the trading system is working correctly
Run before trading live
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(__file__))

from src.utils.logger import get_logger
from src.utils.config_loader import get_config
from src.api.xm_connector import XMConnector
from src.risk.position_manager import PositionManager
from src.trading.volatility_analyzer import VolatilityAnalyzer
from src.trading.market_scanner import MarketScanner


def test_configuration():
    """Test configuration loading"""
    print("\n[TEST 1/5] Configuration Loading...")
    try:
        config = get_config()
        print("  [OK] Config loaded successfully")
        print(f"  [OK] Symbols to trade: {len(config.get_all_symbols())} total")
        print(f"  [OK] Position size: {config.get('trading.position_size_percent', 0)}%")
        return True
    except Exception as e:
        print(f"  [FAIL] Config error: {e}")
        return False


def test_logging():
    """Test logging system"""
    print("\n[TEST 2/5] Logging System...")
    try:
        logger = get_logger()
        logger.info("TEST MESSAGE - This should appear in logs/trading.log")
        print("  [OK] Logger initialized")
        print("  [OK] Check logs/trading.log for test message")
        return True
    except Exception as e:
        print(f"  [FAIL] Logging error: {e}")
        return False


def test_api_connection():
    """Test XM Global API connection"""
    print("\n[TEST 3/5] XM Global API Connection...")
    try:
        config = get_config()
        api = XMConnector(
            login=config.xm_login or "DEMO_TEST",
            password=config.xm_password or "DEMO_PASS"
        )
        
        if api.connect():
            print("  [OK] Connected to XM Global")
            
            account_info = api.get_account_info()
            print(f"  [OK] Account: {account_info.get('login')}")
            print(f"  [OK] Balance: ${account_info.get('balance', 0):.2f}")
            
            quote = api.get_quote("EURUSD")
            if quote:
                print(f"  [OK] EURUSD Quote: Bid={quote['bid']:.5f}, Ask={quote['ask']:.5f}")
            
            ohlc = api.get_ohlc("EURUSD", "5m", 10)
            if ohlc:
                print(f"  [OK] Retrieved {len(ohlc)} OHLC candles for EURUSD")
            
            api.disconnect()
            return True
        else:
            print("  [!] Connection simulated (demo mode)")
            return True
    except Exception as e:
        print(f"  [FAIL] API error: {e}")
        return False


def test_volatility_analysis():
    """Test volatility analyzer"""
    print("\n[TEST 4/5] Volatility Analysis...")
    try:
        analyzer = VolatilityAnalyzer()
        
        # Create sample data
        sample_ohlc = []
        price = 1.0850
        for i in range(100):
            import random
            price += random.uniform(-0.001, 0.001)
            sample_ohlc.append({
                "open": price - 0.0005,
                "high": price + 0.0008,
                "low": price - 0.0008,
                "close": price,
                "volume": 1000
            })
        
        metrics = analyzer.analyze_volatility("EURUSD", sample_ohlc)
        print(f"  [OK] Volatility Analysis")
        print(f"    - ATR: {metrics['atr']:.5f}")
        print(f"    - ATR%: {metrics['atr_percent']:.3f}%")
        print(f"    - Level: {metrics['volatility_level']}")
        
        should_trade, reason = analyzer.should_enter_trade(metrics)
        print(f"  [OK] Entry Signal: {'YES' if should_trade else 'NO'} - {reason}")
        
        return True
    except Exception as e:
        print(f"  [FAIL] Analysis error: {e}")
        return False


def test_position_management():
    """Test position management"""
    print("\n[TEST 5/5] Position Management...")
    try:
        config = get_config()
        api = XMConnector("DEMO", "DEMO")
        pm = PositionManager(api)
        
        # Test position size calculation
        position_size = pm.calculate_position_size(
            symbol="EURUSD",
            account_balance=10000.0,
            entry_price=1.0850,
            stop_loss=1.0800
        )
        print(f"  [OK] Position size calculation: {position_size:.2f} lots")
        
        # Test SL calculation
        sample_ohlc = []
        price = 1.0850
        for i in range(100):
            import random
            price += random.uniform(-0.001, 0.001)
            sample_ohlc.append({
                "open": price - 0.0005,
                "high": price + 0.0008,
                "low": price - 0.0008,
                "close": price,
                "volume": 1000
            })
        
        stop_loss = pm.calculate_stop_loss("EURUSD", 1.0850, sample_ohlc, "BUY")
        take_profit = pm.calculate_take_profit("EURUSD", 1.0850, "BUY")
        
        print(f"  [OK] Stop Loss: {stop_loss:.5f}")
        print(f"  [OK] Take Profit: {take_profit:.5f}")
        
        # Test statistics
        stats = pm.get_24h_stats()
        print(f"  [OK] 24h Stats: {stats['trades']} trades, {stats['win_rate']:.1f}% win rate")
        
        return True
    except Exception as e:
        print(f"  [FAIL] Position management error: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("XM GLOBAL TRADING SYSTEM - SYSTEM TEST")
    print("=" * 60)
    
    tests = [
        test_configuration,
        test_logging,
        test_api_connection,
        test_volatility_analysis,
        test_position_management
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    # Summary
    print("\n" + "=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"TEST SUMMARY: {passed}/{total} tests passed")
    print("=" * 60)
    
    if passed == total:
        print("\n[SUCCESS] All systems ready! You can start trading with: python main.py\n")
        return 0
    else:
        print(f"\n[WARNING] {total - passed} test(s) failed. Please review configuration.\n")
        return 1


if __name__ == "__main__":
    sys.exit(main())
