from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.vehicle import Vehicle
from app.models.user import User
from app.schemas.vehicle import VehicleCreate, VehicleResponse

router = APIRouter()

@router.post("/", response_model=VehicleResponse)
def create_vehicle(
    *,
    db: Session = Depends(deps.get_db),
    vehicle_in: VehicleCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new vehicle.
    """
    vehicle = db.query(Vehicle).filter(Vehicle.vehicle_number == vehicle_in.vehicle_number).first()
    if vehicle:
        raise HTTPException(
            status_code=400,
            detail="A vehicle with this number already exists.",
        )
    vehicle = Vehicle(
        **vehicle_in.model_dump(),
        user_id=current_user.id
    )
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle

@router.get("/", response_model=List[VehicleResponse])
def read_vehicles(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve user's vehicles.
    """
    vehicles = db.query(Vehicle).filter(Vehicle.user_id == current_user.id).all()
    return vehicles

@router.delete("/{vehicle_id}", status_code=204)
def delete_vehicle(
    *,
    db: Session = Depends(deps.get_db),
    vehicle_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> None:
    """
    Delete a vehicle owned by the current user.
    """
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id, Vehicle.user_id == current_user.id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found.")
    db.delete(vehicle)
    db.commit()

