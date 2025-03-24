from fastapi import APIRouter,status,HTTPException,Path
from fastapi.responses import JSONResponse
from ..models.votes_models import TotalVotesResponse
from ..actions.votes_actions import VoteActions
from .token import list_dependencies,depend_data
vote_router = APIRouter()

@vote_router.get("/get_votes",status_code=status.HTTP_200_OK)
def get_votes() -> TotalVotesResponse:
    actions = VoteActions()
    votes = actions.get_votes()
    
    return JSONResponse(content=votes.model_dump(),status_code=status.HTTP_200_OK)

@vote_router.post("/create_vote/{candidate_id}",status_code=status.HTTP_201_CREATED,dependencies=list_dependencies)
def create_vote(data:depend_data,candidate_id: int=Path(gt=0)) -> JSONResponse:
    actions = VoteActions()
    vote_confirm = actions.create_vote(candidate_id=candidate_id,user_id=int(data["id"]))
    if not vote_confirm:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Error in voting registration")

    return JSONResponse(content={"message":"successful voting"},status_code=status.HTTP_201_CREATED)
    

@vote_router.put("/update_vote/{candidate_id}",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def update_vote(data: depend_data,candidate_id: int=Path(gt=0)) -> JSONResponse:
    actions = VoteActions()
    vote_update = actions.update_vote(candidate_id=candidate_id,user_id=int(data["id"]))
    
    if not vote_update:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Vote not Updated")
    
    return JSONResponse(content={"message":"Vote Updated"})

@vote_router.delete("/delete_vote",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def delete_vote(email: str,data: depend_data) -> JSONResponse:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = VoteActions()
    vote_update = actions.delete_vote(email)
    
    if not vote_update:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Vote not deleted")
    
    return JSONResponse(content={"message":"Vote Deleted"})