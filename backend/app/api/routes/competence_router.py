"""
Competence API routes - Presentation Layer.
Handles HTTP requests and responses.
"""
import logging
from fastapi import APIRouter, HTTPException, status, Depends

from app.api.schemas.competence_schemas import CompetenceProfileOutput
from app.services.competence_service import CompetenceService
from app.security.dependencies import require_recruiter

router = APIRouter()
competence_service = CompetenceService()


@router.get(
    "/users/{user_id}/competence",
    response_model=list[CompetenceProfileOutput],
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_recruiter)],
)
async def get_user_competence(user_id: int):
    """
    Get competence profiles for a specific user.

    Requires recruiter role.
    """
    try:
        return await competence_service.get_user_competence(user_id)
    except ValueError as e:
        logging.exception("Failed to get competence for user_id=%s", user_id)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception:
        logging.exception("Failed to get competence for user_id=%s", user_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )
