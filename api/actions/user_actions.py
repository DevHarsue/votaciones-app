from sqlalchemy import select
from sqlalchemy.sql.operators import ilike_op
from sqlalchemy.orm.session import Session
from .session import session
from ..models.user_models import UserRequest,UserResponse,UserUpdate
from ..db.models import User
from ..utils.security import verify_password

class UserActions:
    @session
    def create_user(self,session: Session,user: UserRequest) -> int:
        user = User(
                email=user.email,
                username=user.username,
                password=user.password,
                rol=user.rol)
        
        try:
            session.add(user)
            query = select(User).where(User.username==user.username)
            user = session.execute(query).one()[0]
        except Exception as e:
            print(e)
            return 0
        
        return user.id
    
    
    @session
    def validate_user(self,session: Session,username:str,password:str) -> UserResponse:
        query = select(User).where(User.username==username)
        try:
            user = session.execute(query).one()[0]
            if verify_password(password,user.password):
                return UserResponse(username=user.username,rol=user.rol,email=user.email)
        except Exception as e:
            print(e)    
        return None
        
    @session
    def verify_user(self,session: Session, username:str, email:str, rol:str) -> bool:
        query = select(User).where(User.username==username,User.email==email,User.rol==rol)
        user = session.execute(query).one_or_none()
        if user:
            return True
        return False

    @session
    def update_user(self,session: Session,username:str,email:str,user:UserUpdate) -> dict:
        query = select(User).where(User.username==username,User.email==email)
        user_db = session.execute(query).one()[0]
        if user_db:
            user_db.username = user.username if user.username else user_db.username
            user_db.email = user.email if user.email else user_db.email
            user_db.password = user.password if user.password else user_db.password
            user_db.rol = user.rol if user.rol else user_db.rol
            session.commit()
            return True
        return False
    
    @session
    def delete_user(self,session: Session,username:str) -> bool:
        query = select(User).where(User.username==username)
        try:
            user = session.execute(query).one()[0]
            if user:
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
        return [UserResponse(username=user[0].username,rol=user[0].rol,email=user[0].email) for user in users]
    
    
    @session
    def validate_user_by_username(self,session: Session,username:str) -> int:
        query = select(User).where(User.username==username)
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
                (ilike_op(User.username,f"%{text_filter}%")) |
                (ilike_op(User.email,f"%{text_filter}%")) 
            )
        users = session.execute(query).fetchall()
        return [UserResponse(username=user[0].username,rol=user[0].rol,email=user[0].email) for user in users]
    
    @session
    def get_user_by_username(self,session: Session, username: str) -> list[UserResponse]:
        query = select(User).where(User.username==username.upper())
        user = session.execute(query).one_or_none()
        if not user:
            return False
        return UserResponse(username=user[0].username,rol=user[0].rol,email=user[0].email)