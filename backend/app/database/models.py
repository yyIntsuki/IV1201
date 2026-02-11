"""
Database models - Data Layer.
Defines the structure of database tables.
"""
from sqlalchemy import Column, Integer, String, Date, Numeric
from app.database.connection import Base


class Person(Base):
    """
    Person model representing the person table in the database.
    """
    __tablename__ = "person"
    
    person_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    surname = Column(String(255), nullable=False)
    pnr = Column(String(255), nullable=False, unique=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    role_id = Column(Integer, nullable=False)
    username = Column(String(255), nullable=False, unique=True, index=True)


class Availability(Base):
    """
    Availability model representing the availability table in the database.
    """
    __tablename__ = "availability"
    
    availability_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    person_id = Column(Integer, nullable=False)
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=False)


class Competence(Base):
    """
    Competence model representing the competence table in the database.
    """
    __tablename__ = "competence"
    
    competence_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)


class CompetenceProfile(Base):
    """
    CompetenceProfile model representing the competence_profile table in the database.
    """
    __tablename__ = "competence_profile"
    
    competence_profile = Column(Integer, primary_key=True, index=True, autoincrement=True)
    person_id = Column(Integer, nullable=False)
    competence_id = Column(Integer, nullable=False)
    years_of_experience = Column(Numeric(4, 2), nullable=False)


class Role(Base):
    """
    Role model representing the role table in the database.
    """
    __tablename__ = "role"
    
    role_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
