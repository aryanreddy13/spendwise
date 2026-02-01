from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

try:
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    users_collection = db["users"]
    print(f"Connected to MongoDB at {MONGO_URI}, DB: {DB_NAME}")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    users_collection = None
