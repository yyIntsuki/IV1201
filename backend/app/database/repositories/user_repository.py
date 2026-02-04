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
    
    async def create(self, name: str, surname: str, pnr: str, email: str, password: str, role_id: int, username: str) -> User:
        """
        Insert a new user into the database.
        
        Args:
            name: User's first name
            surname: User's last name
            pnr: User's personal number
            email: User's email address
            password: Hashed password
            role_id: User's role ID
            username: User's username
            
        Returns:
            Created user object
        """
        query = """
            INSERT INTO person (name, surname, pnr, email, password, role_id, username)
            VALUES (:name, :surname, :pnr, :email, :password, :role_id, :username)
            RETURNING id, name, surname, pnr, email, role_id, username
        """
        values = {
            "name": name,
            "surname": surname,
            "pnr": pnr,
            "email": email,
            "password": password,
            "role_id": role_id,
            "username": username
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
            SELECT id, name, surname, pnr, email, role_id, username
            FROM person
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
            SELECT id, name, surname, pnr, email, password, role_id, username
            FROM person
            WHERE email = :email
        """
        result = await database.fetch_one(query=query, values={"email": email})
        return result
    
    async def get_by_username(self, username: str) -> Optional[dict]:
        """
        Retrieve a user by their username.
        
        Args:
            username: The user's username
            
        Returns:
            User data or None if not found
        """
        query = """
            SELECT * FROM person
            WHERE username = :username
        """
        result = await database.fetch_one(query=query, values={"username": username})
        return result

    async def get_all(self) -> List[dict]:
        """
        Retrieve all users from the database.
        
        Returns:
            List of all users
        """
        query = """
            SELECT id, name, surname, pnr, email, role_id, username
            FROM person
            ORDER BY id DESC
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
            UPDATE person
            SET {', '.join(update_fields)}, updated_at = NOW()
            WHERE id = :user_id
            RETURNING id, name, surname, pnr, email, role_id, username
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
            DELETE FROM person
            WHERE id = :user_id
        """
        result = await database.execute(query=query, values={"user_id": user_id})
        return result > 0
