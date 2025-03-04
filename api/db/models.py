from sqlalchemy import Column, Integer,ForeignKey,Text,CHAR,BOOLEAN,DATETIME
from sqlalchemy.dialects.postgresql import BYTEA,JSONB
from .config import Base,engine

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True,autoincrement=True)
    email = Column(Text, nullable=False)
    username = Column(Text, nullable=False)
    password = Column(CHAR(60), nullable=False)
    rol = Column(Text, nullable=False)
    validated = Column(BOOLEAN,nullable=False,default=False)


# class TokenUser(Base):
#     __tablename__ = "tokens_users"
#     id = Column(Integer, primary_key=True,autoincrement=True)
#     user_id = Column(Integer, ForeignKey('users.id'),nullable=False)

class Candidate(Base):
    __tablename__ = 'candidates'
    id = Column(Integer, primary_key=True,autoincrement=True)
    name = Column(Text, nullable=False)
    lastname = Column(Text, nullable=False)
    starname = Column(Text, nullable=False)
    gender = Column(CHAR(1), nullable=False)
    image = Column(BYTEA, nullable=False)
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


# class TokenVoter(Base):
#     __tablename__ = "tokens_voters"
#     id = Column(Integer, primary_key=True,autoincrement=True)
#     voter_id = Column(Integer, ForeignKey('voters.id'),nullable=False)

class Vote:
    __tablename__ = "votes"
    voter_id = Column(Integer, ForeignKey('voters.id'),nullable=False)
    candidate_id = Column(Integer, ForeignKey('candidates.id'),nullable=False)
    voting_date = Column(DATETIME,nullable=False)
    
    

Base.metadata.create_all(bind=engine)
