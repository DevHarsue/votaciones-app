from sqlalchemy import select
from sqlalchemy.orm.session import Session
from .session import session
from ..db.models import Code
from datetime import datetime,timedelta
from ..utils.security import generate_code
from ..models.code_models import CodeRequest,CodeResponse

class CodeActions:
    @session
    def create_code(self,session:Session,code: CodeRequest) -> CodeResponse:
        try:
            expire = datetime.utcnow() + timedelta(minutes=10)
            code_db = Code(
                code=generate_code(),
                expire=expire,
                email=code.email
            )
            session.add(code_db)
            session.commit()
        except Exception as e:
            print(e)
            return False
        
        return CodeResponse(email=code_db.email,code=code_db.code,expire=code_db.expire)

    @session
    def validate_code(self,session:Session,code: int,email:str) -> CodeResponse:
        query = select(Code).where(Code.code==code,Code.email==email)
        try:
            code_db = session.execute(query).fetchone()[0]
        except Exception as e:
            print(e)
            return False
        
        return CodeResponse(email=code_db.email,code=code_db.code,expire=code_db.expire)
        
    
    @session
    def delete_code(self,session:Session,email:str) -> bool:
        query = select(Code).where(Code.email==email)
        try:
            code_db = session.execute(query).fetchone()[0]
            session.delete(code_db)
            session.commit()
        except Exception as e:
            print(e)
            return False
        
        return True
    
    @session
    def delete_codes(self,session:Session) -> bool:
        query = select(Code)
        try:
            codes_db = session.execute(query).all()
            for code in codes_db:
                session.delete(code[0])
            session.commit()
        except Exception as e:
            print(e)
            return False
        
        return True