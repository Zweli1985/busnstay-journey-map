"""Volatility Analysis for Market Entry Signals"""
from typing import Dict, Optional
from src.utils.logger import get_logger
from src.utils.config_loader import get_config

class VolatilityAnalyzer:
    """Analyze market volatility for trading signals"""
    
    def __init__(self):
        self.logger = get_logger()
        self.config = get_config()
    
    def analyze_volatility(self, symbol: str, ohlc_data: list) -> Dict:
        """
        Analyze volatility using ATR and other metrics
        Returns: volatility metrics
        """
        try:
            if len(ohlc_data) < 20:
                self.logger.warning(f"Insufficient data for {symbol} volatility analysis")
                return self._default_volatility()
            
            atr = self._calculate_atr(ohlc_data)
            atr_percent = self._calculate_atr_percent(ohlc_data, atr)
            bollinger_width = self._calculate_bollinger_width(ohlc_data)
            volatility_trend = self._calculate_volatility_trend(ohlc_data)
            
            return {
                "symbol": symbol,
                "atr": round(atr, 5),
                "atr_percent": round(atr_percent, 2),
                "bollinger_width": round(bollinger_width, 5),
                "volatility_level": self._classify_volatility(atr_percent),
                "volatility_trend": volatility_trend,
                "is_trending": abs(volatility_trend) > 10  # > 10% trend
            }
        except Exception as e:
            self.logger.error(f"Volatility analysis error for {symbol}: {e}")
            return self._default_volatility()
    
    def should_enter_trade(self, volatility_metrics: Dict) -> tuple:
        """
        Determine if current volatility conditions are suitable for entry
        Returns: (should_enter: bool, reason: str)
        """
        try:
            # In demo mode, allow more entry opportunities
            demo_mode = self.config.get("demo_mode", False)
            if demo_mode:
                return True, "Demo mode - entry allowed"
            
            vol_level = volatility_metrics["volatility_level"]
            atr_pct = volatility_metrics["atr_percent"]
            
            # For scalping, we want normal to slightly elevated volatility
            # But avoid extremely high volatility which adds slippage risk
            if vol_level == "EXTREME":
                return False, "Volatility too high (extreme) - risk of excessive slippage"
            
            if vol_level == "VERY_LOW":
                return False, "Volatility too low - insufficient movement for scalping"
            
            # Check volatility threshold from config
            threshold = self.config.get("volatility.volatility_threshold", 0.5)
            if atr_pct < threshold and vol_level in ["LOW", "VERY_LOW"]:
                return False, f"ATR% ({atr_pct:.2f}%) below threshold ({threshold}%)"
            
            return True, f"Volatility suitable (Level: {vol_level}, ATR%: {atr_pct:.2f}%)"
        except Exception as e:
            self.logger.error(f"Entry signal error: {e}")
            return False, f"Analysis error: {str(e)}"
    
    @staticmethod
    def _calculate_atr(ohlc_data: list, period: int = 14) -> float:
        """Calculate Average True Range"""
        if len(ohlc_data) < period:
            return 0.0
        
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
        
        atr = sum(true_ranges[-period:]) / period
        return atr
    
    @staticmethod
    def _calculate_atr_percent(ohlc_data: list, atr: float) -> float:
        """Calculate ATR as percentage of current price"""
        if not ohlc_data or atr == 0:
            return 0.0
        
        current_price = ohlc_data[-1]["close"]
        atr_pct = (atr / current_price) * 100
        return atr_pct
    
    @staticmethod
    def _calculate_bollinger_width(ohlc_data: list, period: int = 20, std_dev: float = 2) -> float:
        """Calculate Bollinger Band width"""
        if len(ohlc_data) < period:
            return 0.0
        
        closes = [candle["close"] for candle in ohlc_data[-period:]]
        avg = sum(closes) / period
        variance = sum((x - avg) ** 2 for x in closes) / period
        std = variance ** 0.5
        
        upper_band = avg + (std * std_dev)
        lower_band = avg - (std * std_dev)
        
        return upper_band - lower_band
    
    @staticmethod
    def _calculate_volatility_trend(ohlc_data: list) -> float:
        """Calculate volatility trend (increasing/decreasing)"""
        if len(ohlc_data) < 40:
            return 0.0
        
        recent_vol = VolatilityAnalyzer._calculate_atr_percent(
            ohlc_data[-20:],
            VolatilityAnalyzer._calculate_atr(ohlc_data[-20:], 10)
        )
        older_vol = VolatilityAnalyzer._calculate_atr_percent(
            ohlc_data[-40:-20],
            VolatilityAnalyzer._calculate_atr(ohlc_data[-40:-20], 10)
        )
        
        trend = ((recent_vol - older_vol) / older_vol * 100) if older_vol != 0 else 0
        return trend
    
    @staticmethod
    def _classify_volatility(atr_percent: float) -> str:
        """Classify volatility level"""
        if atr_percent < 0.2:
            return "VERY_LOW"
        elif atr_percent < 0.5:
            return "LOW"
        elif atr_percent < 1.5:
            return "NORMAL"
        elif atr_percent < 3.0:
            return "HIGH"
        else:
            return "EXTREME"
    
    @staticmethod
    def _default_volatility() -> Dict:
        """Return default volatility metrics"""
        return {
            "symbol": "UNKNOWN",
            "atr": 0.0,
            "atr_percent": 0.0,
            "bollinger_width": 0.0,
            "volatility_level": "UNKNOWN",
            "volatility_trend": 0.0,
            "is_trending": False
        }
