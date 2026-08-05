/**
 * Meme Genie 🧞‍♂️ - ASCII Magic & MemeX Engine (v4.1.0-Beta)
 * "MADE BY MEMERS, MADE FOR MEMERS"
 * Features Frame-by-Frame Animated ASCII Genie, MemeX Virtual Stock Market,
 * Longevity Analytics Hall of Fame, Web Audio Soundboard & RAG Search.
 */

const API_BASE = "http://127.0.0.1:8000/api";

// User State
let currentUser = {
    user_id: "usr_guest_" + Math.floor(Math.random() * 1000),
    username: "MemerGuest_" + Math.floor(Math.random() * 100),
    avatar_emoji: "😎",
    xp: 150,
    level: 1,
    coins: 1000,
    portfolio: {},
    badges: ["Meme Novice"],
    active_skin: "cyan"
};

let currentGeniePersonality = "classic";
let currentSessionId = null;
let activeMatchRoomCode = null;
let matchRoundStartTime = null;
let soundEnabled = true;
let voiceModeActive = false;
let speechSynth = window.speechSynthesis;
let matchWebSocket = null;
let chatPollInterval = null;
let matchPollInterval = null;

// Multi-Frame Animated ASCII Genie Rising from Magic Pot
const ASCII_GENIE_FRAMES = [
`
             ☁️
            ☁️ ☁️
           (     )
          (  ✨   )
           (     )
            \   /
             '-'
         .---.
        /  🏺 \   [ FRAME 1: The Magic Pot slumbers... ]
       |_______|
`,
`
            .---.
           /     \    ☁️
          |  o.o  |  ✨
           \  ^  /
            '| |'
             | |      ☁️ ~* Magic Smoke Rising! *~
            /   \
        .---'   '---.
       /     🏺     \ [ FRAME 2: The Genie emerges! ]
      |_______________|
`,
`
            .---.
           /     \   ✨
          |  () () |   "YOUR MEME IS MY COMMAND!"
           \  ===  /
            '|||'
             |||
        .---'   '---.
       /   .-----.   \   ✨
      /   /  MEME \   \
     |   |   GENIE |   |
      \   \       /   /  [ FRAME 3: Full Power Unlocked! ]
       '---'--🏺--'---'
`,
`
            ✨ 🧞‍♂️ ✨
             .---.
            /     \   💥 "I HAVE READ YOUR MEME MIND!" 💥
           |  ⚡ ⚡ |
            \  ===  /
             '|||'
              |||
         .---'   '---.
        /  .-------.  \
       /  /  MEME   \  \
      |   |  GENIE  |   |
       \  \  🏺🏺  /  /   [ FRAME 4: SUPREME MEME OVERLORD ]
        '---'-----'---'
`
];

let currentAsciiFrame = 0;
let asciiAnimInterval = null;

function startAsciiAnimationLoop() {
    if (asciiAnimInterval) clearInterval(asciiAnimInterval);
    const box = document.getElementById("asciiGenieBox");
    if (!box) return;

    asciiAnimInterval = setInterval(() => {
        currentAsciiFrame = (currentAsciiFrame + 1) % ASCII_GENIE_FRAMES.length;
        box.innerText = ASCII_GENIE_FRAMES[currentAsciiFrame];
    }, 700);
}

function triggerAsciiSummon() {
    playMemeFx('vineboom');
    currentAsciiFrame = 3;
    const box = document.getElementById("asciiGenieBox");
    if (box) box.innerText = ASCII_GENIE_FRAMES[3];
}

// Template Preset Images for Meme Studio
const MEME_TEMPLATES = {
    "gigachad": "https://i.kym-cdn.com/entries/icons/original/000/026/152/gigachad.jpg",
    "doge": "https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg",
    "drake": "https://i.kym-cdn.com/entries/icons/original/000/019/649/Drake_Hotline_Bling.jpg",
    "distracted_bf": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop",
    "woman_cat": "https://i.kym-cdn.com/entries/icons/original/000/031/015/cover5.jpg",
    "rickroll": "https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif"
};

// HTML5 Canvas Crystal Particle Engine
let canvas, ctx;
let particles = [];
const particleCount = 45;
let mousePos = { x: -100, y: -100 };

function initCrystalParticles() {
    canvas = document.getElementById("crystalCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });

    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.8,
            speedY: (Math.random() - 0.5) * 0.8,
            color: ['#00f2fe', '#38bdf8', '#c084fc', '#f472b6', '#fbbf24'][Math.floor(Math.random() * 5)],
            alpha: Math.random() * 0.7 + 0.3
        });
    }
    animateParticles();
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const dx = mousePos.x - p.x;
        const dy = mousePos.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
            p.x -= (dx / dist) * 1.6;
            p.y -= (dy / dist) * 1.6;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    requestAnimationFrame(animateParticles);
}

