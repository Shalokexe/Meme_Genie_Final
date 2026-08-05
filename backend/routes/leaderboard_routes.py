from fastapi import APIRouter
from friend_engine import USERS_DB
from db.mongo import get_all_memes
import random
import time

router = APIRouter()

@router.get("/leaderboard/global")
def get_global_leaderboard():
    """Retrieve top ranked users worldwide by XP and level."""
    sorted_users = sorted(
        USERS_DB.values(),
        key=lambda u: (u.get("level", 1), u.get("xp", 0)),
        reverse=True
    )
    
    formatted = []
    for rank, u in enumerate(sorted_users[:10], start=1):
        formatted.append({
            "rank": rank,
            "username": u["username"],
            "avatar_emoji": u.get("avatar_emoji", "😎"),
            "level": u.get("level", 1),
            "xp": u.get("xp", 0),
            "badges": u.get("badges", ["Meme Novice"])
        })
        
    return {"leaderboard": formatted, "total_memers": len(USERS_DB)}

@router.get("/challenge/daily")
def get_daily_challenge():
    """Get today's 3-meme speed trivia challenge."""
    memes = get_all_memes()
    # Seed random with today's date format (YYYY-MM-DD) for consistency
    today_str = time.strftime("%Y-%m-%d")
    rnd = random.Random(today_str)
    
    selected = rnd.sample(memes, min(3, len(memes)))
    
    challenge_memes = []
    for m in selected:
        challenge_memes.append({
            "id": m.get("id"),
            "name": m.get("name"),
            "media_url": m.get("media_url"),
            "quotes": m.get("quotes", [])[:2],
            "tags": m.get("tags", [])[:3]
        })
        
    return {
        "date": today_str,
        "challenge_name": f"Daily Meme Dash ({today_str})",
        "memes": challenge_memes,
        "bonus_xp": 200
    }
