"""
Meme Genie Akinator-Style Scoring Engine
Handles session state management, tag-matching score calculations,
confidence estimation, and candidate rank selection.
"""

import uuid
from typing import Dict, List, Tuple, Optional
from db.mongo import get_all_memes

# Expanded question bank matching tags in database
QUESTIONS = [
    {"id": 0, "q": "Is the meme music or dance based?", "tag": "music"},
    {"id": 1, "q": "Is it a classic old-era meme (pre-2015)?", "tag": "old"},
    {"id": 2, "q": "Is it primarily used for trolling or dark humor?", "tag": "troll"},
    {"id": 3, "q": "Is it a globally recognized viral meme?", "tag": "global"},
    {"id": 4, "q": "Is it famous for iconic spoken dialogue or text quotes?", "tag": "dialogue"},
    {"id": 5, "q": "Does the meme feature an animal (dog, cat, frog, gorilla, etc.)?", "tag": "animal"},
    {"id": 6, "q": "Is it based on a real living person?", "tag": "real_person"},
    {"id": 7, "q": "Is it an animated, cartoon, or anime meme?", "tag": "cartoon"},
    {"id": 8, "q": "Is it used to express sarcasm or irony?", "tag": "sarcasm"},
    {"id": 9, "q": "Is the meme heavily focused on facial reactions?", "tag": "reaction_face"},
    {"id": 10, "q": "Is it related to video games or gaming culture?", "tag": "gaming"},
    {"id": 11, "q": "Does it compare two contrasting things or situations?", "tag": "comparison"}
]

# Session memory store: { session_id: { "asked": set(), "memes": [...], "step": 0 } }
SESSIONS: Dict[str, dict] = {}

def create_session() -> str:
    """Create a new game session with a unique UUID."""
    session_id = str(uuid.uuid4())
    raw_memes = get_all_memes()
    memes_copy = []
    for m in raw_memes:
        m_item = dict(m)
        m_item["score"] = 0
        memes_copy.append(m_item)
        
    SESSIONS[session_id] = {
        "asked": set(),
        "memes": memes_copy,
        "step": 0,
        "max_questions": 6
    }
    return session_id

def get_session(session_id: str) -> Optional[dict]:
    return SESSIONS.get(session_id)

def reset_session(session_id: str) -> bool:
    if session_id in SESSIONS:
        del SESSIONS[session_id]
        return True
    return False

def select_next_question(session: dict) -> Tuple[Optional[int], Optional[dict]]:
    """
    Select the question that best splits remaining high-scoring candidate memes.
    """
    asked = session["asked"]
    remaining_q_indices = [i for i in range(len(QUESTIONS)) if i not in asked]
    
    if not remaining_q_indices or session["step"] >= session["max_questions"]:
        return None, None
        
    # Sort remaining questions based on how evenly they split remaining active memes
    active_memes = [m for m in session["memes"] if m.get("score", 0) >= -2]
    if not active_memes:
        active_memes = session["memes"]
        
    best_q_idx = remaining_q_indices[0]
    best_split_score = 9999
    
    for q_idx in remaining_q_indices:
        tag = QUESTIONS[q_idx]["tag"]
        count_with_tag = sum(1 for m in active_memes if tag in m.get("tags", []))
        split_score = abs((len(active_memes) / 2) - count_with_tag)
        if split_score < best_split_score:
            best_split_score = split_score
            best_q_idx = q_idx
            
    return best_q_idx, QUESTIONS[best_q_idx]

def update_session_scores(session: dict, q_idx: int, answer: str) -> dict:
    """
    Update meme candidate scores based on user answer ('yes', 'no', 'skip').
    """
    if q_idx not in QUESTIONS or q_idx in session["asked"]:
        return session
        
    tag = QUESTIONS[q_idx]["tag"]
    answer_norm = answer.strip().lower()
    
    for meme in session["memes"]:
        meme_tags = meme.get("tags", [])
        if answer_norm in ["yes", "y", "true", "1"]:
            if tag in meme_tags:
                meme["score"] += 2
            else:
                meme["score"] -= 1
        elif answer_norm in ["no", "n", "false", "0"]:
            if tag in meme_tags:
                meme["score"] -= 1.5
            else:
                meme["score"] += 0.5
        # 'skip' / 'don't know' leaves scores unchanged
        
    session["asked"].add(q_idx)
    session["step"] += 1
    return session

def calculate_confidence(session: dict) -> float:
    """Calculate Genie's confidence percentage (0% to 100%)."""
    memes = session["memes"]
    if not memes:
        return 0.0
    sorted_memes = sorted(memes, key=lambda x: x.get("score", 0), reverse=True)
    top_score = sorted_memes[0].get("score", 0)
    
    if len(sorted_memes) > 1:
        second_score = sorted_memes[1].get("score", 0)
        gap = top_score - second_score
        conf = min(99.0, max(20.0, 50.0 + (gap * 15.0)))
    else:
        conf = 95.0
        
    return round(conf, 1)

def get_candidate_count(session: dict) -> int:
    """Get count of active top candidates."""
    return sum(1 for m in session["memes"] if m.get("score", 0) >= 0)

def get_best_guess(session: dict) -> dict:
    """Return highest scoring meme as the final guess."""
    memes = session["memes"]
    sorted_memes = sorted(memes, key=lambda x: x.get("score", 0), reverse=True)
    return sorted_memes[0] if sorted_memes else {}
