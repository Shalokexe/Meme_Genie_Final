from fastapi import APIRouter, HTTPException, Query
from models.user_model import MemeStockTradeRequest
from economy_engine import get_market_summary, execute_stock_trade
from hall_of_fame_engine import get_hall_of_fame_rankings, upvote_hall_of_fame_meme

router = APIRouter()

# --- MemeX Stock Exchange Routes ---
@router.get("/economy/market")
def fetch_market():
    return get_market_summary()

@router.post("/economy/trade")
def trade_meme_stock(req: MemeStockTradeRequest):
    try:
        res = execute_stock_trade(req.user_id, req.ticker, req.action, req.shares)
        return res
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))

# --- Hall of Fame & Longevity Analytics Routes ---
@router.get("/halloffame/rankings")
def fetch_hall_of_fame():
    return {"rankings": get_hall_of_fame_rankings()}

@router.post("/halloffame/vote")
def vote_meme(meme_id: str = Query(...)):
    res = upvote_hall_of_fame_meme(meme_id)
    return {"status": "success", "result": res}
