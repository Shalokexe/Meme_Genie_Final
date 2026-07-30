from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional
from models.meme_model import Meme, MemeCreate, AnswerRequest, QuestionResponse, GameStartResponse
from db.mongo import get_all_memes, add_new_meme, is_mongo_online
from game_engine import (
    create_session, get_session, reset_session,
    select_next_question, update_session_scores,
    calculate_confidence, get_candidate_count, get_best_guess
)

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Meme Genie Backend 🧞‍♂️",
        "mongo_connected": is_mongo_online(),
        "total_memes": len(get_all_memes())
    }

@router.post("/start", response_model=GameStartResponse)
@router.get("/start", response_model=GameStartResponse)
def start_game():
    session_id = create_session()
    memes_list = get_all_memes()
    return GameStartResponse(
        session_id=session_id,
        message="Game session created successfully",
        total_memes=len(memes_list)
    )

@router.get("/question", response_model=QuestionResponse)
def get_question(session_id: str = Query(..., description="Unique game session ID")):
    session = get_session(session_id)
    if not session:
        # Auto-create session if invalid
        session_id = create_session()
        session = get_session(session_id)
        
    q_idx, q_data = select_next_question(session)
    confidence = calculate_confidence(session)
    candidates = get_candidate_count(session)
    progress = round((session["step"] / session["max_questions"]) * 100, 1)
    
    # If no more questions or high confidence, return guess
    if q_idx is None or (session["step"] >= 4 and confidence >= 85.0):
        guess_data = get_best_guess(session)
        return QuestionResponse(
            progress=100.0,
            candidate_count=1,
            confidence=confidence,
            guess=Meme(**guess_data)
        )
        
    return QuestionResponse(
        question_id=q_idx,
        question=q_data["q"],
        progress=progress,
        candidate_count=candidates,
        confidence=confidence,
        guess=None
    )

@router.post("/answer")
def submit_answer(req: AnswerRequest):
    session = get_session(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    update_session_scores(session, req.question_id, req.answer)
    return {"status": "success", "step": session["step"]}

@router.get("/memes")
def list_memes():
    return {"memes": get_all_memes(), "count": len(get_all_memes())}

@router.post("/memes")
def create_meme(meme: MemeCreate):
    meme_dict = meme.dict()
    if not meme_dict.get("id"):
        meme_dict["id"] = meme_dict["name"].lower().replace(" ", "_")
    success = add_new_meme(meme_dict)
    if success:
        return {"message": "Meme created successfully", "meme": meme_dict}
    raise HTTPException(status_code=500, detail="Failed to add meme")

@router.post("/reset")
def reset_game_session(session_id: str = Query(...)):
    success = reset_session(session_id)
    return {"status": "reset" if success else "not_found"}
