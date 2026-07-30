from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models.user_model import (
    UserProfile, FriendRequest, FriendRequestCreate, FriendRequestAction,
    ChatMessage, SendChatMessageRequest, MatchRoomCreate, MatchJoinRequest, MatchGuessSubmit
)
from friend_engine import (
    get_or_create_user, send_friend_request, handle_friend_request,
    get_user_friends, get_pending_requests, USERS_DB
)
from chat_engine import (
    post_chat_message, get_room_messages, QUICK_CHAT_PRESETS
)
from match_engine import (
    create_match_room, join_match_room, get_match_state, submit_match_guess
)

router = APIRouter()

# --- User & Profile Endpoints ---
@router.post("/user/profile")
def register_or_login(username: str = Query(...), avatar_emoji: str = Query("😎")):
    user = get_or_create_user(username, avatar_emoji)
    return user

@router.get("/user/profile/{user_id}")
def get_profile(user_id: str):
    user = USERS_DB.get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- Friend Request Endpoints ---
@router.post("/friends/request")
def send_request(req: FriendRequestCreate):
    try:
        res = send_friend_request(req.from_user_id, req.to_username)
        return {"status": "sent", "request": res}
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))

@router.post("/friends/action")
def respond_request(action_data: FriendRequestAction):
    try:
        res = handle_friend_request(action_data.request_id, action_data.action)
        return {"status": "success", "request": res}
    except ValueError as err:
        raise HTTPException(status_code=400, detail=str(err))

@router.get("/friends/list/{user_id}")
def list_friends(user_id: str):
    friends = get_user_friends(user_id)
    pending = get_pending_requests(user_id)
    return {"friends": friends, "pending_requests": pending}

# --- Among Us Chat Endpoints ---
@router.get("/chat/quick-presets")
def list_quick_presets():
    return {"presets": QUICK_CHAT_PRESETS}

@router.post("/chat/send")
def send_message(req: SendChatMessageRequest):
    msg = post_chat_message(req.room_id, req.user_id, req.username, req.message, req.is_quick_chat)
    return {"status": "sent", "message": msg}

@router.get("/chat/messages/{room_id}")
def fetch_messages(room_id: str):
    messages = get_room_messages(room_id)
    return {"room_id": room_id, "messages": messages}

# --- 5-Round Speed Match Endpoints ---
@router.post("/match/create")
def create_room(req: MatchRoomCreate):
    room = create_match_room(req.host_user_id, req.host_username)
    return {"status": "created", "room": room}

@router.post("/match/join")
def join_room(req: MatchJoinRequest):
    try:
        room = join_match_room(req.room_code, req.user_id, req.username)
        return {"status": "joined", "room": room}
    except ValueError as err:
        raise HTTPException(status_code=404, detail=str(err))

@router.get("/match/state/{room_code}")
def fetch_match_state(room_code: str):
    try:
        state = get_match_state(room_code)
        return state
    except ValueError as err:
        raise HTTPException(status_code=404, detail=str(err))

@router.post("/match/guess")
def process_match_guess(req: MatchGuessSubmit):
    res = submit_match_guess(req.room_code, req.user_id, req.guess_text, req.seconds_taken)
    return res
