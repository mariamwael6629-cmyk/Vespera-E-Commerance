from sqlalchemy import Boolean, Column, Float, Integer, String

from app.database import Base


class PromoCode(Base):
    __tablename__ = "promo_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False, index=True)
    type = Column(String, nullable=False)
    value = Column(Float, default=0)
    uses = Column(Integer, default=0)
    usage_limit = Column(Integer, nullable=True)
    active = Column(Boolean, default=True)
    expires = Column(String, nullable=True)
