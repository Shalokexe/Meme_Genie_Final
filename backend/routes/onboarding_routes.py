from fastapi import APIRouter, HTTPException
from models.onboarding_model import MemeIQSubmitRequest, MemeTasteSaveRequest
from friend_engine import USERS_DB
from db.mongo import get_all_memes

router = APIRouter()

# 10 Curated Meme IQ Quiz Questions
MEME_IQ_QUIZ = [
    {
        "id": 1,
        "question": "Which iconic music video spawned the ultimate internet rickroll?",
        "options": ["Never Gonna Give You Up", "Uptown Funk", "Gangnam Style", "Despacito"],
        "correct": 0
    },
    {
        "id": 2,
        "question": "What animal breed is the legendary Doge meme?",
        "options": ["Golden Retriever", "Shiba Inu", "Husky", "Corgi"],
        "correct": 1
    },
    {
        "id": 3,
        "question": "What is the phrase commonly paired with Ernest Khalimov's iconic meme photo?",
        "options": ["Virgin vs Chad", "Average Fan vs Average Enjoyer", "Shut up and take my money", "Distracted Boyfriend"],
        "correct": 1
    },
    {
        "id": 4,
        "question": "In the Drake Hotline Bling meme, what is Drake doing in the top panel?",
        "options": ["Approving enthusiastically", "Turning away in disapproval", "Laughing loudly", "Crying"],
        "correct": 1
    },
    {
        "id": 5,
        "question": "What is the real name of the white cat sitting at a dinner table being yelled at?",
        "options": ["Smudge the Cat", "Grumpy Cat", "Nyan Cat", "Keyboard Cat"],
        "correct": 0
    },
    {
        "id": 6,
        "question": "What gesture is Kayode Ewumi making in the 'Roll Safe' meme?",
        "options": ["Pointing to his head", "Thumbs up", "Peace sign", "Facepalm"],
        "correct": 0
    },
    {
        "id": 7,
        "question": "Which meme features dancing pallbearers in Ghana wearing suits?",
        "options": ["Coffin Dance", "Harlem Shake", "Crab Rave", "Dame Tu Cosita"],
        "correct": 0
    },
    {
        "id": 8,
        "question": "What is the dog sitting in a room on fire saying in the famous webcomic?",
        "options": ["This is fine.", "Everything hurts.", "Help me.", "I'm okay with this."],
        "correct": 0
    },
    {
        "id": 9,
        "question": "Which frog character became an internet cultural icon created by Matt Furie?",
        "options": ["Kermit", "Pepe the Frog", "Crazy Frog", "Dat Boi"],
        "correct": 1
    },
    {
        "id": 10,
        "question": "What is the famous tagline associated with Meme Genie?",
        "options": ["MADE BY MEMERS, MADE FOR MEMERS", "Gotta Catch 'Em All", "Just Do It", "The Choice of a New Generation"],
        "correct": 0
    }
]

@router.get("/onboarding/iq-quiz")
def get_iq_quiz():
    """Return 10-question Meme IQ calibration quiz."""
    return {"quiz": MEME_IQ_QUIZ}

@router.post("/onboarding/iq-submit")
def submit_iq_quiz(req: MemeIQSubmitRequest):
    """Calculate user Meme IQ score and tier."""
    user = USERS_DB.get(req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    score_pct = (req.correct_answers_count / 10.0)
    meme_iq = int(90 + (score_pct * 60))  # Range 90 to 150
    
    tier = "Meme Novice"
    if meme_iq >= 145:
        tier = "🗿 GigaChad Tier (Godlike Meme IQ)"
    elif meme_iq >= 130:
        tier = "🔥 Supreme Memer (High IQ)"
    elif meme_iq >= 115:
        tier = "😎 Certified Memer"
        
    user["meme_iq"] = meme_iq
    user["meme_iq_tier"] = tier
    if tier not in user.get("badges", []):
        user.setdefault("badges", []).append(tier)
        
    return {
        "status": "success",
        "meme_iq": meme_iq,
        "tier": tier,
        "correct_answers": req.correct_answers_count
    }

@router.get("/onboarding/taste-memes")
def get_taste_memes():
    """Return meme grid items for Spotify-style B&W selection."""
    memes = get_all_memes()
    items = []
    for m in memes[:12]:
        items.append({
            "id": m.get("id", str(m.get("_id", ""))),
            "name": m.get("name"),
            "media_url": m.get("media_url"),
            "era": m.get("era", "2020s")
        })
    return {"memes": items}

@router.post("/onboarding/taste-save")
def save_taste_preferences(req: MemeTasteSaveRequest):
    """Save selected favorite memes and mark onboarding complete."""
    user = USERS_DB.get(req.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user["favorite_memes"] = req.selected_meme_ids
    user["onboarding_complete"] = True
    return {"status": "success", "message": "Onboarding complete! Welcome to Meme Genie Portal."}
