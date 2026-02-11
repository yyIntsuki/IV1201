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

    def _validate_username(self, username: str) -> bool:
        """
        Validate username format (business rule).
        
        Args:
            username: Username to validate
            
        Returns:
            True if valid, False otherwise
        """
        return bool(re.match(r'^[a-zA-Z0-9_\-]+$', username)) and len(username.strip()) > 0

    def _validate_pnr(self, pnr: str) -> bool:
        """
        Validate personal number format (business rule).
        
        Args:
            pnr: Personal number to validate
            
        Returns:
            True if valid, False otherwise
        """
        return bool(re.match(r'^[a-zA-Z0-9\-]+$', pnr)) and len(pnr.strip()) > 0

    def _validate_password(self, password: str) -> bool:
        """
        Validate password format (business rule).
        
        Args:
            password: Plain text password
            
        Returns:
            True if valid, False otherwise
        """
        return len(password.strip()) >= 8
    
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
        if not self._validate_name(user_data.name):
            raise ValueError("Invalid name format")
        
        if not self._validate_name(user_data.surname):
            raise ValueError("Invalid surname format")

        if not self._validate_pnr(user_data.pnr):
            raise ValueError("Invalid personal number format")

        if not self._validate_username(user_data.username):
            raise ValueError("Invalid username format")

        if not self._validate_password(user_data.password):
            raise ValueError("Password must be at least 8 characters")
        
        # Business logic: Check if user already exists
        existing_user = await self.repository.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("User with this email already exists")

        existing_username = await self.repository.get_by_username(user_data.username)
        if existing_username:
            raise ValueError("User with this username already exists")

        existing_pnr = await self.repository.get_by_pnr(user_data.pnr)
        if existing_pnr:
            raise ValueError("User with this personal number already exists")
        
        # Business logic: Hash password
        password_hash = self._hash_password(user_data.password)
        
        # Call database layer to create user
        user = await self.repository.create(
            name=user_data.name,
            surname=user_data.surname,
            pnr=user_data.pnr,
            email=user_data.email,
            password=password_hash,
            role_id=user_data.role_id,
            username=user_data.username
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
        
        if user_data.name and not self._validate_name(user_data.name):
            raise ValueError("Invalid name format")
        
        if user_data.surname and not self._validate_name(user_data.surname):
            raise ValueError("Invalid surname format")

        if user_data.pnr and not self._validate_pnr(user_data.pnr):
            raise ValueError("Invalid personal number format")

        if user_data.username and not self._validate_username(user_data.username):
            raise ValueError("Invalid username format")

        if user_data.password and not self._validate_password(user_data.password):
            raise ValueError("Password must be at least 8 characters")
        
        # Business logic: Check for email conflicts
        if user_data.email:
            existing_user = await self.repository.get_by_email(user_data.email)
            if existing_user and existing_user['id'] != user_id:
                raise ValueError("Email already in use by another user")

        if user_data.username:
            existing_username = await self.repository.get_by_username(user_data.username)
            if existing_username and existing_username['id'] != user_id:
                raise ValueError("Username already in use by another user")

        if user_data.pnr:
            existing_pnr = await self.repository.get_by_pnr(user_data.pnr)
            if existing_pnr and existing_pnr['id'] != user_id:
                raise ValueError("Personal number already in use by another user")
        
        # Prepare update data
        update_data = {}
        if user_data.name:
            update_data['name'] = user_data.name
        if user_data.surname:
            update_data['surname'] = user_data.surname
        if user_data.pnr:
            update_data['pnr'] = user_data.pnr
        if user_data.email:
            update_data['email'] = user_data.email
        if user_data.role_id is not None:
            update_data['role_id'] = user_data.role_id
        if user_data.username:
            update_data['username'] = user_data.username
        if user_data.password:
            update_data['password'] = self._hash_password(user_data.password)
        
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

    async def authenticate_user(self, username: str, password: str) -> Optional[int]:
        """
        Authenticate a user by username and password.
        
        Args:
            username: User's username
            password: Plain text password
        Returns:
            Role ID if authenticated, or None if credentials are invalid
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