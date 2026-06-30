from typing import Optional

from pydantic import BaseModel, ConfigDict


class PromoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    code: str
    type: str
    value: float
    uses: int
    usage_limit: Optional[int] = None
    active: bool
    expires: Optional[str] = None


class PromoCreate(BaseModel):
    code: str
    type: str
    value: float
    usage_limit: Optional[int] = None
    active: bool = True
    expires: Optional[str] = None


class PromoUpdate(BaseModel):
    type: Optional[str] = None
    value: Optional[float] = None
    usage_limit: Optional[int] = None
    active: Optional[bool] = None
    expires: Optional[str] = None


class PromoValidateRequest(BaseModel):
    code: str
