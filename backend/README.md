# IV1201 Backend API

FastAPI backend for the IV1201 recruitment application, demonstrating a complete layered architecture with full-stack integration.

## Architecture

This backend implements a three-layer architecture:

1. **Presentation Layer** (`app/api/routes/`) - HTTP endpoints and request/response handling
2. **Business Logic Layer** (`app/services/`) - Business rules, validation, and coordination
3. **Data Layer** (`app/database/`) - Database models and repository pattern

## Full-Stack Flow

When an HTTP request is made, it flows through all layers:

```
HTTP Request → API Routes → Business Logic Service → Repository → PostgreSQL Database
     ↓              ↓                ↓                    ↓              ↓
  Frontend    Validation       Business Rules      SQL Queries    Data Storage
     ↑              ↑                ↑                    ↑              ↑
HTTP Response ← API Routes ← Business Logic Service ← Repository ← PostgreSQL Database
```

## Setup Instructions

### Prerequisites

- Python version between 3.10 and 3.13
- PostgreSQL 12 or higher

### 1. Install Dependencies

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Database

Create a PostgreSQL database:

```sql
CREATE DATABASE iv1201_db;
```

Copy the environment file and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL` with your PostgreSQL credentials.

### 3. Run the Application

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

- API Documentation: `http://localhost:8000/docs`
- Alternative Documentation: `http://localhost:8000/redoc`

## API Endpoints

### Users

- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/{user_id}` - Get a specific user
- `PUT /api/v1/users/{user_id}` - Update a user
- `DELETE /api/v1/users/{user_id}` - Delete a user

### Example Request

```bash
curl -X POST "http://localhost:8000/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword123"
  }'
```

## Project Structure

```
backend/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── app/
│   ├── api/               # Presentation Layer
│   │   ├── routes/        # API endpoints
│   │   └── schemas/       # Request/response models
│   ├── services/          # Business Logic Layer
│   └── database/          # Data Layer
│       ├── models.py      # SQLAlchemy models
│       ├── connection.py  # Database configuration
│       └── repositories/  # Data access objects
```

## Technology Stack

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## Development

The application uses hot-reload during development. Any changes to the code will automatically restart the server.

## Testing the Full Stack

1. Start the backend server (this project)
2. Start the frontend application (in `frontend/web-app/`)
3. Open the frontend in your browser
4. Create a user through the UI
5. Observe the request flow through all layers in the terminal logs

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000`
- `http://localhost:4173` (Vite preview)

Update CORS settings in `main.py` for production deployment.
