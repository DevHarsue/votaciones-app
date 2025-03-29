from sqlalchemy import select
from sqlalchemy.sql.operators import ilike_op
from typing import List
from sqlalchemy.orm.session import Session
from .session import session
from ..models.canidadate_models import CandidateRequest,CandidateResponse,CandidateUpdate
from ..db.models import Candidate,Vote

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
            query = select(Candidate).where(Candidate.starname==candidate.starname,Candidate.name==candidate.name)
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
        try:
            candidate_db = session.execute(query).one_or_none()[0]
            return CandidateResponse(
                id=candidate_db.id,
                name=candidate_db.name,
                lastname=candidate_db.lastname,
                starname=candidate_db.starname,
                gender=candidate_db.gender,
                image_url=candidate_db.image_url
            )
        except Exception as e:
            print(e)
            
        return False
    
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
        try:
            query = select(Vote).where(Vote.candidate_id==id)
            votes = session.execute(query).all()
            if len(votes) > 0:
                for v in votes: 
                    session.delete(v[0])
                
            query = select(Candidate).where(Candidate.id==id)
            candidate_db = session.execute(query).one()[0]
            if candidate_db:
                session.delete(candidate_db)
                session.commit()
                return True
        except Exception as e:
            print(e)
        return False
    
    @session
    def get_candidates(self,session: Session) -> List[CandidateResponse]:
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
    
    @session
    def get_candidate_by_starname(self,session: Session,starname:str) -> CandidateResponse:
        try:
            query = select(Candidate).where(Candidate.starname==starname)
            candidate_db = session.execute(query).one_or_none()[0]
            
            return CandidateResponse(
                id=candidate_db.id,
                name=candidate_db.name,
                lastname=candidate_db.lastname,
                starname=candidate_db.starname,
                gender=candidate_db.gender,
                image_url=candidate_db.image_url
            )
        except Exception as e:
            print(e)
            
        return False
    
    @session
    def get_candidates_filter(self,session: Session,text_filter:str) -> List[CandidateResponse]:
        try:
            query = select(Candidate).where(
                (ilike_op(Candidate.starname,f"%{text_filter}%")) |
                (ilike_op(Candidate.name,f"%{text_filter}%")) |
                (ilike_op(Candidate.lastname,f"%{text_filter}%"))    
            )
            candidadates = session.execute(query).fetchall()
            return [CandidateResponse(
                id=c[0].id,
                name=c[0].name,
                lastname=c[0].lastname,
                starname=c[0].starname,
                gender=c[0].gender,
                image_url=c[0].image_url
            ) for c in candidadates]
        except Exception as e:
            print(e)
            return False
        
    @session
    def get_candidate_user_id(self,session: Session,id:int) -> CandidateResponse:
        query = select(Candidate).where(Candidate.id==id)
        try:
            candidate_db = session.execute(query).one_or_none()[0]
            return candidate_db.user_id
        except Exception as e:
            print(e)
            
        return False
    
    @session
    def get_candidates_by_user_id(self,session: Session,user_id:int) -> List[CandidateResponse]:
        query = select(Candidate).where(Candidate.user_id==user_id)
        candidates = session.execute(query).all()
        return [CandidateResponse(
                    id=candidate[0].id,
                    name=candidate[0].name,
                    lastname=candidate[0].lastname,
                    starname=candidate[0].starname,
                    gender=candidate[0].gender,
                    image_url=candidate[0].image_url
                ) for candidate in candidates]