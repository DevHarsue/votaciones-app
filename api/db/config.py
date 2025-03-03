from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from dotenv import load_dotenv
import os

# Obtener los datos del env
load_dotenv()
USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
DATABASE = os.getenv("DATABASE")

# Creamos el Motor
engine = create_engine(f"postgresql+psycopg://{USER}:{PASSWORD}@{HOST}/{DATABASE}")

# El objeto session que sirve para instanciar sesiones
Session = sessionmaker(bind=engine)

# Para crear el modelo 
Base = declarative_base()

# Esto servira para los tokens
ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY = os.getenv("SECRET_KEY")
