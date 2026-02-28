from pydantic import BaseModel
from typing import Optional


# Request model
class FactoryCreate(BaseModel):
    factory_code: str
    factory_name: str
    location: Optional[str] = None


# Response model
class FactoryResponse(BaseModel):

    factory_code: str
    factory_name: str

    location: Optional[str] = None

    # ✅ ADD THIS
    factory_address: Optional[str] = None

    is_active: Optional[bool] = True
    created_at: Optional[str] = None


    class Config:
        from_attributes = True
