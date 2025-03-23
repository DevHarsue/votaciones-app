# Votaciones App

## 🚀 Instalación
1. Clona el repo:
   ```bash
   git clone https://github.com/DevHarsue/votaciones-app.git
   ```
2. Instala dependencias:
   ```bash
   pnpm install
   ```
3. Inicia el servidor:
   ```bash
   pnpm dev
   ```

## 🚀 Desplegar backend

Instalar postgresql (pagina oficial de postgresql)
Crear un venv en el repositorio con nombre "venv"
instalar requirimeintos con "pip install -r api/requirements.txt"

rellenar los datos del .env con los siguientes datos:
USER = "postgres" // Cambiar por tus datos
PASSWORD = "03112005" // Cambiar por tus datos
HOST = "localhost" // Cambiar por tus datos
DATABASE = "votacionesdb" // Cambiar por tus datos

ALGORITHM = "HS256"
SECRET_KEY = "VIVAELCNUYLADEMOCRACIA123456789"


EMAIL = "HARSUE0311@GMAIL.COM" // Dejar si quiere este correo con el key para evitar trabajo demás
KEY_EMAIL = "wcqf znto ladq zqam"

NEXT_PUBLIC_API_URL="http://localhost:5000/"

y por ultimo ejecutar "uvicorn api.main:app --host 0.0.0.0 --port 5000"


# Contraseña 
admin
Contra123.

