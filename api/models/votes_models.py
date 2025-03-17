from pydantic import BaseModel,validator
from typing import List
from .canidadate_models import CandidateResponse
from re import fullmatch,findall

class VoteRequest(BaseModel):
    voter_email: str
    candidate_id: int
    
    @validator("voter_email")
    def validate_email(cls,value:str):
        regex = r"^[^@]+@[^@]+\.[^@]+$"
        value = value.upper()
        if (not fullmatch(regex,value) or len(findall(r"\+\d\@",value)) > 0):
            raise ValueError("Invalid Email")
        
        return value
    
    @validator("candidate_id")
    def validate_candidate_id(cls,value:int):
        if value <= 0:
            raise ValueError("Invalid candidate_id")
        
        return value
    
class VoteUpdate(VoteRequest):
    pass
    

class TotalCandidate(BaseModel):
    data_candidate: CandidateResponse
    total_votes: int

class TotalVotesResponse(BaseModel):
    total_votes: int
    candidates: List[TotalCandidate]