import random
import string
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_current_user
from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.promo import PromoCode
from app.models.user import User
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate

router = APIRouter(tags=["orders"])

SHIPPING_RATES = {"standard": 0.0, "express": 15.0, "overnight": 35.0}


def _generate_order_id(db: Session) -> str:
    while True:
        suffix = "".join(random.choices(string.digits, k=5))
        candidate = f"VS-{suffix}"
        if not db.query(Order).filter(Order.id == candidate).first():
            return candidate


@router.post("/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order must contain at least one item")

    subtotal = 0.0
    order_items = []
    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {item.product_id} not found")
        line_total = product.price * item.qty
        subtotal += line_total
        order_items.append(OrderItem(product_id=product.id, material=item.material, qty=item.qty, price=product.price))

    discount = 0.0
    promo_code = None
    if payload.promo_code:
        promo = db.query(PromoCode).filter(PromoCode.code == payload.promo_code.upper()).first()
        if not promo or not promo.active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or inactive promo code")
        if promo.usage_limit is not None and promo.uses >= promo.usage_limit:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Promo code usage limit reached")
        discount = subtotal * (promo.value / 100) if promo.type == "percent" else promo.value
        discount = min(discount, subtotal)
        promo.uses += 1
        promo_code = promo.code

    shipping_cost = SHIPPING_RATES.get(payload.shipping.method or "standard", 0.0)
    total = max(subtotal - discount + shipping_cost, 0.0)

    order = Order(
        id=_generate_order_id(db),
        user_id=current_user.id,
        status="processing",
        subtotal=subtotal,
        discount=discount,
        shipping_cost=shipping_cost,
        total=total,
        promo_code=promo_code,
        shipping_address=payload.shipping.model_dump(),
        payment_last4=payload.card_last4,
        items=order_items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.get("/orders", response_model=List[OrderOut])
def list_my_orders(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/orders/{order_id}", response_model=OrderOut)
def get_order(order_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this order")
    return order


@router.get("/admin/orders", response_model=List[OrderOut])
def list_all_orders(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    return db.query(Order).order_by(Order.created_at.desc()).all()


@router.patch("/admin/orders/{order_id}", response_model=OrderOut)
def update_order_status(
    order_id: str, payload: OrderStatusUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order
