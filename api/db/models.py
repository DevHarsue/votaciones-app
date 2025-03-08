from sqlalchemy import Column, Integer,ForeignKey,Text,CHAR,BOOLEAN,DATE
from .config import Base,engine

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True,autoincrement=True)
    email = Column(Text, nullable=False)
    username = Column(Text, nullable=False)
    password = Column(CHAR(60), nullable=False)
    rol = Column(Text, nullable=False)
    validated = Column(BOOLEAN,nullable=False,default=False)


class CodeUser(Base):
    __tablename__ = "codes_users"
    id = Column(Integer, primary_key=True,autoincrement=True)
    code = Column(Integer,nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'),nullable=False)
    expire = Column(DATE,nullable=False)

class Candidate(Base):
    __tablename__ = 'candidates'
    id = Column(Integer, primary_key=True,autoincrement=True)
    name = Column(Text, nullable=False)
    lastname = Column(Text, nullable=False)
    starname = Column(Text, nullable=False)
    gender = Column(CHAR(1), nullable=False)
    image_url = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'),nullable=False)
    

class Voter(Base):
    __tablename__ = "voters"
    id = Column(Integer, primary_key=True,autoincrement=True)
    nationality = Column(CHAR(1),nullable=False)
    ci = Column(Integer, nullable=False)
    name = Column(Text, nullable=False)
    lastname = Column(Text, nullable=False)
    gender = Column(CHAR(1), nullable=False)
    email = Column(Text, nullable=False)
    validated = Column(BOOLEAN,nullable=False,default=False)


class CodeVoter(Base):
    __tablename__ = "codes_voters"
    id = Column(Integer, primary_key=True,autoincrement=True)
    code = Column(Integer,nullable=False)
    voter_id = Column(Integer, ForeignKey('voters.id'),nullable=False)
    expire = Column(DATE,nullable=False)

class Vote(Base):
    __tablename__ = "votes"
    id = Column(Integer, primary_key=True,autoincrement=True)
    voter_id = Column(Integer, ForeignKey('voters.id'),nullable=False)
    candidate_id = Column(Integer, ForeignKey('candidates.id'),nullable=False)
    voting_date = Column(DATE,nullable=False)
    
    

Base.metadata.create_all(bind=engine)
