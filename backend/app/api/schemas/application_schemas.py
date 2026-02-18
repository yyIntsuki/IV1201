"""
Schemas for job application submission.
"""
from pydantic import BaseModel, Field
from datetime import date


class CompetenceProfileInput(BaseModel):
	competence_id: int = Field(..., description="Competence ID")
	years_of_experience: float = Field(..., ge=0, description="Years of experience")


class AvailabilityInput(BaseModel):
	from_date: date = Field(..., description="Start date")
	to_date: date = Field(..., description="End date")


class AvailabilityOutput(BaseModel):
	availability_id: int = Field(..., description="Availability ID")
	user_id: int = Field(..., description="User ID")
	name: str = Field(..., description="User first name")
	surname: str = Field(..., description="User last name")
	from_date: date = Field(..., description="Start date")
	to_date: date = Field(..., description="End date")
	status: str = Field(..., description="Application status")


class ApplicationCreate(BaseModel):
	user_id: int = Field(..., description="Applicant user ID")
	competence_profile: list[CompetenceProfileInput]
	availability: list[AvailabilityInput]


class AvailabilityStatusUpdate(BaseModel):
	status: str = Field(..., description="New application status")
