"""Market Scanner - Monitor multiple symbols"""
from typing import Dict, List
from src.utils.logger import get_logger
from src.utils.config_loader import get_config

class MarketScanner:
    """Scan multiple markets for trading opportunities"""
    
    def __init__(self, api_connector):
        self.logger = get_logger()
        self.config = get_config()
        self.api = api_connector
        self.symbols = self.config.get_all_symbols()
        self.quotes_cache = {}
        self.ohlc_cache = {}
    
    def scan_all_markets(self) -> Dict:
        """
        Scan all configured symbols for trading signals
        Returns: dictionary of symbols with quotes and OHLC data
        """
        try:
            self.logger.info(f"Scanning {len(self.symbols)} symbols...")
            
            results = {}
            for symbol in self.symbols:
                quote = self.api.get_quote(symbol)
                if not quote:
                    continue
                
                ohlc_data = self.api.get_ohlc(
                    symbol,
                    timeframe=self.config.get("trading.timeframe", "5m"),
                    bars=100
                )
                
                if not ohlc_data:
                    continue
                
                results[symbol] = {
                    "quote": quote,
                    "ohlc": ohlc_data
                }
                
                self.quotes_cache[symbol] = quote
                self.ohlc_cache[symbol] = ohlc_data
            
            self.logger.debug(f"Scanned {len(results)} symbols successfully")
            return results
        
        except Exception as e:
            self.logger.error(f"Market scan error: {e}")
            return {}
    
    def get_current_quotes(self) -> Dict:
        """Get latest quotes for all symbols"""
        return self.quotes_cache.copy()
    
    def get_symbol_ohlc(self, symbol: str) -> List[Dict]:
        """Get OHLC data for specific symbol"""
        return self.ohlc_cache.get(symbol, [])