// 3D Card Perspective Mouse Tilt Engine
function init3DCrystalTilt() {
    document.querySelectorAll(".tilt-card").forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        });
    });
}

// Web Audio API Synthesizer & Meme Soundboard Engine
let audioCtx = null;
function getAudioContext() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playMagicSound(type) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'victory') {
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.type = 'sine';
                o.frequency.setValueAtTime(freq, now + (idx * 0.1));
                g.gain.setValueAtTime(0.22, now + (idx * 0.1));
                g.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.1) + 0.3);
                o.start(now + (idx * 0.1));
                o.stop(now + (idx * 0.1) + 0.3);
            });
        }
    } catch (e) {}
}

function playMemeFx(fxName) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        if (fxName === 'vineboom') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(130, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        } else if (fxName === 'bruh') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.4);
            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (fxName === 'airhorn') {
            [466.16, 466.16, 466.16, 622.25].forEach((freq, idx) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.type = 'square';
                const startTime = now + (idx * 0.08);
                o.frequency.setValueAtTime(freq, startTime);
                g.gain.setValueAtTime(0.2, startTime);
                g.gain.exponentialRampToValueAtTime(0.01, startTime + 0.07);
                o.start(startTime);
                o.stop(startTime + 0.07);
            });
        } else if (fxName === 'sadviolin') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.linearRampToValueAtTime(415, now + 0.8);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
            osc.start(now);
            osc.stop(now + 0.8);
        } else if (fxName === 'braww') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.3);
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (e) {}
}

// Genie Personality System
function changeGeniePersonality(val) {
    currentGeniePersonality = val;
    playMagicSound('click');
    const avatar = document.getElementById("genieAvatar");
    if (val === 'sassy') avatar.innerText = "💅";
    else if (val === 'hypebeast') avatar.innerText = "🧢";
    else if (val === 'boomer') avatar.innerText = "👓";
    else avatar.innerText = "🧞‍♂️";
}

// Tab Navigation Controls
function switchTab(tabName) {
    playMagicSound('click');
    document.querySelectorAll(".nav-tab").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));

    if (tabName === 'genie') {
        document.getElementById("tabGenie").classList.add("active");
        document.getElementById("viewGenie").classList.add("active");
    } else if (tabName === 'ascii') {
        document.getElementById("tabAscii").classList.add("active");
        document.getElementById("viewAscii").classList.add("active");
        startAsciiAnimationLoop();
    } else if (tabName === 'economy') {
        document.getElementById("tabEconomy").classList.add("active");
        document.getElementById("viewEconomy").classList.add("active");
        fetchMarketData();
    } else if (tabName === 'halloffame') {
        document.getElementById("tabHallOfFame").classList.add("active");
        document.getElementById("viewHallOfFame").classList.add("active");
        fetchHallOfFame();
    } else if (tabName === 'leaderboard') {
        document.getElementById("tabLeaderboard").classList.add("active");
        document.getElementById("viewLeaderboard").classList.add("active");
        fetchGlobalLeaderboard();
    } else if (tabName === 'rag') {
        document.getElementById("tabRag").classList.add("active");
        document.getElementById("viewRag").classList.add("active");
    } else if (tabName === 'studio') {
        document.getElementById("tabStudio").classList.add("active");
        document.getElementById("viewStudio").classList.add("active");
        updateStudioMemeCanvas();
    } else if (tabName === 'arena') {
        document.getElementById("tabArena").classList.add("active");
        document.getElementById("viewArena").classList.add("active");
    } else if (tabName === 'friends') {
        document.getElementById("tabFriends").classList.add("active");
        document.getElementById("viewFriends").classList.add("active");
        fetchFriendsList();
    } else if (tabName === 'chat') {
        document.getElementById("tabChat").classList.add("active");
        document.getElementById("viewChat").classList.add("active");
        fetchQuickChatPresets();
        startChatPolling();
    }
}

// User Profile & XP Sync
async function syncUserProfile() {
    try {
        const res = await fetch(`${API_BASE}/user/profile?username=${encodeURIComponent(currentUser.username)}&avatar_emoji=${encodeURIComponent(currentUser.avatar_emoji)}`, { method: "POST" });
        const data = await res.json();
        if (data && data.user_id) {
            currentUser = data;
            renderUserStatsUI();
        }
    } catch (e) {}
}

