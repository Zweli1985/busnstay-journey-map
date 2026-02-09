"""Position and Risk Management"""
from typing import Dict, Optional
from datetime import datetime, timedelta
from src.utils.logger import get_logger
from src.utils.config_loader import get_config

class PositionManager:
    """Manage positions and risk parameters"""
    
    def __init__(self, api_connector):
        self.logger = get_logger()
        self.config = get_config()
        self.api = api_connector
        self.open_positions = {}
        self.position_history = []
    
    def calculate_position_size(self, symbol: str, account_balance: float, 
                               entry_price: float, stop_loss: float) -> float:
        """Calculate position size based on risk management rules"""
        try:
            risk_percent = self.config.get("trading.position_size_percent", 2)
            max_loss_amount = account_balance * (risk_percent / 100)
            
            # Calculate pips at risk
            pips_at_risk = abs(entry_price - stop_loss)
            if pips_at_risk == 0:
                return 0
            
            # For forex/crypto, pip value varies by instrument
            pip_value = self._get_pip_value(symbol)
            
            # Position size = max loss / (pips at risk * pip value)
            position_size = max_loss_amount / (pips_at_risk * pip_value)
            
            # Limit to reasonable size
            position_size = min(position_size, 10.0)  # Max 10 lots
            position_size = max(position_size, 0.01)  # Min 0.01 lot
            
            self.logger.debug(
                f"Position size for {symbol}: {position_size:.2f} "
                f"(risk: {risk_percent}%, pips: {pips_at_risk}, max loss: ${max_loss_amount:.2f})"
            )
            return round(position_size, 2)
        except Exception as e:
            self.logger.error(f"Position size calculation error: {e}")
            return 0.01
    
    @staticmethod
    def _get_pip_value(symbol: str) -> float:
        """Get pip value for symbol (simplified)"""
        gold_symbols = ["GOLD", "XAUUSD"]
        if any(s in symbol for s in gold_symbols):
            return 0.01  # 0.01 USD per pip for gold
        return 0.0001  # Standard forex pip value
    
    def calculate_stop_loss(self, symbol: str, entry_price: float, 
                           ohlc_data: list, order_type: str) -> float:
        """Calculate stop loss based on volatility (ATR)"""
        try:
            atr = self._calculate_atr(ohlc_data)
            atr_multiplier = self.config.get("risk_management.stop_loss.atr_multiplier", 1.5)
            
            stop_loss_distance = atr * atr_multiplier
            
            if order_type == "BUY":
                stop_loss = entry_price - stop_loss_distance
            else:  # SELL
                stop_loss = entry_price + stop_loss_distance
            
            self.logger.debug(
                f"Stop loss for {symbol}: {stop_loss:.5f} "
                f"(ATR: {atr:.5f}, multiplier: {atr_multiplier})"
            )
            return round(stop_loss, 5)
        except Exception as e:
            self.logger.error(f"Stop loss calculation error: {e}")
            return entry_price  # Conservative: no SL
    
    def calculate_take_profit(self, symbol: str, entry_price: float, 
                            order_type: str) -> float:
        """Calculate take profit for scalping"""
        try:
            target_profit_percent = self.config.get(
                "risk_management.take_profit.target_profit_percent", 1.0
            )
            
            target_pips = entry_price * (target_profit_percent / 100)
            
            if order_type == "BUY":
                take_profit = entry_price + target_pips
            else:  # SELL
                take_profit = entry_price - target_pips
            
            self.logger.debug(
                f"Take profit for {symbol}: {take_profit:.5f} "
                f"(target: {target_profit_percent}%)"
            )
            return round(take_profit, 5)
        except Exception as e:
            self.logger.error(f"Take profit calculation error: {e}")
            return entry_price
    
    @staticmethod
    def _calculate_atr(ohlc_data: list, period: int = 14) -> float:
        """Calculate Average True Range (ATR)"""
        if len(ohlc_data) < period:
            return 0.1
        
        true_ranges = []
        for i in range(1, len(ohlc_data)):
            high = ohlc_data[i]["high"]
            low = ohlc_data[i]["low"]
            prev_close = ohlc_data[i-1]["close"]
            
            tr = max(
                high - low,
                abs(high - prev_close),
                abs(low - prev_close)
            )
            true_ranges.append(tr)
        
        atr = sum(true_ranges[-period:]) / period if true_ranges else 0.1
        return round(atr, 5)
    
    def add_position(self, ticket: int, symbol: str, order_type: str, 
                    volume: float, entry_price: float, stop_loss: float, 
                    take_profit: float):
        """Track an open position"""
        self.open_positions[ticket] = {
            "ticket": ticket,
            "symbol": symbol,
            "type": order_type,
            "volume": volume,
            "entry_price": entry_price,
            "stop_loss": stop_loss,
            "take_profit": take_profit,
            "open_time": datetime.utcnow(),
            "entry_equity": None
        }
        self.logger.info(f"Position tracked: #{ticket} {symbol} {order_type}")
    
    def remove_position(self, ticket: int, close_price: float, profit: float):
        """Remove closed position and log to history"""
        if ticket in self.open_positions:
            position = self.open_positions.pop(ticket)
            position["close_price"] = close_price
            position["profit"] = profit
            position["close_time"] = datetime.utcnow()
            self.position_history.append(position)
            
            pips_gained = abs(close_price - position["entry_price"])
            self.logger.info(
                f"Position closed: #{ticket} {position['symbol']} "
                f"Profit: ${profit:.2f} ({pips_gained:.5f} pips)"
            )
    
    def get_open_positions_count(self) -> int:
        """Get number of open positions"""
        return len(self.open_positions)
    
    def get_total_exposure(self) -> float:
        """Calculate total market exposure"""
        return sum(pos["volume"] for pos in self.open_positions.values())
    
    def can_open_position(self) -> bool:
        """Check if new position can be opened based on risk limits"""
        max_positions = self.config.get("trading.max_positions", 5)
        current_positions = self.get_open_positions_count()
        
        if current_positions >= max_positions:
            self.logger.warning(
                f"Max positions reached: {current_positions}/{max_positions}"
            )
            return False
        
        return True
    
    def get_24h_stats(self) -> Dict:
        """Calculate 24-hour trading statistics"""
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        recent_trades = [
            trade for trade in self.position_history
            if trade["close_time"] > cutoff_time
        ]
        
        if not recent_trades:
            return {
                "trades": 0,
                "wins": 0,
                "losses": 0,
                "win_rate": 0,
                "total_profit": 0.0,
                "avg_profit": 0.0
            }
        
        wins = sum(1 for t in recent_trades if t["profit"] > 0)
        losses = sum(1 for t in recent_trades if t["profit"] <= 0)
        total_profit = sum(t["profit"] for t in recent_trades)
        
        return {
            "trades": len(recent_trades),
            "wins": wins,
            "losses": losses,
            "win_rate": (wins / len(recent_trades) * 100) if recent_trades else 0,
            "total_profit": total_profit,
            "avg_profit": total_profit / len(recent_trades) if recent_trades else 0
        }
