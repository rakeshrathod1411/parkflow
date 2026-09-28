import uuid
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.api import deps
from app.models.booking import Booking
from app.models.parking import ParkingSlot
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse
from app.tasks import auto_cancel_booking
from datetime import datetime
import math

router = APIRouter()

def calculate_amount(start_time: datetime, end_time: datetime) -> float:
    # Basic pricing: ₹30 for first hour, ₹20 for every additional hour
    duration = end_time - start_time
    hours = math.ceil(duration.total_seconds() / 3600.0)
    if hours <= 0:
        return 0.0
    if hours == 1:
        return 30.0
    return 30.0 + (hours - 1) * 20.0

@router.post("/", response_model=BookingResponse)
def create_booking(
    *,
    db: Session = Depends(deps.get_db),
    booking_in: BookingCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new booking.
    Solves Double-Booking using Database Pessimistic Locking (SELECT ... FOR UPDATE).
    """
    if booking_in.start_time >= booking_in.end_time:
        raise HTTPException(status_code=400, detail="End time must be after start time.")
        
    # 1. Lock the slot row in the database so no other transaction can read/modify it
    slot = db.query(ParkingSlot).with_for_update().filter(ParkingSlot.id == booking_in.slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Parking slot not found.")
        
    # 2. Check for overlapping bookings for this slot
    overlapping_booking = db.query(Booking).filter(
        Booking.slot_id == slot.id,
        Booking.status.in_(["RESERVED", "ACTIVE"]),
        or_(
            and_(Booking.start_time <= booking_in.start_time, Booking.end_time > booking_in.start_time),
            and_(Booking.start_time < booking_in.end_time, Booking.end_time >= booking_in.end_time),
            and_(Booking.start_time >= booking_in.start_time, Booking.end_time <= booking_in.end_time)
        )
    ).first()
    
    if overlapping_booking:
        raise HTTPException(
            status_code=409, 
            detail="Slot is already booked during this time period."
        )
        
    # 3. Calculate amount
    amount = calculate_amount(booking_in.start_time, booking_in.end_time)
    
    # 4. Generate pseudo QR code hash
    qr_hash = str(uuid.uuid4())
    
    # 5. Create booking
    booking = Booking(
        **booking_in.model_dump(),
        user_id=current_user.id,
        amount=amount,
        qr_code_hash=qr_hash
    )
    
    db.add(booking)
    # The commit here releases the lock on the slot!
    db.commit()
    db.refresh(booking)
    
    # Trigger Celery Task to auto-cancel if not arrived in 15 mins
    auto_cancel_booking.apply_async((booking.id,), countdown=900)
    
    return booking

@router.get("/", response_model=List[BookingResponse])
def read_bookings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve user's bookings.
    """
    # If admin, return all. If user, return only theirs.
    if current_user.role == "admin":
        bookings = db.query(Booking).all()
    else:
        bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    return bookings
