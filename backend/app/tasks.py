import logging
from app.worker import celery_app
from app.db.session import SessionLocal
from app.models.booking import Booking

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@celery_app.task
def auto_cancel_booking(booking_id: int):
    """
    Background task to automatically cancel a booking if it's not paid/activated within 15 minutes.
    """
    logger.info(f"Checking status for booking {booking_id}...")
    db = SessionLocal()
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            logger.error(f"Booking {booking_id} not found.")
            return

        if booking.status == "RESERVED":
            # The user didn't show up/pay
            booking.status = "CANCELLED"
            db.commit()
            logger.info(f"Booking {booking_id} has been automatically CANCELLED.")
        else:
            logger.info(f"Booking {booking_id} is already in status: {booking.status}. No action taken.")
    except Exception as e:
        logger.error(f"Error in auto_cancel_booking for {booking_id}: {e}")
    finally:
        db.close()
