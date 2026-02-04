"""
Main application entry point for the FastAPI backend.
This file configures the application and includes all routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.api.routes import user_routes
from app.database.connection import database, engine
from app.database.models import Base

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    """
    # Startup: Create database tables
    Base.metadata.create_all(bind=engine)
    await database.connect()
    yield
    # Shutdown: Disconnect from database
    await database.disconnect()


app = FastAPI(
    title="IV1201 Application API",
    description="Backend API for the IV1201 recruitment application",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default dev server
        "http://localhost:3000",
        "http://localhost:4173",  # Vite preview
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_routes.router, prefix="/api/v1", tags=["users"])


@app.get("/")
async def root():
    """Root endpoint to verify the API is running."""
    return {"message": "IV1201 API is running", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
