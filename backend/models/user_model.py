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
    coins: int = 1000
    portfolio: Dict[str, int] = Field(default_factory=dict)
    badges: List[str] = Field(default_factory=lambda: ["Meme Novice"])
    active_skin: str = "cyan"
    friends: List[str] = Field(default_factory=list)
    meme_iq: int = 120
    meme_iq_tier: str = "Certified Memer"
    favorite_memes: List[str] = Field(default_factory=list)
    onboarding_complete: bool = False

class FriendRequest(BaseModel):
    request_id: str
    from_user_id: str
    from_username: str
    to_user_id: str
    to_username: str
    status: str = "pending"

class FriendRequestCreate(BaseModel):
    from_user_id: str
    to_username: str

class FriendRequestAction(BaseModel):
    request_id: str
    action: str

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

class MemeStockTradeRequest(BaseModel):
    user_id: str
    ticker: str
    action: str
    shares: int = 1
