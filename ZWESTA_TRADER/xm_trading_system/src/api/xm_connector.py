"""XM Global API Connector - MetaTrader5 Integration"""
import MetaTrader5 as mt5
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import time
from src.utils.logger import get_logger

class XMConnector:
    """
    XM Global MetaTrader5 API Integration
    Real connection to MT5 terminal for live trading
    """
    
    def __init__(self, login: str, password: str, server: str = "XMGlobal-MT5 2"):
        self.logger = get_logger()
        # Login can be either numeric (account number) or text (username)
        try:
            self.login = int(login)
        except ValueError:
            self.login = login
        self.password = password
        self.server = server
        self.connected = False
        self.rate_limit_delay = 0.05  # 50ms between requests
        self.last_request_time = 0
    
    def connect(self) -> bool:
        """Initialize and authenticate with MetaTrader5"""
        try:
            self.logger.info(f"Initializing MetaTrader5...")
            
            # Check if already initialized
            terminal_info = mt5.terminal_info()
            if terminal_info is not None:
                self.logger.info("MT5 already initialized, using existing connection")
                self.connected = True
                return True
            
            # Initialize MT5 with retries
            max_retries = 3
            for attempt in range(max_retries):
                self.logger.info(f"Connection attempt {attempt + 1}/{max_retries}...")
                if mt5.initialize():
                    self.logger.info("MT5 initialized successfully")
                    break
                else:
                    error = mt5.last_error()
                    error_code, error_msg = error if isinstance(error, tuple) else (error, str(error))
                    
                    if attempt < max_retries - 1:
                        self.logger.warning(f"Attempt {attempt + 1} failed, retrying... Error: {error}")
                        import time
                        time.sleep(2)
                    else:
                        # Final attempt failed
                        if error_code == -6:
                            self.logger.error(
                                "ERROR: MetaTrader5 Terminal Authorization Failed\n"
                                "This typically means:\n"
                                "  1. MetaTrader5 terminal is NOT installed on this system\n"
                                "  2. MetaTrader5 terminal is not running\n"
                                "  3. You need to install MetaTrader5 from your broker (XM Global)\n"
                                f"\nTechnical details: {error_msg}"
                            )
                        elif error_code == -10005:
                            self.logger.error(
                                "ERROR: MetaTrader5 IPC Timeout\n"
                                "Make sure:\n"
                                "  1. MetaTrader5 terminal is RUNNING\n"
                                "  2. You are logged into MetaTrader5\n"
                                "  3. The terminal is responsive (not frozen)\n"
                                f"\nTechnical details: {error_msg}"
                            )
                        else:
                            self.logger.error(f"MT5 initialization failed: ({error_code}, {error_msg})")
                        return False
            
            # Login to account
            self.logger.info(f"Logging in to account {self.login} on server {self.server}...")
            if not mt5.login(self.login, self.password, self.server):
                error = mt5.last_error()
                error_code, error_msg = error if isinstance(error, tuple) else (error, str(error))
                self.logger.error(
                    f"MT5 login failed: ({error_code}, {error_msg})\n"
                    f"Please verify:\n"
                    f"  - Login (Account number): {self.login}\n"
                    f"  - Server name: {self.server}\n"
                    f"  - Check .env file for correct credentials"
                )
                mt5.shutdown()
                return False
            
            self.connected = True
            self.logger.info("Connected to MetaTrader5 successfully")
            return True
        except ImportError:
            self.logger.error(
                "ERROR: MetaTrader5 Python package not installed\n"
                "Install it with: pip install MetaTrader5"
            )
            return False
        except Exception as e:
            self.logger.error(f"Connection failed: {e}")
            return False
    
    def disconnect(self) -> bool:
        """Disconnect from MetaTrader5"""
        try:
            if self.connected:
                mt5.shutdown()
                self.connected = False
                self.logger.info("Disconnected from MetaTrader5")
            return True
        except Exception as e:
            self.logger.error(f"Disconnection error: {e}")
            return False
    
    def _rate_limit(self):
        """Apply rate limiting"""
        elapsed = time.time() - self.last_request_time
        if elapsed < self.rate_limit_delay:
            time.sleep(self.rate_limit_delay - elapsed)
        self.last_request_time = time.time()
    
    def get_account_info(self) -> Dict:
        """Get account information from MT5"""
        try:
            self._rate_limit()
            self.logger.debug("Fetching account info...")
            
            account = mt5.account_info()
            if account is None:
                self.logger.error(f"Failed to get account info: {mt5.last_error()}")
                return {}
            
            return {
                "login": account.login,
                "currency": account.currency,
                "balance": account.balance,
                "equity": account.equity,
                "margin": account.margin,
                "free_margin": account.freemargin,
                "margin_level": account.margin_level,
                "open_positions": len(mt5.positions_get()),
                "credit": account.credit,
                "profit": account.profit
            }
        except Exception as e:
            self.logger.error(f"Failed to get account info: {e}")
            return {}
    
    def get_quote(self, symbol: str) -> Optional[Dict]:
        """Get current price quote for symbol from MT5"""
        try:
            self._rate_limit()
            self.logger.debug(f"Fetching quote for {symbol}...")
            
            # Get symbol tick info
            tick = mt5.symbol_info_tick(symbol)
            if tick is None:
                self.logger.warning(f"Failed to get quote for {symbol}: {mt5.last_error()}")
                return None
            
            return {
                "symbol": symbol,
                "bid": tick.bid,
                "ask": tick.ask,
                "time": datetime.fromtimestamp(tick.time).isoformat(),
                "digits": mt5.symbol_info(symbol).digits if mt5.symbol_info(symbol) else 5
            }
        except Exception as e:
            self.logger.error(f"Failed to get quote for {symbol}: {e}")
            return None
    
    def get_ohlc(self, symbol: str, timeframe: str, bars: int = 100) -> List[Dict]:
        """Get OHLC candlestick data from MT5"""
        try:
            self._rate_limit()
            self.logger.debug(f"Fetching {timeframe} OHLC data for {symbol} ({bars} bars)...")
            
            # Map timeframe string to MT5 constant
            timeframe_map = {
                "1m": mt5.TIMEFRAME_M1,
                "5m": mt5.TIMEFRAME_M5,
                "15m": mt5.TIMEFRAME_M15,
                "30m": mt5.TIMEFRAME_M30,
                "1h": mt5.TIMEFRAME_H1,
                "4h": mt5.TIMEFRAME_H4,
                "1d": mt5.TIMEFRAME_D1,
            }
            
            tf = timeframe_map.get(timeframe, mt5.TIMEFRAME_M5)
            
            # Get rates from MT5
            rates = mt5.copy_rates_from_pos(symbol, tf, 0, bars)
            if rates is None:
                self.logger.warning(f"Failed to get OHLC for {symbol}: {mt5.last_error()}")
                return []
            
            candles = []
            for rate in rates:
                candles.append({
                    "time": datetime.fromtimestamp(rate['time']).isoformat(),
                    "open": round(rate['open'], 5),
                    "high": round(rate['high'], 5),
                    "low": round(rate['low'], 5),
                    "close": round(rate['close'], 5),
                    "volume": int(rate['tick_volume'])
                })
            
            return candles
        except Exception as e:
            self.logger.error(f"Failed to get OHLC for {symbol}: {e}")
            return []
    
    def get_positions(self) -> List[Dict]:
        """Get open positions from MT5"""
        try:
            self._rate_limit()
            self.logger.debug("Fetching open positions...")
            
            positions = mt5.positions_get()
            if positions is None:
                return []
            
            result = []
            for pos in positions:
                result.append({
                    "ticket": pos.ticket,
                    "symbol": pos.symbol,
                    "type": "BUY" if pos.type == 0 else "SELL",
                    "volume": pos.volume,
                    "entry_price": pos.price_open,
                    "current_price": pos.price_current,
                    "stop_loss": pos.sl,
                    "take_profit": pos.tp,
                    "profit": pos.profit,
                    "open_time": datetime.fromtimestamp(pos.time).isoformat(),
                    "comment": pos.comment
                })
            
            return result
        except Exception as e:
            self.logger.error(f"Failed to get positions: {e}")
            return []
    
    def open_trade(self, symbol: str, order_type: str, volume: float, 
                  stop_loss: float, take_profit: float, comment: str = "") -> Optional[int]:
        """
        Open a new trade via MT5
        order_type: "BUY" or "SELL"
        """
        try:
            self._rate_limit()
            quote = self.get_quote(symbol)
            if not quote:
                return None
            
            # Determine order type
            action = mt5.ORDER_TYPE_BUY if order_type == "BUY" else mt5.ORDER_TYPE_SELL
            entry_price = quote["ask"] if order_type == "BUY" else quote["bid"]
            
            self.logger.info(
                f"Opening {order_type} trade: {symbol} @ {entry_price} "
                f"vol={volume} (SL: {stop_loss}, TP: {take_profit})"
            )
            
            # Create order request
            request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": symbol,
                "volume": volume,
                "type": action,
                "price": entry_price,
                "sl": stop_loss,
                "tp": take_profit,
                "deviation": 20,
                "magic": 234000 + int(time.time()) % 1000,
                "comment": comment if comment else "XM Trader Bot"
            }
            
            # Send order to MT5
            result = mt5.order_send(request)
            if result is None:
                self.logger.error(f"Failed to open trade - MT5 error: {mt5.last_error()}")
                return None
            
            if result.retcode != mt5.TRADE_RETCODE_DONE:
                self.logger.error(f"Trade order failed - Retcode: {result.retcode}, {result.comment}")
                return None
            
            ticket = result.order
            self.logger.info(f"Trade opened successfully - Ticket: {ticket}")
            return ticket
        except Exception as e:
            self.logger.error(f"Failed to open trade: {e}")
            return None
    
    def close_trade(self, ticket: int, volume: float = 0) -> bool:
        """Close a trade via MT5"""
        try:
            self._rate_limit()
            self.logger.info(f"Closing trade #{ticket} (volume: {volume if volume > 0 else 'all'})")
            
            # Get position info
            pos = mt5.positions_get(ticket=ticket)
            if pos is None or len(pos) == 0:
                self.logger.warning(f"Position #{ticket} not found")
                return False
            
            pos_info = pos[0]
            close_type = mt5.ORDER_TYPE_SELL if pos_info.type == 0 else mt5.ORDER_TYPE_BUY
            close_volume = volume if volume > 0 else pos_info.volume
            
            # Get current quote
            quote = self.get_quote(pos_info.symbol)
            if not quote:
                return False
            
            close_price = quote["bid"] if pos_info.type == 0 else quote["ask"]
            
            # Create close order
            request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": pos_info.symbol,
                "volume": close_volume,
                "type": close_type,
                "position": ticket,
                "price": close_price,
                "deviation": 20,
                "magic": 234000 + int(time.time()) % 1000,
                "comment": "Close order"
            }
            
            result = mt5.order_send(request)
            if result is None or result.retcode != mt5.TRADE_RETCODE_DONE:
                self.logger.error(f"Failed to close trade - Retcode: {result.retcode if result else 'None'}")
                return False
            
            self.logger.info(f"Trade #{ticket} closed successfully")
            return True
        except Exception as e:
            self.logger.error(f"Failed to close trade: {e}")
            return False
    
    def modify_trade(self, ticket: int, stop_loss: float, take_profit: float) -> bool:
        """Modify stop loss and take profit via MT5"""
        try:
            self._rate_limit()
            self.logger.debug(f"Modifying trade #{ticket}: SL={stop_loss}, TP={take_profit}")
            
            # Get position info
            pos = mt5.positions_get(ticket=ticket)
            if pos is None or len(pos) == 0:
                self.logger.warning(f"Position #{ticket} not found")
                return False
            
            pos_info = pos[0]
            
            # Create modify order
            request = {
                "action": mt5.TRADE_ACTION_MODIFY,
                "position": ticket,
                "sl": stop_loss,
                "tp": take_profit
            }
            
            result = mt5.order_send(request)
            if result is None or result.retcode != mt5.TRADE_RETCODE_DONE:
                self.logger.error(f"Failed to modify trade - Retcode: {result.retcode if result else 'None'}")
                return False
            
            self.logger.info(f"Trade #{ticket} modified - SL: {stop_loss}, TP: {take_profit}")
            return True
        except Exception as e:
            self.logger.error(f"Failed to modify trade: {e}")
            return False
    
    def get_trade_history(self, days: int = 1) -> List[Dict]:
        """Get closed trades history"""
        try:
            self._rate_limit()
            self.logger.debug(f"Fetching trade history ({days} day(s))...")
            return []  # Simulated
        except Exception as e:
            self.logger.error(f"Failed to get trade history: {e}")
            return []
