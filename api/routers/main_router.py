from fastapi import APIRouter
from .candidate_router import candidate_router
from .vote_routers import vote_router
from .code_router import code_router

main_router = APIRouter()

main_router.include_router(candidate_router,prefix="/candidates",tags=["Candidates"])
main_router.include_router(vote_router,prefix="/vote",tags=["Votes"])
main_router.include_router(code_router,prefix="/code",tags=["Codes"])