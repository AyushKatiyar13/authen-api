# Modified version with corrections
import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from backend.database import users_collection
from .dependencies import oauth2_scheme

# Hardcoded email configuration
SENDER_EMAIL = "ayushkatiyar1301@gmail.com"
SENDER_PASSWORD = "skiuasfqrcnxwiir"  # Ensure this is an app password or correct credentials

# Hardcoded MongoDB details
MONGODB_URI = "mongodb+srv://authen_api:JP6EP8H5r0CnqXsj@cluster0.wcu1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DATABASE_NAME = "authen_api"

# FastAPI app initialization
app = FastAPI()

# Allow CORS for your frontend origin
origins = ["https://authenapi.netlify.app/"]  # Your frontend URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
SECRET_KEY = "Katiyar's_auth_21"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 100

# Pydantic models for registration and login
class RegisterUser(BaseModel):
    username: str
    email: str
    password: str
    is_verified: bool = False

class LoginUser(BaseModel):
    username: str
    password: str

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Helper functions
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to the Authentication API!"}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("static/favicon.ico")

@app.post("/register")
async def register(user: RegisterUser):
    existing_user = await users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists.")
    
    hashed_password = get_password_hash(user.password)
    user_data = user.dict()
    user_data["password"] = hashed_password
    await users_collection.insert_one(user_data)
    
    send_verification_email(user.username, user.email)
    
    return {"message": "User registered successfully!"}

@app.get("/verify-email")
async def verify_email(token: str):
    username = verify_token(token)
    if not username:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")

    user = await users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await users_collection.update_one({"username": username}, {"$set": {"is_verified": True}})
    return {"message": "Email verified successfully!"}

def send_verification_email(username: str, email: str):
    verification_token = create_access_token(data={"sub": username}, expires_delta=timedelta(minutes=30))
    verification_link = f"https://authenapi.netlify.app/verify-email?token={verification_token}"
    
    msg = MIMEMultipart()
    msg['From'] = SENDER_EMAIL
    msg['To'] = email
    msg['Subject'] = "Email Verification"
    body = f"Hi {username},\n\nPlease verify your email by clicking on the following link:\n{verification_link}\n\nThank you!"
    msg.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.send_message(msg)
        print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {e}")

@app.post("/login")
async def login(user: LoginUser):
    db_user = await users_collection.find_one({"username": user.username})
    
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.username})
    
    return {"access_token": access_token, "token_type": "bearer", "message": f"Welcome back, {user.username}!"}

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    return username

@app.get("/protected")
def read_protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello, {current_user}. This is a protected route."}

class PasswordResetRequest(BaseModel):
    email: str

@app.post("/request-password-reset")
async def request_password_reset(request: PasswordResetRequest):
    user = await users_collection.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    access_token = create_access_token(data={"sub": user["username"]})
    reset_link = f"https://authenapi.netlify.app/reset-password/{access_token}"
    return {"message": "Password reset link sent to your email."}

class PasswordReset(BaseModel):
    token: str
    new_password: str

@app.post("/reset-password")
async def reset_password(password_reset: PasswordReset):
    username = verify_token(password_reset.token)
    if not username:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    db_user = await users_collection.find_one({"username": username})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_new_password = get_password_hash(password_reset.new_password)
    await users_collection.update_one({"username": username}, {"$set": {"password": hashed_new_password}})
    
    return {"message": "Password reset successfully."}
