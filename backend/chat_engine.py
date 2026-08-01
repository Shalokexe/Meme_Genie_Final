"""
Meme Genie Quick Chat Engine with Profanity Censorship & Presets
"""

import time
import uuid
import re
from typing import List, Dict

# Prohibited / profanity word list for automatic sanitization
RESTRICTED_WORDS = [
    r"\bfuck\w*", r"\bshit\w*", r"\basshole\w*", r"\bcatchphrase\b", 
    r"\bbitch\w*", r"\bdick\w*", r"\bcunt\w*", r"\bbastard\w*", 
    r"\bslut\w*", r"\bwhore\w*", r"\bprick\w*", r"\bidiot\w*",
    r"\bstupid\w*", r"\bdumb\w*", r"\bcrap\w*", r"\bswear\w*"
]

QUICK_CHAT_PRESETS = [
    "Mind Blown! 🤯",
    "I got it! ⚡",
    "Fastest meme in the west! 🤠",
    "Who guessed that?! 😱",
    "GG! 🎮",
    "Def Rickroll 🕺",
    "Wait, let me think... 🤔",
    "Made by Memers, Made for Memers 😎"
]

# In-memory store for room chat messages: { room_id: [ ChatMessage dicts ] }
ROOM_CHAT_STORE: Dict[str, List[dict]] = {}

def sanitize_text(text: str) -> str:
    """Censors restricted words into [MEME SANITIZED]."""
    sanitized = text
    for pattern in RESTRICTED_WORDS:
        sanitized = re.sub(pattern, "🧼[MEME SANITIZED]", sanitized, flags=re.IGNORECASE)
    return sanitized

def post_chat_message(room_id: str, user_id: str, username: str, raw_msg: str, is_quick: bool = False) -> dict:
    """Sanitizes and stores a new chat message."""
    if room_id not in ROOM_CHAT_STORE:
        ROOM_CHAT_STORE[room_id] = []
        
    sanitized = raw_msg if is_quick else sanitize_text(raw_msg)
    
    msg_obj = {
        "message_id": str(uuid.uuid4())[:8],
        "room_id": room_id,
        "user_id": user_id,
        "username": username,
        "raw_content": raw_msg,
        "sanitized_content": sanitized,
        "is_quick_chat": is_quick,
        "timestamp": time.time()
    }
    
    ROOM_CHAT_STORE[room_id].append(msg_obj)
    # Keep last 50 messages per room
    if len(ROOM_CHAT_STORE[room_id]) > 50:
        ROOM_CHAT_STORE[room_id].pop(0)
        
    return msg_obj

def get_room_messages(room_id: str) -> List[dict]:
    """Retrieve chat history for a given room."""
    return ROOM_CHAT_STORE.get(room_id, [])
