from fastapi import APIRouter, HTTPException, Query
from rag_engine import rag_search_meme
from db.mongo import add_new_meme

router = APIRouter()

@router.get("/rag/search")
def search_web_memes(query: str = Query(..., description="Meme search term or phrase")):
    if not query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
        
    res = rag_search_meme(query.strip())
    return res

@router.post("/rag/import")
def import_rag_meme(meme: dict):
    if not meme or not meme.get("name") or not meme.get("media_url"):
        raise HTTPException(status_code=400, detail="Invalid meme payload for import")
        
    success = add_new_meme(meme)
    if success:
        return {"status": "success", "message": f"Meme '{meme['name']}' imported into Genie Memory!"}
    raise HTTPException(status_code=500, detail="Failed to import meme")
