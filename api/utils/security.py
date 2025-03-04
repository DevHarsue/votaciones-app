from jose import jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from .env import ALGORITHM, SECRET_KEY
from ..models.user_models import UserResponse
import bcrypt
import json

def hash_password(password: str):
    return (bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12))).decode("utf-8")

def verify_password(password: str, hashed_password: str):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

def generate_token_validate(id: int):
    try:
        payload = {
            "sub": str(id),
            "exp": datetime.utcnow() + timedelta(minutes=5)  # Añadir expiración al token
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return token
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

def generate_token_user(user: UserResponse):
    try:
        payload = {
            "sub": json.dumps({"username":str(user.username), 
                    "email":str(user.email), 
                    "rol":str(user.rol)}),
            "exp": datetime.utcnow() + timedelta(days=30)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return token
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Token is invalid: {str(e)}")
