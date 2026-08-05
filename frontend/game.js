/**
 * Meme Genie 🧞‍♂️ - Human-Crafted Engine (v4.1.0-Beta)
 * "MADE BY MEMERS, MADE FOR MEMERS"
 * Clean, uncluttered UI engine supporting Mind Reader, MemeX Stock Market,
 * Hall of Fame, RAG Web Search, WebSockets Arena, and Sound FX.
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

// Template Preset Images for Meme Studio
const MEME_TEMPLATES = {
    "gigachad": "https://i.kym-cdn.com/entries/icons/original/000/026/152/gigachad.jpg",
    "doge": "https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg",
    "drake": "https://i.kym-cdn.com/entries/icons/original/000/019/649/Drake_Hotline_Bling.jpg",
    "distracted_bf": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop",
    "woman_cat": "https://i.kym-cdn.com/entries/icons/original/000/031/015/cover5.jpg",
    "rickroll": "https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif"
};

// Background Particle Canvas
let canvas, ctx;
let particles = [];
const particleCount = 30;

function initCrystalParticles() {
    canvas = document.getElementById("crystalCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            color: '#38bdf8',
            alpha: Math.random() * 0.4 + 0.1
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

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
    requestAnimationFrame(animateParticles);
}

// Sound Synthesizer
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
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'victory') {
            [523.25, 659.25, 783.99].forEach((freq, idx) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.type = 'sine';
                o.frequency.setValueAtTime(freq, now + (idx * 0.08));
                g.gain.setValueAtTime(0.15, now + (idx * 0.08));
                g.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.08) + 0.25);
                o.start(now + (idx * 0.08));
                o.stop(now + (idx * 0.08) + 0.25);
            });
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
    } else if (tabName === 'studio') {
        document.getElementById("tabStudio").classList.add("active");
        document.getElementById("viewStudio").classList.add("active");
        updateStudioMemeCanvas();
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
    document.getElementById("hdrCoins").innerText = currentUser.coins || 1000;
    const mCoins = document.getElementById("marketCoinBalance");
    if (mCoins) mCoins.innerText = currentUser.coins || 1000;
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
    }
}

// --- 📈 MEMEX STOCK EXCHANGE ---
async function fetchMarketData() {
    try {
        const res = await fetch(`${API_BASE}/economy/market`);
        const data = await res.json();

        const grid = document.getElementById("stocksGrid");
        if (grid && data.stocks) {
            grid.innerHTML = data.stocks.map(s => {
                const isUp = s.change_pct >= 0;
                const owned = (currentUser.portfolio || {})[s.ticker] || 0;
                return `
                    <div class="stock-card">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <strong style="font-size:16px; color:var(--accent-cyan);">$${s.ticker}</strong>
                            <span class="${isUp ? 'price-up' : 'price-down'}">${isUp ? '▲' : '▼'} ${s.change_pct}%</span>
                        </div>
                        <div style="font-size:13px; color:var(--text-muted);">${s.name}</div>
                        <div style="font-size:20px; font-weight:700; color:white; margin:4px 0;">🪙 ${s.price}</div>
                        <div style="font-size:12px; color:var(--text-dim);">Owned: ${owned} shares</div>
                        <div style="display:flex; gap:6px; margin-top:8px;">
                            <button class="crystal-btn" style="flex:1; padding:6px; font-size:12px; background:rgba(16,185,129,0.2); color:var(--accent-green);" onclick="executeMemeTrade('${s.ticker}', 'buy')">Buy</button>
                            <button class="crystal-btn" style="flex:1; padding:6px; font-size:12px; background:rgba(244,63,94,0.2); color:var(--accent-red);" onclick="executeMemeTrade('${s.ticker}', 'sell')">Sell</button>
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
                    <div style="font-size:22px; font-weight:800; color:var(--accent-gold);">#${idx + 1}</div>
                    <div class="media-frame" style="max-width:140px; max-height:90px;">
                        <img src="${m.media_url}" alt="${m.name}">
                    </div>
                    <div style="flex:1;">
                        <h3 style="font-size:18px; font-weight:600;">${m.name}</h3>
                        <div style="margin-top:4px;">
                            <span class="longevity-badge">⏳ ${m.longevity}</span>
                            <span class="badge-pill" style="margin-left:6px;">⚡ Virality: ${m.peak_virality}%</span>
                        </div>
                        <p style="color:var(--text-muted); font-size:13px; margin-top:4px;">${m.description || ''}</p>
                    </div>
                    <div>
                        <button class="crystal-btn" style="padding:6px 14px; font-size:13px; background:rgba(251,191,36,0.15); color:var(--accent-gold);" onclick="upvoteMeme('${m.id}')">🏆 Upvote (${m.upvotes})</button>
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
                <tr style="border-bottom:1px solid var(--panel-border);">
                    <td style="padding:10px; font-weight:700; color:var(--accent-gold);">#${u.rank}</td>
                    <td style="padding:10px;">${u.avatar_emoji} <strong>${u.username}</strong></td>
                    <td style="padding:10px; text-align:center;">Lvl ${u.level}</td>
                    <td style="padding:10px; text-align:center; color:var(--accent-cyan); font-weight:600;">${u.xp} XP</td>
                    <td style="padding:10px; text-align:right;">${(u.badges || []).map(b => `<span class="badge-pill">${b}</span>`).join(" ")}</td>
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
    container.innerHTML = `<div class="crystal-subpanel" style="text-align:center; padding:20px; color:var(--text-muted);"><p>🌐 Searching live web for meme '${query}' via RAG Engine...</p></div>`;

    try {
        const res = await fetch(`${API_BASE}/rag/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        renderRagResults(data);
    } catch (e) {
        container.innerHTML = `<div class="crystal-subpanel" style="text-align:center; padding:20px; color:var(--accent-red);"><p>Error connecting to RAG web engine.</p></div>`;
    }
}

function renderRagResults(data) {
    const container = document.getElementById("ragResultsArea");
    const meme = data.meme;
    const sources = data.sources || [];

    const sourcesHTML = sources.map(s => `
        <div style="background:rgba(255,255,255,0.02); padding:8px 12px; border-radius:10px; margin-top:6px; font-size:12px;">
            <a href="${s.link}" target="_blank" style="color:var(--accent-cyan); font-weight:600; text-decoration:none;">🔗 ${s.title}</a>
            <p style="color:var(--text-muted); margin-top:2px;">${s.snippet}</p>
        </div>
    `).join("");

    container.innerHTML = `
        <div class="crystal-subpanel" style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="censor-badge">🤖 Source: ${data.rag_source}</span>
                <button class="primary-btn crystal-btn" style="padding:6px 14px; font-size:12px;" onclick='importRagMeme(${JSON.stringify(meme)})'>📥 Import to Memory</button>
            </div>

            <div style="display:flex; gap:16px; flex-wrap:wrap; align-items:center;">
                <div class="media-frame" style="max-width:220px; max-height:150px;">
                    <img src="${meme.media_url}" alt="${meme.name}">
                </div>
                <div style="flex:1;">
                    <h2 style="font-size:20px; font-weight:600;">${meme.name}</h2>
                    <p style="color:var(--text-muted); font-size:13.5px; margin-top:4px;">${meme.description}</p>
                </div>
            </div>

            <div style="margin-top:8px;">
                <h4 style="font-size:13px; color:var(--text-muted);">🌐 Web Sources:</h4>
                ${sourcesHTML || '<p style="font-size:12px; color:var(--text-dim);">Indexed.</p>'}
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

// --- 🎨 MEME CREATOR STUDIO ---
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

        ctx.font = `900 ${fontSize}px Impact, sans-serif`;
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
            alert("🚀 Published! Your meme is now inside Genie Memory.");
            playMagicSound('victory');
        }
    } catch (e) {}
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

// --- ⚡ WEBSOCKETS MATCH ARENA ---
function initMatchWebSocket(roomCode) {
    if (matchWebSocket) matchWebSocket.close();
    const wsUrl = `ws://127.0.0.1:8000/api/ws/match/${roomCode}/${currentUser.user_id}`;
    
    try {
        matchWebSocket = new WebSocket(wsUrl);
        matchWebSocket.onopen = () => console.log("⚡ WebSockets Connected:", roomCode);
        matchWebSocket.onmessage = () => pollMatchState();
    } catch (e) {}
}

// --- QUICK CHAT ---
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
            <div class="chat-msg">
                <span style="color:var(--accent-cyan); font-weight:600;">${msg.username}:</span> ${msg.sanitized_content}
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

// --- FRIEND REQUESTS ---
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
            alert(`✅ Request sent to ${targetName}!`);
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
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:10px; margin-top:6px; font-size:13px;">
                    <span>Request from <strong>${req.from_username}</strong></span>
                    <div>
                        <button class="crystal-btn" style="padding:4px 10px; font-size:12px;" onclick="respondFriendReq('${req.request_id}', 'accept')">Accept</button>
                    </div>
                </div>
            `).join("");
        } else {
            pList.innerHTML = `<p style="font-size:13px; color:var(--text-dim);">No pending requests</p>`;
        }

        const fList = document.getElementById("myFriendsList");
        if (data.friends && data.friends.length > 0) {
            fList.innerHTML = data.friends.map(f => `
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:10px; margin-top:6px; font-size:13px;">
                    <span>${f.avatar_emoji} <strong>${f.username}</strong></span>
                    <span style="color:var(--accent-cyan);">${f.status}</span>
                </div>
            `).join("");
        } else {
            fList.innerHTML = `<p style="font-size:13px; color:var(--text-dim);">No friends added yet.</p>`;
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

// --- MATCH ARENA ---
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

        if (state.is_finished && state.winner) {
            document.getElementById("guessFeedback").innerText = `👑 Winner: ${state.winner.username} (${state.winner.score} pts)`;
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
            fb.innerHTML = `🎯 <span style="color:var(--accent-cyan);">CORRECT! +${data.points_earned} Pts</span>`;
            playMagicSound('victory');
        } else {
            fb.innerHTML = `❌ <span style="color:var(--accent-red);">${data.message || 'Incorrect'}</span>`;
        }
    } catch (e) {}
}

// --- MIND READER GAME LIFECYCLE ---
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
        moodText = "Back in my day memes were simple...";
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

    area.innerHTML = `
        <div class="guess-card-container">
            <div class="score-badge">🎯 Genie's Guess (${confidence || 95}% Confidence)</div>
            <h1 class="glow-title crystal-title">${meme.name}</h1>

            <div class="media-frame">
                <img src="${meme.media_url}" alt="${meme.name}">
            </div>

            <p style="color:var(--text-muted); max-width: 480px; font-size: 14px;">${meme.description || ''}</p>

            <div class="action-buttons">
                <button class="primary-btn crystal-btn-large" onclick="startGame()">🔮 Read Another Mind</button>
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

    try {
        const res = await fetch(`${API_BASE}/memes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, media_url, format: "image", era: "2020s", tags: ["custom"], quotes: [], description: "User added" })
        });
        if (res.ok) {
            alert("✅ Meme added to Genie Memory!");
            closeAddMemeModal();
        }
    } catch (err) {}
}

window.addEventListener("DOMContentLoaded", () => {
    initCrystalParticles();
    init3DCrystalTilt();
    syncUserProfile();
});
