"""
XM Trading System - Web Dashboard
Real-time monitoring interface for the trading bot
"""

from flask import Flask, jsonify, render_template
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta
from typing import Dict, List
from src.utils.logger import get_logger
from src.utils.config_loader import get_config
from src.api.xm_connector import XMConnector

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

logger = get_logger()
config = get_config()

# Initialize API connector
api = XMConnector(
    login=config.xm_login,
    password=config.xm_password,
    server=config.xm_server
)

# Store trades in memory (in production, use a database)
trades_history = []
current_positions = []

# Store price history for charts
price_history = {
    'GOLD': [], 'XAUUSD': [],
    'EURUSD': [], 'GBPUSD': [], 'USDJPY': [], 'USDCAD': [],
    'BTCUSD': [], 'ETHUSD': []
}

def get_price_with_history(symbol: str) -> Dict:
    """Get current price and update history with trend"""
    try:
        quote = api.get_quote(symbol)
        if not quote:
            return {'price': 0, 'bid': 0, 'ask': 0, 'trend': 'neutral', 'trend_percent': 0}
        
        current_price = quote.get('bid', 0)
        
        # Maintain price history (keep last 20 prices)
        if symbol not in price_history:
            price_history[symbol] = []
        
        price_history[symbol].append({
            'price': current_price,
            'time': datetime.now().isoformat()
        })
        
        # Keep only last 20 prices
        if len(price_history[symbol]) > 20:
            price_history[symbol].pop(0)
        
        # Calculate trend
        if len(price_history[symbol]) >= 2:
            old_price = price_history[symbol][0]['price']
            trend_percent = ((current_price - old_price) / old_price * 100) if old_price != 0 else 0
            trend = 'up' if trend_percent > 0 else 'down' if trend_percent < 0 else 'neutral'
        else:
            trend = 'neutral'
            trend_percent = 0
        
        return {
            'price': current_price,
            'bid': quote.get('bid', 0),
            'ask': quote.get('ask', 0),
            'trend': trend,
            'trend_percent': round(trend_percent, 2),
            'history': price_history[symbol]
        }
    except Exception as e:
        logger.error(f"Error getting price for {symbol}: {e}")
        return {'price': 0, 'bid': 0, 'ask': 0, 'trend': 'neutral', 'trend_percent': 0}

def load_trades_from_logs():
    """Load trade history from log files"""
    try:
        log_file = 'logs/trading_log.json'
        if os.path.exists(log_file):
            with open(log_file, 'r') as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Error loading trades: {e}")
    return []

@app.route('/')
def dashboard():
    """Serve the main dashboard"""
    return render_template('index.html')

@app.route('/api/account', methods=['GET'])
def get_account():
    """Get account information"""
    try:
        if not api.connected:
            api.connect()
        
        account_info = api.get_account_info()
        return jsonify({
            'status': 'success',
            'data': {
                'balance': account_info.get('balance', 0),
                'equity': account_info.get('equity', 0),
                'margin': account_info.get('margin', 0),
                'free_margin': account_info.get('free_margin', 0),
                'profit': account_info.get('profit', 0),
                'open_positions': account_info.get('open_positions', 0),
                'currency': account_info.get('currency', 'USD')
            }
        })
    except Exception as e:
        logger.error(f"Error fetching account: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/positions', methods=['GET'])
def get_positions():
    """Get current open positions"""
    try:
        if not api.connected:
            api.connect()
        
        # Simulated positions for demo
        positions = [
            {
                'symbol': 'EURUSD',
                'type': 'BUY',
                'volume': 1.0,
                'entry_price': 1.0850,
                'current_price': 1.0865,
                'profit': 15.00,
                'profit_percent': 0.14,
                'open_time': datetime.now().isoformat()
            }
        ]
        return jsonify({
            'status': 'success',
            'data': positions
        })
    except Exception as e:
        logger.error(f"Error fetching positions: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/trades', methods=['GET'])
def get_trades():
    """Get recent trades"""
    try:
        trades = load_trades_from_logs()
        # Return last 20 trades
        return jsonify({
            'status': 'success',
            'data': trades[-20:] if trades else []
        })
    except Exception as e:
        logger.error(f"Error fetching trades: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get trading statistics"""
    try:
        trades = load_trades_from_logs()
        
        if not trades:
            return jsonify({
                'status': 'success',
                'data': {
                    'total_trades': 0,
                    'winning_trades': 0,
                    'losing_trades': 0,
                    'win_rate': 0,
                    'total_profit': 0,
                    'avg_profit_per_trade': 0
                }
            })
        
        total = len(trades)
        winning = sum(1 for t in trades if t.get('profit', 0) > 0)
        losing = total - winning
        total_profit = sum(t.get('profit', 0) for t in trades)
        
        return jsonify({
            'status': 'success',
            'data': {
                'total_trades': total,
                'winning_trades': winning,
                'losing_trades': losing,
                'win_rate': round((winning / total * 100) if total > 0 else 0, 2),
                'total_profit': round(total_profit, 2),
                'avg_profit_per_trade': round(total_profit / total if total > 0 else 0, 2)
            }
        })
    except Exception as e:
        logger.error(f"Error calculating statistics: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/symbols', methods=['GET'])
def get_symbols():
    """Get monitored symbols with trend data"""
    try:
        symbols = {
            'gold': ['GOLD', 'XAUUSD'],
            'forex': ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCAD'],
            'crypto': ['BTCUSD', 'ETHUSD']
        }
        
        all_symbols = []
        for category, symbol_list in symbols.items():
            for symbol in symbol_list:
                # Get current quote with trend
                price_data = get_price_with_history(symbol)
                all_symbols.append({
                    'symbol': symbol,
                    'category': category.upper(),
                    'price': price_data['price'],
                    'bid': price_data['bid'],
                    'ask': price_data['ask'],
                    'trend': price_data['trend'],
                    'trend_percent': price_data['trend_percent'],
                    'history': price_data['history']
                })
        
        return jsonify({
            'status': 'success',
            'data': all_symbols
        })
    except Exception as e:
        logger.error(f"Error fetching symbols: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get system status"""
    try:
        api_status = api.connected
        return jsonify({
            'status': 'success',
            'data': {
                'connected': api_status,
                'timestamp': datetime.now().isoformat(),
                'account': config.xm_login,
                'mode': config.trading_mode
            }
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting XM Trading Dashboard on http://localhost:5000")
    app.run(debug=False, host='0.0.0.0', port=5000)
