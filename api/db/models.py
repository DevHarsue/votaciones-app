from sqlalchemy import Column, Integer,ForeignKey,Text,CHAR,DATE,DateTime
from .config import Base,engine

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True,autoincrement=True)
    email = Column(Text, nullable=False,unique=True)
    username = Column(Text, nullable=False,unique=True)
    password = Column(CHAR(60), nullable=False)
    rol = Column(Text, nullable=False)

class Code(Base):
    __tablename__ = "codes"
    id = Column(Integer, primary_key=True,autoincrement=True)
    code = Column(Integer,nullable=False)
    email = Column(Text, nullable=False,unique=True)
    expire = Column(DateTime,nullable=False)

class Candidate(Base):
    __tablename__ = 'candidates'
    id = Column(Integer, primary_key=True,autoincrement=True)
    name = Column(Text, nullable=False)
    lastname = Column(Text, nullable=False)
    starname = Column(Text, nullable=False,unique=True)
    gender = Column(CHAR(1), nullable=False)
    image_url = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'),nullable=False)
    

class Voter(Base):
    __tablename__ = "voters"
    id = Column(Integer, primary_key=True,autoincrement=True)
    nationality = Column(CHAR(1),nullable=False)
    ci = Column(Integer, nullable=False,unique=True)
    name = Column(Text, nullable=False)
    lastname = Column(Text, nullable=False)
    gender = Column(CHAR(1), nullable=False)
    email = Column(Text, nullable=False,unique=True)

class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True,autoincrement=True)
    voter_id = Column(Integer, ForeignKey('voters.id'),nullable=False,unique=True)
    candidate_id = Column(Integer, ForeignKey('candidates.id'),nullable=False)
    voting_date = Column(DATE,nullable=False)
    
    

Base.metadata.create_all(bind=engine)
