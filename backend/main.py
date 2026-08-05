import os
import sys

# Ensure backend directory is in sys.path for direct module imports
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from routes.game_routes import router as game_router
from routes.social_routes import router as social_router
from routes.websocket_routes import router as ws_router
from routes.rag_routes import router as rag_router
from routes.leaderboard_routes import router as leaderboard_router

app = FastAPI(
    title="Meme Genie 🧞‍♂️ API",
    description="Interactive Meme Mind Reader, WebSockets Arena, Meme Studio, RAG Engine & Global Leaderboards",
    version="4.0.0-beta"
)

# Enable CORS for cross-origin browser fetch calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include game, social, WebSocket, RAG, and Leaderboard API routes under /api
app.include_router(game_router, prefix="/api")
app.include_router(social_router, prefix="/api")
app.include_router(ws_router, prefix="/api")
app.include_router(rag_router, prefix="/api")
app.include_router(leaderboard_router, prefix="/api")

# Mount frontend static files directly at / (after API routes) so index.html, style.css, and game.js resolve seamlessly
frontend_path = os.path.abspath(os.path.join(backend_dir, "..", "frontend"))
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
