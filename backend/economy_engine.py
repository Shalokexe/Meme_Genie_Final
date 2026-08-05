"""
MemeX Stock Exchange (Virtual Meme Economy Engine)
Manages floating meme stock tickers, price fluctuations, trading, and portfolios.
"""

import random
import time
from typing import Dict, List
from friend_engine import USERS_DB

# Meme Stock Market Database: { ticker: { name, price, change_pct, volume, history } }
MEMEX_MARKET: Dict[str, dict] = {
    "CHAD": {
        "ticker": "CHAD",
        "name": "GigaChad",
        "price": 150.50,
        "change_pct": 5.2,
        "volume": 1240,
        "history": [140.0, 142.5, 145.0, 148.0, 150.50]
    },
    "DOGE": {
        "ticker": "DOGE",
        "name": "Original Doge",
        "price": 230.10,
        "change_pct": 12.4,
        "volume": 3500,
        "history": [200.0, 210.0, 215.0, 222.0, 230.10]
    },
    "RICK": {
        "ticker": "RICK",
        "name": "Rickroll Classic",
        "price": 420.00,
        "change_pct": -1.5,
        "volume": 8900,
        "history": [430.0, 428.0, 425.0, 422.0, 420.00]
    },
    "DRAKE": {
        "ticker": "DRAKE",
        "name": "Drake Hotline Bling",
        "price": 95.80,
        "change_pct": 3.1,
        "volume": 1800,
        "history": [90.0, 91.5, 93.0, 94.2, 95.80]
    },
    "PEPE": {
        "ticker": "PEPE",
        "name": "Rare Pepe",
        "price": 310.00,
        "change_pct": 8.7,
        "volume": 4200,
        "history": [280.0, 290.0, 298.0, 305.0, 310.00]
    },
    "CAT": {
        "ticker": "CAT",
        "name": "Woman Yelling at Cat",
        "price": 88.40,
        "change_pct": -2.4,
        "volume": 950,
        "history": [94.0, 92.0, 91.0, 90.0, 88.40]
    }
}

def update_market_prices():
    """Simulate random live market fluctuations for all meme stocks."""
    for ticker, stock in MEMEX_MARKET.items():
        fluctuation = (random.random() - 0.48) * 0.05  # Slight upward bias
        new_price = max(5.0, round(stock["price"] * (1 + fluctuation), 2))
        change_pct = round(((new_price - stock["history"][0]) / stock["history"][0]) * 100, 1)
        
        stock["price"] = new_price
        stock["change_pct"] = change_pct
        stock["history"].append(new_price)
        if len(stock["history"]) > 10:
            stock["history"].pop(0)

def get_market_summary() -> dict:
    """Return all stock market tickers and prices."""
    update_market_prices()
    ticker_tape = []
    for stock in MEMEX_MARKET.values():
        symbol = "▲" if stock["change_pct"] >= 0 else "▼"
        ticker_tape.append(f"${stock['ticker']} {symbol} {stock['change_pct']:+.1f}%")
        
    return {
        "stocks": list(MEMEX_MARKET.values()),
        "ticker_tape": " | ".join(ticker_tape)
    }

def execute_stock_trade(user_id: str, ticker: str, action: str, shares: int = 1) -> dict:
    """Execute buy or sell order for a user."""
    stock = MEMEX_MARKET.get(ticker.upper())
    if not stock:
        raise ValueError(f"Unknown meme stock ticker '{ticker}'")
        
    user = USERS_DB.get(user_id)
    if not user:
        raise ValueError("User profile not found")
        
    coins = user.get("coins", 1000)
    portfolio = user.setdefault("portfolio", {})
    current_owned = portfolio.get(ticker.upper(), 0)
    total_cost = round(stock["price"] * shares, 2)
    
    if action.lower() == "buy":
        if coins < total_cost:
            raise ValueError(f"Insufficient MEME coins. Required: {total_cost}, Available: {coins}")
        user["coins"] = round(coins - total_cost, 2)
        portfolio[ticker.upper()] = current_owned + shares
        stock["volume"] += shares
    elif action.lower() == "sell":
        if current_owned < shares:
            raise ValueError(f"You do not own {shares} shares of ${ticker}. Owned: {current_owned}")
        user["coins"] = round(coins + total_cost, 2)
        portfolio[ticker.upper()] = current_owned - shares
        if portfolio[ticker.upper()] == 0:
            del portfolio[ticker.upper()]
    else:
        raise ValueError("Invalid trade action. Use 'buy' or 'sell'.")
        
    return {
        "status": "success",
        "action": action,
        "ticker": ticker.upper(),
        "shares": shares,
        "price_per_share": stock["price"],
        "total_value": total_cost,
        "user_coins": user["coins"],
        "user_portfolio": user["portfolio"]
    }
