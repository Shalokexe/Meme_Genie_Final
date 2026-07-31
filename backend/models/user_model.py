from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class UserProfile(BaseModel):
    user_id: str
    username: str
    avatar_emoji: str = "😎"
    status: str = "online"
    score_total: int = 0
    xp: int = 150
    level: int = 1
    badges: List[str] = ["Meme Novice"]
    active_skin: str = "cyan"  # 'cyan', 'ruby', 'sapphire', 'emerald', 'amethyst'
    friends: List[str] = []  # user_ids

class FriendRequest(BaseModel):
    request_id: str
    from_user_id: str
    from_username: str
    to_user_id: str
    to_username: str
    status: str = "pending"  # 'pending', 'accepted', 'rejected'

class FriendRequestCreate(BaseModel):
    from_user_id: str
    to_username: str

class FriendRequestAction(BaseModel):
    request_id: str
    action: str  # 'accept' or 'reject'

class ChatMessage(BaseModel):
    message_id: str
    room_id: str
    user_id: str
    username: str
    raw_content: str
    sanitized_content: str
    is_quick_chat: bool = False
    timestamp: float

class SendChatMessageRequest(BaseModel):
    room_id: str
    user_id: str
    username: str
    message: str
    is_quick_chat: bool = False

class MatchRoomCreate(BaseModel):
    host_user_id: str
    host_username: str
    max_players: int = 4

class MatchJoinRequest(BaseModel):
    room_code: str
    user_id: str
    username: str

class MatchGuessSubmit(BaseModel):
    room_code: str
    user_id: str
    guess_text: str
    seconds_taken: float

class SkinEquipRequest(BaseModel):
    user_id: str
    skin_name: str
