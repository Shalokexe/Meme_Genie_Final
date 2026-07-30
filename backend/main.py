
from fastapi import FastAPI
from routes.game_routes import router as game_router

app = FastAPI(title="Meme Genie 🧞‍♂️")

app.include_router(game_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Meme Genie Backend is running!"}
