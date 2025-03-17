from sqlalchemy import select,join
from sqlalchemy.exc import IntegrityError
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
            query = select(Voter).where(Voter.email==vote.voter_email)
            voter_db = session.execute(query).one_or_none()[0]
            
            query = select(Vote).where(Vote.voter_id==voter_db.id)
            vote_exists = session.execute(query).one_or_none()
            if vote_exists:
                return False
            
            query = select(Candidate).where(Candidate.id==vote.candidate_id)
            candidate_exists = session.execute(query).one_or_none()
            if not candidate_exists:
                return False
            
            vote_db = Vote(
                voter_id=voter_db.id,
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
    def update_vote(self,session: Session, vote: VoteRequest) -> bool:
        try:
            query = select(Voter).where(Voter.email==vote.voter_email)
            voter_db = session.execute(query).one_or_none()[0]
            
            query = select(Vote).where(Vote.voter_id==voter_db.id)
            vote_exists = session.execute(query).one_or_none()
            if not vote_exists:
                return False
            
            query = select(Candidate).where(Candidate.id==vote.candidate_id)
            candidate_exists = session.execute(query).one_or_none()
            if not candidate_exists:
                return False
            
            query = select(Voter).where(Voter.email==vote.voter_email)
            voter_db = session.execute(query).one_or_none()[0]
            
            query = select(Vote).where(Vote.voter_id==voter_db.id)
            vote_db = session.execute(query).one_or_none()[0]
            vote_db.candidate_id = vote.candidate_id
            vote_db.voting_date = datetime.utcnow()
            session.commit()
            return True
        except Exception as e:
            print(e)
        
        return False
    
    @session
    def delete_vote(self,session: Session,email: str):
        try:
            query = select(Voter).where(Voter.email==email.upper())
            voter_db = session.execute(query).one_or_none()[0]
            
            query = select(Vote).where(Vote.voter_id==voter_db.id)
            vote_db = session.execute(query).one_or_none()[0]
            session.delete(vote_db)
            session.commit()
            return True
        except Exception as e:
            print(e)
        
        return False
    
    @session
    def get_votes(self,session: Session):
        
        total_votes = len(session.execute(select(Vote.id).select_from(join(Vote,Voter,Vote.voter_id==Voter.id)).group_by(Vote.id)).fetchall())
        
        
        j = join(Vote,Candidate,Vote.candidate_id==Candidate.id)
        j = join(j,Voter,Vote.voter_id==Voter.id)
        
        query = select(Candidate,count(Candidate.id)).select_from(j).group_by(Candidate.id)

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