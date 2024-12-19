from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    username: str
    email: EmailStr
    
    model_config = ConfigDict(from_attributes=True)  # Updated from orm_mode

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: int
    is_active: bool

class User(UserBase):
    id: int

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str