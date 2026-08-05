/**
 * Meme Genie 🧞‍♂️ - Memer Community Portal & MemeTV Engine (v5.1.0-Beta)
 * "MADE BY MEMERS, MADE FOR MEMERS"
 * Features 1-on-1 Random Stranger Video Chat (MemeTV), Meme IQ Quiz, Spotify B&W Grid & FYP Feed.
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
    meme_iq: 120,
    meme_iq_tier: "Certified Memer",
    favorite_memes: [],
    onboarding_complete: false
};

let currentSessionId = null;
let soundEnabled = true;
let iqQuizData = [];
let iqCurrentIndex = 0;
let iqCorrectAnswers = 0;
let selectedTasteIds = [];

// --- WEBRTC MEMETV VIDEO CHAT ENGINE ---
let memeTvSocket = null;
let localStream = null;
let peerConnection = null;
let currentMatchedPeerId = null;

const rtcConfiguration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
    ]
};

async function initLocalMediaStream() {
    if (localStream) return localStream;
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const localVideo = document.getElementById("localVideo");
        if (localVideo) localVideo.srcObject = localStream;
        return localStream;
    } catch (err) {
        console.warn("Camera/Mic access denied or unavailable:", err);
        return null;
    }
}

function initMemeTvWebSocket() {
    if (memeTvSocket && memeTvSocket.readyState === WebSocket.OPEN) return;
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host || "127.0.0.1:8000";
    const wsUrl = `${wsProtocol}//${host}/api/ws/memetv/${currentUser.user_id}/${encodeURIComponent(currentUser.username)}/${currentUser.meme_iq || 120}`;

    memeTvSocket = new WebSocket(wsUrl);

    memeTvSocket.onopen = () => console.log("📹 MemeTV WebSocket Connected");
    memeTvSocket.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        handleMemeTvSignalMessage(msg);
    };
    memeTvSocket.onclose = () => { updateMemeTvStatus("Status: Idle"); };
}

async function handleMemeTvSignalMessage(msg) {
    if (msg.type === "match_found") {
        currentMatchedPeerId = msg.peer_user_id;
        updateMemeTvStatus(`Matched with ${msg.peer_username} (IQ ${msg.peer_meme_iq})!`);
        document.getElementById("remoteStrangerLabel").innerText = `${msg.peer_username} (IQ ${msg.peer_meme_iq})`;
        document.getElementById("remotePlaceholder").style.display = "none";

        setupRtcPeerConnection();

        if (msg.is_initiator) {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            memeTvSocket.send(JSON.stringify({ action: "signal_offer", payload: offer }));
        }
    } else if (msg.type === "signal_offer") {
        if (!peerConnection) setupRtcPeerConnection();
        await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.payload));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        memeTvSocket.send(JSON.stringify({ action: "signal_answer", payload: answer }));
    } else if (msg.type === "signal_answer") {
        if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.payload));
        }
    } else if (msg.type === "ice_candidate") {
        if (peerConnection && msg.payload) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(msg.payload));
            } catch (e) {}
        }
    } else if (msg.type === "peer_disconnected") {
        resetRemoteVideoStream();
        updateMemeTvStatus("Stranger disconnected. Click 'Next Stranger' to continue!");
    }
}

function setupRtcPeerConnection() {
    if (peerConnection) peerConnection.close();
    peerConnection = new RTCPeerConnection(rtcConfiguration);

    if (localStream) {
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    }

    peerConnection.ontrack = (event) => {
        const remoteVideo = document.getElementById("remoteVideo");
        if (remoteVideo && event.streams[0]) {
            remoteVideo.srcObject = event.streams[0];
        }
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate && memeTvSocket) {
            memeTvSocket.send(JSON.stringify({ action: "ice_candidate", payload: event.candidate }));
        }
    };
}

async function startMemeTvSearch() {
    playMagicSound('click');
    await initLocalMediaStream();
    initMemeTvWebSocket();

    updateMemeTvStatus("🔍 Searching for Meme IQ Stranger...");
    resetRemoteVideoStream();

    setTimeout(() => {
        if (memeTvSocket && memeTvSocket.readyState === WebSocket.OPEN) {
            memeTvSocket.send(JSON.stringify({ action: "search" }));
        }
    }, 500);
}

function nextMemeTvStranger() {
    playMagicSound('click');
    if (peerConnection) peerConnection.close();
    resetRemoteVideoStream();

    if (memeTvSocket && memeTvSocket.readyState === WebSocket.OPEN) {
        memeTvSocket.send(JSON.stringify({ action: "next_stranger" }));
        updateMemeTvStatus("🔍 Searching for next stranger...");
        memeTvSocket.send(JSON.stringify({ action: "search" }));
    } else {
        startMemeTvSearch();
    }
}

function stopMemeTvVideo() {
    playMagicSound('click');
    if (peerConnection) peerConnection.close();
    if (memeTvSocket) {
        memeTvSocket.send(JSON.stringify({ action: "disconnect" }));
        memeTvSocket.close();
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    resetRemoteVideoStream();
    updateMemeTvStatus("Status: Idle");
}

function resetRemoteVideoStream() {
    const remoteVideo = document.getElementById("remoteVideo");
    if (remoteVideo) remoteVideo.srcObject = null;
    document.getElementById("remotePlaceholder").style.display = "flex";
    document.getElementById("remoteStrangerLabel").innerText = "Stranger (Searching...)";
}

function updateMemeTvStatus(statusText) {
    const badge = document.getElementById("videoMatchStatus");
    if (badge) badge.innerText = statusText;
}

// Preset Meme Templates
const MEME_TEMPLATES = {
    "gigachad": "https://i.kym-cdn.com/entries/icons/original/000/026/152/gigachad.jpg",
    "doge": "https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg",
    "drake": "https://i.kym-cdn.com/entries/icons/original/000/019/649/Drake_Hotline_Bling.jpg",
    "distracted_bf": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop",
    "woman_cat": "https://i.kym-cdn.com/entries/icons/original/000/031/015/cover5.jpg",
    "rickroll": "https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif"
};

// Phase Switcher
function switchAppPhase(phaseName) {
    document.querySelectorAll(".app-phase").forEach(p => p.style.display = "none");
    if (phaseName === 'landing') {
        document.getElementById("viewLanding").style.display = "flex";
    } else if (phaseName === 'iq_quiz') {
        document.getElementById("viewMemeIQ").style.display = "flex";
        loadMemeIqQuiz();
    } else if (phaseName === 'taste_select') {
        document.getElementById("viewTaste").style.display = "flex";
        loadTasteMemes();
    } else if (phaseName === 'portal') {
        document.getElementById("viewPortal").style.display = "flex";
        renderUserStatsUI();
        switchPortalTab('fyp');
    }
}

// Landing & Login
function openLoginModal(mode) {
    document.getElementById("loginModalTitle").innerText = mode === 'register' ? 'Sign Up for Memer Portal' : 'Memer Account Login';
    document.getElementById("loginModal").classList.add("active");
}

function closeLoginModal() { document.getElementById("loginModal").classList.remove("active"); }

async function handleAccountAuth(e) {
    e.preventDefault();
    const handle = document.getElementById("authUsernameInput").value.trim();
    const avatar = document.getElementById("authAvatarSelect").value;
    if (!handle) return;

    currentUser.username = handle;
    currentUser.avatar_emoji = avatar;
    closeLoginModal();
    playMagicSound('click');

    await syncUserProfile();
    switchAppPhase('iq_quiz');
}

// Meme IQ Quiz
async function loadMemeIqQuiz() {
    try {
        const res = await fetch(`${API_BASE}/onboarding/iq-quiz`);
        const data = await res.json();
        iqQuizData = data.quiz || [];
        iqCurrentIndex = 0; iqCorrectAnswers = 0;
        document.getElementById("iqResultContainer").style.display = "none";
        document.getElementById("iqQuestionContainer").style.display = "block";
        renderIqQuestion();
    } catch (e) {}
}

function renderIqQuestion() {
    if (iqCurrentIndex >= iqQuizData.length) { finishIqQuiz(); return; }
    const q = iqQuizData[iqCurrentIndex];
    document.getElementById("iqQuizTitle").innerText = `Question ${iqCurrentIndex + 1} of ${iqQuizData.length}`;
    document.getElementById("iqQuizProgress").style.width = `${((iqCurrentIndex + 1) / iqQuizData.length) * 100}%`;
    document.getElementById("iqQuestionText").innerText = q.question;

    const grid = document.getElementById("iqOptionsGrid");
    grid.innerHTML = q.options.map((opt, idx) => `
        <button class="iq-option-btn" onclick="submitIqAnswer(${idx})">${opt}</button>
    `).join("");
}

function submitIqAnswer(selectedIdx) {
    const q = iqQuizData[iqCurrentIndex];
    if (selectedIdx === q.correct) { iqCorrectAnswers++; playMagicSound('click'); }
    iqCurrentIndex++;
    renderIqQuestion();
}

async function finishIqQuiz() {
    try {
        const res = await fetch(`${API_BASE}/onboarding/iq-submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.user_id, correct_answers_count: iqCorrectAnswers })
        });
        const data = await res.json();
        currentUser.meme_iq = data.meme_iq;
        currentUser.meme_iq_tier = data.tier;

        document.getElementById("iqQuestionContainer").style.display = "none";
        document.getElementById("iqResultContainer").style.display = "block";
        document.getElementById("resIqScore").innerText = `Meme IQ ${data.meme_iq}`;
        document.getElementById("resIqTier").innerText = data.tier;
        playMagicSound('victory');
    } catch (e) {}
}

function proceedToTasteSelection() { switchAppPhase('taste_select'); }

// Spotify Taste Grid
async function loadTasteMemes() {
    try {
        const res = await fetch(`${API_BASE}/onboarding/taste-memes`);
        const data = await res.json();
        const grid = document.getElementById("tasteMemesGrid");
        selectedTasteIds = [];

        grid.innerHTML = (data.memes || []).map(m => `
            <div class="taste-card" id="tasteCard_${m.id}" onclick="toggleTasteMeme('${m.id}')">
                <div class="taste-media"><img src="${m.media_url}" alt="${m.name}"></div>
                <div class="taste-title">${m.name}</div>
                <div class="taste-check">✓ SELECTED</div>
            </div>
        `).join("");
    } catch (e) {}
}

function toggleTasteMeme(memeId) {
    const card = document.getElementById(`tasteCard_${memeId}`);
    if (!card) return;
    if (selectedTasteIds.includes(memeId)) {
        selectedTasteIds = selectedTasteIds.filter(id => id !== memeId);
        card.classList.remove("selected");
    } else {
        selectedTasteIds.push(memeId);
        card.classList.add("selected");
        playMagicSound('click');
    }
}

async function finishOnboardingAndEnterPortal() {
    try {
        await fetch(`${API_BASE}/onboarding/taste-save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUser.user_id, selected_meme_ids: selectedTasteIds })
        });
        currentUser.favorite_memes = selectedTasteIds;
        currentUser.onboarding_complete = true;
        playMagicSound('victory');
        switchAppPhase('portal');
    } catch (e) { switchAppPhase('portal'); }
}

// Portal Navigation
function switchPortalTab(tabName) {
    playMagicSound('click');
    document.querySelectorAll(".nav-tab").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".portal-tab-content").forEach(c => c.classList.remove("active"));

    if (tabName === 'fyp') {
        document.getElementById("tabFyp").classList.add("active");
        document.getElementById("portalFyp").classList.add("active");
        fetchFypFeed();
    } else if (tabName === 'video') {
        document.getElementById("tabVideo").classList.add("active");
        document.getElementById("portalVideo").classList.add("active");
        document.getElementById("localMemeIqLabel").innerText = `Meme IQ ${currentUser.meme_iq || 120}`;
    } else if (tabName === 'genie') {
        document.getElementById("tabGenie").classList.add("active");
        document.getElementById("portalGenie").classList.add("active");
    } else if (tabName === 'rag') {
        document.getElementById("tabRag").classList.add("active");
        document.getElementById("portalRag").classList.add("active");
    } else if (tabName === 'studio') {
        document.getElementById("tabStudio").classList.add("active");
        document.getElementById("portalStudio").classList.add("active");
        updateStudioMemeCanvas();
    } else if (tabName === 'economy') {
        document.getElementById("tabEconomy").classList.add("active");
        document.getElementById("portalEconomy").classList.add("active");
        fetchMarketData();
    } else if (tabName === 'halloffame') {
        document.getElementById("tabHallOfFame").classList.add("active");
        document.getElementById("portalHallOfFame").classList.add("active");
        fetchHallOfFame();
    } else if (tabName === 'arena') {
        document.getElementById("tabArena").classList.add("active");
        document.getElementById("portalArena").classList.add("active");
    } else if (tabName === 'chat') {
        document.getElementById("tabChat").classList.add("active");
        document.getElementById("portalChat").classList.add("active");
        fetchChatMessages();
    } else if (tabName === 'profile') {
        document.getElementById("tabProfile").classList.add("active");
        document.getElementById("portalProfile").classList.add("active");
        renderUserProfileTab();
    }
}

// FYP Feed
async function fetchFypFeed() {
    try {
        const res = await fetch(`${API_BASE}/feed/fyp`);
        const data = await res.json();
        const container = document.getElementById("fypFeedContainer");
        container.innerHTML = (data.posts || []).map(post => `
            <div class="fyp-post-card">
                <div class="fyp-post-header">
                    <div class="fyp-author">
                        <span class="fyp-author-avatar">${post.author_avatar}</span>
                        <span class="fyp-author-name">${post.author_username}</span>
                    </div>
                    <span class="badge-pill">${post.meme_name}</span>
                </div>
                <div class="media-frame"><img src="${post.media_url}" alt="${post.meme_name}"></div>
                <p style="color:var(--text-main); font-size:14px;">${post.caption}</p>
                <div class="fyp-actions-bar">
                    <button class="fyp-upvote-btn" onclick="upvoteFypPost('${post.post_id}')">❤️ Upvote (${post.upvotes})</button>
                    <span style="font-size:12.5px; color:var(--text-muted);">💬 ${(post.comments || []).length} comments</span>
                </div>
            </div>
        `).join("");
    } catch (e) {}
}

async function upvoteFypPost(postId) {
    try {
        const res = await fetch(`${API_BASE}/feed/upvote?post_id=${postId}&user_id=${currentUser.user_id}`, { method: "POST" });
        if (res.ok) { playMagicSound('victory'); fetchFypFeed(); }
    } catch (e) {}
}

// Profile & Stats
async function syncUserProfile() {
    try {
        const res = await fetch(`${API_BASE}/user/profile?username=${encodeURIComponent(currentUser.username)}&avatar_emoji=${encodeURIComponent(currentUser.avatar_emoji)}`, { method: "POST" });
        const data = await res.json();
        if (data && data.user_id) { currentUser = { ...currentUser, ...data }; renderUserStatsUI(); }
    } catch (e) {}
}

function renderUserStatsUI() {
    document.getElementById("userAvatar").innerText = currentUser.avatar_emoji;
    document.getElementById("userNameLabel").innerText = currentUser.username;
    document.getElementById("hdrLevel").innerText = currentUser.level || 1;
    document.getElementById("hdrCoins").innerText = currentUser.coins || 1000;
    document.getElementById("hdrMemeIq").innerText = currentUser.meme_iq || 120;
    const mCoins = document.getElementById("marketCoinBalance");
    if (mCoins) mCoins.innerText = currentUser.coins || 1000;
}

function renderUserProfileTab() {
    document.getElementById("profAvatar").innerText = currentUser.avatar_emoji;
    document.getElementById("profUsername").innerText = currentUser.username;
    document.getElementById("profIqBadge").innerText = `🧠 Meme IQ: ${currentUser.meme_iq || 120}`;
    document.getElementById("profTierBadge").innerText = currentUser.meme_iq_tier || "Certified Memer";
    document.getElementById("profLevel").innerText = currentUser.level || 1;
    document.getElementById("profXp").innerText = currentUser.xp || 150;
    document.getElementById("profCoins").innerText = currentUser.coins || 1000;

    const grid = document.getElementById("profFavMemesGrid");
    grid.innerHTML = (currentUser.favorite_memes || []).map(id => `
        <span class="badge-pill" style="background:rgba(56,189,248,0.15); color:var(--accent-cyan);">🔥 ${id}</span>
    `).join(" ") || '<p style="font-size:13px; color:var(--text-muted);">No favorite memes selected yet.</p>';
}

// Market, Hall of Fame & Studio
async function fetchMarketData() {
    try {
        const res = await fetch(`${API_BASE}/economy/market`);
        const data = await res.json();
        const grid = document.getElementById("stocksGrid");
        if (grid && data.stocks) {
            grid.innerHTML = data.stocks.map(s => `
                <div class="crystal-subpanel">
                    <strong style="color:var(--accent-cyan);">$${s.ticker}</strong>
                    <div>${s.name}</div>
                    <div style="font-size:18px; font-weight:700; color:white; margin:4px 0;">🪙 ${s.price}</div>
                </div>
            `).join("");
        }
    } catch (e) {}
}

async function fetchHallOfFame() {
    try {
        const res = await fetch(`${API_BASE}/halloffame/rankings`);
        const data = await res.json();
        const grid = document.getElementById("hofGrid");
        if (grid && data.rankings) {
            grid.innerHTML = data.rankings.map((m, idx) => `
                <div class="crystal-subpanel" style="display:flex; gap:14px; align-items:center;">
                    <div style="font-size:20px; font-weight:800; color:var(--accent-gold);">#${idx + 1}</div>
                    <div class="media-frame" style="max-width:120px;"><img src="${m.media_url}" alt="${m.name}"></div>
                    <div style="flex:1;">
                        <h3 style="font-size:16px;">${m.name}</h3>
                        <p style="font-size:12px; color:var(--text-muted);">⏳ Longevity: ${m.longevity} | ⚡ Virality: ${m.peak_virality}%</p>
                    </div>
                </div>
            `).join("");
        }
    } catch (e) {}
}

function updateStudioMemeCanvas() {
    const canvas = document.getElementById("memeStudioCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const templateKey = document.getElementById("studioTemplateSelect").value;
    const topText = (document.getElementById("studioTopText").value || "WHEN YOU BUILD MEME GENIE").toUpperCase();
    const bottomText = (document.getElementById("studioBottomText").value || "ABSOLUTE GIGACHAD").toUpperCase();

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = MEME_TEMPLATES[templateKey] || MEME_TEMPLATES["gigachad"];

    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = `900 28px Impact, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#000000"; ctx.lineWidth = 4;
        ctx.strokeText(topText, canvas.width / 2, 40); ctx.fillText(topText, canvas.width / 2, 40);
        ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20); ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
    };
}

function publishStudioMeme() { alert("🚀 Custom meme published to For You Page!"); playMagicSound('victory'); }
function downloadStudioMeme() {
    const canvas = document.getElementById("memeStudioCanvas"); if (!canvas) return;
    const link = document.createElement("a"); link.download = `MemeGenie_${Date.now()}.png`; link.href = canvas.toDataURL("image/png"); link.click();
}

// Mind Reader
async function startGame() {
    playMagicSound('click');
    try {
        const res = await fetch(`${API_BASE}/start`, { method: "POST" });
        const data = await res.json(); currentSessionId = data.session_id; fetchNextQuestion();
    } catch (err) {}
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
    const area = document.getElementById("gameArea");
    area.innerHTML = `
        <div class="question-container">
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${data.progress}%"></div></div>
            <h2 class="glow-title crystal-title">${data.question}</h2>
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
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ session_id: currentSessionId, question_id: qData.question_id, answer: ans })
            });
        }
    } catch (e) {}
    fetchNextQuestion();
}

function renderGuessReveal(meme, confidence) {
    playMagicSound('victory');
    const area = document.getElementById("gameArea");
    area.innerHTML = `
        <div class="guess-card-container">
            <div class="quiz-badge">🎯 Genie's Guess (${confidence || 95}% Confidence)</div>
            <h1 class="glow-title crystal-title">${meme.name}</h1>
            <div class="media-frame"><img src="${meme.media_url}" alt="${meme.name}"></div>
            <p style="color:var(--text-muted); font-size: 14px;">${meme.description || ''}</p>
            <button class="primary-btn crystal-btn-large" style="margin-top:15px;" onclick="startGame()">🔮 Read Another Mind</button>
        </div>
    `;
}

// Background Particle Canvas
let canvas, ctx; let particles = []; const particleCount = 25;
function initCrystalParticles() {
    canvas = document.getElementById("crystalCanvas"); if (!canvas) return;
    ctx = canvas.getContext("2d"); resizeCanvas(); window.addEventListener("resize", resizeCanvas);
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.4, speedY: (Math.random() - 0.5) * 0.4, color: '#38bdf8', alpha: Math.random() * 0.4 + 0.1
        });
    }
    animateParticles();
}
function resizeCanvas() { if (!canvas) return; canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
function animateParticles() {
    if (!ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });
    requestAnimationFrame(animateParticles);
}

// Sound Synthesizer
let audioCtx = null;
function getAudioContext() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
function playMagicSound(type) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination); const now = ctx.currentTime;
        if (type === 'click') {
            osc.frequency.setValueAtTime(500, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
            gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now); osc.stop(now + 0.05);
        } else if (type === 'victory') {
            [523.25, 659.25, 783.99].forEach((freq, idx) => {
                const o = ctx.createOscillator(); const g = ctx.createGain();
                o.connect(g); g.connect(ctx.destination);
                o.frequency.setValueAtTime(freq, now + (idx * 0.08)); g.gain.setValueAtTime(0.15, now + (idx * 0.08));
                g.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.08) + 0.25);
                o.start(now + (idx * 0.08)); o.stop(now + (idx * 0.08) + 0.25);
            });
        }
    } catch (e) {}
}
function toggleSound() { soundEnabled = !soundEnabled; }

window.addEventListener("scroll", () => {
    const hero = document.getElementById("landingHero");
    if (hero) hero.style.transform = `translateY(${window.scrollY * 0.25}px)`;
});

window.addEventListener("DOMContentLoaded", () => {
    initCrystalParticles();
    switchAppPhase('landing');
});
