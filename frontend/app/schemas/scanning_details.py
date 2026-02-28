from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ScanCreate(BaseModel):
    guard_name: Optional[str]
    qr_id: Optional[str]
    qr_name: Optional[str]
    lat: Optional[float]
    log: Optional[float]
    status: Optional[str]
    factory_code: Optional[str]

class ScanResponse(ScanCreate):
    id: int
    scan_time: datetime

    class Config:
        from_attributes = True