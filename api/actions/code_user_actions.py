from sqlalchemy import select
from sqlalchemy.orm.session import Session
from .session import session
from ..db.models import CodeUser
from datetime import datetime,timedelta

class CodeUserActions:
    @session
    def create_code(self,session:Session, user_id: int,code: int) -> bool:
        try:
            expire = datetime.utcnow() + timedelta(minutes=10)
            code_db = CodeUser(
                user_id=user_id,
                code=code,
                expire=expire
            )
            session.add(code_db)
            session.commit()
        except Exception as e:
            print(e)
            return False
        return True

    @session
    def validate_code(self,session:Session,code: int) -> int :
        query = select(CodeUser).where(CodeUser.code==code)
        try:
            code_db = session.execute(query).fetchone()[0]
        except Exception as e:
            print(e)
            return False
        
        return code_db.user_id
    
    @session
    def delete_code(self,session:Session,code:int,user_id:int) -> bool:
        query = select(CodeUser).where(CodeUser.code==code and CodeUser.user_id==user_id)
        try:
            code_db = session.execute(query).fetchone()[0]
            session.delete(code_db)
            session.commit()
        except Exception as e:
            print(e)
            return False
        
        return True