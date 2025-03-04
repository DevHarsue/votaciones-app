from fastapi import FastAPI,status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from api.routers.user_router import user_router

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



@app.get("/",status_code=status.HTTP_200_OK)
def home() -> JSONResponse:
    return JSONResponse(
            {"message":"API RUNNING"},
            status_code=status.HTTP_200_OK
        )



app.include_router(user_router,tags=["User"],prefix="/user")