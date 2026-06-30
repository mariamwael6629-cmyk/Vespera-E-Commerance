from pydantic import BaseModel


class WishlistOut(BaseModel):
    product_ids: list[str]
