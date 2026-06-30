from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.database import get_db
from app.models.order import Order
from app.models.user import User
from app.schemas.user import UserAdminOut, UserStatusUpdate

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=List[UserAdminOut])
def list_users(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    users = db.query(User).all()
    result = []
    for user in users:
        orders = db.query(Order).filter(Order.user_id == user.id).all()
        result.append(
            UserAdminOut(
                id=user.id,
                name=user.name,
                email=user.email,
                role=user.role,
                status=user.status,
                created_at=user.created_at,
                orders_count=len(orders),
                spent=sum(o.total for o in orders),
            )
        )
    return result


@router.patch("/users/{user_id}", response_model=UserAdminOut)
def update_user(
    user_id: int, payload: UserStatusUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if payload.status is not None:
        user.status = payload.status
    if payload.role is not None:
        user.role = payload.role
    db.commit()
    db.refresh(user)
    orders = db.query(Order).filter(Order.user_id == user.id).all()
    return UserAdminOut(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        status=user.status,
        created_at=user.created_at,
        orders_count=len(orders),
        spent=sum(o.total for o in orders),
    )
