"""
Application service - Business Logic Layer.
Contains business logic and coordinates between presentation and data layers.
"""
from app.api.schemas.application_schemas import ApplicationCreate, AvailabilityOutput
from app.database.repositories.application_repository import ApplicationRepository


class ApplicationService:
	"""
	Service for submitting job applications.
	"""

	def __init__(self):
		self.repository = ApplicationRepository()

	async def submit_application(self, payload: ApplicationCreate) -> bool:
		"""
		Validate and submit a job application.
		"""
		if not payload.competence_profile or not payload.availability:
			raise ValueError("competence_profile and availability must not be empty")

		for availability in payload.availability:
			if availability.from_date > availability.to_date:
				raise ValueError("from_date must be before or equal to to_date")

		success = await self.repository.submit_application(
			user_id=payload.user_id,
			competence_profiles=[
				{
					"competence_id": item.competence_id,
					"years_of_experience": item.years_of_experience,
				}
				for item in payload.competence_profile
			],
			availabilities=[
				{
					"from_date": item.from_date,
					"to_date": item.to_date,
				}
				for item in payload.availability
			],
		)
		if not success:
			raise ValueError("Failed to submit application")
		return True

	async def get_availabilities(self) -> list[AvailabilityOutput]:
		"""
		Return all availability entries.
		"""
		results = await self.repository.get_availabilities()
		return [AvailabilityOutput(**dict(item)) for item in results]

	async def update_availability_status(self, availability_id: int, status: str) -> bool:
		"""
		Update availability status.
		"""
		allowed = {"accepted", "rejected", "unhandled"}
		if status not in allowed:
			raise ValueError("Invalid status")
		return await self.repository.update_availability_status(availability_id, status)
