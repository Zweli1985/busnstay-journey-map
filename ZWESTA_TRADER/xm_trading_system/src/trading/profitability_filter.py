"""Profitability Filter - Only trade if conditions are met"""
from datetime import datetime, timedelta
from src.utils.logger import get_logger
from src.utils.config_loader import get_config

class ProfitabilityFilter:
    """Filter trades based on profitability criteria"""
    
    def __init__(self, position_manager):
        self.logger = get_logger()
        self.config = get_config()
        self.position_manager = position_manager
    
    def can_trade(self, account_balance: float) -> tuple:
        """
        Check if trading should proceed based on profitability criteria
        Returns: (should_trade: bool, reason: str)
        """
        try:
            # In demo mode, allow more trades
            demo_mode = self.config.get("demo_mode", False)
            
            if demo_mode:
                self.logger.debug("Demo mode enabled - relaxed trading filters")
                return True, "Demo mode - trading enabled"
            
            # Check 24-hour profitability (production mode)
            if self.config.get("profitability.check_24h_profit", True):
                stats = self.position_manager.get_24h_stats()
                
                if stats["trades"] > 0:
                    # Check minimum win rate
                    min_win_rate = self.config.get("profitability.min_win_rate", 50)
                    if stats["win_rate"] < min_win_rate:
                        message = (
                            f"Win rate {stats['win_rate']:.1f}% below minimum {min_win_rate}%"
                        )
                        self.logger.warning(f"Trading blocked: {message}")
                        return False, message
                    
                    # Check consecutive losses
                    max_consecutive = self.config.get("profitability.max_consecutive_losses", 3)
                    consecutive_losses = self._count_consecutive_losses()
                    if consecutive_losses >= max_consecutive:
                        message = (
                            f"Max consecutive losses ({consecutive_losses}) reached"
                        )
                        self.logger.warning(f"Trading blocked: {message}")
                        return False, message
                    
                    # Check 24h profit requirement
                    min_profit_pct = self.config.get("profitability.min_24h_profit_percent", 0)
                    if stats["total_profit"] < 0 and min_profit_pct > 0:
                        message = (
                            f"24h profit ${stats['total_profit']:.2f} is negative "
                            f"(requires ${min_profit_pct}% of balance)"
                        )
                        self.logger.warning(f"Trading blocked: {message}")
                        return False, message
                    
                    self.logger.info(
                        f"Profitability check passed - Stats: "
                        f"{stats['trades']} trades, "
                        f"{stats['win_rate']:.1f}% win rate, "
                        f"${stats['total_profit']:.2f} profit"
                    )
            
            return True, "Trade conditions met"
        
        except Exception as e:
            self.logger.error(f"Error in profitability check: {e}")
            return False, f"Profitability check error: {str(e)}"
    
    def _count_consecutive_losses(self) -> int:
        """Count consecutive losses from recent trades"""
        consecutive = 0
        for position in reversed(self.position_manager.position_history[-10:]):
            if position.get("profit", 0) <= 0:
                consecutive += 1
            else:
                break
        return consecutive
    
    def get_trading_stats(self) -> str:
        """Get formatted trading statistics"""
        stats = self.position_manager.get_24h_stats()
        
        return (
            f"24h Stats - Trades: {stats['trades']}, "
            f"Wins: {stats['wins']}, Losses: {stats['losses']}, "
            f"Win Rate: {stats['win_rate']:.1f}%, "
            f"Total Profit: ${stats['total_profit']:.2f}, "
            f"Avg Profit per Trade: ${stats['avg_profit']:.2f}"
        )
