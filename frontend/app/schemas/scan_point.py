from pydantic import BaseModel
from typing import Optional

class ScanPointCreate(BaseModel):
    factory_id: str
    scan_point_name: str
    scan_point_code: Optional[str]
    location: Optional[str]
    scan_type: Optional[str]
    floor: Optional[str]
    area: Optional[str]
    risk_level: Optional[str] = "Low"
    is_active: Optional[bool] = True

class ScanPointUpdate(BaseModel):
    factory_id: Optional[str]
    scan_point_name: Optional[str]
    scan_point_code: Optional[str]
    location: Optional[str]
    scan_type: Optional[str]
    floor: Optional[str]
    area: Optional[str]
    risk_level: Optional[str]
    is_active: Optional[bool]

class ScanPointResponse(BaseModel):
    id: str
    factory_id: str
    scan_point_name: str
    scan_point_code: Optional[str]
    location: Optional[str]
    scan_type: Optional[str]
    floor: Optional[str]
    area: Optional[str]
    risk_level: Optional[str]
    is_active: bool
    created_at: Optional[str]

    class Config:
        from_attributes = True
