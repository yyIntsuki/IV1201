"""
Database connection configuration.
Manages the connection to PostgreSQL database.
"""
import databases
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/iv1201_db"
)

# Create database instance for async operations
database = databases.Database(DATABASE_URL)

# Create SQLAlchemy engine
engine = sqlalchemy.create_engine(
    DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://")
)

# Create sessionmaker for sync operations if needed
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()


def get_db():
    """
    Dependency for getting database session.
    Use this in routes that need database access.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
