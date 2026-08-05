import json
import asyncio
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

# Active searching queue: list of dicts {"user_id": str, "username": str, "meme_iq": int, "websocket": WebSocket}
VIDEO_SEARCH_QUEUE: List[dict] = []

# Active paired sessions: {user_id: peer_user_id}
ACTIVE_PAIRS: Dict[str, str] = {}
ACTIVE_CONNECTIONS: Dict[str, WebSocket] = {}

@router.websocket("/ws/memetv/{user_id}/{username}/{meme_iq}")
async def memetv_websocket_endpoint(websocket: WebSocket, user_id: str, username: str, meme_iq: int):
    await websocket.accept()
    ACTIVE_CONNECTIONS[user_id] = websocket
    
    try:
        while True:
            data_text = await websocket.receive_text()
            data = json.loads(data_text)
            action = data.get("action")
            
            if action == "search":
                # Add user to search queue if not present
                if not any(q["user_id"] == user_id for q in VIDEO_SEARCH_QUEUE):
                    VIDEO_SEARCH_QUEUE.append({
                        "user_id": user_id,
                        "username": username,
                        "meme_iq": meme_iq,
                        "websocket": websocket
                    })
                
                # Attempt to find match in queue with similar Meme IQ
                matched_peer = None
                for candidate in VIDEO_SEARCH_QUEUE:
                    if candidate["user_id"] != user_id:
                        matched_peer = candidate
                        break
                        
                if matched_peer:
                    # Remove both from search queue
                    VIDEO_SEARCH_QUEUE[:] = [q for q in VIDEO_SEARCH_QUEUE if q["user_id"] not in (user_id, matched_peer["user_id"])]
                    
                    ACTIVE_PAIRS[user_id] = matched_peer["user_id"]
                    ACTIVE_PAIRS[matched_peer["user_id"]] = user_id
                    
                    # Notify initiator to create WebRTC offer
                    await websocket.send_json({
                        "type": "match_found",
                        "peer_user_id": matched_peer["user_id"],
                        "peer_username": matched_peer["username"],
                        "peer_meme_iq": matched_peer["meme_iq"],
                        "is_initiator": True
                    })
                    
                    # Notify receiver
                    await matched_peer["websocket"].send_json({
                        "type": "match_found",
                        "peer_user_id": user_id,
                        "peer_username": username,
                        "peer_meme_iq": meme_iq,
                        "is_initiator": False
                    })
            
            elif action in ("signal_offer", "signal_answer", "ice_candidate"):
                peer_id = ACTIVE_PAIRS.get(user_id)
                if peer_id and peer_id in ACTIVE_CONNECTIONS:
                    peer_ws = ACTIVE_CONNECTIONS[peer_id]
                    await peer_ws.send_json({
                        "type": action,
                        "sender_id": user_id,
                        "payload": data.get("payload")
                    })
            
            elif action == "next_stranger" or action == "disconnect":
                peer_id = ACTIVE_PAIRS.pop(user_id, None)
                if peer_id:
                    ACTIVE_PAIRS.pop(peer_id, None)
                    if peer_id in ACTIVE_CONNECTIONS:
                        await ACTIVE_CONNECTIONS[peer_id].send_json({"type": "peer_disconnected"})
                        
                VIDEO_SEARCH_QUEUE[:] = [q for q in VIDEO_SEARCH_QUEUE if q["user_id"] == user_id]
                
    except WebSocketDisconnect:
        ACTIVE_CONNECTIONS.pop(user_id, None)
        peer_id = ACTIVE_PAIRS.pop(user_id, None)
        if peer_id:
            ACTIVE_PAIRS.pop(peer_id, None)
            if peer_id in ACTIVE_CONNECTIONS:
                try:
                    await ACTIVE_CONNECTIONS[peer_id].send_json({"type": "peer_disconnected"})
                except Exception:
                    pass
        VIDEO_SEARCH_QUEUE[:] = [q for q in VIDEO_SEARCH_QUEUE if q["user_id"] != user_id]
