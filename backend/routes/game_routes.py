
from fastapi import APIRouter
from db.mongo import memes
from game_engine import initialize_scores, next_question, update_scores, best_guess

router = APIRouter()

session = {
    "asked": [],
    "memes": []
}

@router.get("/start")
def start_game():
    session["memes"] = initialize_scores(list(memes.find({}, {"_id": 0})))
    session["asked"] = []
    return {"message": "Game started", "total_memes": len(session["memes"])}

@router.get("/question")
def get_question():
    idx, q = next_question(session["asked"])
    if q is None:
        guess = best_guess(session["memes"])
        return {"guess": guess}
    session["asked"].append(idx)
    return {"question_id": idx, "question": q["q"]}

@router.post("/answer")
def answer_question(question_id: int, answer: str):
    tag = None
    from game_engine import QUESTIONS
    tag = QUESTIONS[question_id]["tag"]
    session["memes"] = update_scores(session["memes"], tag, answer)
    return {"status": "answer recorded"}
