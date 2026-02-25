"""
Competence service - Business Logic Layer.
Contains business logic and coordinates between presentation and data layers.
"""
import logging

from app.api.schemas.competence_schemas import CompetenceProfileOutput
from app.database.repositories.competence_repository import CompetenceRepository


class CompetenceService:
    """
    Service for competence queries.
    """

    def __init__(self):
        self.repository = CompetenceRepository()

    def _validate_user_id(self, user_id: int) -> bool:
        """
        Validate user_id (business rule).
        """
        return user_id > 0

    async def get_user_competence(self, user_id: int) -> list[CompetenceProfileOutput]:
        """
        Return competence profiles for a specific user.
        """
        if not self._validate_user_id(user_id):
            raise ValueError("user_id must be positive")
        competences = await self.repository.get_user_competence(user_id)
        response = []
        for competence in competences:
            competence_data = dict(competence)
            response.append(CompetenceProfileOutput(
                competence=competence_data.get("name"),
                years_of_experience=competence_data.get("years_of_experience"),
            ))
        return response
