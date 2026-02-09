"""Trade Execution Engine"""
from typing import Optional
from datetime import datetime
from src.utils.logger import get_logger
from src.utils.config_loader import get_config

class TradeExecutor:
    """Execute trades and manage trade lifecycle"""
    
    def __init__(self, api_connector, position_manager, volatility_analyzer, profitability_filter):
        self.logger = get_logger()
        self.config = get_config()
        self.api = api_connector
        self.position_manager = position_manager
        self.volatility_analyzer = volatility_analyzer
        self.profitability_filter = profitability_filter
    
    def execute_trade(self, symbol: str, order_type: str, quote: dict, 
                     ohlc_data: list, account_balance: float) -> Optional[int]:
        """
        Execute a trade with full risk management
        Returns: ticket number or None if failed
        """
        try:
            # 1. Check profitability conditions
            can_trade, trade_reason = self.profitability_filter.can_trade(account_balance)
            if not can_trade:
                self.logger.warning(f"Trade blocked for {symbol}: {trade_reason}")
                return None
            
            # 2. Check position limits
            if not self.position_manager.can_open_position():
                self.logger.warning(f"Cannot open new position - limit reached")
                return None
            
            # 3. Analyze volatility
            volatility_metrics = self.volatility_analyzer.analyze_volatility(symbol, ohlc_data)
            should_enter, vol_reason = self.volatility_analyzer.should_enter_trade(volatility_metrics)
            
            if not should_enter:
                self.logger.debug(f"Market conditions unfavorable for {symbol}: {vol_reason}")
                return None
            
            # 4. Get entry price
            entry_price = quote["ask"] if order_type == "BUY" else quote["bid"]
            
            # 5. Calculate stop loss (volatility-based)
            stop_loss = self.position_manager.calculate_stop_loss(
                symbol, entry_price, ohlc_data, order_type
            )
            
            # 6. Calculate take profit (scalping target)
            take_profit = self.position_manager.calculate_take_profit(
                symbol, entry_price, order_type
            )
            
            # 7. Verify profitability projection
            projected_rr_ratio = self._calculate_reward_risk_ratio(
                entry_price, stop_loss, take_profit, order_type
            )
            
            # In demo mode, allow more flexible RR ratios
            demo_mode = self.config.get("demo_mode", False)
            min_rr_ratio = 0.5 if demo_mode else 1.0
            
            if projected_rr_ratio < min_rr_ratio:
                self.logger.warning(
                    f"Poor risk/reward ratio for {symbol}: {projected_rr_ratio:.2f} "
                    f"(entry: {entry_price}, SL: {stop_loss}, TP: {take_profit})"
                )
                if not demo_mode:
                    return None
                else:
                    self.logger.info(f"Demo mode: allowing trade despite low RR ratio")
            
            # 8. Calculate position size
            position_size = self.position_manager.calculate_position_size(
                symbol, account_balance, entry_price, stop_loss
            )
            
            if position_size <= 0:
                self.logger.error(f"Invalid position size for {symbol}: {position_size}")
                return None
            
            # 9. Execute trade via API
            ticket = self.api.open_trade(
                symbol=symbol,
                order_type=order_type,
                volume=position_size,
                stop_loss=stop_loss,
                take_profit=take_profit,
                comment=f"Scalp {symbol} via volatility analyzer"
            )
            
            if ticket is None:
                self.logger.error(f"Failed to open trade for {symbol}")
                return None
            
            # 10. Track position
            self.position_manager.add_position(
                ticket=ticket,
                symbol=symbol,
                order_type=order_type,
                volume=position_size,
                entry_price=entry_price,
                stop_loss=stop_loss,
                take_profit=take_profit
            )
            
            self.logger.info(
                f"✓ TRADE EXECUTED #{ticket}: {order_type} {position_size} {symbol} "
                f"@ {entry_price:.5f} | SL: {stop_loss:.5f} | TP: {take_profit:.5f} | "
                f"RR: {projected_rr_ratio:.2f} | {volatility_metrics.get('volatility_level', 'N/A')}"
            )
            
            return ticket
        
        except Exception as e:
            self.logger.error(f"Trade execution error for {symbol}: {e}")
            return None
    
    def check_and_close_positions(self, current_quotes: dict) -> int:
        """
        Check open positions and close if TP/SL is hit
        Returns: number of positions closed
        """
        closed_count = 0
        
        try:
            positions_to_check = list(self.position_manager.open_positions.items())
            
            for ticket, position in positions_to_check:
                symbol = position["symbol"]
                
                if symbol not in current_quotes:
                    continue
                
                current_price = current_quotes[symbol]["bid"] if position["type"] == "BUY" else current_quotes[symbol]["ask"]
                entry_price = position["entry_price"]
                take_profit = position["take_profit"]
                stop_loss = position["stop_loss"]
                
                # Calculate profit/loss
                if position["type"] == "BUY":
                    profit = (current_price - entry_price) * position["volume"] * 100  # Simplified
                    is_tp_hit = current_price >= take_profit
                    is_sl_hit = current_price <= stop_loss
                else:  # SELL
                    profit = (entry_price - current_price) * position["volume"] * 100
                    is_tp_hit = current_price <= take_profit
                    is_sl_hit = current_price >= stop_loss
                
                # Close position if TP or SL hit
                if is_tp_hit or is_sl_hit:
                    close_reason = "TAKE_PROFIT" if is_tp_hit else "STOP_LOSS"
                    
                    if self.api.close_trade(ticket):
                        self.position_manager.remove_position(ticket, current_price, profit)
                        closed_count += 1
                        
                        self.logger.info(
                            f"✓ POSITION CLOSED #{ticket}: {symbol} "
                            f"@ {current_price:.5f} | Reason: {close_reason} | "
                            f"Profit: ${profit:.2f}"
                        )
        
        except Exception as e:
            self.logger.error(f"Error checking positions: {e}")
        
        return closed_count
    
    @staticmethod
    def _calculate_reward_risk_ratio(entry: float, stop_loss: float, 
                                    take_profit: float, order_type: str) -> float:
        """Calculate reward-to-risk ratio"""
        if order_type == "BUY":
            risk = entry - stop_loss
            reward = take_profit - entry
        else:  # SELL
            risk = stop_loss - entry
            reward = entry - take_profit
        
        if risk == 0:
            return 0.0
        
        return reward / risk if reward > 0 else 0.0
