"""
Speech-to-Text & Audio Processing Helper Module
Supports server-side audio parsing stubs and natural language command parsing.
"""

def parse_voice_answer(transcript: str) -> str:
    """Normalize raw speech transcript into valid game answer."""
    if not transcript:
        return "skip"
    t = transcript.lower().strip()
    
    yes_keywords = ["yes", "yeah", "yep", "sure", "correct", "affirmative", "true", "definitely", "right"]
    no_keywords = ["no", "nope", "nah", "never", "false", "incorrect", "wrong", "negative"]
    skip_keywords = ["skip", "don't know", "dont know", "maybe", "unsure", "next", "pass"]
    
    for word in t.split():
        if word in yes_keywords:
            return "yes"
        if word in no_keywords:
            return "no"
        if word in skip_keywords:
            return "skip"
            
    return "skip"

def convert_audio_to_text(audio_bytes=None) -> str:
    """
    Placeholder for Whisper / Speech API processing.
    Returns normalized text transcription.
    """
    return "yes"
