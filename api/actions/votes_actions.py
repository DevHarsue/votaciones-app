from sqlalchemy import select,join
from sqlalchemy.exc import IntegrityError
from sqlalchemy.sql.functions import count
from sqlalchemy.orm.session import Session
from .session import session
from ..models.votes_models import TotalVotesResponse,TotalCandidate,CandidateResponse
from ..db.models import Vote,Candidate,User
from datetime import datetime,UTC

class VoteActions:
    
    @session
    def create_vote(self,session: Session, candidate_id: int, user_id: int) -> bool:
        try:
            query = select(Vote).where(Vote.user_id==user_id)
            vote_exists = session.execute(query).one_or_none()
            if vote_exists:
                return False
            
            query = select(Candidate).where(Candidate.id==candidate_id)
            candidate_exists = session.execute(query).one_or_none()
            if not candidate_exists:
                return False
            
            vote_db = Vote(
                user_id=user_id,
                candidate_id=candidate_id,
                voting_date=datetime.now(UTC)
            )
            session.add(vote_db)
            session.commit()
            return True
        except Exception as e:
            print(e)
        
        return False
            
    
    @session
    def update_vote(self,session: Session, candidate_id: int,user_id: int) -> bool:
        try:
            query = select(Candidate).where(Candidate.id==candidate_id)
            candidate_exists = session.execute(query).one_or_none()
            if not candidate_exists:
                return False
            
            query = select(Vote).where(Vote.user_id==user_id)
            vote_db = session.execute(query).one_or_none()[0]
            vote_db.candidate_id = candidate_id
            vote_db.voting_date = datetime.now(UTC)
            session.commit()
            return True
        except Exception as e:
            print(e)
        
        return False
    
    @session
    def delete_vote(self,session: Session,email: str):
        try:
            query = select(User).where(User.email==email.upper())
            user_db = session.execute(query).one_or_none()[0]
            
            query = select(Vote).where(Vote.user_id==user_db.id)
            vote_db = session.execute(query).one_or_none()[0]
            session.delete(vote_db)
            session.commit()
            return True
        except Exception as e:
            print(e)
        
        return False
    
    @session
    def get_votes(self,session: Session):
        
        total_votes = len(
                        session.execute(
                                select(Vote.id).
                                select_from(join(Vote,User,Vote.user_id==User.id)).
                                group_by(Vote.id)
                            ).fetchall()
                        )
        
        j = join(Vote,Candidate,Vote.candidate_id==Candidate.id)
        j = join(j,User,Vote.user_id==User.id)
        
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