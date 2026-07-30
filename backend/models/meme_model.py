from typing import List, Optional
from pydantic import BaseModel, Field

class Meme(BaseModel):
    id: Optional[str] = None
    name: str
    quotes: List[str] = []
    tags: List[str] = []
    era: str = "2010s"
    region: str = "global"
    format: str = "image"
    media_url: str
    description: Optional[str] = ""

class MemeCreate(BaseModel):
    name: str
    quotes: List[str] = []
    tags: List[str] = []
    era: str = "2020s"
    region: str = "global"
    format: str = "image"
    media_url: str
    description: Optional[str] = ""

class AnswerRequest(BaseModel):
    session_id: str
    question_id: int
    answer: str  # 'yes', 'no', 'skip'

class GameStartResponse(BaseModel):
    session_id: str
    message: str
    total_memes: int

class QuestionResponse(BaseModel):
    question_id: Optional[int] = None
    question: Optional[str] = None
    progress: float = 0.0
    candidate_count: int = 0
    confidence: float = 0.0
    guess: Optional[Meme] = None
