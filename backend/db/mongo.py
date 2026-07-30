import logging
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
from db.seed import INITIAL_MEMES, seed_memes_collection

logger = logging.getLogger("meme_genie_db")

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME = "meme_genie"
COLLECTION_NAME = "memes"

_mongo_available = False
client = None
db = None
memes_collection = None

try:
    # 2 second timeout attempt to connect to MongoDB
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    client.admin.command('ping')
    db = client[DB_NAME]
    memes_collection = db[COLLECTION_NAME]
    seed_memes_collection(memes_collection)
    _mongo_available = True
    logger.info("Connected to local MongoDB instance!")
except (ServerSelectionTimeoutError, ConnectionFailure, Exception) as e:
    logger.info("Local MongoDB not detected. Using robust embedded meme memory store.")
    _mongo_available = False

def is_mongo_online() -> bool:
    return _mongo_available

def get_all_memes():
    """Retrieve all memes from MongoDB if connected, otherwise return in-memory dataset."""
    if _mongo_available and memes_collection is not None:
        try:
            return list(memes_collection.find({}, {"_id": 0}))
        except Exception as err:
            logger.error(f"Error fetching from MongoDB: {err}")
    return [dict(m) for m in INITIAL_MEMES]

def add_new_meme(meme_dict: dict) -> bool:
    """Insert a new meme into MongoDB or in-memory store."""
    if _mongo_available and memes_collection is not None:
        try:
            memes_collection.insert_one(meme_dict)
            return True
        except Exception as err:
            logger.error(f"Failed to insert into MongoDB: {err}")
    # Also add to in-memory store
    INITIAL_MEMES.append(meme_dict)
    return True
