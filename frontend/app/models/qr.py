from sqlalchemy import Column, Integer, Text, Float, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class QR(Base):
    __tablename__ = "qr"

    qr_id = Column(Integer, primary_key=True, index=True)
    qr_name = Column(Text, nullable=False)

    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)

    status = Column(Text, default="active")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    factory_code = Column(
        Text,
        ForeignKey("factories.factory_code"),
        nullable=True
    )
