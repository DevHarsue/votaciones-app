from sqlalchemy import select
from sqlalchemy.sql.operators import ilike_op
from sqlalchemy.orm.session import Session
from .session import session
from ..models.user_models import UserRequest,UserResponse,UserUpdate
from ..db.models import User,Vote,Candidate
from ..utils.security import verify_password,hash_password

class UserActions:
    
    @session
    def create_user(self,session: Session,user: UserRequest, rol: str = "USER") -> UserResponse:
        user = User(
            nationality = user.nationality,
            ci = user.ci,
            name = user.name,
            lastname = user.lastname,
            gender = user.gender,
            password = user.password,
            email = user.email,
            image_url = "Temporally",
            rol = rol
        )
        
        try:
            session.add(user)
            query = select(User).where(User.email==user.email)
            user_db = session.execute(query).one()[0]
        except Exception as e:
            print(e)
            return False
        
        return UserResponse(
            id=user_db.id,
            nationality=user_db.nationality,
            ci=user_db.ci,
            name=user_db.name,
            lastname=user_db.lastname,
            gender=user_db.gender,
            email=user_db.email,
            rol=user_db.rol
        )
    
    @session
    def assign_image(self,session: Session, image_url: str, id: int) -> bool:
        query = select(User).where(User.id==id)
        try:
            user_db = session.execute(query).one()[0]
            user_db.image_url = image_url
            session.commit()
            return True
        except Exception as e:
            print(e)
            
        return False
    
    @session
    def authenticate_user(self,session: Session,email:str,password:str) -> UserResponse:
        query = select(User).where(User.email==email)
        try:
            user_db = session.execute(query).one()[0]
            if verify_password(password,user_db.password):
                return UserResponse(
                    id=user_db.id,
                    nationality=user_db.nationality,
                    ci=user_db.ci,
                    name=user_db.name,
                    lastname=user_db.lastname,
                    gender=user_db.gender,
                    email=user_db.email,
                    rol=user_db.rol,
                    image_url=user_db.image_url
                )
        except Exception as e:
            print(e)    
        return None
        
    @session
    def verify_email(self,session: Session,email:str) -> bool:
        query = select(User).where(User.email==email)
        user = session.execute(query).one_or_none()
        if user:
            return True
        return False

    @session
    def update_user(self,session: Session,email:str,user:UserUpdate, rol:str = "") -> UserResponse:
        query = select(User).where(User.email==email)
        user_db = session.execute(query).one()[0]
        if user_db:
            user_db.nationality = user.nationality if user.nationality else user_db.nationality
            user_db.ci = user.ci if user.ci else user_db.ci
            user_db.name = user.name if user.name else user_db.name
            user_db.lastname = user.lastname if user.lastname else user_db.lastname
            user_db.gender = user.gender if user.gender else user_db.gender
            user_db.email = user.email if user.email else user_db.email
            user_db.rol = rol if rol!="" else user_db.rol
            session.commit()
            return UserResponse(
                    id=user_db.id,
                    nationality=user_db.nationality,
                    ci=user_db.ci,
                    name=user_db.name,
                    lastname=user_db.lastname,
                    gender=user_db.gender,
                    email=user_db.email,
                    rol=user_db.rol,
                    image_url=user_db.image_url
                )
        return False
    
    @session
    def delete_user(self,session: Session,email:str) -> bool:
        query = select(User).where(User.email==email)
        try:
            user = session.execute(query).one()[0]
            if user:
                query = select(Candidate).where(Candidate.user_id==user.id)
                candidates = session.execute(query).all()
                if candidates:
                    for c in candidates:
                        query = select(Vote).where(Vote.candidate_id==c[0].id)
                        votes = session.execute(query).all()
                        if len(votes) > 0:
                            for v in votes: 
                                print(v[0].id)
                                session.delete(v[0])
                        session.flush()
                        session.delete(c[0])
                
                query = select(Vote).where(Vote.user_id==user.id)
                votes = session.execute(query).all()
                if len(votes) > 0:
                    for v in votes: 
                        session.delete(v[0])
                session.flush()
                session.delete(user)
                session.commit()
                return True
        except Exception as e:
            print(e)
        return False
    
    @session
    def get_users(self,session: Session) -> list[UserResponse]:
        query = select(User)
        users = session.execute(query).fetchall()
        return [UserResponse(
                    id=user[0].id,
                    nationality=user[0].nationality,
                    ci=user[0].ci,
                    name=user[0].name,
                    lastname=user[0].lastname,
                    gender=user[0].gender,
                    email=user[0].email,
                    rol=user[0].rol,
                    image_url=user[0].image_url
                ) for user in users]
    
    
    @session
    def validate_user_by_ci(self,session: Session,nationality:str,ci:int) -> int:
        query = select(User).where(User.nationality==nationality,User.ci==ci)
        try:
            user = session.execute(query).one_or_none()[0]
            return user.id
        except Exception as e:
            print(e)
        return False
    
    @session
    def validate_user_by_email(self,session: Session,email:str) -> int:
        query = select(User).where(User.email==email)
        try:
            user = session.execute(query).one_or_none()[0]
            return user.id
        except Exception as e:
            print(e)
        return False
    
    @session
    def get_users_filter(self,session: Session, text_filter: str) -> list[UserResponse]:
        query = select(User).where(
                (ilike_op(User.name,f"%{text_filter}%")) |
                (ilike_op(User.lastname,f"%{text_filter}%")) |
                (ilike_op(User.email,f"%{text_filter}%")) 
            )
        users = session.execute(query).fetchall()
        return [UserResponse(
                    id=user[0].id,
                    nationality=user[0].nationality,
                    ci=user[0].ci,
                    name=user[0].name,
                    lastname=user[0].lastname,
                    gender=user[0].gender,
                    email=user[0].email,
                    rol=user[0].rol,
                    image_url=user[0].image_url
                ) for user in users]
    
    @session
    def get_user_by_id(self,session: Session, id: int) -> UserResponse:
        query = select(User).where(User.id==id)
        user_db = session.execute(query).one_or_none()
        if not user_db:
            return False
        user_db = user_db[0]
        return UserResponse(
                    id=user_db.id,
                    nationality=user_db.nationality,
                    ci=user_db.ci,
                    name=user_db.name,
                    lastname=user_db.lastname,
                    gender=user_db.gender,
                    email=user_db.email,
                    rol=user_db.rol,
                    image_url=user_db.image_url
                )
    
    @session
    def update_password(self,session: Session,email:str,password:str) -> UserResponse:
        query = select(User).where(User.email==email)
        try:
            user_db = session.execute(query).one()[0]
            user_db.password = hash_password(password=password)
            session.commit()
            return UserResponse(
                id=user_db.id,
                nationality=user_db.nationality,
                ci=user_db.ci,
                name=user_db.name,
                lastname=user_db.lastname,
                gender=user_db.gender,
                email=user_db.email,
                rol=user_db.rol,
                image_url=user_db.image_url
                
            )
        except Exception as e:
            print(e)    
        return None