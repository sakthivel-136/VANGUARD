
class FactoryCreate(BaseModel):

    factory_code: str
    factory_name: str

    location: Optional[str] = None

    # ✅ MUST EXIST
    factory_address: Optional[str] = None
