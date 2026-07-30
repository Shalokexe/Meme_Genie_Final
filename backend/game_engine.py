
# Akinator-style scoring engine

QUESTIONS = [
    {"q": "Is the meme music based?", "tag": "music"},
    {"q": "Is it an old meme?", "tag": "old"},
    {"q": "Is it used mainly for trolling?", "tag": "troll"},
    {"q": "Is it a global meme?", "tag": "global"},
    {"q": "Is it dialogue based?", "tag": "dialogue"},
]

def initialize_scores(memes):
    for m in memes:
        m["score"] = 0
    return memes

def next_question(asked):
    for i, q in enumerate(QUESTIONS):
        if i not in asked:
            return i, q
    return None, None

def update_scores(memes, tag, answer):
    for meme in memes:
        if answer == "yes" and tag in meme["tags"]:
            meme["score"] += 2
        elif answer == "no" and tag in meme["tags"]:
            meme["score"] -= 1
    return memes

def best_guess(memes):
    return max(memes, key=lambda x: x.get("score", 0))