function renderUserStatsUI() {
    document.getElementById("userAvatar").innerText = currentUser.avatar_emoji;
    document.getElementById("userNameLabel").innerText = currentUser.username;
    document.getElementById("hdrLevel").innerText = currentUser.level || 1;
    document.getElementById("modalLevel").innerText = currentUser.level || 1;
    document.getElementById("userXp").innerText = currentUser.xp || 100;
    document.getElementById("hdrCoins").innerText = currentUser.coins || 1000;
    const mCoins = document.getElementById("marketCoinBalance");
    if (mCoins) mCoins.innerText = currentUser.coins || 1000;

    const xpPercent = Math.min(100, ((currentUser.xp % 250) / 250) * 100);
    document.getElementById("xpBarFill").style.width = `${xpPercent}%`;

    const bRow = document.getElementById("userBadgesRow");
    if (bRow) {
        bRow.innerHTML = (currentUser.badges || ["Meme Novice"]).map(b => `<span class="badge-pill">🏅 ${b}</span>`).join(" ");
    }

    if (currentUser.active_skin) {
        changeCrystalOrbSkin(currentUser.active_skin);
    }
}

async function changeCrystalOrbSkin(skinName) {
    currentUser.active_skin = skinName;
    const orb = document.getElementById("mainCrystalOrb");
    if (orb) {
        orb.className = `crystal-orb skin-${skinName}`;
    }
    try {
        await fetch(`${API_BASE}/user/equip-skin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.user_id, skin_name: skinName })
        });
    } catch (e) {}
}

function openProfileModal() { document.getElementById("profileModal").classList.add("active"); }
function closeProfileModal() { document.getElementById("profileModal").classList.remove("active"); }

async function saveUserProfile(e) {
    e.preventDefault();
    const newName = document.getElementById("profileUsernameInput").value;
    const newAvatar = document.getElementById("profileAvatarSelect").value;
    if (newName) {
        currentUser.username = newName;
        currentUser.avatar_emoji = newAvatar;
        await syncUserProfile();
        closeProfileModal();
        alert("✅ Profile & Skin updated! Welcome " + currentUser.username);
    }
}

// --- 📈 MEMEX STOCK EXCHANGE ---
async function fetchMarketData() {
    try {
        const res = await fetch(`${API_BASE}/economy/market`);
        const data = await res.json();
        
        const tape = document.getElementById("tickerTapeText");
        if (tape && data.ticker_tape) tape.innerText = "📈 MEMEX MARKET: " + data.ticker_tape;

        const grid = document.getElementById("stocksGrid");
        if (grid && data.stocks) {
            grid.innerHTML = data.stocks.map(s => {
                const isUp = s.change_pct >= 0;
                const owned = (currentUser.portfolio || {})[s.ticker] || 0;
                return `
                    <div class="stock-card">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong style="font-size:18px; color:var(--neon-cyan);">$${s.ticker}</strong>
                            <span class="${isUp ? 'price-up' : 'price-down'}">${isUp ? '▲' : '▼'} ${s.change_pct}%</span>
                        </div>
                        <div style="font-size:14px; font-weight:700;">${s.name}</div>
                        <div style="font-size:22px; font-weight:900; color:white;">🪙 ${s.price}</div>
                        <div style="font-size:12px; color:var(--text-secondary);">Owned: ${owned} shares</div>
                        <div style="display:flex; gap:8px; margin-top:8px;">
                            <button class="crystal-btn" style="flex:1; padding:6px; font-size:12px; background:var(--neon-green); color:black;" onclick="executeMemeTrade('${s.ticker}', 'buy')">Buy 1 Share</button>
                            <button class="crystal-btn" style="flex:1; padding:6px; font-size:12px; background:var(--neon-red); color:white;" onclick="executeMemeTrade('${s.ticker}', 'sell')">Sell 1 Share</button>
                        </div>
                    </div>
                `;
            }).join("");
        }
    } catch (e) {}
}

async function executeMemeTrade(ticker, action) {
    try {
        const res = await fetch(`${API_BASE}/economy/trade`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.user_id, ticker: ticker, action: action, shares: 1 })
        });
        const data = await res.json();
        if (res.ok) {
            playMagicSound('victory');
            currentUser.coins = data.user_coins;
            currentUser.portfolio = data.user_portfolio;
            renderUserStatsUI();
            fetchMarketData();
        } else {
            alert("Trade Error: " + (data.detail || "Transaction failed"));
        }
    } catch (e) {}
}

// --- 🏆 IMMORTAL MEME HALL OF FAME ---
async function fetchHallOfFame() {
    try {
        const res = await fetch(`${API_BASE}/halloffame/rankings`);
        const data = await res.json();
        const grid = document.getElementById("hofGrid");
        if (grid && data.rankings) {
            grid.innerHTML = data.rankings.map((m, idx) => `
                <div class="hof-card-item">
                    <div style="font-size:28px; font-weight:900; color:var(--neon-gold);">#${idx + 1}</div>
                    <div class="media-frame" style="max-width:160px; max-height:110px;">
                        <img src="${m.media_url}" alt="${m.name}">
                    </div>
                    <div style="flex:1;">
                        <h3 class="crystal-title" style="font-size:20px;">${m.name}</h3>
                        <div style="margin-top:4px;">
                            <span class="longevity-badge">⏳ Longevity: ${m.longevity}</span>
                            <span class="badge-pill" style="margin-left:6px; background:rgba(0,242,254,0.15); color:var(--neon-cyan);">⚡ Virality: ${m.peak_virality}%</span>
                        </div>
                        <p style="color:var(--text-secondary); font-size:13px; margin-top:6px;">${m.description || ''}</p>
                    </div>
                    <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                        <button class="crystal-btn" style="padding:8px 16px; font-size:13px; background:var(--ios-gold-gradient); color:#030308;" onclick="upvoteMeme('${m.id}')">🏆 Upvote (${m.upvotes})</button>
                    </div>
                </div>
            `).join("");
        }
    } catch (e) {}
}

async function upvoteMeme(memeId) {
    try {
        const res = await fetch(`${API_BASE}/halloffame/vote?meme_id=${memeId}`, { method: "POST" });
        if (res.ok) {
            playMagicSound('victory');
            fetchHallOfFame();
        }
    } catch (e) {}
}

// --- 📊 GLOBAL LEADERBOARD & DAILY CHALLENGE ---
async function fetchGlobalLeaderboard() {
    try {
        const res = await fetch(`${API_BASE}/leaderboard/global`);
        const data = await res.json();
        const tbody = document.getElementById("globalLeaderboardBody");
        if (data.leaderboard && data.leaderboard.length > 0) {
            tbody.innerHTML = data.leaderboard.map(u => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
                    <td style="padding:12px; font-weight:800; color:var(--neon-gold);">#${u.rank}</td>
                    <td style="padding:12px;">${u.avatar_emoji} <strong>${u.username}</strong></td>
                    <td style="padding:12px; text-align:center; font-weight:700;">Lvl ${u.level}</td>
                    <td style="padding:12px; text-align:center; color:var(--neon-cyan); font-weight:800;">${u.xp} XP</td>
                    <td style="padding:12px; text-align:right;">${(u.badges || []).map(b => `<span class="badge-pill" style="font-size:10px;">${b}</span>`).join(" ")}</td>
                </tr>
            `).join("");
        }
    } catch (e) {}
}

