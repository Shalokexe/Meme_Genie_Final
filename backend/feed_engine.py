"""
Instagram-Style For You Page (FYP) Feed Engine
Manages scrollable meme feed posts, upvotes, and comments.
"""

import time
import uuid
from typing import List, Dict
from db.mongo import get_all_memes

# In-memory feed posts list
FEED_POSTS: List[dict] = [
    {
        "post_id": "post_1",
        "author_id": "usr_gigachad",
        "author_username": "GigaChad_99",
        "author_avatar": "🗿",
        "meme_name": "Average Meme Genie Enjoyer",
        "media_url": "https://i.kym-cdn.com/entries/icons/original/000/026/152/gigachad.jpg",
        "caption": "When you guess the meme on the 2nd question without even sweating 😎",
        "upvotes": 428,
        "upvoted_by": [],
        "comments": [
            {"user": "DogeMaster", "text": "Absolute unit 🗿"},
            {"user": "MemerGuest", "text": "Genie AI is too OP"}
        ],
        "timestamp": time.time() - 3600
    },
    {
        "post_id": "post_2",
        "author_id": "usr_doge",
        "author_username": "DogeMaster",
        "author_avatar": "🐕",
        "meme_name": "Such Mind Reading",
        "media_url": "https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg",
        "caption": "Much confidence. Very accuracy. Wow 🐕",
        "upvotes": 312,
        "upvoted_by": [],
        "comments": [
            {"user": "GigaChad_99", "text": "Classic Doge never dies"}
        ],
        "timestamp": time.time() - 7200
    }
]

def get_fyp_feed() -> List[dict]:
    """Return scrollable For You Page feed posts."""
    # Append database memes as posts if feed is small
    if len(FEED_POSTS) < 5:
        db_memes = get_all_memes()
        for idx, m in enumerate(db_memes[:5]):
            pid = f"post_db_{idx}"
            if not any(p["post_id"] == pid for p in FEED_POSTS):
                FEED_POSTS.append({
                    "post_id": pid,
                    "author_id": "usr_genie",
                    "author_username": "GenieOfficial 🧞‍♂️",
                    "author_avatar": "🧞‍♂️",
                    "meme_name": m.get("name"),
                    "media_url": m.get("media_url"),
                    "caption": m.get("description", "Featured in Genie Mind Memory!"),
                    "upvotes": 150 + (idx * 25),
                    "upvoted_by": [],
                    "comments": [{"user": "MemerCommunity", "text": "Iconic meme!"}],
                    "timestamp": time.time() - (idx * 1800)
                })
    return sorted(FEED_POSTS, key=lambda x: x["timestamp"], reverse=True)

def upvote_fyp_post(post_id: str, user_id: str) -> dict:
    """Upvote a post in the FYP feed."""
    for post in FEED_POSTS:
        if post["post_id"] == post_id:
            if user_id not in post["upvoted_by"]:
                post["upvotes"] += 1
                post["upvoted_by"].append(user_id)
            return {"post_id": post_id, "new_upvotes": post["upvotes"]}
    raise ValueError("Post not found")
