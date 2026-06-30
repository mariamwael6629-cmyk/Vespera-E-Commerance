from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class OrderItemIn(BaseModel):
    product_id: str
    material: str
    qty: int = 1


class ShippingAddress(BaseModel):
    name: str
    email: str
    address: str
    city: str
    state: str
    zip: str
    method: Optional[str] = "standard"


class OrderCreate(BaseModel):
    items: List[OrderItemIn]
    shipping: ShippingAddress
    card_last4: Optional[str] = None
    promo_code: Optional[str] = None


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    product_id: str
    material: str
    qty: int
    price: float


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    status: str
    subtotal: float
    discount: float
    shipping_cost: float
    total: float
    promo_code: Optional[str] = None
    shipping_address: dict
    payment_last4: Optional[str] = None
    created_at: datetime
    items: List[OrderItemOut]


class OrderStatusUpdate(BaseModel):
    status: str