async function startDailyChallenge() {
    try {
        const res = await fetch(`${API_BASE}/challenge/daily`);
        const data = await res.json();
        alert(`📅 Starting ${data.challenge_name}! Guess all 3 memes correctly to claim +200 Bonus XP!`);
        startGame();
    } catch (e) {}
}

// --- 🔍 FREE RAG WEB SEARCH ENGINE ---
async function searchWebMemes() {
    const input = document.getElementById("ragQueryInput");
    const query = input.value.trim();
    if (!query) return;

    playMagicSound('click');
    const container = document.getElementById("ragResultsArea");
    container.innerHTML = `<div class="crystal-subpanel" style="text-align:center; padding:25px;"><p>🌐 Searching live web for meme '${query}' via RAG Engine...</p></div>`;

    try {
        const res = await fetch(`${API_BASE}/rag/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        renderRagResults(data);
    } catch (e) {
        container.innerHTML = `<div class="crystal-subpanel" style="text-align:center; padding:25px; color:#ef4444;"><p>Error connecting to RAG web engine.</p></div>`;
    }
}

function renderRagResults(data) {
    const container = document.getElementById("ragResultsArea");
    const meme = data.meme;
    const sources = data.sources || [];

    const sourcesHTML = sources.map(s => `
        <div style="background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:10px; margin-top:6px; font-size:12px;">
            <a href="${s.link}" target="_blank" style="color:var(--neon-cyan); font-weight:700; text-decoration:none;">🔗 ${s.title}</a>
            <p style="color:var(--text-secondary); margin-top:2px;">${s.snippet}</p>
        </div>
    `).join("");

    container.innerHTML = `
        <div class="crystal-subpanel" style="display:flex; flex-direction:column; gap:15px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="censor-badge" style="background:rgba(0,242,254,0.15); color:var(--neon-cyan);">🤖 Source: ${data.rag_source}</span>
                <button class="primary-btn crystal-btn" style="padding:6px 16px; font-size:13px;" onclick='importRagMeme(${JSON.stringify(meme)})'>📥 Import to Genie Memory</button>
            </div>

            <div style="display:flex; gap:20px; flex-wrap:wrap; align-items:center;">
                <div class="media-frame" style="max-width:260px; max-height:180px;">
                    <img src="${meme.media_url}" alt="${meme.name}">
                </div>
                <div style="flex:1;">
                    <h2 class="crystal-title" style="font-size:24px;">${meme.name}</h2>
                    <p style="color:#cbd5e1; font-size:14px; margin-top:6px;">${meme.description}</p>
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        ${(meme.tags || []).map(t => `<span class="quote-tag" style="background:rgba(192,132,252,0.2); color:var(--neon-purple); font-size:11px;">#${t}</span>`).join(" ")}
                    </div>
                </div>
            </div>

            <div style="margin-top:10px;">
                <h4 style="font-size:14px; color:var(--text-secondary);">🌐 Retrieved Web Sources:</h4>
                ${sourcesHTML || '<p style="font-size:12px; color:var(--text-secondary);">Web sources indexed.</p>'}
            </div>
        </div>
    `;
}

async function importRagMeme(memeObj) {
    try {
        const res = await fetch(`${API_BASE}/rag/import`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(memeObj)
        });
        if (res.ok) {
            alert(`✅ '${memeObj.name}' imported into Genie Memory!`);
            playMagicSound('victory');
        }
    } catch (e) { alert("Failed to import meme."); }
}

// --- 🎨 IN-APP MEME CREATOR STUDIO ---
function updateStudioMemeCanvas() {
    const canvas = document.getElementById("memeStudioCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const templateKey = document.getElementById("studioTemplateSelect").value;
    const topText = (document.getElementById("studioTopText").value || "WHEN YOU BUILD MEME GENIE").toUpperCase();
    const bottomText = (document.getElementById("studioBottomText").value || "ABSOLUTE GIGACHAD").toUpperCase();
    const fontSize = document.getElementById("studioFontSize").value || 32;
    const textColor = document.getElementById("studioTextColor").value || "#ffffff";

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = MEME_TEMPLATES[templateKey] || MEME_TEMPLATES["gigachad"];

    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        ctx.font = `900 ${fontSize}px ${currentUser.font_ios || 'Outfit'}, Impact, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = textColor;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = Math.max(3, fontSize / 8);

        ctx.strokeText(topText, canvas.width / 2, parseInt(fontSize) + 15);
        ctx.fillText(topText, canvas.width / 2, parseInt(fontSize) + 15);

        ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
        ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
    };
}

async function publishStudioMeme() {
    const templateKey = document.getElementById("studioTemplateSelect").value;
    const topText = document.getElementById("studioTopText").value || "Custom Meme";
    const bottomText = document.getElementById("studioBottomText").value || "Genie Memory";
    const memeName = `${topText} ${bottomText}`;
    const mediaUrl = MEME_TEMPLATES[templateKey] || MEME_TEMPLATES["gigachad"];

    try {
        const res = await fetch(`${API_BASE}/memes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: memeName,
                media_url: mediaUrl,
                format: "image",
                era: "2020s",
                tags: ["custom", "studio", "global"],
                quotes: [topText, bottomText],
                description: `Created by ${currentUser.username} in Meme Studio`
            })
        });
        if (res.ok) {
            alert("🚀 1-Click Published! Your meme is now inside Genie's Memory!");
            playMagicSound('victory');
            await fetch(`${API_BASE}/user/award-xp?user_id=${currentUser.user_id}&xp_amount=50&badge=Meme%20Picasso`, { method: "POST" });
            syncUserProfile();
        }
    } catch (e) { alert("Failed to publish meme."); }
}

function downloadStudioMeme() {
    const canvas = document.getElementById("memeStudioCanvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `MemeGenie_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    playMagicSound('click');
}

// --- ⚡ WEBSOCKETS REAL-TIME MATCH ARENA ---
function initMatchWebSocket(roomCode) {
    if (matchWebSocket) matchWebSocket.close();
    const wsUrl = `ws://127.0.0.1:8000/api/ws/match/${roomCode}/${currentUser.user_id}`;
    
    try {
        matchWebSocket = new WebSocket(wsUrl);
        matchWebSocket.onopen = () => console.log("⚡ WebSockets Connected to Room:", roomCode);
        matchWebSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            pollMatchState();
        };
        matchWebSocket.onerror = (err) => console.warn("WebSocket Error:", err);
    } catch (e) {}
}

// --- GENIE QUICK CHAT & PROFANITY FILTER ---
async function fetchQuickChatPresets() {
    try {
        const res = await fetch(`${API_BASE}/chat/quick-presets`);
        const data = await res.json();
        const grid = document.getElementById("quickBubblesGrid");
        grid.innerHTML = (data.presets || []).map(preset => 
            `<button class="quick-bubble" onclick="sendQuickChatMessage('${preset}')">${preset}</button>`
        ).join("");
    } catch (e) {}
}

function sendQuickChatMessage(presetText) { sendChatMessagePayload(presetText, true); }

function sendCustomChatMessage() {
    const input = document.getElementById("chatTextInput");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendChatMessagePayload(text, false);
}

async function sendChatMessagePayload(msgText, isQuick) {
    const roomId = activeMatchRoomCode || "global_lobby";
    try {
        await fetch(`${API_BASE}/chat/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                room_id: roomId,
                user_id: currentUser.user_id,
                username: currentUser.username,
                message: msgText,
                is_quick_chat: isQuick
            })
        });
        fetchChatMessages();
    } catch (e) {}
}

async function fetchChatMessages() {
    const roomId = activeMatchRoomCode || "global_lobby";
    try {
        const res = await fetch(`${API_BASE}/chat/messages/${roomId}`);
        const data = await res.json();
        const feed = document.getElementById("chatFeed");
        
        feed.innerHTML = (data.messages || []).map(msg => `
            <div class="chat-msg ${msg.is_quick_chat ? 'quick' : ''}">
                <span class="sender" style="color:var(--neon-cyan); font-weight:800;">${msg.username}:</span> ${msg.sanitized_content}
            </div>
        `).join("");
        feed.scrollTop = feed.scrollHeight;
    } catch (e) {}
}

function startChatPolling() {
    if (chatPollInterval) clearInterval(chatPollInterval);
    fetchChatMessages();
    chatPollInterval = setInterval(fetchChatMessages, 2500);
}

// --- FRIEND REQUEST SYSTEM ---
async function sendFriendRequest() {
    const targetName = document.getElementById("friendUsernameInput").value.trim();
    if (!targetName) return;
    try {
        const res = await fetch(`${API_BASE}/friends/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from_user_id: currentUser.user_id, to_username: targetName })
        });
        const data = await res.json();
        if (res.ok) {
            alert(`✅ Friend Request sent to ${targetName}!`);
            document.getElementById("friendUsernameInput").value = "";
            fetchFriendsList();
        } else {
            alert("Error: " + (data.detail || "Failed to send request"));
        }
    } catch (e) {}
}

