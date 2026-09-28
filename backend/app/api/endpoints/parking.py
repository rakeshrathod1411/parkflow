from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.parking import ParkingLot, ParkingSlot
from app.models.user import User
from app.schemas.parking import ParkingLotCreate, ParkingLotResponse

router = APIRouter()

@router.post("/", response_model=ParkingLotResponse)
def create_parking_lot(
    *,
    db: Session = Depends(deps.get_db),
    lot_in: ParkingLotCreate,
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new parking lot (Admin only).
    """
    lot = ParkingLot(**lot_in.model_dump())
    db.add(lot)
    db.commit()
    db.refresh(lot)
    
    # Automatically generate slots
    for i in range(1, lot.total_slots + 1):
        slot = ParkingSlot(
            parking_lot_id=lot.id,
            slot_number=f"A-{i:03d}"
        )
        db.add(slot)
    db.commit()
    
    return lot

@router.get("/", response_model=List[ParkingLotResponse])
def read_parking_lots(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve parking lots.
    """
    lots = db.query(ParkingLot).offset(skip).limit(limit).all()
    return lots
