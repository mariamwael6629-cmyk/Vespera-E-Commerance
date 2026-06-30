from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    product_id: str
    author_name: str
    rating: float
    title: str
    body: str
    created_at: datetime


class ReviewCreate(BaseModel):
    rating: float = Field(ge=1, le=5)
    title: str
    body: str
