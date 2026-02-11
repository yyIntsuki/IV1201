"""
User API routes - Presentation Layer.
Handles HTTP requests and responses.
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from app.api.schemas.user_schemas import UserCreate, UserResponse, UserUpdate, TokenResponse
from app.services.user_service import UserService
from app.security.jwt import create_access_token
from app.security.dependencies import get_current_user

router = APIRouter()
user_service = UserService()


@router.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_user(user_data: UserCreate):
    """
    Create a new user.
    
    This endpoint demonstrates the full stack flow:
    1. HTTP POST request (Presentation Layer)
    2. Business logic validation (Business Logic Layer)
    3. Database insertion (Database Layer)
    """
    try:
        user = await user_service.create_user(user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get(
    "/users",
    response_model=List[UserResponse],
    dependencies=[Depends(get_current_user)],
)
async def get_all_users():
    """
    Get all users from the database.
    
    Demonstrates full stack flow from HTTP GET to database query.
    """
    try:
        users = await user_service.get_all_users()
        return users
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get(
    "/users/{user_id}",
    response_model=UserResponse,
    dependencies=[Depends(get_current_user)],
)
async def get_user(user_id: int):
    """
    Get a specific user by ID.
    
    Demonstrates parameterized request flow through all layers.
    """
    try:
        user = await user_service.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.put(
    "/users/{user_id}",
    response_model=UserResponse,
    dependencies=[Depends(get_current_user)],
)
async def update_user(user_id: int, user_data: UserUpdate):
    """
    Update a user's information.
    
    Demonstrates update operation flow through all layers.
    """
    try:
        user = await user_service.update_user(user_id, user_data)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.delete(
    "/users/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_user)],
)
async def delete_user(user_id: int):
    """
    Delete a user.
    
    Demonstrates delete operation flow through all layers.
    """
    try:
        success = await user_service.delete_user(user_id)
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
)
async def login_user(username: str, password: str):
    """
    User login endpoint.
    
    Demonstrates authentication flow through all layers.
    """
    try:
        user_role_id = await user_service.authenticate_user(username=username, password=password)
        if not user_role_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        access_token = create_access_token({"sub": username, "role_id": user_role_id})
        return TokenResponse(access_token=access_token, token_type="bearer", role_id=user_role_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")