from pydantic import BaseModel
from typing import Optional

# Optional model for typed objects (useful for internal operations)
class ScanPoint(BaseModel):
    id: str
    factory_id: str
    scan_point_name: str
    scan_point_code: Optional[str]
    location: Optional[str]
    scan_type: Optional[str]
    floor: Optional[str]
    area: Optional[str]
    risk_level: Optional[str]

    class Config:
        from_attributes = True  # Updated for Pydantic v2

