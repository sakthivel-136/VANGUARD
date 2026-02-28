from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# 🟢 CREATE (qr_id REQUIRED)
class QRCreate(BaseModel):
    qr_id: int
    qr_name: str
    lat: Optional[float] = None
    lon: Optional[float] = None
    status: Optional[str] = "active"
    factory_code: Optional[str] = None


# 🟡 UPDATE (qr_id NOT editable)
class QRUpdate(BaseModel):
    qr_name: Optional[str] = None
    lat: Optional[float] = None
    lon: Optional[float] = None
    status: Optional[str] = None
    factory_code: Optional[str] = None


# 🔵 RESPONSE
class QROut(QRCreate):
    created_at: datetime
