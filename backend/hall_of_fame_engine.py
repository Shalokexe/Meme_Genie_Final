"""
Immortal Meme Hall of Fame & Internet Longevity Analytics Engine
Tracks viral duration (years active), peak virality, and community upvotes.
"""

from typing import List, Dict
from db.mongo import get_all_memes

# Upvote Store: { meme_id: count }
HALL_OF_FAME_VOTES: Dict[str, int] = {
    "rickroll": 12500,
    "gigachad": 9800,
    "doge": 11400,
    "drake_hotline": 7600,
    "pepe_frog": 8900
}

# Longevity Metadata: { meme_id: { first_seen_year, active_duration_years, peak_score } }
LONGEVITY_METADATA: Dict[str, dict] = {
    "rickroll": {"start": 2007, "years": 19, "peak_virality": 99, "era_label": "2007 – Present (19 Years Virality)"},
    "doge": {"start": 2013, "years": 13, "peak_virality": 98, "era_label": "2013 – Present (13 Years Virality)"},
    "gigachad": {"start": 2017, "years": 9, "peak_virality": 96, "era_label": "2017 – Present (9 Years Virality)"},
    "drake_hotline": {"start": 2015, "years": 11, "peak_virality": 94, "era_label": "2015 – Present (11 Years Virality)"},
    "pepe_frog": {"start": 2008, "years": 18, "peak_virality": 97, "era_label": "2008 – Present (18 Years Virality)"}
}

def get_hall_of_fame_rankings() -> List[dict]:
    """Return memes ordered by Hall of Fame Index (Upvotes + Longevity Score)."""
    raw_memes = get_all_memes()
    rankings = []
    
    for m in raw_memes:
        mid = m.get("id", str(m.get("_id", "")))
        votes = HALL_OF_FAME_VOTES.get(mid, 150)
        long_data = LONGEVITY_METADATA.get(mid, {
            "start": 2020,
            "years": 6,
            "peak_virality": 85,
            "era_label": "2020 – Present (6 Years Virality)"
        })
        
        # Hall of Fame Score Formula: Votes + (Years Active * 500) + (Peak Virality * 50)
        hof_score = votes + (long_data["years"] * 500) + (long_data["peak_virality"] * 50)
        
        rankings.append({
            "id": mid,
            "name": m.get("name"),
            "media_url": m.get("media_url"),
            "description": m.get("description", ""),
            "upvotes": votes,
            "longevity": long_data["era_label"],
            "years_active": long_data["years"],
            "peak_virality": long_data["peak_virality"],
            "hof_score": hof_score
        })
        
    return sorted(rankings, key=lambda x: x["hof_score"], reverse=True)

def upvote_hall_of_fame_meme(meme_id: str) -> dict:
    """Increment golden upvote count for a Hall of Fame meme."""
    HALL_OF_FAME_VOTES[meme_id] = HALL_OF_FAME_VOTES.get(meme_id, 100) + 1
    return {"meme_id": meme_id, "new_upvotes": HALL_OF_FAME_VOTES[meme_id]}
