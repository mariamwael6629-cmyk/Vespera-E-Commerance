from sqlalchemy import Column, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, default="")

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    price = Column(Float, nullable=False)
    compare_at = Column(Float, nullable=True)
    rating = Column(Float, default=0)
    reviews_count = Column(Integer, default=0)
    tag = Column(String, nullable=True)
    materials = Column(JSON, default=list)
    stock = Column(Integer, default=0)
    description = Column(String, default="")
    specs = Column(JSON, default=dict)
    images = Column(JSON, default=list)

    category = relationship("Category", back_populates="products")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
