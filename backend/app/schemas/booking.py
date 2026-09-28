from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookingBase(BaseModel):
    vehicle_id: int
    slot_id: int
    start_time: datetime
    end_time: datetime

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: str
    amount: Optional[float] = None
    qr_code_hash: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
