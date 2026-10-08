from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
    full_name: Optional[str] = None
    has_profile: bool = False

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    has_profile: bool
    created_at: datetime

    class Config:
        from_attributes = True
