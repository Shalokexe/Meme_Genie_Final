# Meme Genie 🧞‍♂️ - v4.0.0-Beta Edition

> **"MADE BY MEMERS, MADE FOR MEMERS"** 🔥

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Beta Version](https://img.shields.io/badge/Release-v4.0.0--Beta-purple.svg)](https://github.com/Shalokexe/Meme_Genie_Final)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Meme Genie** is an interactive, full-stack meme-guessing platform, Web RAG engine, and multiplayer arena. Combining an **AI mind-reading engine**, an **iPhone / iOS Liquid Crystal UI**, **Meme Audio Soundboard**, **Genie Personalities**, **Global Leaderboards**, **Free RAG Web Search Engine**, **Genie Quick Chat with profanity censorship**, a **Friend Request system**, and **5-Round competitive speed guessing matches**, Meme Genie delivers the ultimate meme trivia experience.

---

## ✨ Beta Features (v4.0.0-Beta)

### 🔊 Meme Audio Soundboard & Genie Personalities
- **Web Audio Sound FX**: Synthesizes iconic meme sounds directly in the browser (*Vine Boom 💥*, *Bruh 🗿*, *Airhorn 🎺*, *Sad Violin 🎻*, *Braww 🐕*).
- **Genie Vibe Personalities**: Choose Genie's mood (*Classic 🧞‍♂️*, *Sassy 💅*, *Hypebeast 🧢*, *Boomer 👓*).

### 📊 Global Leaderboard & Daily Trivia Challenge
- **Daily Meme Dash**: Guess 3 memes as fast as possible to claim +200 Bonus XP.
- **Global Public Leaderboard**: Ranks top memers worldwide by XP and Level.

### 🔮 Single-Player Genie Reader
- **Genie Mind-Reading Engine**: Asks strategic binary trait questions.
- **Dynamic Candidate Splitting**: Calculates tag entropy to narrow down candidate memes.
- **Real-Time Confidence Indicator**: Tracks Genie's mind-reading confidence percentage (0% – 100%).

### 🔍 Free RAG Web Search Engine
- **Live Internet Retrieval**: Search any meme, catchphrase, or viral trend live from the web for free.
- **Grok AI & Free Provider Fallback**: Uses free web search scrapers + Grok AI API fallback (`GROK_API_KEY`).
- **1-Click Publishing to Genie Memory**: Import live web search results straight into Genie Memory.

### 🎨 In-App Meme Creator Studio
- **HTML5 Canvas Meme Editor**: Custom top & bottom text with classic bold meme typography.
- **1-Click Publishing & PNG Download**: Export customized memes to your device or publish to Genie memory.

### ⚔️ 5-Round Speed Match Arena
- **Competitive Friend Matches**: Host or join 5-round game rooms via room code (e.g. `ROOM-777`).
- **WebSockets Real-Time Sync**: Instant zero-latency player join alerts, speed guess submissions, and synchronized round advancement.

---

## 📁 Repository Structure

```
Meme_Genie_Final/
├── backend/
│   ├── main.py              # FastAPI app (v4.0.0-Beta), CORSMiddleware, static route mounting
│   ├── game_engine.py       # Single-player tag-scoring engine & session memory
│   ├── rag_engine.py        # Free RAG Web Search Engine & Grok AI integration
│   ├── chat_engine.py       # Genie Quick Chat engine & profanity sanitization
│   ├── friend_engine.py     # User profiles, XP leveling & Crystal Orb skin switcher
│   ├── match_engine.py      # 5-Round match room speed-scoring engine
│   ├── speech_to_text.py    # Voice recognition parsing helpers
│   ├── db/
│   │   ├── mongo.py         # MongoDB connector with embedded fallback memory store
│   │   └── seed.py          # Seeder dataset of 25 iconic memes
│   ├── models/
│   │   ├── meme_model.py    # Pydantic schemas for Meme & Game endpoints
│   │   └── user_model.py    # Pydantic schemas for Users, Friends, Chat & Match Rooms
│   └── routes/
│       ├── game_routes.py   # Game API routes (/start, /question, /answer)
│       ├── rag_routes.py    # Free RAG Web Search API routes (/rag/search, /rag/import)
│       ├── social_routes.py # Social API routes (/user, /friends, /chat, /match)
│       ├── leaderboard_routes.py # Global Leaderboard & Daily Challenge routes
│       └── websocket_routes.py # WebSockets real-time match room broadcaster (/ws/match)
├── frontend/
│   ├── index.html           # iOS Liquid Crystal layout, Soundboard, Leaderboard & RAG tab
│   ├── style.css            # Specular glass tokens, soundboard buttons & skin orb themes
│   └── game.js              # Soundboard synth, Genie personalities, WebSockets & RAG handlers
├── README.md                # Project documentation
└── WORKSCRIPT.md            # Active project log & roadmap
```

---

## ⚡ Quickstart Guide

### 1. Install Dependencies
```bash
pip install fastapi uvicorn pymongo pydantic
```

### 2. Launch Backend Server
```bash
uvicorn backend.main:app --reload --port 8000
```

### 3. Play Meme Genie!
Open your browser and navigate to:
```
http://127.0.0.1:8000/
```

---

## 📜 License & Credits

Built with ❤️ by **Memers for Memers**. Released under the MIT License.
