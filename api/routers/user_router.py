from fastapi import APIRouter,status,Form,Depends,Query
from typing import Annotated
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from typing import List
from ..models.user_models import UserRequest,UserResponse,UserUpdate,UserDelete
from ..actions.user_actions import UserActions
from ..actions.code_user_actions import CodeUserActions
from ..utils.emails import Email
from ..utils.security import generate_code,verify_token,hash_password,generate_token_user
from ..utils.depends import depend_data
from .token import list_dependencies

user_router = APIRouter()

@user_router.post("/register_user",status_code=status.HTTP_201_CREATED)
def register_user(user: UserRequest) -> UserResponse:
    actions = UserActions()
    user.password = hash_password(user.password)
    id = actions.create_user(user=user)
    if id==0:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="id is 0")
    code = generate_code()
    
    code_actions = CodeUserActions()
    if not code_actions.create_code(user_id=id,code=code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Code not saved")
    sender = Email()
    sender.send_email_validate_user(user.email,code)
    
    return JSONResponse(content=UserResponse(email=user.email,username=user.username,rol=user.rol,validated=False).model_dump(),
                        status_code=status.HTTP_201_CREATED)

@user_router.get("/validate_user/{code}",status_code=status.HTTP_200_OK)
def validate_user(code: int) -> JSONResponse:
    code_actions = CodeUserActions()
    id = code_actions.validate_code(code)
    if id==0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Invalid Code")
    
    actions = UserActions()
    validate = actions.validate_user(id)
    if not validate:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="User not validated")
    
    code_actions.delete_code(code=code,user_id=id)
    
    return JSONResponse(content={"message":"User validated"},
                        status_code=status.HTTP_200_OK)
    


class CustomOAuth2PasswordRequestForm:
    def __init__(self, username: str = Form(...), password: str = Form(...)):
        self.username = username.upper()
        self.password = password


@user_router.post("/token",status_code=status.HTTP_200_OK)
async def login(form_data: Annotated[CustomOAuth2PasswordRequestForm,Depends()]) -> JSONResponse:
    actions = UserActions()
    user = actions.get_user(form_data.username,form_data.password)
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
    user.password = hash_password(user.password) if user.password else None
    data = actions.update_user(data["username"],data["email"],user)
    if data:
        email = Email()
        code = generate_code()
        code_actions = CodeUserActions()
        if not code_actions.create_code(user_id=data["id"],code=code):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Code not keeped")
        try:
            email.send_email_validate_user(data["email"],code) 
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Email not sent")
        
        return JSONResponse(content={"message": "User updated"},
                        status_code=status.HTTP_200_OK)
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="User not updated")

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
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="User not deleted")

@user_router.get("/get_users",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
def get_users(data:depend_data) -> List[UserResponse]:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = UserActions()
    users = actions.get_users()
    return JSONResponse(content=[user.model_dump() for user in users],status_code=status.HTTP_200_OK)