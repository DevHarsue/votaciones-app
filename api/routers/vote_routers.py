from fastapi import APIRouter,status,HTTPException
from fastapi.responses import JSONResponse
from ..models.votes_models import VoteRequest,VoteUpdate,TotalVotesResponse
from ..actions.votes_actions import VoteActions
from ..utils.depends import depend_data
from .token import list_dependencies
vote_router = APIRouter()

@vote_router.get("/get_votes",status_code=status.HTTP_200_OK)
def get_votes() -> TotalVotesResponse:
    actions = VoteActions()
    votes = actions.get_votes()
    
    return JSONResponse(content=votes.model_dump(),status_code=status.HTTP_200_OK)

@vote_router.post("/create_vote",status_code=status.HTTP_201_CREATED)
def create_vote(vote:VoteRequest) -> JSONResponse:
    actions = VoteActions()
    vote_confirm = actions.create_vote(vote)
    if not vote_confirm:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Error in voting registration")

    return JSONResponse(content={"message":"successful voting"},status_code=status.HTTP_201_CREATED)
    

@vote_router.put("/update_vote",status_code=status.HTTP_200_OK)
def update_vote(vote: VoteUpdate) -> JSONResponse:
    actions = VoteActions()
    vote_update = actions.update_vote(vote)
    
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