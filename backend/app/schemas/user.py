from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    role: str
    status: str
    created_at: datetime


class UserAdminOut(UserOut):
    orders_count: int = 0
    spent: float = 0


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class UserStatusUpdate(BaseModel):
    status: Optional[str] = None
    role: Optional[str] = None
