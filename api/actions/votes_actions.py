from sqlalchemy import select,join
from sqlalchemy.sql.functions import count
from sqlalchemy.orm.session import Session
from .session import session
from ..models.votes_models import VoteRequest,TotalVotesResponse,TotalCandidate,CandidateResponse
from ..db.models import Vote,Candidate,Voter
from datetime import datetime

class VoteActions:
    @session
    def create_vote(self,session: Session, vote: VoteRequest) -> bool:
        try:
            vote_db = Vote(
                voter_id=vote.voter_id,
                candidate_id=vote.candidate_id,
                voting_date=datetime.utcnow()
            )
            
            session.add(vote_db)
            session.commit()
            return True
        except Exception as e:
            print(e)
        
        return False
    
    @session
    def update_vote(self,session: Session, voter_id:int, candidate_id: int) -> bool:
        try:
            query = select(Vote).where(Vote.voter_id==voter_id)
            vote_db = session.execute(query).one_or_none()[0]
            vote_db.candidate_id = candidate_id
            vote_db.voting_date = datetime.utcnow()
            session.commit()
            return True
        except Exception as e:
            print(e)
        
        return False
    
    @session
    def delete_vote(self,session: Session,voter_id):
        try:
            query = select(Vote).where(Vote.voter_id==voter_id)
            vote_db = session.execute(query).one_or_none()[0]
            session.delete(vote_db)
            session.commit()
            return True
        except Exception as e:
            print(e)
        
        return False
    
    @session
    def get_votes(self,session: Session):
        
        total_votes = len(session.execute(select(Vote.id).select_from(join(Vote,Voter,Vote.voter_id==Voter.id)).where(Voter.validated==True).group_by(Vote.id)).fetchall())
        
        
        j = join(Vote,Candidate,Vote.candidate_id==Candidate.id)
        j = join(j,Voter,Vote.voter_id==Voter.id)
        
        query = select(Candidate,count(Candidate.id)).select_from(j).where(Voter.validated==True).group_by(Candidate.id)

        result = session.execute(query).fetchall()
        
        votes = TotalVotesResponse(
            total_votes=total_votes,
            candidates=[TotalCandidate(
                    total_votes= data[1],
                    data_candidate = CandidateResponse(
                        id=data[0].id,
                        name=data[0].name,
                        lastname=data[0].lastname,
                        starname=data[0].starname,
                        gender=data[0].gender,
                        image_url=data[0].image_url
                    )
                ) for data in result]
        )
        
        
        
        return votes 