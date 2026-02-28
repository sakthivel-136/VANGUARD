from sqlalchemy import Column, BigInteger, Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base

class ScanningDetails(Base):
    __tablename__ = "scanning_details"

    id = Column(BigInteger, primary_key=True, index=True)

    round_id = Column(UUID, nullable=False, index=True)

    guard_name = Column(Text)
    employee_id = Column(Text)

    qr_id = Column(Text)
    qr_name = Column(Text)

    lat = Column(Text)
    log = Column(Text)

    scan_time = Column(TIMESTAMP(timezone=True), server_default=func.now())
    status = Column(Text)
    factory_code = Column(Text)
