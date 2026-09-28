from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ParkingSlotBase(BaseModel):
    slot_number: str
    status: str = "AVAILABLE"

class ParkingSlotResponse(ParkingSlotBase):
    id: int
    parking_lot_id: int

    class Config:
        from_attributes = True

class ParkingLotBase(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    total_slots: int

class ParkingLotCreate(ParkingLotBase):
    pass

class ParkingLotResponse(ParkingLotBase):
    id: int
    status: str
    created_at: datetime
    slots: List[ParkingSlotResponse] = []

    class Config:
        from_attributes = True
