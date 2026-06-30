from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin
from app.database import get_db
from app.models.promo import PromoCode
from app.schemas.promo import PromoCreate, PromoOut, PromoUpdate, PromoValidateRequest

router = APIRouter(prefix="/promos", tags=["promos"])


@router.post("/validate", response_model=PromoOut)
def validate_promo(payload: PromoValidateRequest, db: Session = Depends(get_db)):
    promo = db.query(PromoCode).filter(PromoCode.code == payload.code.upper()).first()
    if not promo or not promo.active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid or inactive promo code")
    if promo.usage_limit is not None and promo.uses >= promo.usage_limit:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Promo code usage limit reached")
    return promo


@router.get("", response_model=List[PromoOut])
def list_promos(db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    return db.query(PromoCode).all()


@router.post("", response_model=PromoOut, status_code=status.HTTP_201_CREATED)
def create_promo(payload: PromoCreate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    code = payload.code.upper()
    if db.query(PromoCode).filter(PromoCode.code == code).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Promo code already exists")
    data = payload.model_dump()
    data["code"] = code
    promo = PromoCode(**data)
    db.add(promo)
    db.commit()
    db.refresh(promo)
    return promo


@router.put("/{promo_id}", response_model=PromoOut)
def update_promo(
    promo_id: int, payload: PromoUpdate, db: Session = Depends(get_db), _admin=Depends(get_current_admin)
):
    promo = db.query(PromoCode).filter(PromoCode.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promo code not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(promo, field, value)
    db.commit()
    db.refresh(promo)
    return promo


@router.delete("/{promo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_promo(promo_id: int, db: Session = Depends(get_db), _admin=Depends(get_current_admin)):
    promo = db.query(PromoCode).filter(PromoCode.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Promo code not found")
    db.delete(promo)
    db.commit()
