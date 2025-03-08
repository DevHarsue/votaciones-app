from fastapi import APIRouter
from .voters_router import voters_router
from .candidate_router import candidate_router

main_router = APIRouter()

main_router.include_router(voters_router,prefix="/voters",tags=["Voters"])
main_router.include_router(candidate_router,prefix="/candidates",tags=["Candidates"])