from sqlalchemy import select
from sqlalchemy.sql.operators import ilike_op
from sqlalchemy.orm.session import Session
from .session import session
from ..models.voter_models import VoterRequest,VoterResponse,VoterUpdate
from ..db.models import Voter,Vote

class VoterActions:
    @session
    def create_voter(self,session: Session,voter: VoterRequest) -> VoterResponse:
        voter_db = Voter(
            nationality=voter.nationality,
            ci=voter.ci,
            name=voter.name,
            lastname=voter.lastname,
            gender=voter.gender,
            email=voter.email
        )
        try:
            session.add(voter_db)
            query = select(Voter).where(Voter.ci==voter.ci)
            voter_db = session.execute(query).one()[0]
        except Exception as e:
            print(e)
            return 0
        
        return VoterResponse(
            id=voter_db.id,
            nationality=voter_db.nationality,
            ci=voter_db.ci,
            name=voter_db.name,
            lastname=voter_db.lastname,
            gender=voter_db.gender,
            email=voter_db.email
        )
    
    
    @session
    def get_voter(self,session: Session,email: str) -> VoterResponse:
        try:
            query = select(Voter).where(Voter.email==email)
            voter = session.execute(query).one()[0]
        except Exception as e:
            print(e)
            return False

        return VoterResponse(
                id=voter.id,
                nationality=voter.nationality,
                ci=voter.ci,
                name=voter.name,
                lastname=voter.lastname,
                gender=voter.gender,
                email=voter.email
            )
    
    @session
    def get_voter_by_ci(self,session: Session,ci: int) -> VoterResponse:
        try:
            query = select(Voter).where(Voter.ci==ci)
            voter = session.execute(query).one()[0]
        except Exception as e:
            print(e)
            return False
        
        return VoterResponse(
                id=voter.id,
                nationality=voter.nationality,
                ci=voter.ci,
                name=voter.name,
                lastname=voter.lastname,
                gender=voter.gender,
                email=voter.email
            )
    
    @session
    def get_voter_by_id(self,session: Session,id: int) -> VoterResponse:
        try:
            query = select(Voter).where(Voter.id==id)
            voter = session.execute(query).one()[0]
        except Exception as e:
            print(e)
            return False
        
        return VoterResponse(
                id=voter.id,
                nationality=voter.nationality,
                ci=voter.ci,
                name=voter.name,
                lastname=voter.lastname,
                gender=voter.gender,
                email=voter.email
            )
    
    @session
    def verify_voter(self,session: Session
        ,nationality:str,ci:int,email:str) -> bool:
        query = select(Voter).where(Voter.ci==ci,Voter.nationality==nationality,Voter.email==email)
        voter = session.execute(query).one_or_none()
        if voter:
            return True
        return False
    
    @session
    def update_voter(self,session: Session,id:int,voter:VoterUpdate) -> VoterResponse:
        query = select(Voter).where(Voter.id==id)
        voter_db = session.execute(query).one()[0]
        if voter_db:
            voter_db.nationality = voter.nationality if voter.nationality else voter_db.nationality
            voter_db.ci = voter.ci if voter.ci else voter_db.ci
            voter_db.name = voter.name if voter.name else voter_db.name
            voter_db.lastname = voter.lastname if voter.lastname else voter_db.lastname
            voter_db.gender = voter.gender if voter.gender else voter_db.gender
            voter_db.email = voter.email if voter.email else voter_db.email
            session.commit()
            return VoterResponse(
                id=voter_db.id,
                nationality=voter_db.nationality,
                ci=voter_db.ci,
                name=voter_db.name,
                lastname=voter_db.lastname,
                gender=voter_db.gender,
                email=voter_db.email
            )
                
        return False
    
    @session
    def delete_voter(self,session: Session,id: int) -> bool:
        try:
            query = select(Vote).where(Vote.voter_id==id)
            vote = session.execute(query).one_or_none()
            if vote:
                session.delete(vote[0])
            
            query = select(Voter).where(Voter.id==id)
            voter = session.execute(query).one()[0]
            if voter:
                session.delete(voter)
                session.commit()
        except Exception as e:
            print(e)
            return False
        
        return True
    
    @session
    def get_voters(self,session: Session) -> list[VoterResponse]:
        query = select(Voter)
        voters = session.execute(query).all()
        return [VoterResponse(
                id=voter[0].id,
                nationality=voter[0].nationality,
                ci=voter[0].ci,
                name=voter[0].name,
                lastname=voter[0].lastname,
                gender=voter[0].gender,
                email=voter[0].email
            ) for voter in voters]
        
    @session
    def get_voters_filter(self,session: Session,text_filter:str) -> list[VoterResponse]:
        try:
            query = select(Voter).where(
                (ilike_op(Voter.name,f"%{text_filter}%")) |
                (ilike_op(Voter.lastname,f"%{text_filter}%"))    
            )
            voters = session.execute(query).fetchall()
            return [VoterResponse(
                id=v[0].id,
                nationality=v[0].nationality,
                ci=v[0].ci,
                name=v[0].name,
                lastname=v[0].lastname,
                gender=v[0].gender,
                email=v[0].email
            ) for v in voters]
        except Exception as e:
            print(e)
            return False