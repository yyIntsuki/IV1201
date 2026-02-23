# IV1201 — Recruitment Application

A full-stack web application for managing job applications in a recruitment process. Applicants can register, submit their competence profiles and availability, and recruiters can review and action incoming applications.

## Documentation

| Document | Description |
| --- | --- |
| [Frontend README](frontend/web-app/README.md) | Setup, project structure, and development guide for the React frontend |
| [Backend README](backend/README.md) | Setup and API reference for the FastAPI backend |
| [Architectural Decisions](docs/architectural-decisions.md) | Reasoning behind the key technical and structural decisions |

---

## Technology Stack

**Frontend:**

- [React 19](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — type-safe JavaScript
- [Vite](https://vitejs.dev/) — build tool and development server
- [Material UI](https://mui.com/) — component library
- [React Router](https://reactrouter.com/) — client-side routing
- [i18next](https://www.i18next.com/) — internationalisation (English and Swedish)
- [Axios](https://axios-http.com/) — HTTP client
- [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) — testing

**Backend:**

- [FastAPI](https://fastapi.tiangolo.com/) — Python web framework
- [PostgreSQL](https://www.postgresql.org/) — relational database
- [SQLAlchemy](https://www.sqlalchemy.org/) — ORM
- [Pydantic](https://docs.pydantic.dev/) — data validation
- [python-jose](https://python-jose.readthedocs.io/) — JWT authentication
- [Uvicorn](https://www.uvicorn.org/) — ASGI server

---

## Prerequisites

- **Node.js** 18 or higher
- **Python** 3.10 – 3.13
- **PostgreSQL** 12 or higher

---

## Quick Start

### 1. Database

```bash
createdb iv1201_db
```

### 2. Backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET_KEY at minimum
```

Key environment variables (see `backend/.env.example` for the full list):

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/iv1201_db` |
| `JWT_SECRET_KEY` | Secret used to sign JWTs — **must be changed in production** | `change-me` |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins | `http://localhost:5173` |

```bash
uvicorn main:app --reload
```

Backend runs at **http://localhost:8000**. Interactive API docs are available at **http://localhost:8000/docs**.

### 3. Frontend

```bash
cd frontend/web-app

npm install

cp .env.example .env
# Edit .env — set VITE_API_BASE_URL to the backend URL

npm run dev
```

Frontend runs at **http://localhost:5173**.

---

## Project Structure

```txt
IV1201/
├── backend/
│   ├── main.py                    # Application entry point — FastAPI app, CORS, routers
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── api/
│       │   ├── routes/            # HTTP route handlers (presentation layer)
│       │   └── schemas/           # Pydantic request/response models
│       ├── services/              # Business logic layer
│       ├── database/
│       │   ├── models.py          # SQLAlchemy ORM models
│       │   ├── connection.py      # Database connection and session
│       │   └── repositories/      # SQL queries (data layer)
│       └── security/
│           ├── jwt.py             # Token creation and decoding
│           └── dependencies.py    # FastAPI auth dependency (get_current_user)
│
├── frontend/web-app/
│   ├── src/
│   │   ├── api/                   # Raw HTTP calls — one file per endpoint
│   │   ├── auth/                  # AuthContext and AuthProvider
│   │   ├── components/            # Reusable UI components
│   │   ├── constants/             # Routes, storage keys, role definitions
│   │   ├── errors/                # Error context and toast notification
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── layout/                # Shared page layout
│   │   ├── loading/               # Loading context and overlay
│   │   ├── locales/               # i18next translation files (en, sv)
│   │   ├── pages/                 # Top-level page components
│   │   ├── routes/                # ProtectedRoute and PublicRoute guards
│   │   ├── services/              # Business logic between pages and API
│   │   ├── types/                 # Shared TypeScript type definitions
│   │   └── utils/                 # Pure utility functions
│   ├── tests/                     # Vitest test files (mirrors src/ structure)
│   ├── .env.example
│   └── package.json
│
└── docs/
    └── architectural-decisions.md
```

---

## API Reference

All endpoints are prefixed with `/api/v1`. Endpoints marked 🔒 require a valid `Authorization: Bearer <token>` header.

### Authentication

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/v1/login` | Authenticate a user, returns a JWT |

### Users

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/v1/users` | Register a new user |
| `GET` | `/api/v1/users` 🔒 | Get all users |
| `GET` | `/api/v1/users/{id}` 🔒 | Get a user by ID |
| `PUT` | `/api/v1/users/{id}` 🔒 | Update a user |
| `DELETE` | `/api/v1/users/{id}` 🔒 | Delete a user |

### Applications

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/api/v1/applications` 🔒 | Submit a job application (competence profile + availability) |
| `GET` | `/api/v1/availabilities` 🔒 | Fetch all submitted applications (recruiter use) |
| `POST` | `/api/v1/availabilities/{id}/status` 🔒 | Update the status of an application |

The full interactive API reference with request/response schemas is available at **http://localhost:8000/docs** when the backend is running.

---

## Application Overview

The application supports two user roles:

**Applicant** — registers an account, then submits a job application consisting of a competence profile (areas of expertise with years of experience) and one or more availability periods.

**Recruiter** — views all submitted applications in a paginated table, opens individual applications to review details, and sets the status of each to `accepted`, `rejected`, or `unhandled`. Status updates use an optimistic concurrency check — if another recruiter has changed the status since the page was loaded, the update is rejected with a 409 to prevent conflicting overwrites.

---

## Running Tests

```bash
cd frontend/web-app
npm run test
```

The frontend test suite uses Vitest with React Testing Library and covers services, hooks, utility functions, and page-level orchestration. See the [Frontend README](frontend/web-app/README.md) for the full testing strategy.

The backend does not currently have an automated test suite.

---

## Deployment

The application is designed for deployment on **Render** but can be deployed to any platform that supports Python and Node.js runtimes.

**Before deploying:**

1. Set `JWT_SECRET_KEY` in the backend environment to a strong randomly-generated secret — never use the default `change-me` value in production.
2. Set `CORS_ORIGINS` in the backend environment to the production frontend URL.
3. Set `VITE_API_BASE_URL` in the frontend environment to the production backend URL, then run `npm run build` to produce the static bundle.
4. Configure the server to serve `index.html` for all frontend routes — this is required for client-side routing to work correctly.

For backend-specific deployment steps, see the [Backend README](backend/README.md).
