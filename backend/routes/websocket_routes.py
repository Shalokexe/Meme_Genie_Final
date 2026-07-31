import json
import logging
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

logger = logging.getLogger("websocket_manager")
router = APIRouter()

class ConnectionManager:
    """Manages active WebSockets connections per match room code."""
    def __init__(self):
        # { room_code: { user_id: WebSocket } }
        self.active_rooms: Dict[str, Dict[str, WebSocket]] = {}

    async def connect(self, room_code: str, user_id: str, websocket: WebSocket):
        await websocket.accept()
        if room_code not in self.active_rooms:
            self.active_rooms[room_code] = {}
        self.active_rooms[room_code][user_id] = websocket
        logger.info(f"WebSocket connected: {user_id} in {room_code}")

    def disconnect(self, room_code: str, user_id: str):
        if room_code in self.active_rooms and user_id in self.active_rooms[room_code]:
            del self.active_rooms[room_code][user_id]
            if not self.active_rooms[room_code]:
                del self.active_rooms[room_code]

    async def broadcast(self, room_code: str, message: dict):
        if room_code in self.active_rooms:
            disconnected = []
            for uid, ws in self.active_rooms[room_code].items():
                try:
                    await ws.send_json(message)
                except Exception:
                    disconnected.append(uid)
            for uid in disconnected:
                self.disconnect(room_code, uid)

manager = ConnectionManager()

@router.websocket("/ws/match/{room_code}/{user_id}")
async def websocket_match_endpoint(websocket: WebSocket, room_code: str, user_id: str):
    await manager.connect(room_code, user_id, websocket)
    # Broadcast player join event
    await manager.broadcast(room_code, {
        "type": "PLAYER_JOINED",
        "user_id": user_id,
        "room_code": room_code
    })
    
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            event_type = payload.get("type", "CHAT")
            
            # Broadcast incoming message/typing status to room
            await manager.broadcast(room_code, {
                "type": event_type,
                "user_id": user_id,
                "payload": payload
            })
    except WebSocketDisconnect:
        manager.disconnect(room_code, user_id)
        await manager.broadcast(room_code, {
            "type": "PLAYER_LEFT",
            "user_id": user_id,
            "room_code": room_code
        })
    except Exception as err:
        logger.error(f"WebSocket error: {err}")
        manager.disconnect(room_code, user_id)
