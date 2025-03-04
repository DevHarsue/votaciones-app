from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from ..utils.env import USER,PASSWORD,HOST,DATABASE

# Creamos el Motor
engine = create_engine(f"postgresql+psycopg://{USER}:{PASSWORD}@{HOST}/{DATABASE}")

# El objeto session que sirve para instanciar sesiones
Session = sessionmaker(bind=engine)

# Para crear el modelo 
Base = declarative_base()