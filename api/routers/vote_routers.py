from fastapi import APIRouter,status,HTTPException
from fastapi.responses import JSONResponse
from ..models.votes_models import VoteRequest,VoteUpdate,TotalVotesResponse
from ..actions.votes_actions import VoteActions
from ..actions.voter_actions import VoterActions
from ..actions.code_voter_actions import CodeVoterActions
from ..utils.emails import Email
from ..utils.security import generate_code

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

@vote_router.post("/send_code/{email}",status_code=status.HTTP_201_CREATED)
def send_code(email: str) -> JSONResponse:
    email = email.upper()
    voter_actions = VoterActions()
    voter = voter_actions.get_voter(email=email)
    if not voter:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Voter not Found")
    code = generate_code()
    actions = CodeVoterActions()
    try:
        actions.create_code(voter_id=voter.id,code=code)
        sender = Email()
        sender.send_email_validate_voter(email,code)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Email not send")
    
    return JSONResponse(content={"message":"Code send"},status_code=status.HTTP_201_CREATED)
    

@vote_router.put("/update_vote",status_code=status.HTTP_200_OK)
def update_vote(vote: VoteUpdate) -> JSONResponse:
    code_voter_actions = CodeVoterActions()
    voter_id = code_voter_actions.validate_code(vote.code)
    
    if not voter_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Invalid Code")
    
    actions = VoteActions()
    if not actions.update_vote(voter_id=voter_id,candidate_id=vote.candidate_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Vote not Updated")
    
    return JSONResponse(content={"message":"Vote Updated"})
