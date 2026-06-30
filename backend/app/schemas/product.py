from typing import Dict, List, Optional

from pydantic import BaseModel, ConfigDict


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    description: str = ""


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    category_id: str
    price: float
    compare_at: Optional[float] = None
    rating: float = 0
    reviews_count: int = 0
    tag: Optional[str] = None
    materials: List[str] = []
    stock: int = 0
    description: str = ""
    specs: Dict[str, str] = {}
    images: List[str] = []


class ProductCreate(BaseModel):
    id: Optional[str] = None
    name: str
    category_id: str
    price: float
    compare_at: Optional[float] = None
    rating: float = 4.5
    reviews_count: int = 0
    tag: Optional[str] = None
    materials: List[str] = []
    stock: int = 0
    description: str = ""
    specs: Dict[str, str] = {}
    images: List[str] = []


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[str] = None
    price: Optional[float] = None
    compare_at: Optional[float] = None
    tag: Optional[str] = None
    materials: Optional[List[str]] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    specs: Optional[Dict[str, str]] = None
    images: Optional[List[str]] = None
