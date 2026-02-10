"""
User data schemas for request/response validation.
These schemas define the structure of data in the presentation layer.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserBase(BaseModel):
    """Base user schema with common fields."""
    name: str = Field(..., min_length=1, max_length=255, description="User's name")
    surname: str = Field(..., min_length=1, max_length=255, description="User's surname")
    pnr: str = Field(..., min_length=1, max_length=255, description="User's personal number")
    email: EmailStr = Field(..., description="User's email address")
    role_id: int = Field(..., description="User's role ID")
    username: str = Field(..., min_length=1, max_length=255, description="User's username")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8, max_length=255, description="User's password (minimum 8 characters)")


class UserUpdate(BaseModel):
    """Schema for updating user information."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    surname: Optional[str] = Field(None, min_length=1, max_length=255)
    pnr: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    role_id: Optional[int] = None
    username: Optional[str] = Field(None, min_length=1, max_length=255)
    password: Optional[str] = Field(None, min_length=8, max_length=255)


class UserResponse(UserBase):
    """Schema for user response (excludes password)."""
    id: int
    
    class Config:
        from_attributes = True
