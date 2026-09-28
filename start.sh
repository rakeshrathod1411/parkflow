#!/bin/bash
echo "Starting Vehicle Parking System..."

# Start DB and Redis
docker-compose up -d

# Setup Backend
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head

# Start Celery in background
celery -A app.worker.celery_app worker --loglevel=info &
CELERY_PID=$!

# Start FastAPI in background
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
FASTAPI_PID=$!

# Start Frontend
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "All services started! Press Ctrl+C to stop."

# Wait for termination signal
trap "echo 'Stopping services...'; kill $CELERY_PID; kill $FASTAPI_PID; kill $FRONTEND_PID; docker-compose stop; exit" SIGINT SIGTERM
wait
