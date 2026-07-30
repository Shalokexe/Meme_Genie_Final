"""
5-Round Competitive Match Engine with Speed-Based Scoring
"""

import uuid
import random
import time
from typing import Dict, List, Optional
from db.mongo import get_all_memes

# Active match rooms: { room_code: { room_code, host, players, round, max_rounds, round_meme, scores, round_completed } }
MATCH_ROOMS: Dict[str, dict] = {}

def create_match_room(host_user_id: str, host_username: str) -> dict:
    """Create a new 5-Round Match Room with a unique room code."""
    room_code = f"ROOM-{random.randint(100, 999)}"
    all_memes = get_all_memes()
    selected_memes = random.sample(all_memes, min(5, len(all_memes)))
    
    room_obj = {
        "room_code": room_code,
        "host_user_id": host_user_id,
        "host_username": host_username,
        "players": [
            {"user_id": host_user_id, "username": host_username, "score": 0}
        ],
        "current_round": 1,
        "max_rounds": 5,
        "memes_pool": selected_memes,
        "round_meme": selected_memes[0] if selected_memes else {},
        "round_start_time": time.time(),
        "round_guesses": [], # track guesses submitted in current round
        "is_finished": False,
        "winner": None
    }
    
    MATCH_ROOMS[room_code] = room_obj
    return room_obj

def join_match_room(room_code: str, user_id: str, username: str) -> dict:
    """Join an existing match room."""
    room = MATCH_ROOMS.get(room_code)
    if not room:
        raise ValueError("Match room not found")
        
    # Check if user already in room
    existing = [p for p in room["players"] if p["user_id"] == user_id]
    if not existing:
        room["players"].append({"user_id": user_id, "username": username, "score": 0})
        
    return room

def get_match_state(room_code: str) -> dict:
    """Get live status of match room."""
    room = MATCH_ROOMS.get(room_code)
    if not room:
        raise ValueError("Room not found")
        
    # Filter round_meme payload to obscure full name initially if guessing
    curr_meme = room["round_meme"]
    censored_meme = {
        "quotes": curr_meme.get("quotes", []),
        "tags": curr_meme.get("tags", []),
        "era": curr_meme.get("era", "2020s"),
        "media_url": curr_meme.get("media_url", "")
    }
    
    return {
        "room_code": room["room_code"],
        "current_round": room["current_round"],
        "max_rounds": room["max_rounds"],
        "players": sorted(room["players"], key=lambda x: x["score"], reverse=True),
        "hint": censored_meme,
        "round_guesses_count": len(room["round_guesses"]),
        "is_finished": room["is_finished"],
        "winner": room.get("winner")
    }

def submit_match_guess(room_code: str, user_id: str, guess_text: str, seconds_taken: float) -> dict:
    """
    Process speed guess submission. First player to guess correctly receives speed bonus!
    """
    room = MATCH_ROOMS.get(room_code)
    if not room or room["is_finished"]:
        return {"status": "room_inactive"}
        
    target_meme = room["round_meme"]
    meme_name = target_meme.get("name", "").lower()
    user_guess = guess_text.strip().lower()
    
    # Check match accuracy (exact name or main keyword contained)
    is_correct = (user_guess in meme_name) or (meme_name in user_guess) or any(k in user_guess for k in target_meme.get("id", "").split("_"))
    
    if not is_correct:
        return {"correct": False, "message": "Incorrect guess, try again!"}
        
    # Calculate speed score
    first_guesser = len(room["round_guesses"]) == 0
    base_points = 100
    speed_bonus = max(10, int(100 - (seconds_taken * 8)))
    first_bonus = 50 if first_guesser else 0
    total_points = base_points + speed_bonus + first_bonus
    
    # Update player score
    player_found = False
    for p in room["players"]:
        if p["user_id"] == user_id:
            p["score"] += total_points
            player_found = True
            break
            
    room["round_guesses"].append({
        "user_id": user_id,
        "guess_text": guess_text,
        "seconds_taken": seconds_taken,
        "points_earned": total_points
    })
    
    # Advance round if all players guessed or host triggered
    if len(room["round_guesses"]) >= len(room["players"]) or first_guesser:
        advance_match_round(room)
        
    return {
        "correct": True,
        "points_earned": total_points,
        "is_first": first_guesser,
        "target_name": target_meme.get("name")
    }

def advance_match_round(room: dict):
    """Advance to next round in the 5-round match."""
    if room["current_round"] >= room["max_rounds"]:
        room["is_finished"] = True
        sorted_players = sorted(room["players"], key=lambda x: x["score"], reverse=True)
        room["winner"] = sorted_players[0] if sorted_players else None
    else:
        room["current_round"] += 1
        idx = room["current_round"] - 1
        if idx < len(room["memes_pool"]):
            room["round_meme"] = room["memes_pool"][idx]
        room["round_guesses"] = []
        room["round_start_time"] = time.time()
