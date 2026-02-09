"""Logging configuration for trading system"""
import logging
import os
from datetime import datetime
from logging.handlers import RotatingFileHandler
import yaml

class TradingLogger:
    def __init__(self, config_path="config/settings.yaml"):
        self.config = self._load_config(config_path)
        self.logger = self._setup_logger()
    
    @staticmethod
    def _load_config(config_path):
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f)
        except FileNotFoundError:
            return {"logging": {"level": "INFO", "file": "logs/trading.log"}}
    
    def _setup_logger(self):
        logger = logging.getLogger('XM_TRADER')
        log_level = getattr(logging, self.config.get("logging", {}).get("level", "INFO"))
        logger.setLevel(log_level)
        
        # Only add handlers if they don't already exist
        if logger.hasHandlers():
            return logger
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(log_level)
        console_format = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(console_format)
        logger.addHandler(console_handler)
        
        # File handler
        log_file = self.config.get("logging", {}).get("file", "logs/trading.log")
        os.makedirs(os.path.dirname(log_file), exist_ok=True)
        
        file_handler = RotatingFileHandler(
            log_file,
            maxBytes=10485760,  # 10MB
            backupCount=5
        )
        file_handler.setLevel(log_level)
        file_format = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - [%(funcName)s:%(lineno)d] - %(message)s'
        )
        file_handler.setFormatter(file_format)
        logger.addHandler(file_handler)
        
        return logger
    
    def get_logger(self):
        return self.logger

def get_logger():
    """Get logger instance"""
    return TradingLogger().get_logger()
