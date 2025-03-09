from fastapi import FastAPI,status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from .routers.main_router import main_router
from .routers.user_router import user_router

app = FastAPI(
    title="API CNU",
    description="API para un sistema de votaciones llamado CNU",
    version="0.1.0"
)

origins = [
    "http://localhost",
    "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear donde se guardaran las imagenes
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/",status_code=status.HTTP_200_OK)
def home() -> JSONResponse:
    return JSONResponse(
            {"message":"API RUNNING"},
            status_code=status.HTTP_200_OK
        )

app.include_router(user_router,tags=["User"])
app.include_router(main_router)
