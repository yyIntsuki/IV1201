"""
User API routes - Presentation Layer.
Handles HTTP requests and responses.
"""

from fastapi import APIRouter, HTTPException, status, Depends
import logging
from typing import List

from app.api.schemas.user_schemas import (
    UserCreate,
    UserResponse,
    UserUpdate,
    TokenResponse,
    LoginRequest,
    Users,
    ForgetPasswordRequest,
    VerifyTokenRequest,
    VerifyTokenResponse,
)
from app.services.user_service import UserService
from app.security.jwt import create_access_token
from app.security.dependencies import get_current_user, require_recruiter

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
    except Exception:
        logging.exception("Failed to create user")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.get(
    "/users",
    response_model=List[Users],
    dependencies=[Depends(require_recruiter)],
)
async def get_all_users():
    """
    Get all users from the database.

    Demonstrates full stack flow from HTTP GET to database query.
    """
    try:
        users = await user_service.get_all_users()
        return users
    except Exception:
        logging.exception("Failed to get all users")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.get(
    "/users/{user_id}",
    response_model=Users,
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
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user
    except HTTPException:
        raise
    except Exception:
        logging.exception("Failed to get user %s", user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.put(
    "/users/{user_id}",
    response_model=bool,
    dependencies=[Depends(get_current_user)],
)
async def update_user(user_id: int, user_data: UserUpdate):
    """
    Update a user's information.

    Demonstrates update operation flow through all layers.
    """
    try:
        return await user_service.update_user(user_id, user_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception:
        logging.exception("Failed to update user %s", user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


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
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
    except HTTPException:
        raise
    except Exception:
        logging.exception("Failed to delete user %s", user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
)
async def login_user(credentials: LoginRequest):
    """
    User login endpoint.

    Demonstrates authentication flow through all layers.
    """
    try:
        user_detail = await user_service.authenticate_user(
            username=credentials.username, password=credentials.password
        )
        if not user_detail:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
            )
        access_token = create_access_token(
            {"role_id": user_detail["role_id"], "user_id": user_detail["user_id"]}
        )
        return TokenResponse(access_token=access_token, token_type="bearer")
    except HTTPException:
        raise
    except Exception:
        logging.exception("Failed to login user")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )

@router.post(
    "/forget-password",
    status_code=status.HTTP_200_OK,
)
async def magic_login_request(payload: ForgetPasswordRequest):
    """
    Request a magic login link for users without a password.
    """
    email = payload.identifier
    user = await user_service.repository.get_by_email(email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="This email address does not belong to any user")
    try:
        await user_service.send_email_with_link(email)
        return {"message": "Check your email for the login link"}
    except Exception:
        logging.exception("Failed to send magic login link to %s", email)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )

@router.post(
    "/magic-login/verify",
    response_model=VerifyTokenResponse,
    status_code=status.HTTP_200_OK,
)
async def magic_login_verify(payload: VerifyTokenRequest):
    """
    Verify magic login token and log user in.
    """
    try:
        user_info = await user_service.verify_magic_token(payload.token)
        if not user_info:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
        user_id = user_info["user_id"]
        user = await user_service.repository.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        # Issue a proper access token for frontend use
        access_token = create_access_token({"role_id": user["role_id"], "user_id": user_id})
        response = {"access_token": access_token, "token_type": "bearer", "user_id": user_id}
        return VerifyTokenResponse(**response)
    except Exception:
        logging.exception("Failed to verify magic login token")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")