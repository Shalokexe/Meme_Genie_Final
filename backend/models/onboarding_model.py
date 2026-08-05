from typing import List
from pydantic import BaseModel

class MemeIQSubmitRequest(BaseModel):
    user_id: str
    correct_answers_count: int  # 0 to 10

class MemeTasteSaveRequest(BaseModel):
    user_id: str
    selected_meme_ids: List[str]
