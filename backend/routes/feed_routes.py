from fastapi import APIRouter, HTTPException
from feed_engine import get_fyp_feed, upvote_fyp_post

router = APIRouter()

@router.get("/feed/fyp")
def get_fyp():
    """Retrieve Instagram-style For You Page feed."""
    return {"posts": get_fyp_feed()}

@router.post("/feed/upvote")
def upvote_post(post_id: str, user_id: str):
    """Upvote a post in FYP feed."""
    try:
        res = upvote_fyp_post(post_id, user_id)
        return res
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
