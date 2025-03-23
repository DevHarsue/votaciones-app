from pydantic import BaseModel
from typing import List
from .canidadate_models import CandidateResponse

class TotalCandidate(BaseModel):
    data_candidate: CandidateResponse
    total_votes: int

class TotalVotesResponse(BaseModel):
    total_votes: int
    candidates: List[TotalCandidate]