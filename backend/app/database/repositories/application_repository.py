"""
Application repository - Database Layer.
Handles all database operations for applications.
"""
import logging
from app.database.connection import database
from app.api.schemas.application_schemas import AvailabilityOutput

class ApplicationRepository:
	"""
	Repository for job application database operations.
	"""

	async def submit_application(
		self,
		user_id: int,
		competence_profiles: list[dict],
		availabilities: list[dict],
	) -> bool:
		"""
		Insert competence profile and availability for a user.
		"""
		competence_query = """
			INSERT INTO competence_profile (person_id, competence_id, years_of_experience)
			VALUES (:person_id, :competence_id, :years_of_experience)
		"""
		availability_query = """
			INSERT INTO availability (person_id, from_date, to_date)
			VALUES (:person_id, :from_date, :to_date)
		"""
		async with database.transaction():
			for competence in competence_profiles:
				logging.info(
					f"Inserting competence profile for user_id={user_id}, "
					f"competence_id={competence['competence_id']}, "
					f"years_of_experience={competence['years_of_experience']}"
				)
				await database.execute(
					query=competence_query,
					values={
						"person_id": user_id,
						"competence_id": competence["competence_id"],
						"years_of_experience": competence["years_of_experience"],
					},
				)
			for availability in availabilities:
				logging.info(
					f"Inserting availability for user_id={user_id}, "
					f"from_date={availability['from_date']}, "
					f"to_date={availability['to_date']}"
				)
				await database.execute(
					query=availability_query,
					values={
						"person_id": user_id,
						"from_date": availability["from_date"],
						"to_date": availability["to_date"],
					},
				)
		return True
	

	async def get_availabilities(self) -> list[dict]:
		"""
		Fetch all availability entries.
		"""
		query = """
			SELECT
				availability.person_id AS user_id,
				person.name,
				person.surname,
				availability.from_date,
				availability.to_date
			FROM availability
			JOIN person ON person.person_id = availability.person_id
			WHERE availability.to_date >= CURRENT_DATE
			ORDER BY availability_id DESC
		"""
		results = await database.fetch_all(query=query)
		return results