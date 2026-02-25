"""
Application service - Business Logic Layer.
Contains business logic and coordinates between presentation and data layers.
"""
from datetime import date
from app.api.schemas.application_schemas import ApplicationCreate, AvailabilityOutput
from app.database.repositories.application_repository import ApplicationRepository


class ApplicationService:
	"""
	Service for submitting job applications.
	"""

	def __init__(self):
		self.repository = ApplicationRepository()
		self._allowed_statuses = {"accepted", "rejected", "unhandled"}

	def _validate_user_id(self, user_id: int) -> bool:
		"""
		Validate user_id (business rule).
		"""
		return user_id > 0

	def _validate_availability_range(self, from_date, to_date) -> bool:
		"""
		Validate availability date range (business rule).
		"""
		return from_date <= to_date
	
	def _validate_availability_start_date(self, from_date) -> bool:
		"""
		Validate availability start date (business rule).
		"""
		return from_date >= date.today()

	def _validate_status(self, status: str) -> bool:
		"""
		Validate availability status (business rule).
		"""
		return status in self._allowed_statuses

	async def submit_application(self, payload: ApplicationCreate) -> bool:
		"""
		Validate and submit a job application.
		"""
		if not self._validate_user_id(payload.user_id):
			raise ValueError("user_id must be positive")
		if not payload.competence_profile or not payload.availability:
			raise ValueError("competence_profile and availability must not be empty")

		for availability in payload.availability:
			if not self._validate_availability_range(availability.from_date, availability.to_date):
				raise ValueError("from_date must be before or equal to to_date")
			if not self._validate_availability_start_date(availability.from_date):
				raise ValueError("from_date cannot be in the past")

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

	async def update_availability_status(self, availability_id: int, status: str, expected_status: str) -> bool:
		"""
		Update availability status.
		"""
		if availability_id <= 0:
			raise ValueError("availability_id must be positive")
		if not self._validate_status(status):
			raise ValueError("Invalid status")
		if not self._validate_status(expected_status):
			raise ValueError("Corrupted status, please refresh and try again")
		return await self.repository.update_availability_status(availability_id, status, expected_status)
