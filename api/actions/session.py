from api.db.config import Session

def session(func):
    def wrapper(self,*args,**kwargs):
        with Session() as session:
            result = func(self,session,*args,**kwargs)
            session.commit()
            return result
    return wrapper