from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
# from geoalchemy2 import Geometry # Uncomment when PostGIS is fully linked in DB

class ParkingLot(Base):
    __tablename__ = "parking_lots"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    # location = Column(Geometry(geometry_type='POINT', srid=4326))
    total_slots = Column(Integer)
    status = Column(String, default="OPEN") # OPEN, CLOSED, MAINTENANCE
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    slots = relationship("ParkingSlot", back_populates="parking_lot")

class ParkingSlot(Base):
    __tablename__ = "parking_slots"
    id = Column(Integer, primary_key=True, index=True)
    parking_lot_id = Column(Integer, ForeignKey("parking_lots.id"))
    slot_number = Column(String, index=True)
    status = Column(String, default="AVAILABLE") # AVAILABLE, RESERVED, OCCUPIED, MAINTENANCE
    
    parking_lot = relationship("ParkingLot", back_populates="slots")
