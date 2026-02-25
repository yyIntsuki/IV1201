"""
Competence repository - Database Layer.
Handles all database operations for competence data.
"""
from app.database.connection import database


class CompetenceRepository:
    """
    Repository for competence database operations.
    """

    async def get_user_competence(self, user_id: int) -> list[dict]:
        """
        Fetch competence profiles for a specific user.
        """
        query = """
            SELECT c.competence_id, c.name, cp.years_of_experience
            FROM competence_profile cp
            JOIN competence c ON cp.competence_id = c.competence_id
            WHERE cp.person_id = :user_id
            ORDER BY c.competence_id ASC
        """
        return await database.fetch_all(query=query, values={"user_id": user_id})