async function fetchFriendsList() {
    try {
        const res = await fetch(`${API_BASE}/friends/list/${currentUser.user_id}`);
        const data = await res.json();
        const pList = document.getElementById("pendingRequestsList");
        if (data.pending_requests && data.pending_requests.length > 0) {
            pList.innerHTML = data.pending_requests.map(req => `
                <div class="friend-item" style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.06); padding:10px 14px; border-radius:14px; margin-top:8px;">
                    <span>📩 Request from <strong>${req.from_username}</strong></span>
                    <div>
                        <button class="crystal-btn" style="padding: 4px 10px; font-size: 12px;" onclick="respondFriendReq('${req.request_id}', 'accept')">Accept</button>
                        <button class="crystal-btn" style="padding: 4px 10px; font-size: 12px; background: rgba(239,68,68,0.2);" onclick="respondFriendReq('${req.request_id}', 'reject')">Decline</button>
                    </div>
                </div>
            `).join("");
        } else {
            pList.innerHTML = `<p class="empty-text">No pending requests</p>`;
        }

        const fList = document.getElementById("myFriendsList");
        if (data.friends && data.friends.length > 0) {
            fList.innerHTML = data.friends.map(f => `
                <div class="friend-item" style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.06); padding:10px 14px; border-radius:14px; margin-top:8px;">
                    <span>${f.avatar_emoji} <strong>${f.username}</strong></span>
                    <span style="color:var(--neon-cyan); font-size: 12px; font-weight:700;">${f.status}</span>
                </div>
            `).join("");
        } else {
            fList.innerHTML = `<p class="empty-text">No friends added yet. Send a request above!</p>`;
        }
    } catch (e) {}
}

