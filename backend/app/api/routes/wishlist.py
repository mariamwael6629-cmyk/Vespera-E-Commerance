from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.product import Product
from app.models.user import User
from app.models.wishlist import WishlistItem
from app.schemas.wishlist import WishlistOut

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


def _wishlist_out(db: Session, user_id: int) -> WishlistOut:
    items = db.query(WishlistItem).filter(WishlistItem.user_id == user_id).all()
    return WishlistOut(product_ids=[item.product_id for item in items])


@router.get("", response_model=WishlistOut)
def get_wishlist(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return _wishlist_out(db, current_user.id)


@router.post("/{product_id}", response_model=WishlistOut)
def add_to_wishlist(
    product_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if not db.query(Product).filter(Product.id == product_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    exists = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id)
        .first()
    )
    if not exists:
        db.add(WishlistItem(user_id=current_user.id, product_id=product_id))
        db.commit()
    return _wishlist_out(db, current_user.id)


@router.delete("/{product_id}", response_model=WishlistOut)
def remove_from_wishlist(
    product_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    item = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id, WishlistItem.product_id == product_id)
        .first()
    )
    if item:
        db.delete(item)
        db.commit()
    return _wishlist_out(db, current_user.id)
