
from typing import List
from pydantic import BaseModel

class Meme(BaseModel):
    name: str
    quotes: List[str]
    tags: List[str]
    era: str
    region: str
    format: str
    media_url: str
