from fastapi import APIRouter,status,Form,Depends,Query,Path
from typing import Annotated
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from typing import List
from ..models.user_models import UserRequest,UserResponse,UserUpdate,UserDelete
from ..actions.user_actions import UserActions
from ..actions.code_actions import CodeActions
from ..utils.emails import SenderEmail
from ..utils.security import generate_code,hash_password,generate_token_user
from ..utils.depends import depend_data
from .token import list_dependencies

user_router = APIRouter()

@user_router.post("/register_user",status_code=status.HTTP_201_CREATED)
def register_user(user: UserRequest) -> UserResponse:
    actions = UserActions()
    
    if actions.validate_user_by_email(email=user.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Email already exists")
    
    if actions.validate_user_by_username(username=user.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Username already exists")
    
    code_actions = CodeActions()
    if not code_actions.validate_code(code=user.code,email=user.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Code Incorrect")
    
    code_actions.delete_code(email=user.email)
    
    user.password = hash_password(user.password)
    id = actions.create_user(user=user)
    if id==0:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error creating user")
    
    
    return JSONResponse(content=UserResponse(email=user.email,username=user.username,rol=user.rol,validated=False).model_dump(),
                        status_code=status.HTTP_201_CREATED)


class CustomOAuth2PasswordRequestForm:
    def __init__(self, username: str = Form(...), password: str = Form(...)):
        self.username = username.upper()
        self.password = password


@user_router.post("/token",status_code=status.HTTP_200_OK)
async def login(form_data: Annotated[CustomOAuth2PasswordRequestForm,Depends()]) -> JSONResponse:
    actions = UserActions()
    user = actions.validate_user(form_data.username,form_data.password)
    if not bool(user):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"})
        
    token = generate_token_user(user)
    return JSONResponse(content={"access_token": token},status_code=status.HTTP_200_OK)


@user_router.put("/update_user",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
def update_user(data:depend_data,user: UserUpdate) -> JSONResponse:
    actions = UserActions()
    if actions.validate_user_by_email(email=user.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Email already exists")
    
    if actions.validate_user_by_username(username=user.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Username already exists")
    
    code_actions = CodeActions()
    if not code_actions.validate_code(code=user.code,email=data["email"]):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Code Incorrect")
    
    code_actions.delete_code(email=data["email"])
    
    user.password = hash_password(user.password) if user.password else None
    data = actions.update_user(data["username"],data["email"],user)
    if not data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="User not updated")
    
    return JSONResponse(content={"message": "User updated"},status_code=status.HTTP_200_OK)

@user_router.delete("/delete_user",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
def delete_user(data:depend_data,username: str = Query()) -> JSONResponse:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    username = username.upper()
    actions = UserActions()
    if actions.delete_user(username):
        return JSONResponse(content={"message": "User deleted"},
                        status_code=status.HTTP_200_OK)
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not deleted")

@user_router.get("/get_users",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
def get_users(data:depend_data) -> List[UserResponse]:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = UserActions()
    users = actions.get_users()
    return JSONResponse(content=[user.model_dump() for user in users],status_code=status.HTTP_200_OK)

@user_router.get("/validate_token",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def validate_token(data:depend_data) -> List[UserResponse]:
    return JSONResponse(content={"message":"Token Validated"},status_code=status.HTTP_200_OK)

@user_router.get("/get_users_filter/{text_filter}",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
def get_users_filter(data:depend_data,text_filter:str = Path()) -> List[UserResponse]:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = UserActions()
    users = actions.get_users_filter(text_filter=text_filter)
    return JSONResponse(content=[user.model_dump() for user in users],status_code=status.HTTP_200_OK)

@user_router.get("/get_user_by_username/{username}",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
def get_user_by_username(data:depend_data,username:str = Path()) -> List[UserResponse]:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = UserActions()
    user = actions.get_user_by_username(username=username)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not Found")
        
    return JSONResponse(content=user.model_dump(),status_code=status.HTTP_200_OK)
