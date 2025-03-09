from sqlalchemy import select
from sqlalchemy.orm.session import Session
from .session import session
from ..models.voter_models import VoterRequest,VoterResponse,VoterUpdate
from ..db.models import Voter

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
            email=voter_db.email,
            validated=voter_db.validated
        )
    
    @session
    def validate_voter(self,session: Session,id: int) -> bool:
        query = select(Voter).where(Voter.id==int(id))
        voter = session.execute(query).one()[0]
        try:
            voter.validated = True
            session.commit()
        except Exception as e:
            print(e)
            return False
        return True
    
    @session
    def get_voter(self,session: Session,email: str) -> VoterResponse:
        query = select(Voter).where(Voter.email==email)
        try:
            voter = session.execute(query).one()[0]
            return VoterResponse(
                id=voter.id,
                nationality=voter.nationality,
                ci=voter.ci,
                name=voter.name,
                lastname=voter.lastname,
                gender=voter.gender,
                email=voter.email,
                validated=voter.validated
            )
        except Exception as e:
            print(e)
            return False
    
    @session
    def get_voter_by_ci(self,session: Session,nationality: str, ci: int) -> VoterResponse:
        query = select(Voter).where(Voter.nationality==nationality,Voter.ci==ci)
        try:
            voter = session.execute(query).one()[0]
            return VoterResponse(
                id=voter.id,
                nationality=voter.nationality,
                ci=voter.ci,
                name=voter.name,
                lastname=voter.lastname,
                gender=voter.gender,
                email=voter.email,
                validated=voter.validated
            )
        except Exception as e:
            print(e)
            return False
    
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
            voter_db.validated = False
            session.commit()
            return VoterResponse(
                id=voter_db.id,
                nationality=voter_db.nationality,
                ci=voter_db.ci,
                name=voter_db.name,
                lastname=voter_db.lastname,
                gender=voter_db.gender,
                email=voter_db.email,
                validated=voter_db.validated
            )
                
        return False
    
    @session
    def delete_voter(self,session: Session,id: int) -> bool:
        query = select(Voter).where(Voter.id==id)
        try:
            voter = session.execute(query).one()[0]
            if voter:
                session.delete(voter)
                session.commit()
                return True
        except Exception as e:
            print(e)
        return False
    
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
                email=voter[0].email,
                validated=voter[0].validated
            ) for voter in voters]