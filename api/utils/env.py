from dotenv import load_dotenv
import os

load_dotenv()

# Datos de la base de datos
USER = os.getenv("USER")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("HOST")
DATABASE = os.getenv("DATABASE")

# Esto servira para los tokens
ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY = os.getenv("SECRET_KEY")

# Datos del email
EMAIL = os.getenv("EMAIL")
KEY_EMAIL = os.getenv("KEY_EMAIL")

