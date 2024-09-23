from motor.motor_asyncio import AsyncIOMotorClient
from urllib.parse import quote_plus

# Hardcode values for testing
username = "authen_api"
password = "JP6EP8H5r0CnqXsj"  # Your actual password
encoded_password = quote_plus(password)  # URL-encode the password

MONGODB_URI = f"mongodb+srv://{username}:{encoded_password}@cluster0.wcu1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "auth_api"

print(f"MONGODB_URI: {MONGODB_URI}, DATABASE_NAME: {DATABASE_NAME}")

client = AsyncIOMotorClient(MONGODB_URI)
database = client[DATABASE_NAME]
users_collection = database["users"]
