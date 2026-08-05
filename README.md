<div align="center">

```
             .---.
            /     \
           | () () |  ✨ "YOUR MEME IS MY COMMAND!" ✨
            \  ^  /
             '|||'
              |||
         .---'   '---.
        /  .-------.  \
       /  /  MEME   \  \
      /  |   GENIE   |  \
     |   |   🧞‍♂️      |   |
      \  \           /  /
       \  '---------'  /
        '---.     .---'
             |   |
             |   |     ☁️ ~* Smoke Rising *~
            /     \    ☁️
      .----'       '----.
     /   _           _   \
    /   / \         / \   \
   |   |   |_______|   |   |
   |   |   '-------'   |   |
    \   \             /   /
     '---'-----------'---'
         \_________/  👈 THE MAGIC MEME POT 🏺
```

# 🧞‍♂️ Meme Genie — v4.1.0-Beta
### *The Ultimate AI Meme Mind-Reader, Stock Exchange & RAG Engine*

> **"MADE BY MEMERS, MADE FOR MEMERS"** 🔥

---

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Release](https://img.shields.io/badge/Release-v4.1.0--Beta-9945FF.svg?style=for-the-badge&logo=sparkles&logoColor=white)](https://github.com/Shalokexe/Meme_Genie_Final)
[![License](https://img.shields.io/badge/License-MIT-FF69B4.svg?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 What is Meme Genie?

**Meme Genie** is an interactive, full-stack meme-guessing platform, virtual stock market, internet longevity hall of fame, Web RAG engine, and zero-latency multiplayer arena. Built with an **iPhone / iOS Liquid Crystal Glassmorphism UI**, Meme Genie reads your mind to reveal what viral meme you are thinking of!

```
                  ┌────────────────────────────────────────┐
                  │   🔮 1. THINK OF ANY VIRAL MEME        │
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────────┐
                  │   🤔 2. ANSWER STRATEGIC TRAIT QUESTIONS│
                  └──────────────────┬─────────────────────┘
                                     │
                                     ▼
                  ┌────────────────────────────────────────┐
                  │   ✨ 3. GENIE REVEALS YOUR MEME!       │
                  └────────────────────────────────────────┘
```

---

## 🔥 Key Revolutionary Features

### 🔮 1. AI Mind-Reading Engine
- **Entropy Tag-Scoring Matrix**: Asks binary trait questions (music, era, trolling, global popularity, animals, face reactions, gaming).
- **Dynamic Candidate Splitting**: Calculates optimal question paths to narrow down candidate memes.
- **Web Speech AI Voice**: Full voice control (Genie speaks questions & listens for voice answers).

### 📈 2. MemeX Virtual Stock Exchange (Meme Economy)
- **Live Stock Ticker Tape**: Real-time scrolling stock tickers (`$CHAD ▲ +5.2% | $DOGE ▲ +12.4% | $RICK ▼ -1.5% | $PEPE ▲ +8.7%`).
- **Buy & Sell Shares**: Trade shares in viral memes using virtual MEME coins to build your investment portfolio.
- **Dynamic Price Fluctuation Engine**: Meme stock prices fluctuate based on trade volume and simulated internet trends.

### 🏆 3. Immortal Meme Hall of Fame & Longevity Analytics
- **Internet Usage Duration**: Displays exact viral lifespan metrics (*e.g. Rickroll: 19 Years Active, 2007 – Present*).
- **Peak Virality Score**: Ranks viral legends by longevity and peak virality score.
- **Golden Community Upvotes**: 1-Click community upvoting for Hall of Fame memes.

### 🔍 4. Free RAG Web Search Engine & Grok AI Integration
- **Live Web Retrieval**: Search any meme or catchphrase live from the web for free (DuckDuckGo scraper + Grok AI `xAI` API fallback).
- **1-Click Publishing**: Import live web-retrieved memes directly into Genie's Mind Memory.

### 🎨 5. In-App Meme Creator Studio
- **HTML5 Canvas Meme Editor**: Classic Impact meme typography (white fill, black outline stroke).
- **PNG Downloader**: Export custom memes to your device or 1-click publish to Genie memory.

### ⚔️ 6. 5-Round Speed Match Arena (WebSockets)
- **Zero-Latency WebSocket Rooms**: Live player join alerts, speed guess submissions, and synchronized round advancement.
- **Speed Scoring**: Points awarded based on guess speed (`100 base pts + time bonus + 50 pt first guesser bonus`).

### 🔊 7. Meme Soundboard & Genie Personalities
- **Web Audio Sound FX**: Synthesizes meme sound effects (*Vine Boom 💥*, *Bruh 🗿*, *Airhorn 🎺*, *Sad Violin 🎻*, *Braww 🐕*).
- **Genie Vibe Personalities**: Choose Genie's mood (*Classic 🧞‍♂️*, *Sassy 💅*, *Hypebeast 🧢*, *Boomer 👓*).

---

## 📁 Codebase Architecture

```
Meme_Genie_Final/
├── backend/
│   ├── main.py              # FastAPI app (v4.1.0-Beta), CORSMiddleware, static route mounting
│   ├── game_engine.py       # Tag-scoring engine & session memory
│   ├── rag_engine.py        # Free RAG Web Search Engine & Grok AI integration
│   ├── economy_engine.py    # MemeX Virtual Stock Market & trading engine
│   ├── hall_of_fame_engine.py # Internet longevity analytics & Hall of Fame
│   ├── chat_engine.py       # Quick Chat engine & profanity sanitization
│   ├── friend_engine.py     # User profiles, XP leveling & Crystal Orb skins
│   ├── match_engine.py      # 5-Round competitive match room engine
│   ├── db/
│   │   ├── mongo.py         # Resilient MongoDB connector & fallback memory dataset
│   │   └── seed.py          # Initial dataset of 25 iconic memes
│   ├── models/
│   │   ├── meme_model.py    # Pydantic schemas for Meme & Game endpoints
│   │   └── user_model.py    # Pydantic schemas for Users, Economy & Match Rooms
│   └── routes/
│       ├── game_routes.py   # Single player game API routes
│       ├── rag_routes.py    # Free RAG Web Search API routes
│       ├── social_routes.py # User, Friends & Chat API routes
│       ├── leaderboard_routes.py # Global Leaderboard & Daily Challenge routes
│       ├── economy_routes.py # MemeX trading & Hall of Fame routes
│       └── websocket_routes.py # WebSockets match room broadcaster
├── frontend/
│   ├── index.html           # iOS Liquid Crystal layout, Ticker Tape, Soundboard & Tabs
│   ├── style.css            # Specular glass tokens, squircle cards & skin orb themes
│   └── game.js              # Soundboard synth, MemeX trading, WebSockets & RAG handlers
├── README.md                # Dynamic README documentation
└── WORKSCRIPT.md            # Project workscript log
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

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/start` | Starts a new mind-reading game session |
| `GET` | `/api/question` | Fetches next optimal trait question or final guess |
| `POST` | `/api/answer` | Submits Yes/No/Skip answer & updates candidate weights |
| `GET` | `/api/economy/market` | Returns live MemeX stock market prices & ticker tape |
| `POST` | `/api/economy/trade` | Executes buy/sell order for meme stock shares |
| `GET` | `/api/halloffame/rankings` | Returns Hall of Fame memes ranked by longevity & votes |
| `POST` | `/api/halloffame/vote` | Upvotes a Hall of Fame meme |
| `GET` | `/api/rag/search` | Performs free live RAG web search retrieval |
| `POST` | `/api/rag/import` | Imports web search meme directly into Genie memory |
| `WS` | `/api/ws/match/{room}/{uid}` | WebSockets real-time match room stream |

---

<div align="center">

### 📜 License & Credits
Built with ❤️ by **Memers for Memers**. Released under the **MIT License**.

***"MADE BY MEMERS, MADE FOR MEMERS"*** 🔥

</div>
