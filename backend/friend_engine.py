"""
Friend Management, User Accounts, XP Leveling & Crystal Skins Engine
"""

import uuid
from typing import Dict, List, Optional

# In-memory user database: { user_id: { username, avatar_emoji, xp, level, badges, active_skin, status, friends: [user_ids] } }
USERS_DB: Dict[str, dict] = {
    "usr_gigachad": {
        "user_id": "usr_gigachad",
        "username": "GigaChad_99",
        "avatar_emoji": "🗿",
        "xp": 1250,
        "level": 5,
        "badges": ["Meme Novice", "Fastest Fingers", "Meme Overlord"],
        "active_skin": "ruby",
        "status": "online",
        "friends": ["usr_doge"]
    },
    "usr_doge": {
        "user_id": "usr_doge",
        "username": "DogeMaster",
        "avatar_emoji": "🐕",
        "xp": 600,
        "level": 3,
        "badges": ["Meme Novice", "Meme Picasso"],
        "active_skin": "sapphire",
        "status": "online",
        "friends": ["usr_gigachad"]
    }
}

# Pending friend requests: { request_id: { request_id, from_user_id, to_user_id, status } }
FRIEND_REQUESTS: Dict[str, dict] = {}

def calculate_level(xp: int) -> int:
    """Calculate user level based on XP formula: 1 + floor(XP / 250)."""
    return 1 + (xp // 250)

def award_user_xp(user_id: str, xp_amount: int, badge_to_grant: Optional[str] = None) -> dict:
    """Grant XP to a user, update their level, and award badges if unlocked."""
    user = USERS_DB.get(user_id)
    if not user:
        return {}
        
    user["xp"] = user.get("xp", 0) + xp_amount
    user["level"] = calculate_level(user["xp"])
    
    if badge_to_grant and badge_to_grant not in user.get("badges", []):
        user["badges"].append(badge_to_grant)
        
    # Auto-grant Level milestone badges
    if user["level"] >= 5 and "Meme Overlord" not in user["badges"]:
        user["badges"].append("Meme Overlord")
        
    return user

def equip_skin(user_id: str, skin_name: str) -> bool:
    """Equip a custom Crystal Orb skin (cyan, ruby, sapphire, emerald, amethyst)."""
    user = USERS_DB.get(user_id)
    if not user:
        return False
        
    valid_skins = ["cyan", "ruby", "sapphire", "emerald", "amethyst"]
    if skin_name in valid_skins:
        user["active_skin"] = skin_name
        return True
    return False

def get_or_create_user(username: str, avatar_emoji: str = "😎") -> dict:
    """Find user by username or create a new user profile."""
    for uid, udata in USERS_DB.items():
        if udata["username"].lower() == username.lower():
            return udata
            
    uid = f"usr_{str(uuid.uuid4())[:6]}"
    user_obj = {
        "user_id": uid,
        "username": username,
        "avatar_emoji": avatar_emoji,
        "xp": 100,
        "level": 1,
        "badges": ["Meme Novice"],
        "active_skin": "cyan",
        "status": "online",
        "friends": []
    }
    USERS_DB[uid] = user_obj
    return user_obj

def send_friend_request(from_user_id: str, to_username: str) -> dict:
    """Send a friend request to a target user."""
    from_user = USERS_DB.get(from_user_id)
    if not from_user:
        raise ValueError("Sender user not found")
        
    target_user = None
    for udata in USERS_DB.values():
        if udata["username"].lower() == to_username.lower():
            target_user = udata
            break
            
    if not target_user:
        raise ValueError(f"User '{to_username}' not found")
        
    if target_user["user_id"] in from_user.get("friends", []):
        raise ValueError(f"You are already friends with {to_username}")
        
    req_id = f"freq_{str(uuid.uuid4())[:6]}"
    req_obj = {
        "request_id": req_id,
        "from_user_id": from_user_id,
        "from_username": from_user["username"],
        "to_user_id": target_user["user_id"],
        "to_username": target_user["username"],
        "status": "pending"
    }
    FRIEND_REQUESTS[req_id] = req_obj
    return req_obj

def handle_friend_request(request_id: str, action: str) -> dict:
    """Accept or decline a pending friend request."""
    req = FRIEND_REQUESTS.get(request_id)
    if not req:
        raise ValueError("Friend request not found")
        
    if action == "accept":
        req["status"] = "accepted"
        u1 = USERS_DB.get(req["from_user_id"])
        u2 = USERS_DB.get(req["to_user_id"])
        if u1 and u2:
            if req["to_user_id"] not in u1.get("friends", []):
                u1.setdefault("friends", []).append(req["to_user_id"])
            if req["from_user_id"] not in u2.get("friends", []):
                u2.setdefault("friends", []).append(req["from_user_id"])
    else:
        req["status"] = "rejected"
        
    return req

def get_user_friends(user_id: str) -> List[dict]:
    """Retrieve list of accepted friends for a user."""
    user = USERS_DB.get(user_id)
    if not user:
        return []
    friends_list = []
    for fid in user.get("friends", []):
        f_data = USERS_DB.get(fid)
        if f_data:
            friends_list.append(f_data)
    return friends_list

def get_pending_requests(user_id: str) -> List[dict]:
    """Get incoming pending friend requests for a user."""
    return [req for req in FRIEND_REQUESTS.values() if req["to_user_id"] == user_id and req["status"] == "pending"]
