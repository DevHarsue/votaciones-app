from sqlalchemy import Column, Integer,ForeignKey,Text,CHAR,DATE,TIMESTAMP,Enum,text
from .config import Base,engine
from apscheduler.schedulers.background import BackgroundScheduler

roles = ("ADMIN","USER")
nationalities = ("V","E")
genders = ("M","F","O")

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True,autoincrement=True)
    nationality = Column(Enum(*nationalities,name="nationality_enum"),nullable=False)
    ci = Column(Integer, nullable=False)
    name = Column(Text, nullable=False)
    lastname = Column(Text, nullable=False)
    gender = Column(Enum(*genders,name="gender_enum"), nullable=False)
    password = Column(CHAR(60), nullable=False)
    email = Column(Text, nullable=False,unique=True)
    image_url = Column(Text, nullable=False)
    rol = Column(Enum(*roles,name="rol_enum"), nullable=False)

    

class Code(Base):
    __tablename__ = "codes"
    id = Column(Integer, primary_key=True,autoincrement=True)
    code = Column(Integer,nullable=False)
    email = Column(Text, nullable=False,unique=True)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

class Candidate(Base):
    __tablename__ = 'candidates'
    id = Column(Integer, primary_key=True,autoincrement=True)
    name = Column(Text, nullable=False)
    lastname = Column(Text, nullable=False)
    starname = Column(Text, nullable=False,unique=True)
    gender = Column(Enum(*genders,name="gender_enum"), nullable=False)
    image_url = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'),nullable=False)
    

class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True,autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'),nullable=False,unique=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'),nullable=False)
    voting_date = Column(DATE,nullable=False)

def delete_codes_expires():
    with engine.connect() as connection:
        connection.execute(text("DELETE FROM codes WHERE created_at < NOW() - INTERVAL '5 minutes'"))
        connection.commit()

# Configura el scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(delete_codes_expires, 'interval', minutes=1)  # Ejecutar cada minuto
scheduler.start()

Base.metadata.create_all(bind=engine)
