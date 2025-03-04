from sqlalchemy import select
from sqlalchemy.orm.session import Session
from .session import session
from ..models.user_models import UserRequest,UserResponse
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
    def validate_user(self,session: Session,id: int) -> bool:
        query = select(User).where(User.id==int(id))
        user = session.execute(query).one()[0]
        user.validated = True
        session.commit()
        return True
    
    @session
    def get_user(self,session: Session,username:str,password:str) -> UserResponse:
        query = select(User).where(User.username==username)
        user = session.execute(query).one()[0]
        if verify_password(password,user.password):
            return UserResponse(username=user.username,rol=user.rol,email=user.email)
        return None
