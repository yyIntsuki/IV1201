"""
Schemas for competence data.
"""
from pydantic import BaseModel, Field


class CompetenceProfileOutput(BaseModel):
    competence: str = Field(..., description="Competence name")
    years_of_experience: float = Field(..., ge=0, description="Years of experience")
