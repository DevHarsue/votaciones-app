from sqlalchemy import select
from sqlalchemy.orm.session import Session
from .session import session
from ..db.models import CodeVoter
from datetime import datetime,timedelta

class CodeVoterActions:
    @session
    def create_code(self,session:Session, voter_id: int,code: int) -> bool:
        try:
            expire = datetime.utcnow() + timedelta(minutes=10)
            code_db = CodeVoter(
                voter_id=voter_id,
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
        query = select(CodeVoter).where(CodeVoter.code==code)
        try:
            code_db = session.execute(query).fetchone()[0]
        except Exception as e:
            print(e)
            return False
        
        return code_db.voter_id
    
    @session
    def delete_code(self,session:Session,code:int,voter_id:int) -> bool:
        query = select(CodeVoter).where(CodeVoter.code==code and CodeVoter.voter_id==voter_id)
        try:
            code_db = session.execute(query).fetchone()[0]
            session.delete(code_db)
            session.commit()
        except Exception as e:
            print(e)
            return False
        
        return True