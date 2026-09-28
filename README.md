# 🚗 ParkFlow

### Smart Vehicle Parking Management Platform

ParkFlow is a full-stack vehicle parking management platform designed to simplify parking operations through digital vehicle registration, parking-lot management, reservations, and user authentication.

The application provides a modern web interface for users to manage their vehicles and bookings while enabling parking operations to be handled through a centralized backend.

---

## ✨ Features

### 🔐 Authentication & Security

* User registration and login
* Secure authentication workflow
* Protected API endpoints
* Password hashing and security utilities
* User-specific vehicle and booking management

### 🚘 Vehicle Management

* Add and manage registered vehicles
* Store vehicle information securely
* View vehicles associated with the authenticated user
* Manage multiple vehicles from a single account

### 🅿️ Parking Management

* Create and manage parking lots
* View available parking locations
* Track parking capacity
* Manage parking-related information through REST APIs

### 📅 Booking Management

* Create parking reservations
* View existing bookings
* Manage booking information
* Associate bookings with users and vehicles

### ⚡ Modern Full-Stack Architecture

* RESTful backend APIs
* Responsive React frontend
* PostgreSQL-ready backend architecture
* Database migrations with Alembic
* Background task support
* Docker-based development environment

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      ParkFlow        │
                    │   Web Application    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │     Frontend         │
                    └──────────┬───────────┘
                               │
                         REST API / HTTP
                               │
                               ▼
                    ┌──────────────────────┐
                    │   FastAPI Backend    │
                    │                      │
                    │ Authentication       │
                    │ Vehicles             │
                    │ Parking              │
                    │ Bookings             │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Database        │
                    │     PostgreSQL       │
                    └──────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **Axios**

### Backend

* **Python**
* **FastAPI**
* **Pydantic**
* **SQLAlchemy**
* **Alembic**
* **JWT-based authentication**
* **Celery / background task support**

### Database & Infrastructure

* **PostgreSQL**
* **Docker**
* **Docker Compose**

### Development Tools

* Git
* GitHub
* VS Code
* REST API development and testing tools

---

## 📁 Project Structure

```text
parkflow/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py
│   │   │   │   ├── bookings.py
│   │   │   │   ├── parking.py
│   │   │   │   └── vehicles.py
│   │   │   │
│   │   │   └── deps.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   │
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   ├── base_class.py
│   │   │   └── session.py
│   │   │
│   │   ├── models/
│   │   │   ├── booking.py
│   │   │   ├── parking.py
│   │   │   ├── user.py
│   │   │   └── vehicle.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── booking.py
│   │   │   ├── parking.py
│   │   │   ├── user.py
│   │   │   └── vehicle.py
│   │   │
│   │   ├── main.py
│   │   ├── tasks.py
│   │   └── worker.py
│   │
│   ├── alembic/
│   ├── alembic.ini
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── contexts/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── Bookings.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── ParkingLots.tsx
│   │   │   ├── Register.tsx
│   │   │   └── Vehicles.tsx
│   │   ├── api/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── docker-compose.yml
├── start.sh
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* Python 3.10+
* Node.js 18+
* npm
* Docker & Docker Compose
* Git
* PostgreSQL (if running the database locally)

---

## 1. Clone the Repository

```bash
git clone https://github.com/rakeshrathod1411/parkflow.git
cd parkflow
```

---

## 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it on macOS/Linux:

```bash
source venv/bin/activate
```

On Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/parkflow
SECRET_KEY=your_secret_key
```

> ⚠️ Never commit your `.env` file or other credentials to GitHub.

---

## 4. Database Migration

Run the Alembic migrations:

```bash
alembic upgrade head
```

---

## 5. Start the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The backend API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI automatically provides interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 6. Start the Frontend

Open another terminal and navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🐳 Running with Docker

ParkFlow includes a Docker Compose configuration for running the application using containers.

From the project root:

```bash
docker compose up --build
```

To run the services in detached mode:

```bash
docker compose up -d --build
```

To stop the services:

```bash
docker compose down
```

---

## 🔌 API Overview

ParkFlow exposes REST APIs for the application's core functionality.

| Module      | Purpose                                    |
| ----------- | ------------------------------------------ |
| `/auth`     | User authentication and account operations |
| `/vehicles` | Vehicle management                         |
| `/parking`  | Parking-lot operations                     |
| `/bookings` | Parking reservations                       |

Interactive API documentation is available through FastAPI:

```text
/docs
```

---

## 🔒 Security

ParkFlow follows several security practices:

* Password hashing
* Token-based authentication
* Protected API routes
* Environment-based configuration
* Separation of application secrets from source code
* `.gitignore` protection for local credentials and environments

---

## 🧩 Core Data Model

The backend is organized around several primary entities:

```text
User
 │
 ├──────────► Vehicle
 │
 └──────────► Booking
                  │
                  ├──────────► Vehicle
                  │
                  └──────────► Parking Lot
```

This structure allows users, vehicles, parking locations, and reservations to be managed independently while maintaining their relationships.

---

## 📸 Screenshots

> Screenshots can be added here to showcase the application's interface.

Example:

```text
docs/
├── dashboard.png
├── login.png
├── parking-lots.png
├── vehicles.png
└── bookings.png
```

Then add them to the README:

```markdown
![Dashboard](docs/dashboard.png)
```

---

## 🧪 Development

Run backend tests:

```bash
pytest
```

Check backend API documentation:

```text
http://localhost:8000/docs
```

Run the frontend development server:

```bash
npm run dev
```

---

## 🔮 Future Improvements

Potential improvements for future versions include:

* [ ] Real-time parking availability
* [ ] QR-code based vehicle entry and exit
* [ ] Online payment integration
* [ ] Automated booking expiration
* [ ] Email/SMS booking notifications
* [ ] Admin dashboard
* [ ] Parking occupancy analytics
* [ ] Role-based access control
* [ ] Google Maps integration
* [ ] Mobile application
* [ ] Automated deployment with CI/CD
* [ ] Cloud deployment
* [ ] Monitoring and logging

---

## 📈 Project Goals

ParkFlow aims to demonstrate the development of a production-oriented full-stack application by combining:

* Modern frontend development
* REST API architecture
* Authentication and authorization
* Relational database design
* Database migrations
* Containerized development
* Background processing
* Clean project organization

---

## 👨‍💻 Author

**Rakesh Rathod**

GitHub:
https://github.com/rakeshrathod1411

---

## 📄 License

This project is intended for educational and portfolio purposes.

A suitable open-source license can be added to the repository depending on the project's distribution requirements.

---

⭐ If you find this project useful, consider giving the repository a star.
