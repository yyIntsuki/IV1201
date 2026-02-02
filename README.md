# IV1201 - Recruitment Application

A full-stack web application demonstrating a complete layered architecture with HTTP requests flowing through presentation, business logic, and database layers.

## Architecture Overview

This project implements a three-layer architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
│  Frontend (React) + Backend API Routes (FastAPI)                │
│  - User Interface                                               │
│  - HTTP Request/Response Handling                               │
│  - Input Validation                                             │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                       │
│  Services (Python)                                              │
│  - Business Rules                                               │
│  - Data Transformation                                          │
│  - Validation Logic                                             │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                          │
│  Repositories (SQLAlchemy) + PostgreSQL                         │
│  - Data Persistence                                             │
│  - Query Execution                                              │
│  - Database Operations                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Complete Request Flow

When a user creates a new user account, the request flows through all layers:

1. **Frontend (React)** - User fills form and clicks submit
2. **HTTP Request** - POST request sent to backend API
3. **API Route (FastAPI)** - Receives request, validates schema
4. **Service Layer** - Validates business rules, hashes password
5. **Repository** - Executes SQL INSERT query
6. **Database (PostgreSQL)** - Stores data, returns new user
7. **Response** - Data flows back through all layers to frontend
8. **UI Update** - React component displays the new user

## Project Structure

```
IV1201/
├── backend/                    # FastAPI backend
│   ├── main.py                # Application entry point
│   ├── requirements.txt       # Python dependencies
│   ├── app/
│   │   ├── api/              # Presentation Layer
│   │   │   ├── routes/       # HTTP endpoints
│   │   │   └── schemas/      # Request/response models
│   │   ├── services/         # Business Logic Layer
│   │   └── database/         # Data Layer
│   │       ├── models.py     # Database models
│   │       ├── connection.py # DB configuration
│   │       └── repositories/ # Data access objects
│   └── README.md
│
├── frontend/                  # React frontend
│   └── web-app/
│       ├── src/
│       │   ├── App.tsx       # Main component
│       │   ├── UserManagement.tsx  # User interface
│       │   └── services/
│       │       └── api.ts    # Backend API client
│       ├── package.json
│       └── README.md
│
└── docs/
    └── architectural-decisions.md
```

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Relational database
- **SQLAlchemy** - ORM model for database operations
- **Pydantic** - Data validation

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 12+

### 1. Setup Database

```bash
# Create PostgreSQL database
createdb iv1201_db
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run the server
uvicorn main:app --reload
```

Backend will run at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### 3. Setup Frontend

```bash
cd frontend/web-app
npm install

# Configure environment
cp .env.example .env

# Run the development server
npm run dev
```

Frontend will run at `http://localhost:5173`

## Testing the Full Stack

1. Start the PostgreSQL database
2. Start the backend server (port 8000)
3. Start the frontend server (port 5173)
4. Open http://localhost:5173 in your browser
5. Try creating a user:
   - Fill in the form
   - Click "Create User"
   - Watch the request flow through all layers
   - See the new user appear in the list

## API Endpoints

### Users
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/{id}` - Get user by ID
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

## Key Features Demonstrating Layer Integration

### Create User Flow
```
User Input (Frontend)
  → Form Validation (Frontend)
    → HTTP POST Request
      → Schema Validation (API Layer)
        → Business Rules Check (Service Layer)
          → Password Hashing (Service Layer)
            → SQL INSERT (Repository Layer)
              → PostgreSQL Database
                → Response back through all layers
                  → UI Update (Frontend)
```

### Get Users Flow
```
User Click "Refresh" (Frontend)
  → HTTP GET Request
    → Route Handler (API Layer)
      → Service Method (Business Logic Layer)
        → SQL SELECT (Repository Layer)
          → PostgreSQL Database
            → Transform Data (Service Layer)
              → JSON Response
                → Update UI (Frontend)
```

## Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload
```
Changes will hot-reload automatically.

### Frontend Development
```bash
cd frontend/web-app
npm run dev
```
Vite provides instant HMR (Hot Module Replacement).

## Documentation

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/web-app/README.md)
- [Architectural Decisions](docs/architectural-decisions.md)

## License

See [LICENSE](LICENSE) file for details.

