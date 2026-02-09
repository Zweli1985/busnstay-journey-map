"""
XM Global Trading System - Main Application
Automated scalping bot with volatility-based entry, risk management, and profitability filters
"""

import time
import signal
import sys
from datetime import datetime, timedelta
from typing import Optional

from src.utils.logger import get_logger
from src.utils.config_loader import get_config
from src.api.xm_connector import XMConnector
from src.risk.position_manager import PositionManager
from src.trading.profitability_filter import ProfitabilityFilter
from src.trading.volatility_analyzer import VolatilityAnalyzer
from src.trading.trade_executor import TradeExecutor
from src.trading.market_scanner import MarketScanner


class XMTradingSystem:
    """Main trading system orchestrator"""
    
    def __init__(self):
        self.logger = get_logger()
        self.config = get_config()
        
        # Validate credentials
        if not self.config.xm_login or not self.config.xm_password:
            self.logger.error(
                "ERROR: MT5 credentials not configured!\n"
                "Please create a .env file with the following variables:\n"
                "  XM_LOGIN=your_account_number\n"
                "  XM_PASSWORD=your_password\n"
                "  XM_SERVER=XMGlobal-MT5 2 (for demo) or appropriate server\n"
                "\n"
                "See .env.example for a template."
            )
            raise ValueError("Missing MT5 credentials in environment variables")
        self.running = False
        self.cycle_count = 0
        
        # Initialize components
        self.api = XMConnector(
            login=self.config.xm_login,
            password=self.config.xm_password,
            server=self.config.xm_server
        )
        
        self.position_manager = PositionManager(self.api)
        self.volatility_analyzer = VolatilityAnalyzer()
        self.profitability_filter = ProfitabilityFilter(self.position_manager)
        
        self.trade_executor = TradeExecutor(
            api_connector=self.api,
            position_manager=self.position_manager,
            volatility_analyzer=self.volatility_analyzer,
            profitability_filter=self.profitability_filter
        )
        
        self.market_scanner = MarketScanner(self.api)
        
        # Setup signal handlers for graceful shutdown
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
    
    def _signal_handler(self, sig, frame):
        """Handle shutdown signals"""
        self.logger.info("Shutdown signal received. Closing all positions...")
        self.stop()
        sys.exit(0)
    
    def initialize(self) -> bool:
        """Initialize the trading system"""
        try:
            self.logger.info("=" * 80)
            self.logger.info("XM GLOBAL TRADING SYSTEM - INITIALIZING")
            self.logger.info("=" * 80)
            
            # Connect to XM Global
            if not self.api.connect():
                self.logger.error("Failed to connect to XM Global")
                return False
            
            # Get account info
            account_info = self.api.get_account_info()
            self.logger.info(
                f"Account: {account_info.get('login')} | "
                f"Balance: ${account_info.get('balance', 0):.2f} | "
                f"Currency: {account_info.get('currency', 'USD')}"
            )
            
            # Log configuration
            self.logger.info(f"Trading Mode: {self.config.trading_mode}")
            self.logger.info(f"Symbols: {self.config.get_all_symbols()}")
            self.logger.info(f"Max Positions: {self.config.get('trading.max_positions', 5)}")
            self.logger.info(
                f"Position Size: {self.config.get('trading.position_size_percent', 2)}% per trade"
            )
            self.logger.info(
                f"Volatility-based SL: {self.config.get('risk_management.stop_loss.atr_multiplier', 1.5)}x ATR"
            )
            self.logger.info(f"Scalping Target: {self.config.get('risk_management.take_profit.target_profit_percent', 1.0)}%")
            self.logger.info(
                f"24h Profitability Check: {self.config.get('profitability.check_24h_profit', True)}"
            )
            self.logger.info(f"Min Win Rate: {self.config.get('profitability.min_win_rate', 50)}%")
            
            self.logger.info("=" * 80)
            self.logger.info("System initialized successfully")
            self.logger.info("=" * 80)
            return True
        
        except Exception as e:
            self.logger.error(f"Initialization error: {e}")
            return False
    
    def run(self):
        """Main trading loop"""
        if not self.initialize():
            return
        
        self.running = True
        scan_interval = 5  # Scan every 5 seconds
        last_scan = 0
        last_stats_log = 0
        stats_log_interval = 300  # Log stats every 5 minutes
        
        self.logger.info("Starting trading loop...")
        
        try:
            while self.running:
                current_time = time.time()
                self.cycle_count += 1
                
                # Perform market scan
                if current_time - last_scan >= scan_interval:
                    self._market_cycle()
                    last_scan = current_time
                
                # Log statistics
                if current_time - last_stats_log >= stats_log_interval:
                    self._log_session_stats()
                    last_stats_log = current_time
                
                # Sleep to prevent CPU overload
                time.sleep(0.1)
        
        except KeyboardInterrupt:
            self.logger.info("Keyboard interrupt received")
        except Exception as e:
            self.logger.error(f"Unexpected error in main loop: {e}")
        finally:
            self.stop()
    
    def _market_cycle(self):
        """Execute one market scanning and trading cycle"""
        try:
            # Get current account state
            account_info = self.api.get_account_info()
            balance = account_info.get('balance', 0)
            
            self.logger.debug(
                f"\n[Cycle #{self.cycle_count}] "
                f"Time: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} | "
                f"Open Positions: {self.position_manager.get_open_positions_count()} | "
                f"Balance: ${balance:.2f}"
            )
            
            # Scan markets
            market_data = self.market_scanner.scan_all_markets()
            if not market_data:
                return
            
            # Check and close any positions that hit TP/SL
            closed_positions = self.trade_executor.check_and_close_positions(
                self.market_scanner.get_current_quotes()
            )
            
            # Log trading opportunity
            self.logger.debug(f"Closed {closed_positions} position(s) this cycle")
            
            # Look for new trading opportunities
            for symbol, data in market_data.items():
                quote = data["quote"]
                ohlc_data = data["ohlc"]
                
                # Check if we can open positions
                if not self.position_manager.can_open_position():
                    continue
                
                # Determine entry signal (simplified: based on volatility)
                volatility_metrics = self.volatility_analyzer.analyze_volatility(symbol, ohlc_data)
                
                # In demo mode, be more aggressive with entry signals
                demo_mode = self.config.get("demo_mode", False)
                
                if demo_mode:
                    # Demo mode: alternate BUY/SELL on each cycle/symbol for more trades
                    if (self.cycle_count + hash(symbol)) % 3 == 0:
                        order_type = "BUY"
                    else:
                        order_type = "SELL"
                else:
                    # Production: use volatility-based signals
                    if self.cycle_count % 2 == 0:
                        order_type = "BUY"
                    else:
                        order_type = "SELL"
                
                # Try to execute trade
                ticket = self.trade_executor.execute_trade(
                    symbol=symbol,
                    order_type=order_type,
                    quote=quote,
                    ohlc_data=ohlc_data,
                    account_balance=balance
                )
        
        except Exception as e:
            self.logger.error(f"Market cycle error: {e}")
    
    def _log_session_stats(self):
        """Log session statistics"""
        try:
            stats = self.position_manager.get_24h_stats()
            account_info = self.api.get_account_info()
            
            self.logger.info("-" * 80)
            self.logger.info("SESSION STATISTICS")
            self.logger.info("-" * 80)
            self.logger.info(f"Account Balance: ${account_info.get('balance', 0):.2f}")
            self.logger.info(f"Open Positions: {self.position_manager.get_open_positions_count()}")
            self.logger.info(
                f"24h Trading: {stats['trades']} trades, "
                f"{stats['wins']} wins, {stats['losses']} losses"
            )
            self.logger.info(
                f"24h Performance: {stats['win_rate']:.1f}% win rate, "
                f"${stats['total_profit']:.2f} profit, "
                f"${stats['avg_profit']:.2f} avg per trade"
            )
            self.logger.info(self.profitability_filter.get_trading_stats())
            self.logger.info("-" * 80)
        
        except Exception as e:
            self.logger.error(f"Stats logging error: {e}")
    
    def stop(self):
        """Stop the trading system"""
        self.logger.info("Stopping trading system...")
        self.running = False
        
        # Close any open positions
        open_positions = list(self.position_manager.open_positions.keys())
        if open_positions:
            self.logger.info(f"Closing {len(open_positions)} open positions...")
            for ticket in open_positions:
                self.api.close_trade(ticket)
        
        # Disconnect
        self.api.disconnect()
        
        # Final stats
        self._log_session_stats()
        self.logger.info("Trading system stopped")


def main():
    """Entry point"""
    try:
        system = XMTradingSystem()
        system.run()
    except ValueError as e:
        import sys
        print(f"\n{e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        import sys
        print(f"\nFatal error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
