"""
User service - Business Logic Layer.
Contains business logic and coordinates between presentation and data layers.
"""
from typing import List, Optional
import hashlib
import re
import logging

from app.database.repositories.user_repository import UserRepository
from app.api.schemas.user_schemas import UserCreate, UserResponse, UserUpdate


class UserService:
    """
    User service implementing business logic.
    This is the business logic layer that sits between the API routes and database.
    """
    
    def __init__(self):
        self.repository = UserRepository()
    
    def _hash_password(self, password: str) -> str:
        """
        Hash a password using SHA-256.
        In production, use bcrypt or argon2 instead.
        
        Args:
            password: Plain text password
            
        Returns:
            Hashed password
        """
        return hashlib.sha256(password.encode()).hexdigest()
    
    def _validate_email(self, email: str) -> bool:
        """
        Validate email format (business rule).
        
        Args:
            email: Email address to validate
            
        Returns:
            True if valid, False otherwise
        """
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    def _validate_name(self, name: str) -> bool:
        """
        Validate name (business rule).
        
        Args:
            name: Name to validate
            
        Returns:
            True if valid, False otherwise
        """
        # Name should contain only letters, spaces, hyphens
        return bool(re.match(r'^[a-zA-Z\s\-]+$', name)) and len(name.strip()) > 0
    
    async def create_user(self, user_data: UserCreate) -> UserResponse:
        """
        Create a new user with business logic validation.
        
        This method demonstrates the business logic layer:
        1. Validates business rules
        2. Processes data (password hashing)
        3. Checks for duplicates
        4. Calls repository to persist data
        
        Args:
            user_data: User creation data
            
        Returns:
            Created user
            
        Raises:
            ValueError: If validation fails or user already exists
        """
        # Business logic: Validate email format
        if not self._validate_email(user_data.email):
            raise ValueError("Invalid email format")
        
        # Business logic: Validate names
        if not self._validate_name(user_data.first_name):
            raise ValueError("Invalid first name format")
        
        if not self._validate_name(user_data.last_name):
            raise ValueError("Invalid last name format")
        
        # Business logic: Check if user already exists
        existing_user = await self.repository.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("User with this email already exists")
        
        # Business logic: Hash password
        password_hash = self._hash_password(user_data.password)
        
        # Call database layer to create user
        user = await self.repository.create(
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            password_hash=password_hash
        )
        
        return UserResponse(**dict(user))
    
    async def get_user_by_id(self, user_id: int) -> Optional[UserResponse]:
        """
        Get a user by ID.
        
        Args:
            user_id: User ID
            
        Returns:
            User data or None if not found
        """
        user = await self.repository.get_by_id(user_id)
        if user:
            return UserResponse(**dict(user))
        return None
    
    async def get_all_users(self) -> List[UserResponse]:
        """
        Get all users from the database.
        
        Returns:
            List of all users
        """
        users = await self.repository.get_all()
        return [UserResponse(**dict(user)) for user in users]
    
    async def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[UserResponse]:
        """
        Update a user with business logic validation.
        
        Args:
            user_id: User ID
            user_data: Update data
            
        Returns:
            Updated user or None if not found
            
        Raises:
            ValueError: If validation fails
        """
        # Business logic: Validate fields if provided
        if user_data.email and not self._validate_email(user_data.email):
            raise ValueError("Invalid email format")
        
        if user_data.first_name and not self._validate_name(user_data.first_name):
            raise ValueError("Invalid first name format")
        
        if user_data.last_name and not self._validate_name(user_data.last_name):
            raise ValueError("Invalid last name format")
        
        # Business logic: Check for email conflicts
        if user_data.email:
            existing_user = await self.repository.get_by_email(user_data.email)
            if existing_user and existing_user['id'] != user_id:
                raise ValueError("Email already in use by another user")
        
        # Prepare update data
        update_data = {}
        if user_data.email:
            update_data['email'] = user_data.email
        if user_data.first_name:
            update_data['first_name'] = user_data.first_name
        if user_data.last_name:
            update_data['last_name'] = user_data.last_name
        if user_data.password:
            update_data['password_hash'] = self._hash_password(user_data.password)
        
        # Call database layer to update
        user = await self.repository.update(user_id, **update_data)
        if user:
            return UserResponse(**dict(user))
        return None
    
    async def delete_user(self, user_id: int) -> bool:
        """
        Delete a user.
        
        Args:
            user_id: User ID
            
        Returns:
            True if deleted, False if not found
        """
        # Additional business logic could be added here
        # For example: check if user has related records, soft delete, etc.
        return await self.repository.delete(user_id)

    async def authenticate_user(self, username: str, password: str) -> int:
        """
        Authenticate a user by username and password.
        
        Args:
            username: User's username
            password: Plain text password
        Returns:
            Authenticated user or None if credentials are invalid
        """
        user = await self.repository.get_by_username(username)
        if not user:
            logging.info(f"Authentication failed: User '{username}' not found.")
            return None
        
        hashed_input_password = self._hash_password(password)
        if user['password'] != hashed_input_password:
            logging.info(f"Authentication failed: Incorrect password for user '{username}'.")
            return None
        
        return user['role_id']