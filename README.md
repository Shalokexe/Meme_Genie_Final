# Meme Genie 🧞‍♂️

> **"MADE BY MEMERS, MADE FOR MEMERS"** 🔥

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=flat&logo=python)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Meme Genie** is an interactive, full-stack meme-guessing platform and multiplayer arena. Combining an **Akinator-style AI mind-reading engine**, an **iPhone / iOS Liquid Crystal UI**, **Among Us style quick chat with profanity censorship**, a **Friend Request system**, and **5-Round competitive speed guessing matches**, Meme Genie delivers the ultimate meme trivia experience.

---

## ✨ Features at a Glance

### 🔮 Single-Player Genie Reader
- **Akinator-Style Scoring Engine**: Asks strategic binary trait questions (music, old classic, trolling, global popularity, dialogue, animal, cartoon/anime, gaming, reaction face).
- **Dynamic Candidate Splitting**: Calculates tag entropy to narrow down candidate memes.
- **Real-Time Confidence Indicator**: Tracks Genie's mind-reading confidence percentage (0% – 100%).
- **Web Speech Voice Control**: Built-in speech synthesis (Genie talking questions) and voice recognition (listening to user answers).

### ⚔️ 5-Round Speed Match Arena
- **Competitive Friend Matches**: Host or join 5-round game rooms via room code (e.g. `ROOM-777`).
- **Speed-Based Scoring**: Points awarded based on speed (`100 base pts + time bonus + 50 pt first-guesser bonus`).
- **Live Leaderboard**: Real-time room scoreboard updated after every round.

### 💬 Among Us Style Chat (with Profanity Filter)
- **Quick Chat Wheel**: One-tap pre-set bubbles (*"Sus... 🧐"*, *"I got it! ⚡"*, *"Fastest meme in the west! 🤠"*, *"Who guessed that?! 😱"*, *"GG! 🎮"*).
- **Automated Profanity Filter**: Sanitizes restricted words into `🧼[MEME SANITIZED]`.

### 👥 Friend Request System
- **Memer Handles & Avatars**: Custom handles with avatars (🗿 GigaChad, 🐕 Doge, 🐸 Pepe, 😎 Cool Memer).
- **Friend Management**: Send friend requests, accept/decline pending requests, and view online friends.

### 💎 iPhone Liquid Crystal UI
- **Specular Glass Panels**: Multi-layered frosted glass (`backdrop-filter: blur(40px) saturate(210%)`).
- **iOS Dynamic Island Header**: Top header pill bar housing profile, audio toggle, and tagline.
- **HTML5 Crystal Particle Canvas**: Background floating dust stars reacting to mouse physics.
- **3D Card Tilt Effects**: Interactive perspective tilt on mouse hover.
- **Genie Crystal Orb**: 3D orb with pulsating aura rings and dynamic state badges.

---

## 📁 Repository Structure

```
Meme_Genie_Final/
├── backend/
│   ├── main.py              # FastAPI app, CORSMiddleware, static route mounting
│   ├── game_engine.py       # Single-player tag-scoring engine & session memory
│   ├── chat_engine.py       # Among Us chat engine & profanity sanitization
│   ├── friend_engine.py     # User profiles & friend request management
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
│       └── social_routes.py # Social API routes (/user, /friends, /chat, /match)
├── frontend/
│   ├── index.html           # iOS Liquid Crystal HTML layout & Genie Crystal Orb
│   ├── style.css            # Specular glass tokens, squircle cards & spring press states
│   └── game.js              # HTML5 particle canvas engine, 3D mouse tilt & sound synthesis
├── .gitignore               # Excludes bytecode & cache files
├── README.md                # Project documentation
└── WORKSCRIPT.md            # Active project log & roadmap
```

---

## ⚡ Quickstart Guide

### Prerequisites
- Python 3.10+
- (Optional) MongoDB running on `mongodb://localhost:27017/` (*If MongoDB is offline, Meme Genie seamlessly uses its embedded seed memory dataset!*)

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
*(Or simply double-click `frontend/index.html`)*

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Diagnostic connection status & meme count |
| `POST` | `/api/start` | Creates a new game session with a unique UUID |
| `GET` | `/api/question` | Fetches next optimal question or final guess payload |
| `POST` | `/api/answer` | Submits Yes/No/Skip answer & updates candidate weights |
| `GET` | `/api/memes` | Retrieves all loaded memes |
| `POST` | `/api/memes` | Submits a new meme into database |
| `POST` | `/api/user/profile` | Registers or loads user profile handle |
| `POST` | `/api/friends/request` | Sends friend request to target username |
| `POST` | `/api/friends/action` | Accepts or declines pending friend request |
| `GET` | `/api/friends/list/{id}`| Lists online friends & pending requests |
| `POST` | `/api/chat/send` | Sends chat message (auto-sanitizes profanity) |
| `GET` | `/api/chat/messages/{room}`| Fetches room chat message feed |
| `POST` | `/api/match/create` | Hosts a new 5-Round Match Room |
| `POST` | `/api/match/join` | Joins a match room by code |
| `POST` | `/api/match/guess` | Submits a speed guess & awards points |

---

## 📜 License & Credits

Built with ❤️ by **Memers for Memers**. Released under the MIT License.
