from pydantic import BaseModel
from datetime import datetime

class VehicleBase(BaseModel):
    vehicle_number: str
    vehicle_type: str
    model: str
    color: str

class VehicleCreate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
