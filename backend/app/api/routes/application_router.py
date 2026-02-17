"""
Application API routes - Presentation Layer.
Handles HTTP requests and responses.
"""
from fastapi import APIRouter, HTTPException, status, Depends

from app.api.schemas.application_schemas import ApplicationCreate, AvailabilityOutput
from app.services.application_service import ApplicationService
from app.security.dependencies import get_current_user

router = APIRouter()
application_service = ApplicationService()


@router.post(
    "/applications",
    response_model=bool,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_user)],
)
async def submit_application(payload: ApplicationCreate):
    """
    Submit a job application.
    
    Requires a valid JWT token.
    """
    try:
        success = await application_service.submit_application(payload)
        return success
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get(
    "/availabilities",
    response_model=list[AvailabilityOutput],
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_user)],
)
async def get_availabilities():
    """
    Get all availabilities for the current user.
    
    Requires a valid JWT token.
    """
    try:
        return await application_service.get_availabilities()
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")