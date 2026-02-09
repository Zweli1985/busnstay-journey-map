"""Configuration loader"""
import yaml
import os
from dotenv import load_dotenv

class ConfigLoader:
    def __init__(self, config_path="config/settings.yaml", env_path=".env"):
        load_dotenv(env_path)
        self.config = self._load_yaml(config_path)
        self._load_env_vars()
    
    @staticmethod
    def _load_yaml(path):
        """Load YAML configuration file"""
        try:
            with open(path, 'r') as f:
                return yaml.safe_load(f)
        except FileNotFoundError:
            raise Exception(f"Configuration file not found: {path}")
        except yaml.YAMLError as e:
            raise Exception(f"Error parsing YAML: {e}")
    
    def _load_env_vars(self):
        """Load environment variables"""
        self.xm_login = os.getenv("XM_LOGIN")
        self.xm_password = os.getenv("XM_PASSWORD")
        self.xm_server = os.getenv("XM_SERVER", "demo.trader.xm.com")
        self.trading_mode = os.getenv("TRADING_MODE", "paper")
        self.risk_per_trade = float(os.getenv("RISK_PER_TRADE", "2"))
        
        # Load demo mode from environment
        demo_mode_str = os.getenv("DEMO_MODE", "false").lower()
        self.demo_mode = demo_mode_str in ["true", "1", "yes", "on"]
    
    def get(self, key, default=None):
        """Get configuration value by key (dot notation supported)"""
        # Check for special environment-based settings first
        if key == "demo_mode":
            return self.demo_mode
        
        # Then check YAML config
        keys = key.split(".")
        value = self.config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
        return value if value is not None else default
    
    def get_symbols(self, asset_class):
        """Get symbols for a specific asset class"""
        return self.config.get("trading", {}).get("symbols", {}).get(asset_class, [])
    
    def get_all_symbols(self):
        """Get all trading symbols"""
        symbols = []
        symbol_config = self.config.get("trading", {}).get("symbols", {})
        for asset_class, symbol_list in symbol_config.items():
            symbols.extend(symbol_list)
        return symbols

def get_config():
    """Get global config instance"""
    return ConfigLoader()
