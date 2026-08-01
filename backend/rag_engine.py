"""
Meme Genie Free RAG & Web Search Engine
Integrates live web retrieval for memes, origins, quotes, and media URLs
with Grok AI (xAI) & free search provider fallbacks.
"""

import os
import re
import json
import logging
import urllib.parse
import urllib.request
from typing import Dict, List, Optional

logger = logging.getLogger("meme_genie_rag")

GROK_API_KEY = os.getenv("GROK_API_KEY", "")

def fetch_duckduckgo_web_results(query: str) -> List[dict]:
    """
    Fetch free web search snippets from DuckDuckGo HTML search.
    """
    search_term = f"{query} meme origin media"
    encoded_query = urllib.parse.quote_plus(search_term)
    url = f"https://html.duckduckgo.com/html/?q={encoded_query}"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    results = []
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=4) as response:
            html = response.read().decode('utf-8', errors='ignore')
            
            # Simple regex parser for DuckDuckGo HTML results
            snippets = re.findall(r'<a class="result__snippet[^>]*>(.*?)</a>', html, re.DOTALL)
            links = re.findall(r'<a class="result__url[^>]*href="([^"]+)"', html, re.DOTALL)
            titles = re.findall(r'<a class="result__a[^>]*>(.*?)</a>', html, re.DOTALL)
            
            for i in range(min(4, len(titles))):
                clean_title = re.sub(r'<[^>]+>', '', titles[i]).strip()
                clean_snippet = re.sub(r'<[^>]+>', '', snippets[i] if i < len(snippets) else '').strip()
                clean_link = links[i].strip() if i < len(links) else "https://knowyourmeme.com"
                
                results.append({
                    "title": clean_title,
                    "snippet": clean_snippet,
                    "link": clean_link
                })
    except Exception as err:
        logger.warning(f"Free web search fetch fallback: {err}")
        
    return results

def query_grok_ai(prompt: str) -> Optional[str]:
    """
    Query Grok AI (xAI API) if GROK_API_KEY environment variable is configured.
    """
    if not GROK_API_KEY:
        return None
        
    try:
        url = "https://api.x.ai/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GROK_API_KEY}"
        }
        data = {
            "messages": [
                {"role": "system", "content": "You are Meme Genie RAG assistant. Return concise meme backstory, quotes, and image URL."},
                {"role": "user", "content": prompt}
            ],
            "model": "grok-beta",
            "temperature": 0.3
        }
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req, timeout=5) as response:
            res_json = json.loads(response.read().decode('utf-8'))
            return res_json['choices'][0]['message']['content']
    except Exception as err:
        logger.warning(f"Grok AI query fallback: {err}")
        return None

def rag_search_meme(query: str) -> dict:
    """
    Perform Retrieval-Augmented Generation (RAG) search for any meme query.
    Combines live web retrieval with synthesized structured output.
    """
    web_sources = fetch_duckduckgo_web_results(query)
    
    # Check if Grok AI response is available
    grok_prompt = f"Analyze meme: '{query}'. Context snippets: {json.dumps(web_sources)}"
    grok_result = query_grok_ai(grok_prompt)
    
    # Synthesize RAG Meme Payload
    synthesized_name = query.title()
    description = ""
    quotes = []
    tags = ["viral", "web_search", "rag"]
    media_url = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600"
    
    if web_sources:
        description = web_sources[0]["snippet"]
        if len(web_sources) > 1:
            quotes.append(web_sources[1]["title"][:40])
    else:
        description = f"Popular viral meme '{query}' discovered via Meme Genie RAG Web Engine."
        
    if grok_result:
        description = grok_result[:300]
        
    # Standard image fallbacks based on common search keywords
    query_lower = query.lower()
    if "dog" in query_lower or "shiba" in query_lower:
        media_url = "https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg"
        tags.extend(["animal", "dog"])
    elif "cat" in query_lower:
        media_url = "https://i.kym-cdn.com/entries/icons/original/000/031/015/cover5.jpg"
        tags.extend(["animal", "cat"])
    elif "rick" in query_lower or "roll" in query_lower:
        media_url = "https://media.giphy.com/media/Vuw9m5wXviFIQ/giphy.gif"
        tags.extend(["music", "classic"])
    elif "chad" in query_lower:
        media_url = "https://i.kym-cdn.com/entries/icons/original/000/026/152/gigachad.jpg"
        tags.extend(["real_person", "fitness"])

    return {
        "query": query,
        "meme": {
            "id": f"rag_{re.sub(r'[^a-z0-9]', '_', query_lower)}",
            "name": synthesized_name,
            "quotes": quotes if quotes else [f"Viral quote for {synthesized_name}"],
            "tags": list(set(tags)),
            "era": "2020s",
            "region": "global",
            "format": "image",
            "media_url": media_url,
            "description": description
        },
        "sources": web_sources,
        "rag_source": "Grok AI + DuckDuckGo Web Engine" if grok_result else "Free Live Web Search Engine"
    }
