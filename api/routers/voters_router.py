from fastapi import APIRouter,HTTPException,status,Path
from fastapi.responses import JSONResponse
from typing import List
from ..models.voter_models import VoterRequest,VoterResponse,VoterUpdate
from ..actions.voter_actions import VoterActions
from ..actions.code_actions import CodeActions
from .token import list_dependencies
from ..utils.depends import depend_data

voters_router = APIRouter()



@voters_router.get("/get_voters",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def get_voters(data: depend_data) -> List[VoterResponse]:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    actions = VoterActions()
    voters = actions.get_voters()
    return JSONResponse(content=[voter.model_dump() for voter in voters],
                        status_code=status.HTTP_200_OK)

@voters_router.post("/create_voter",status_code=status.HTTP_201_CREATED)
def create_voter(voter: VoterRequest) -> VoterResponse:
    actions = VoterActions()
    code_actions = CodeActions()
        
    voter_exists = actions.get_voter(email=voter.email)
    if voter_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Email already exists")
    
    voter_exists = actions.get_voter_by_ci(nationality=voter.nationality,ci=voter.ci)
    if voter_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="CI already exists")
        
    if not code_actions.validate_code(code=voter.code,email=voter.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Code Incorrect")
    
    code_actions.delete_code(email=voter.email)
    
    voter = actions.create_voter(voter)
    if not voter:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error creating voter")
    
    return JSONResponse(content=voter.model_dump(),
                        status_code=status.HTTP_201_CREATED)


@voters_router.put("/update_voter/{id}",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def update_voter(voter: VoterUpdate,id: int=Path(gt=0)) -> VoterResponse:
    actions = VoterActions()
    code_actions = CodeActions()
    
    if (not voter.ci and voter.nationality) or (voter.ci and not voter.nationality):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Include C.I complete")

    
    if voter.email:
        voter_exists = actions.get_voter(email=voter.email)
        if voter_exists:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Email already exists")
    
    if voter.nationality or voter.ci:
        voter_exists = actions.get_voter_by_ci(nationality=voter.nationality,ci=voter.ci)
        if voter_exists:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="CI already exists")
    
    voter_db = actions.get_voter_by_id(id)
    if not code_actions.validate_code(code=voter.code,email=voter_db.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Code Incorrect")
        
    code_actions.delete_code(email=voter_db.email)
        
        
    voter = actions.update_voter(id,voter)
    if not voter:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error updating voter")
    
    return JSONResponse(content=voter.model_dump(),
                        status_code=status.HTTP_200_OK)

@voters_router.delete("/delete_voter/{id}",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def delete_voter(data: depend_data,id: int = Path(gt=0)) -> JSONResponse:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    actions = VoterActions()
    voter = actions.delete_voter(id)
    if not voter:
        return JSONResponse(content={"message":"Voter not found"},
                            status_code=status.HTTP_404_NOT_FOUND)
    return JSONResponse(content={"message":"Voter deleted"},
                        status_code=status.HTTP_200_OK)
    

@voters_router.get("/get_voters_filter/{text_filter}",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def get_voters_filter(data: depend_data,text_filter: str = Path()) -> List[VoterResponse]:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = VoterActions()
    voters = actions.get_voters_filter(text_filter)
    voters = [] if not voters else voters
    
    return JSONResponse(content=[voter.model_dump() for voter in voters],
                        status_code=status.HTTP_200_OK)
    
@voters_router.get("/get_voter_by_id/{id}",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def get_voter_by_id(data: depend_data,id: int = Path()) -> VoterResponse:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = VoterActions()
    voter = actions.get_voter_by_id(id)
    voter = [] if not voter else voter
    return JSONResponse(content=voter.model_dump(),
                        status_code=status.HTTP_200_OK)
