from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "product_id", name="uq_user_product_wishlist"),)

    user = relationship("User", back_populates="wishlist_items")
    product = relationship("Product")
