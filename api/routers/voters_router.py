from fastapi import APIRouter,HTTPException,status,Query
from fastapi.responses import JSONResponse
from typing import List
from ..models.voter_models import VoterRequest,VoterResponse,VoterUpdate
from ..actions.voter_actions import VoterActions
from ..actions.code_voter_actions import CodeVoterActions
from .token import list_dependencies
from ..utils.depends import depend_data
from ..utils.emails import Email
from ..utils.security import generate_code

voters_router = APIRouter()

def send_code(id,receiver):
    code = generate_code()
    code_actions = CodeVoterActions()
    if not code_actions.create_code(voter_id=id,code=code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Code not keeped")
    sender = Email()
    sender.send_email_validate_voter(receiver,code)

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
    voter_exists = actions.get_voter(email=voter.email)
    if voter_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Email already exists")
    
    voter_exists = actions.get_voter_by_ci(nationality=voter.nationality,ci=voter.ci)
    if voter_exists:
        voter_response = actions.update_voter(
            id=voter_exists.id,
            voter=VoterUpdate(
                email=voter.email
            )
        )
        
        if not voter_response:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error creating voter")
        
        send_code(voter_response.id,voter_response.email)
        
        return JSONResponse(content=voter_response.model_dump(),
                        status_code=status.HTTP_201_CREATED)
        
    voter = actions.create_voter(voter)
    if not voter:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error creating voter")
    
    send_code(voter.id,voter.email)
    
    return JSONResponse(content=voter.model_dump(),
                        status_code=status.HTTP_201_CREATED)

@voters_router.get("/validate_voter/{code}",status_code=status.HTTP_200_OK)
def validate_voter(code: int) -> JSONResponse:
    code_actions = CodeVoterActions()
    id = code_actions.validate_code(code)
    if id==0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Invalid Code")
    actions = VoterActions()
    validate = actions.validate_voter(id)
    if not validate:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Voter not validated")
    
    code_actions.delete_code(code=code,voter_id=id)
    
    return JSONResponse(content={"message":"Voter validated"},
                        status_code=status.HTTP_200_OK)

@voters_router.put("/update_voter",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def update_voter(voter: VoterUpdate,id: int=Query(gt=0)) -> VoterResponse:
    actions = VoterActions()
    voter = actions.update_voter(id,voter)
    if not voter:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error updating voter")
    
    send_code(voter.id,voter.email)
    
    return JSONResponse(content=voter.model_dump(),
                        status_code=status.HTTP_200_OK)

@voters_router.delete("/delete_voter",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def delete_voter(data: depend_data,id: int = Query(gt=0)) -> JSONResponse:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    actions = VoterActions()
    voter = actions.delete_voter(id)
    if not voter:
        return JSONResponse(content={"message":"Voter not found"},
                            status_code=status.HTTP_404_NOT_FOUND)
    return JSONResponse(content={"message":"Voter deleted"},
                        status_code=status.HTTP_200_OK)
    
