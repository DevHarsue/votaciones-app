from pydantic import BaseModel,validator
from typing import List
from .canidadate_models import CandidateResponse

class VoteRequest(BaseModel):
    voter_id: int
    candidate_id: int
    
    @validator("voter_id")
    def validate_voter_id(cls,value:int):
        if value <= 0:
            raise ValueError("Invalid voter_id")
        
        return value
    
    @validator("candidate_id")
    def validate_candidate_id(cls,value:int):
        if value <= 0:
            raise ValueError("Invalid candidate_id")
        
        return value
    
class VoteUpdate(BaseModel):
    candidate_id: int
    code: int
    
    @validator("candidate_id")
    def validate_candidate_id(cls,value:int):
        if value <= 0:
            raise ValueError("Invalid candidate_id")
        
        return value

    @validator("code")
    def validate_code(cls,value:int):
        code_str = str(value)
        
        if len(code_str) != 6:
            raise ValueError("Invalid code")
        
        return value
    

class TotalCandidate(BaseModel):
    data_candidate: CandidateResponse
    total_votes: int

class TotalVotesResponse(BaseModel):
    total_votes: int
    candidates: List[TotalCandidate]