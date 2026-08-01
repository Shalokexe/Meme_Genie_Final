# Meme Genie 🧞‍♂️ - Project Workscript & Implementation Log

**Date:** July 31, 2026  
**Tagline:** MADE BY MEMERS, MADE FOR MEMERS 🔥  
**Edition:** RAG Web Search, WebSockets, Meme Studio & XP Leveling Edition Complete

---

## 1. Executive Summary & Codebase Architecture

The **Meme Genie** application has been upgraded with four major systems:
1. **Free RAG Web Search Engine** (`GET /api/rag/search` & `POST /api/rag/import`): Real-time internet meme retrieval combining free web search scrapers with Grok AI (xAI API) fallback (`GROK_API_KEY`).
2. **Strict Original Brand Integrity**: 100% scrubbed all external game name references across all backend code, frontend UI elements, and documentation files.
3. **WebSockets Real-Time Match Sync** (`WS /api/ws/match/{room_code}/{user_id}`) for zero-latency multiplayer rooms.
4. **In-App Meme Creator Studio** featuring HTML5 Canvas text rendering, **1-Click Publishing** to Genie's memory, and `.png` image downloads.

### 📁 Refactored Project Structure
```
Meme_Genie_Final/
├── backend/
│   ├── main.py              # FastAPI entrypoint (WebSockets, game, social, RAG routers & static root mounting)
│   ├── game_engine.py       # Single-player tag-scoring engine & session memory
│   ├── rag_engine.py        # Free RAG Web Search Engine & Grok AI integration
│   ├── chat_engine.py       # Genie Quick Chat engine & profanity sanitization
│   ├── friend_engine.py     # User profiles, XP leveling, badges & crystal orb skin switcher
│   ├── match_engine.py      # 5-Round competitive match room engine & speed-based scoring
│   ├── speech_to_text.py    # Audio transcription & voice command helper
│   ├── db/
│   │   ├── mongo.py         # Resilient MongoDB connector & fallback memory dataset
│   │   └── seed.py          # Seeder dataset of 25 iconic memes
│   ├── models/
│   │   ├── meme_model.py    # Pydantic schemas for Meme & Game endpoints
│   │   └── user_model.py    # Pydantic schemas for Users, Friends, Chat, Match Rooms & Skins
│   └── routes/
│       ├── game_routes.py   # Single player game API routes (/start, /question, /answer)
│       ├── rag_routes.py    # Free RAG Web Search API routes (/rag/search, /rag/import)
│       ├── social_routes.py # Social API routes (/user, /friends, /chat, /match, /equip-skin, /award-xp)
│       └── websocket_routes.py # WebSockets real-time match room broadcaster (/ws/match)
├── frontend/
│   ├── index.html           # iOS Liquid Crystal layout, Genie Crystal Orb, RAG search & Meme Studio tab
│   ├── style.css            # Specular glass tokens, squircle cards & skin orb themes
│   └── game.js              # RAG web search fetch handler, HTML5 particle canvas engine, Meme Studio, WebSockets
├── README.md                # Quickstart instructions
└── WORKSCRIPT.md            # Active project log & future feature backlog
```

---

## 2. Completed Features Today

- [x] **Scrubbed External Game References**:
  - Removed all occurrences of external game names across `index.html`, `game.js`, `style.css`, `main.py`, `chat_engine.py`, `game_engine.py`, `social_routes.py`, `README.md`, and `WORKSCRIPT.md`.

- [x] **Free RAG & Web Search Engine (`backend/rag_engine.py` & `backend/routes/rag_routes.py`)**:
  - Free web search query execution (DuckDuckGo HTML search / Grok AI API).
  - RAG context builder extracting meme name, origin year, description, and image URL.
  - `GET /api/rag/search` and `POST /api/rag/import` endpoints.

- [x] **WebSockets Real-Time Sync (`backend/routes/websocket_routes.py`)**:
  - Zero-latency match room WebSockets broadcasting `PLAYER_JOINED`, `SPEED_GUESS`, `ROUND_ADVANCED`, and `PLAYER_LEFT` events.

- [x] **In-App Meme Creator Studio (`frontend/`)**:
  - HTML5 Canvas Meme Editor supporting top & bottom meme typography, text colors, font sizes, template selection, `.png` file download, and **1-Click Publishing** straight into Genie's memory.

---

## 3. Quickstart Command

```bash
uvicorn backend.main:app --reload --port 8000
```

---

*Document updated on July 31, 2026 after completing Free RAG Web Engine & Brand Cleanup.*