async function respondFriendReq(reqId, action) {
    try {
        await fetch(`${API_BASE}/friends/action`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ request_id: reqId, action: action })
        });
        fetchFriendsList();
    } catch (e) {}
}

// --- 5-ROUND SPEED MATCH ARENA ---
async function createNewMatch() {
    try {
        const res = await fetch(`${API_BASE}/match/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ host_user_id: currentUser.user_id, host_username: currentUser.username })
        });
        const data = await res.json();
        activeMatchRoomCode = data.room.room_code;
        enterMatchRoom(activeMatchRoomCode);
    } catch (e) {}
}

async function joinMatchRoom() {
    const code = document.getElementById("joinRoomCode").value.trim().toUpperCase();
    if (!code) return;
    try {
        const res = await fetch(`${API_BASE}/match/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room_code: code, user_id: currentUser.user_id, username: currentUser.username })
        });
        if (res.ok) {
            activeMatchRoomCode = code;
            enterMatchRoom(activeMatchRoomCode);
        } else { alert("Room not found!"); }
    } catch (e) {}
}

function enterMatchRoom(roomCode) {
    document.getElementById("arenaSetup").style.display = "none";
    document.getElementById("activeMatchRoom").style.display = "block";
    document.getElementById("displayRoomCode").innerText = roomCode;
    matchRoundStartTime = Date.now();
    initMatchWebSocket(roomCode);
    startMatchPolling();
}

