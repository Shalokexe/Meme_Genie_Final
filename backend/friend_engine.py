"""
Friend Management & User Account Engine
"""

import uuid
from typing import Dict, List, Optional

# In-memory user database: { user_id: { username, avatar_emoji, status, friends: [user_ids] } }
USERS_DB: Dict[str, dict] = {
    "usr_gigachad": {"user_id": "usr_gigachad", "username": "GigaChad_99", "avatar_emoji": "🗿", "status": "online", "friends": ["usr_doge"]},
    "usr_doge": {"user_id": "usr_doge", "username": "DogeMaster", "avatar_emoji": "🐕", "status": "online", "friends": ["usr_gigachad"]},
    "usr_pepe": {"user_id": "usr_pepe", "username": "PepeLord", "avatar_emoji": "🐸", "status": "offline", "friends": []}
}

# Pending friend requests: { request_id: { request_id, from_user_id, to_user_id, status } }
FRIEND_REQUESTS: Dict[str, dict] = {}

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
        
    if target_user["user_id"] in from_user["friends"]:
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
            if req["to_user_id"] not in u1["friends"]:
                u1["friends"].append(req["to_user_id"])
            if req["from_user_id"] not in u2["friends"]:
                u2["friends"].append(req["from_user_id"])
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
