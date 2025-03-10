from sqlalchemy import select
from sqlalchemy.orm.session import Session
from .session import session
from ..models.canidadate_models import CandidateRequest,CandidateResponse,CandidateUpdate
from ..db.models import Candidate

class CandidateActions:
    @session
    def create_candidate(self,session: Session,
                        candidate: CandidateRequest,
                        user_id: int) -> CandidateResponse:
        candidate_db = Candidate(
            name=candidate.name,
            lastname=candidate.lastname,
            starname=candidate.starname,
            gender=candidate.gender,
            image_url="Temporally",
            user_id=user_id
        )
        try:
            session.add(candidate_db)
            query = select(Candidate).where(Candidate.starname==candidate.starname and Candidate.name==candidate.starname)
            candidate_db = session.execute(query).one()[0]
        except Exception as e:
            print(e)
            return False
        
        return CandidateResponse(
            id=candidate_db.id,
            name=candidate_db.name,
            lastname=candidate_db.lastname,
            starname=candidate_db.starname,
            gender=candidate_db.gender,
            image_url=candidate_db.image_url
        )
        
    @session
    def assign_image(self,session: Session, image_url: str, id: int):
        query = select(Candidate).where(Candidate.id==id)
        try:
            candidate_db = session.execute(query).one()[0]
            candidate_db.image_url = image_url
            session.commit()
            return True
        except Exception as e:
            print(e)
            
        return False
    
    @session
    def get_candidate(self,session: Session,id:int) -> CandidateResponse:
        query = select(Candidate).where(Candidate.id==id)
        candidate_db = session.execute(query).one()[0]
        return CandidateResponse(
            id=candidate_db.id,
            name=candidate_db.name,
            lastname=candidate_db.lastname,
            starname=candidate_db.starname,
            gender=candidate_db.gender,
            image_url=candidate_db.image_url
        )
    
    @session
    def update_candidate(self,session: Session,id:int,candidate:CandidateUpdate) -> CandidateResponse:
        query = select(Candidate).where(Candidate.id==id)
        candidate_db = session.execute(query).one()[0]
        if candidate_db:
            candidate_db.name = candidate.name if candidate.name else candidate_db.name
            candidate_db.lastname = candidate.lastname if candidate.lastname else candidate_db.lastname
            candidate_db.starname = candidate.starname if candidate.starname else candidate_db.starname
            candidate_db.gender = candidate.gender if candidate.gender else candidate_db.gender
            session.commit()
            return CandidateResponse(
                id=candidate_db.id,
                name=candidate_db.name,
                lastname=candidate_db.lastname,
                starname=candidate_db.starname,
                gender=candidate_db.gender,
                image_url=candidate_db.image_url
            )
                
        return False
    
    @session
    def delete_candidate(self,session: Session,id: int) -> bool:
        query = select(Candidate).where(Candidate.id==id)
        try:
            candidate_db = session.execute(query).one()[0]
            if candidate_db:
                session.delete(candidate_db)
                session.commit()
                return True
        except Exception as e:
            print(e)
        return False
    
    @session
    def get_candidates(self,session: Session) -> list[CandidateResponse]:
        query = select(Candidate)
        candidates = session.execute(query).all()
        return [CandidateResponse(
                    id=candidate[0].id,
                    name=candidate[0].name,
                    lastname=candidate[0].lastname,
                    starname=candidate[0].starname,
                    gender=candidate[0].gender,
                    image_url=candidate[0].image_url
                ) for candidate in candidates]