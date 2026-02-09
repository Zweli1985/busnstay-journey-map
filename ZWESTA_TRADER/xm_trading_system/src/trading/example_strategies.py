"""Example trading strategy implementation"""

from src.trading.volatility_analyzer import VolatilityAnalyzer
from src.utils.logger import get_logger

class ExampleStrategy:
    """
    Example of a custom trading strategy
    This is how you would implement your own signal generation
    """
    
    def __init__(self):
        self.logger = get_logger()
        self.volatility_analyzer = VolatilityAnalyzer()
    
    def generate_signal(self, symbol: str, ohlc_data: list) -> tuple:
        """
        Generate trading signal for a symbol
        Returns: (order_type, confidence)
        - order_type: "BUY", "SELL", or "NONE"
        - confidence: 0.0 to 1.0
        """
        
        if len(ohlc_data) < 20:
            return "NONE", 0.0
        
        # Example 1: Simple moving average crossover
        fast_ma = self._calculate_ma(ohlc_data, 5)
        slow_ma = self._calculate_ma(ohlc_data, 20)
        
        if fast_ma > slow_ma:
            signal = "BUY"
            confidence = min((fast_ma - slow_ma) / slow_ma, 1.0)
        elif fast_ma < slow_ma:
            signal = "SELL"
            confidence = min((slow_ma - fast_ma) / slow_ma, 1.0)
        else:
            return "NONE", 0.0
        
        # Example 2: Confirm with volatility
        volatility_metrics = self.volatility_analyzer.analyze_volatility(symbol, ohlc_data)
        if volatility_metrics["volatility_level"] in ["VERY_LOW", "EXTREME"]:
            confidence *= 0.5  # Reduce confidence in unfavorable volatility
        
        return signal, confidence
    
    @staticmethod
    def _calculate_ma(ohlc_data: list, period: int) -> float:
        """Calculate moving average"""
        if len(ohlc_data) < period:
            return 0.0
        
        closes = [candle["close"] for candle in ohlc_data[-period:]]
        return sum(closes) / period


# Other example strategies you could implement:

class RSIStrategy:
    """RSI-based trading strategy"""
    
    @staticmethod
    def generate_signal(ohlc_data: list) -> tuple:
        """
        Overbought (RSI > 70) generate SELL signals
        Oversold (RSI < 30) generate BUY signals
        """
        # Calculate RSI
        rsi = RSIStrategy._calculate_rsi(ohlc_data)
        
        if rsi > 70:
            return "SELL", (100 - rsi) / 30
        elif rsi < 30:
            return "BUY", rsi / 30
        else:
            return "NONE", 0.0
    
    @staticmethod
    def _calculate_rsi(ohlc_data: list, period: int = 14) -> float:
        """Calculate RSI (Relative Strength Index)"""
        if len(ohlc_data) < period + 1:
            return 50.0
        
        closes = [candle["close"] for candle in ohlc_data]
        gains = []
        losses = []
        
        for i in range(1, len(closes)):
            change = closes[i] - closes[i-1]
            if change > 0:
                gains.append(change)
                losses.append(0)
            else:
                gains.append(0)
                losses.append(abs(change))
        
        avg_gain = sum(gains[-period:]) / period
        avg_loss = sum(losses[-period:]) / period
        
        if avg_loss == 0:
            return 100.0
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi


class BollingerBandStrategy:
    """Bollinger Bands mean reversion strategy"""
    
    @staticmethod
    def generate_signal(ohlc_data: list) -> tuple:
        """
        Price at upper band = SELL (overextended)
        Price at lower band = BUY (oversold)
        """
        if len(ohlc_data) < 20:
            return "NONE", 0.0
        
        period = 20
        closes = [candle["close"] for candle in ohlc_data[-period:]]
        current_price = closes[-1]
        
        # Calculate Bollinger Bands
        sma = sum(closes) / period
        variance = sum((x - sma) ** 2 for x in closes) / period
        std_dev = variance ** 0.5
        
        upper_band = sma + (std_dev * 2)
        lower_band = sma - (std_dev * 2)
        
        # Generate signals
        if current_price >= upper_band:
            distance_ratio = (current_price - sma) / (upper_band - sma)
            return "SELL", min(distance_ratio, 1.0)
        elif current_price <= lower_band:
            distance_ratio = (sma - current_price) / (sma - lower_band)
            return "BUY", min(distance_ratio, 1.0)
        else:
            return "NONE", 0.0
