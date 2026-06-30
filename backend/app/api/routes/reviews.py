from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.database import get_db
from app.models.product import Product
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewCreate, ReviewOut

router = APIRouter(prefix="/products/{product_id}/reviews", tags=["reviews"])


def _refresh_product_rating(db: Session, product_id: str) -> None:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return
    reviews = db.query(Review).filter(Review.product_id == product_id).all()
    product.reviews_count = len(reviews)
    product.rating = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else 0
    db.commit()


@router.get("", response_model=List[ReviewOut])
def list_reviews(product_id: str, db: Session = Depends(get_db)):
    if not db.query(Product).filter(Product.id == product_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return (
        db.query(Review)
        .filter(Review.product_id == product_id)
        .order_by(Review.created_at.desc())
        .all()
    )


@router.post("", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
def create_review(
    product_id: str,
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not db.query(Product).filter(Product.id == product_id).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    review = Review(
        product_id=product_id,
        user_id=current_user.id,
        author_name=current_user.name,
        rating=payload.rating,
        title=payload.title,
        body=payload.body,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    _refresh_product_rating(db, product_id)
    return review
