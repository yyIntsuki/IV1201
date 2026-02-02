"""
User repository - Database Layer.
Handles all database operations for users.
"""
from typing import List, Optional
from sqlalchemy import select, update, delete
from app.database.models import User
from app.database.connection import database


class UserRepository:
    """
    Repository for user database operations.
    This implements the data access layer.
    """
    
    async def create(self, email: str, first_name: str, last_name: str, password_hash: str) -> User:
        """
        Insert a new user into the database.
        
        Args:
            email: User's email address
            first_name: User's first name
            last_name: User's last name
            password_hash: Hashed password
            
        Returns:
            Created user object
        """
        query = """
            INSERT INTO users (email, first_name, last_name, password_hash)
            VALUES (:email, :first_name, :last_name, :password_hash)
            RETURNING id, email, first_name, last_name, created_at, updated_at
        """
        values = {
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "password_hash": password_hash
        }
        
        result = await database.fetch_one(query=query, values=values)
        return result
    
    async def get_by_id(self, user_id: int) -> Optional[dict]:
        """
        Retrieve a user by their ID.
        
        Args:
            user_id: The user's ID
            
        Returns:
            User data or None if not found
        """
        query = """
            SELECT id, email, first_name, last_name, created_at, updated_at
            FROM users
            WHERE id = :user_id
        """
        result = await database.fetch_one(query=query, values={"user_id": user_id})
        return result
    
    async def get_by_email(self, email: str) -> Optional[dict]:
        """
        Retrieve a user by their email.
        
        Args:
            email: The user's email address
            
        Returns:
            User data or None if not found
        """
        query = """
            SELECT id, email, first_name, last_name, password_hash, created_at, updated_at
            FROM users
            WHERE email = :email
        """
        result = await database.fetch_one(query=query, values={"email": email})
        return result
    
    async def get_all(self) -> List[dict]:
        """
        Retrieve all users from the database.
        
        Returns:
            List of all users
        """
        query = """
            SELECT id, email, first_name, last_name, created_at, updated_at
            FROM users
            ORDER BY created_at DESC
        """
        results = await database.fetch_all(query=query)
        return results
    
    async def update(self, user_id: int, **kwargs) -> Optional[dict]:
        """
        Update a user's information.
        
        Args:
            user_id: The user's ID
            **kwargs: Fields to update
            
        Returns:
            Updated user data or None if not found
        """
        # Build dynamic update query
        update_fields = []
        values = {"user_id": user_id}
        
        for key, value in kwargs.items():
            if value is not None:
                update_fields.append(f"{key} = :{key}")
                values[key] = value
        
        if not update_fields:
            return await self.get_by_id(user_id)
        
        query = f"""
            UPDATE users
            SET {', '.join(update_fields)}, updated_at = NOW()
            WHERE id = :user_id
            RETURNING id, email, first_name, last_name, created_at, updated_at
        """
        
        result = await database.fetch_one(query=query, values=values)
        return result
    
    async def delete(self, user_id: int) -> bool:
        """
        Delete a user from the database.
        
        Args:
            user_id: The user's ID
            
        Returns:
            True if deleted, False if not found
        """
        query = """
            DELETE FROM users
            WHERE id = :user_id
        """
        result = await database.execute(query=query, values={"user_id": user_id})
        return result > 0