async function pollMatchState() {
    if (!activeMatchRoomCode) return;
    try {
        const res = await fetch(`${API_BASE}/match/state/${activeMatchRoomCode}`);
        const state = await res.json();
        document.getElementById("currRoundNum").innerText = state.current_round;

        const lb = document.getElementById("matchLeaderboard");
        lb.innerHTML = (state.players || []).map((p, i) => `
            <div class="score-badge">#${i+1} ${p.username}: ${p.score} pts</div>
        `).join("");

        const mediaFrame = document.getElementById("matchMediaFrame");
        if (state.hint && state.hint.media_url) {
            mediaFrame.innerHTML = `<img src="${state.hint.media_url}" alt="Meme Hint">`;
        }

        const tagsBox = document.getElementById("matchHintTags");
        if (state.hint && state.hint.tags) {
            tagsBox.innerHTML = state.hint.tags.map(t => `<span class="quote-tag" style="background:rgba(0,242,254,0.15); color:var(--neon-cyan); padding:4px 10px; border-radius:10px; margin-right:5px;">#${t}</span>`).join(" ");
        }

        if (state.is_finished && state.winner) {
            document.getElementById("guessFeedback").innerText = `👑 GAME OVER! Ultimate Champion: ${state.winner.username} with ${state.winner.score} pts!`;
            playMagicSound('victory');
        }
    } catch (e) {}
}

function startMatchPolling() {
    if (matchPollInterval) clearInterval(matchPollInterval);
    pollMatchState();
    matchPollInterval = setInterval(pollMatchState, 2500);
}

async function submitMatchSpeedGuess() {
    const input = document.getElementById("matchGuessInput");
    const guessText = input.value.trim();
    if (!guessText || !activeMatchRoomCode) return;

    const secondsTaken = (Date.now() - matchRoundStartTime) / 1000;
    input.value = "";

    try {
        const res = await fetch(`${API_BASE}/match/guess`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                room_code: activeMatchRoomCode,
                user_id: currentUser.user_id,
                guess_text: guessText,
                seconds_taken: secondsTaken
            })
        });
        const data = await res.json();
        const fb = document.getElementById("guessFeedback");

        if (data.correct) {
            fb.innerHTML = `🎯 <span style="color:var(--neon-cyan);">CORRECT! +${data.points_earned} Points! (${data.target_name})</span>`;
            playMagicSound('victory');
            syncUserProfile();
        } else {
            fb.innerHTML = `❌ <span style="color:#ef4444;">${data.message || 'Incorrect guess'}</span>`;
        }
    } catch (e) {}
}

// --- SINGLE PLAYER GENIE GAME LIFECYCLE ---
async function startGame() {
    playMagicSound('click');
    setGenieMood("thinking", "Gazing into the Liquid Mind Crystal...", "🔮");
    try {
        const res = await fetch(`${API_BASE}/start`, { method: "POST" });
        const data = await res.json();
        currentSessionId = data.session_id;
        fetchNextQuestion();
    } catch (err) {
        const res = await fetch(`${API_BASE}/start`);
        const data = await res.json();
        currentSessionId = data.session_id;
        fetchNextQuestion();
    }
}

async function fetchNextQuestion() {
    if (!currentSessionId) return;
    try {
        const res = await fetch(`${API_BASE}/question?session_id=${currentSessionId}`);
        const data = await res.json();
        if (data.guess) renderGuessReveal(data.guess, data.confidence);
        else renderQuestion(data);
    } catch (e) {}
}

