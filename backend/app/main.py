from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import auth, vehicles, parking, bookings

app = FastAPI(
    title="Smart Parking Management API",
    description="API for the Smart Parking Management Platform",
    version="1.0.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
app.include_router(parking.router, prefix="/parking-lots", tags=["parking"])
app.include_router(bookings.router, prefix="/bookings", tags=["bookings"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Parking Management API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
