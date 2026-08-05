import os
import sys

# Ensure backend directory is in python module search path
backend_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.abspath(os.path.join(backend_dir, ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if project_dir not in sys.path:
    sys.path.insert(0, project_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes import game_routes, rag_routes, social_routes, leaderboard_routes, websocket_routes, economy_routes, onboarding_routes, feed_routes

app = FastAPI(
    title="Meme Genie API 🧞‍♂️",
    description="Full-stack AI Meme Mind-Reader, Memer Portal & Stock Market (v5.0.0-Beta)",
    version="5.0.0"
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(game_routes.router, prefix="/api")
app.include_router(rag_routes.router, prefix="/api")
app.include_router(social_routes.router, prefix="/api")
app.include_router(leaderboard_routes.router, prefix="/api")
app.include_router(websocket_routes.router, prefix="/api")
app.include_router(economy_routes.router, prefix="/api")
app.include_router(onboarding_routes.router, prefix="/api")
app.include_router(feed_routes.router, prefix="/api")

# Serve Frontend static assets
frontend_dir = os.path.join(project_dir, "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