function renderQuestion(data) {
    let moodText = "Consulting the meme spirits...";
    let emoji = "🤔";

    if (currentGeniePersonality === 'sassy') {
        moodText = "Ugh, making me work hard today...";
        emoji = "💅";
    } else if (currentGeniePersonality === 'hypebeast') {
        moodText = "YO! Let me cook real quick!!";
        emoji = "🧢";
    } else if (currentGeniePersonality === 'boomer') {
        moodText = "Back in my day memes were simple images...";
        emoji = "👓";
    }

    setGenieMood("asking", moodText, emoji);
    const area = document.getElementById("gameArea");
    area.innerHTML = `
        <div class="question-container">
            <div class="progress-header">
                <span>Confidence: ${data.confidence}%</span>
                <span>Active Candidates: ${data.candidate_count}</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${data.progress}%"></div>
            </div>

            <h2 class="question-text crystal-title">${data.question}</h2>

            <div class="answers-grid">
                <button class="ans-btn yes" onclick="handleAnswer('yes')">👍 YES</button>
                <button class="ans-btn no" onclick="handleAnswer('no')">👎 NO</button>
                <button class="ans-btn skip" onclick="handleAnswer('skip')">🤷 SKIP</button>
            </div>
        </div>
    `;
}

async function handleAnswer(ans) {
    if (!currentSessionId) return;
    try {
        const qRes = await fetch(`${API_BASE}/question?session_id=${currentSessionId}`);
        const qData = await qRes.json();
        if (qData.question_id !== undefined) {
            await fetch(`${API_BASE}/answer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    session_id: currentSessionId,
                    question_id: qData.question_id,
                    answer: ans
                })
            });
        }
    } catch (e) {}
    fetchNextQuestion();
}

function renderGuessReveal(meme, confidence) {
    playMagicSound('victory');
    setGenieMood("victory", "The Liquid Crystal Orb has spoken!", "✨");
    const area = document.getElementById("gameArea");
    const quotesTags = (meme.quotes || []).map(q => `<span class="quote-tag" style="background:rgba(244,114,182,0.15); color:var(--neon-pink); padding:4px 12px; border-radius:12px; font-style:italic;">"${q}"</span>`).join(" ");

    area.innerHTML = `
        <div class="guess-card-container">
            <div class="guess-badge crystal-badge">🎯 Genie's Guess (${confidence || 95}% Confidence)</div>
            <h1 class="meme-title crystal-title">${meme.name}</h1>

            <div class="media-frame">
                <img src="${meme.media_url}" alt="${meme.name}" onerror="this.src='https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600'">
            </div>

            <p style="color: #cbd5e1; max-width: 500px; font-size: 14px;">${meme.description || ''}</p>

            <div class="quotes-cloud" style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">${quotesTags}</div>

            <div class="action-buttons">
                <button class="primary-btn crystal-btn-large pulse-glow" onclick="startGame()">🎉 Read Another Mind</button>
            </div>
        </div>
    `;
    fetch(`${API_BASE}/user/award-xp?user_id=${currentUser.user_id}&xp_amount=50`, { method: "POST" }).then(() => syncUserProfile());
}

function setGenieMood(state, statusText, emoji) {
    const avatar = document.getElementById("genieAvatar");
    const status = document.getElementById("genieStatus");
    if (status) status.innerText = statusText;
    if (avatar) avatar.innerText = emoji || "🧞‍♂️";
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById("soundIcon").innerText = soundEnabled ? "🔊" : "🔇";
}

function toggleVoiceMode() {
    voiceModeActive = !voiceModeActive;
    document.getElementById("voiceModeBtn").innerText = voiceModeActive ? "🎤 Voice Mode: ON" : "🎤 Voice Mode: OFF";
}

function openAddMemeModal() { document.getElementById("addMemeModal").classList.add("active"); }
function closeAddMemeModal() { document.getElementById("addMemeModal").classList.remove("active"); }

async function submitNewMeme(e) {
    e.preventDefault();
    const name = document.getElementById("memeName").value;
    const media_url = document.getElementById("memeMediaUrl").value;
    const format = document.getElementById("memeFormat").value;
    const era = document.getElementById("memeEra").value;
    const tags = document.getElementById("memeTags").value.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
    const quotes = document.getElementById("memeQuotes").value.split(",").map(q => q.trim()).filter(Boolean);
    const description = document.getElementById("memeDesc").value;

    try {
        const res = await fetch(`${API_BASE}/memes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, media_url, format, era, tags, quotes, description })
        });
        if (res.ok) {
            alert("✅ New Meme successfully added to Genie Memory!");
            closeAddMemeModal();
        }
    } catch (err) {}
}

window.addEventListener("DOMContentLoaded", () => {
    initCrystalParticles();
    init3DCrystalTilt();
    syncUserProfile();
    fetchMarketData();
    setInterval(fetchMarketData, 8000);
});
