"""
Application repository - Database Layer.
Handles all database operations for applications.
"""
from datetime import date

from app.database.connection import database

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
		user_id = int(user_id)
		competence_query = """
			INSERT INTO competence_profile (person_id, competence_id, years_of_experience)
			VALUES (:person_id, :competence_id, :years_of_experience)
		"""
		competence_select = """
			SELECT competence_profile.competence_profile_id AS competence_profile_id
			FROM competence_profile
			WHERE person_id = :person_id
			AND competence_id = :competence_id
		"""
		competence_update = """
			UPDATE competence_profile
			SET years_of_experience = :years_of_experience
			WHERE competence_profile_id = :competence_profile_id
		"""
		availability_query = """
			INSERT INTO availability (person_id, from_date, to_date)
			VALUES (:person_id, :from_date, :to_date)
		"""
		availability_select_overlap = """
			SELECT availability_id, from_date, to_date
			FROM availability
			WHERE person_id = :person_id
			AND from_date <= :to_date
			AND to_date >= :from_date
			AND (status IS NULL OR status <> 'accepted')
			ORDER BY from_date ASC
		"""
		availability_update = """
			UPDATE availability
			SET from_date = :from_date, to_date = :to_date
			WHERE availability_id = :availability_id
		"""
		availability_delete = """
			DELETE FROM availability
			WHERE availability_id = :availability_id
		"""
		async with database.transaction():
			for competence in competence_profiles:
				competence_id = int(competence["competence_id"])
				years_of_experience = float(competence["years_of_experience"])
				existing = await database.fetch_one(
					query=competence_select,
					values={
						"person_id": user_id,
						"competence_id": competence_id,
					},
				)
				if existing:
					competence_profile_id = int(existing["competence_profile_id"])
					await database.execute(
						query=competence_update,
						values={
							"competence_profile_id": competence_profile_id,
							"years_of_experience": years_of_experience,
						},
					)
				else:
					await database.execute(
						query=competence_query,
						values={
							"person_id": user_id,
							"competence_id": competence_id,
							"years_of_experience": years_of_experience,
						},
					)
			for availability in availabilities:
				from_date_value = availability["from_date"]
				to_date_value = availability["to_date"]
				if isinstance(from_date_value, str):
					from_date_value = date.fromisoformat(from_date_value)
				if isinstance(to_date_value, str):
					to_date_value = date.fromisoformat(to_date_value)
				overlaps = await database.fetch_all(
					query=availability_select_overlap,
					values={
						"person_id": user_id,
						"from_date": from_date_value,
						"to_date": to_date_value,
					},
				)
				if overlaps:
					merged_from = min(
						from_date_value,
						min(row["from_date"] for row in overlaps),
					)
					merged_to = max(
						to_date_value,
						max(row["to_date"] for row in overlaps),
					)
					primary_id = overlaps[0]["availability_id"]
					await database.execute(
						query=availability_update,
						values={
							"availability_id": primary_id,
							"from_date": merged_from,
							"to_date": merged_to,
						},
					)
					for row in overlaps[1:]:
						await database.execute(
							query=availability_delete,
							values={"availability_id": row["availability_id"]},
						)
				else:
					await database.execute(
						query=availability_query,
						values={
							"person_id": user_id,
							"from_date": from_date_value,
							"to_date": to_date_value,
						},
					)
		return True
	

	async def get_availabilities(self) -> list[dict]:
		"""
		Fetch all availability entries.
		"""
		query = """
			SELECT
				availability.availability_id,
				availability.person_id AS user_id,
				person.name,
				person.surname,
				availability.from_date,
				availability.to_date,
				availability.status
			FROM availability
			JOIN person ON person.person_id = availability.person_id
			WHERE availability.to_date >= CURRENT_DATE
			ORDER BY availability_id DESC
		"""
		results = await database.fetch_all(query=query)
		return results


	async def update_availability_status(self, availability_id: int, status: str, expected_status: str) -> bool:
		"""
		Update status for a single availability entry.
		"""
		query = """
			UPDATE availability
			SET status = :status
			WHERE availability_id = :availability_id
			AND status = :expected_status
		"""
		row = await database.fetch_one(
			query="SELECT status FROM availability WHERE availability_id = :availability_id",
			values={"availability_id": availability_id},
		)
		if row and row["status"] != expected_status:
			raise ValueError("Status update aborted: application was modified by another user")
		await database.execute(
			query=query,
			values={
				"availability_id": availability_id,
				"status": status,
				"expected_status": expected_status,
			},
		)
		return True