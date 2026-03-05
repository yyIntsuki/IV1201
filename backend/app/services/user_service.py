"""
User service - Business Logic Layer.
Contains business logic and coordinates between presentation and data layers.
"""
from typing import List, Optional, Dict
from datetime import date, datetime, timedelta, timezone
import hashlib
import re
import logging
import jose
import os

from app.database.repositories.user_repository import UserRepository
from app.api.schemas.user_schemas import UserCreate, UserResponse, UserUpdate, Users
from app.utils.mail import send_magic_link_email
from app.security.jwt import JWT_SECRET_KEY, ALGORITHM, decode_access_token

FRONTEND_URL = os.getenv("FRONTEND_URL")  # This should come from environment variables in production

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
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
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
        return bool(re.match(r"^[a-zA-Z\s\-]+$", name)) and len(name.strip()) > 0

    def _validate_username(self, username: str) -> bool:
        """
        Validate username format (business rule).

        Args:
            username: Username to validate

        Returns:
            True if valid, False otherwise
        """
        return bool(re.match(r"^[a-zA-Z0-9_\-]+$", username)) and len(username.strip()) >= 4

    def _validate_pnr(self, pnr: str) -> bool:
        """
        Validate Swedish personal number format YYYYMMDD-XXXX (business rule).

        Args:
            pnr: Personal number to validate

        Returns:
            True if valid, False otherwise
        """
        pattern = re.compile(r"^(\d{4})(\d{2})(\d{2})-(\d{4})$")
        match = pattern.match(pnr)
        if not match:
            return False

        year, month, day = int(match.group(1)), int(match.group(2)), int(match.group(3))

        current_year = date.today().year
        if year < 1900 or year > current_year:
            return False

        try:
            date(year, month, day)
        except ValueError:
            return False

        return True

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
        # Validate email format
        if not self._validate_email(user_data.email):
            raise ValueError("Invalid email format")

        # Validate names
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

        # Check if user already exists
        existing_user = await self.repository.get_by_email(user_data.email)
        if existing_user:
            raise ValueError("User with this email already exists")

        existing_username = await self.repository.get_by_username(user_data.username)
        if existing_username:
            raise ValueError("User with this username already exists")

        existing_pnr = await self.repository.get_by_pnr(user_data.pnr)
        if existing_pnr:
            raise ValueError("User with this personal number already exists")

        # Hash password
        password_hash = self._hash_password(user_data.password)

        # Create user
        user = await self.repository.create(
            name=user_data.name,
            surname=user_data.surname,
            pnr=user_data.pnr,
            email=user_data.email,
            password=password_hash,
            role_id=user_data.role_id,
            username=user_data.username,
        )

        return UserResponse(**dict(user))

    async def get_user_by_id(self, user_id: int) -> Optional[Users]:
        """
        Get a user by ID.

        Args:
            user_id: User ID

        Returns:
            User data or None if not found
        """
        user = await self.repository.get_by_id(user_id)
        if user:
            user_data = dict(user)
            return {
                "firstName": user_data.get("name") or "",
                "lastName": user_data.get("surname") or "",
                "personNumber": user_data.get("pnr") or "",
                "email": user_data.get("email") or "",
                "username": user_data.get("username") or "",
                "password": "",
            }
        return None

    async def get_all_users(self) -> List[Users]:
        """
        Get all users from the database.

        Returns:
            List of all users
        """
        users = await self.repository.get_all()
        response = []
        for user in users:
            user_data = dict(user)
            response.append(
                Users(
                    name=user_data.get("name") or "",
                    surname=user_data.get("surname") or "",
                    pnr=user_data.get("pnr") or None,
                    email=user_data.get("email") or None,
                )
            )
        return response

    async def update_user(self, user_id: int, user_data: UserUpdate) -> bool:
        """
        Update a user with business logic validation.

        Args:
            user_id: User ID
            user_data: Update data

        Returns:
            True if updated, False if not found

        Raises:
            ValueError: If validation fails
        """
        # Validate fields if provided
        existing_user = await self.repository.get_by_id(user_id)
        if not existing_user:
            raise ValueError("User not found")
        
        if user_data.email and not self._validate_email(user_data.email):
            raise ValueError("Invalid email format")

        if user_data.name and not self._validate_name(user_data.name):
            raise ValueError("Invalid name format")

        if user_data.surname and not self._validate_name(user_data.surname):
            raise ValueError("Invalid surname format")

        if user_data.pnr and not self._validate_pnr(user_data.pnr):
            raise ValueError("Invalid personal number format")

        if user_data.username and not self._validate_username(user_data.username):
            raise ValueError("Username must be at least 4 characters")

        if user_data.password and not self._validate_password(user_data.password):
            raise ValueError("Password must be at least 8 characters")

        # Check for email conflicts
        if user_data.email:
            existing_user = await self.repository.get_by_email(user_data.email)
            if existing_user and int(existing_user["id"]) != int(user_id):
                raise ValueError("Email already in use by another user")

        if user_data.username:
            existing_username = await self.repository.get_by_username(user_data.username)
            if existing_username and int(existing_username["id"]) != int(user_id):
                raise ValueError("Username already in use by another user")

        if user_data.pnr:
            existing_pnr = await self.repository.get_by_pnr(user_data.pnr)
            if existing_pnr and int(existing_pnr["id"]) != int(user_id):
                raise ValueError("Personal number already in use by another user")

        # Prepare update data
        update_data = {}
        if user_data.name:
            update_data["name"] = user_data.name
        if user_data.surname:
            update_data["surname"] = user_data.surname
        if user_data.pnr:
            update_data["pnr"] = user_data.pnr
        if user_data.email:
            update_data["email"] = user_data.email
        if user_data.role_id is not None:
            update_data["role_id"] = user_data.role_id
        if user_data.username:
            update_data["username"] = user_data.username
        if user_data.password:
            update_data["password"] = self._hash_password(user_data.password)

        # Update
        response = await self.repository.update(user_id, **update_data)

        return response

    async def delete_user(self, user_id: int) -> bool:
        """
        Delete a user.

        Args:
            user_id: User ID

        Returns:
            True if deleted, False if not found
        """
        return await self.repository.delete(user_id)

    async def authenticate_user(self, username: str, password: str) -> Dict[str, int]:
        """
        Authenticate a user by username and password.

        Args:
            username: User's username or email
            password: Plain text password
        Returns:
            Role ID if authenticated, or None if credentials are invalid
        """
        user = await self.repository.get_by_username(username)
        if not user:
            user = await self.repository.get_by_email(username)
            if not user:
                logging.info(f"Authentication failed: User '{username}' not found.")
                return None

        hashed_input_password = self._hash_password(password)
        if user["password"] != hashed_input_password:
            logging.info(f"Authentication failed: Incorrect password for user '{username}'.")
            return None

        response = {
            "user_id": user["id"],
            "role_id": user["role_id"],
        }
        return response

    async def send_email_with_link(self, email: str) -> bool:
        """
        Send an email with a magic login link.

        Args:
            email: User's email address

        Returns:
            True if email sent, False if user not found
        """
        user = await self.repository.get_by_email(email)
        if not user:
            logging.info(f"Magic link request failed: Email '{email}' not found.")
            return False
        user_id = user["id"]
        role_id = user["role_id"]

        token_data = {
            "user_id": user_id,
            "role_id": role_id,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        }
        token = jose.jwt.encode(token_data, JWT_SECRET_KEY, algorithm=ALGORITHM)
        
        magic_link = f"{FRONTEND_URL}/complete-account?token={token}"
        send_magic_link_email(to_email=email, magic_link=magic_link)
        return True
    
    async def verify_magic_token(self, token: str) -> Optional[Dict[str, int]]:
        """
        Verify a magic login token and return user info if valid.

        Args:
            token: JWT token from magic link
        Returns:
            User info if token is valid, None otherwise
        """
        try:
            payload = decode_access_token(token)
            user_id = payload["user_id"]
            role_id = payload["role_id"]
            return {"user_id": user_id, "role_id": role_id}
        except Exception:
            return None