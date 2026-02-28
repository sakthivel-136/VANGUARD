from pydantic import BaseModel, Field
from typing import Optional

class SecurityUserBase(BaseModel):
    security_id: str = Field(..., description="Unique Security ID")
    security_name: str = Field(..., description="Name of the security user")
    security_password: str = Field(..., description="Password (hashed ideally)")
    factory: str = Field(..., description="Factory ID or Name")

class SecurityUserCreate(SecurityUserBase):
    pass

class SecurityUserUpdate(BaseModel):
    security_name: Optional[str] = None
    security_password: Optional[str] = None
    factory: Optional[str] = None

class SecurityUserResponse(SecurityUserBase):
    created_at: Optional[str] = None
