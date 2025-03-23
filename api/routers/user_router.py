from fastapi import APIRouter,status,Form,Depends,Path
from typing import Annotated
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from typing import List
from ..models.user_models import UserResponse,UserForm,UserFormUpdate
from ..actions.user_actions import UserActions
from ..actions.code_actions import CodeActions
from ..utils.security import hash_password,generate_token_user
from ..utils.images import create_image
from .token import list_dependencies,depend_data
import os

user_router = APIRouter()

@user_router.post("/register_user",status_code=status.HTTP_201_CREATED)
async def register_user(form_data: Annotated[UserForm,Depends()]) -> UserResponse:
    actions = UserActions()
    
    if actions.validate_user_by_email(email=form_data.user.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Email already exists")
    
    if actions.validate_user_by_ci(nationality=form_data.user.nationality,ci=form_data.user.ci):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="CI already exists")
    
    code_actions = CodeActions()
    if not code_actions.validate_code(code=form_data.code,email=form_data.user.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Code Incorrect")
    
    
    form_data.user.password = hash_password(form_data.user.password)
    user_response = actions.create_user(user=form_data.user)
    if not user_response:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error creating user")
    
    file_path = await create_image(form_data.image)
    actions.assign_image(image_url=file_path,id=user_response.id)
    user_response.image_url = file_path
    
    code_actions.delete_code(email=form_data.user.email)
    
    return JSONResponse(content=user_response.model_dump(),status_code=status.HTTP_201_CREATED)


class CustomOAuth2PasswordRequestForm:
    def __init__(self, username: str = Form(...), password: str = Form(...)):
        self.email = username.upper()
        self.password = password


@user_router.post("/token",status_code=status.HTTP_200_OK)
async def login(form_data: Annotated[CustomOAuth2PasswordRequestForm,Depends()]) -> JSONResponse:
    actions = UserActions()
    user = actions.authenticate_user(email=form_data.email,password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"})
        
    token = generate_token_user(user)
    return JSONResponse(content={"access_token": token},status_code=status.HTTP_200_OK)


@user_router.put("/update_self_user",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
async def update_self_user(data:depend_data,form_data: Annotated[UserFormUpdate,Depends()],code:int=Form(gt=0)) -> JSONResponse:
    actions = UserActions()
    data["id"] = int(data["id"])
    user_id = actions.validate_user_by_email(email=form_data.user.email)
    if user_id and data["id"]!=user_id :
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Email already exists")
    
    if (not form_data.user.nationality and form_data.user.ci) or (form_data.user.nationality and not form_data.user.ci):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Included CI Complete")
        
    user_id = actions.validate_user_by_ci(nationality=form_data.user.nationality,ci=form_data.user.ci)
    if user_id and data["id"]!=user_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="CI already exists")
    
    code_actions = CodeActions()
    if not code_actions.validate_code(
                                code=code,
                                email= data["email"] if not form_data.user.email else form_data.user.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Code Incorrect")
    
    
    form_data.user.password = hash_password(form_data.user.password) if form_data.user.password else None
    user_response = actions.update_user(email=data["email"],user=form_data.user)
    if not user_response:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="User not updated")
    
    if form_data.image:
        if os.path.exists(user_response.image_url):
            try:
                os.remove(user_response.image_url)
            except Exception as e:
                print(f"Error al borrar: {e}")
        file_path = await create_image(form_data.image)
        actions.assign_image(image_url=file_path,id=user_response.id)
        user_response.image_url = file_path
    
    code_actions.delete_code(email=data["email"])
    
    return JSONResponse(content=user_response.model_dump(),status_code=status.HTTP_200_OK)

@user_router.put("/update_user",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
async def update_user(data:depend_data,form_data: Annotated[UserFormUpdate,Depends()],id: int = Form(gt=0)) -> JSONResponse:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = UserActions()
    user_id = actions.validate_user_by_email(email=form_data.user.email)
    if user_id and id!=user_id :
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Email already exists")
    
    if (not form_data.user.nationality and form_data.user.ci) or (form_data.user.nationality and not form_data.user.ci):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Included CI Complete")
    user_id = actions.validate_user_by_ci(nationality=form_data.user.nationality,ci=form_data.user.ci)
    if user_id and id!=user_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="CI already exists")
    
    user_response = actions.get_user_by_id(id=id)
    form_data.user.password = hash_password(form_data.user.password) if form_data.user.password else None
    user_response = actions.update_user(email=user_response.email,user=form_data.user)
    if not user_response:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="User not updated")
    
    if form_data.image:
        if os.path.exists(user_response.image_url):
            try:
                os.remove(user_response.image_url)
            except Exception as e:
                print(f"Error al borrar: {e}")
        file_path = await create_image(form_data.image)
        actions.assign_image(image_url=file_path,id=user_response.id)
        user_response.image_url = file_path
    
    
    return JSONResponse(content=user_response.model_dump(),status_code=status.HTTP_200_OK)

@user_router.delete("/delete_user/{email}",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
def delete_user(data:depend_data,email: str = Path()) -> JSONResponse:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = UserActions()
    email = email.upper()
    if actions.delete_user(email):
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
def validate_token(data:depend_data) -> JSONResponse:
    actions = UserActions()
    user = actions.get_user_by_id(int(data["id"]))
    return JSONResponse(content=user.model_dump(),status_code=status.HTTP_200_OK)

@user_router.get("/get_users_filter/{text_filter}",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
def get_users_filter(data:depend_data,text_filter:str = Path()) -> List[UserResponse]:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = UserActions()
    users = actions.get_users_filter(text_filter=text_filter)
    return JSONResponse(content=[user.model_dump() for user in users],status_code=status.HTTP_200_OK)


@user_router.get("/get_user_by_id/{id}",status_code=status.HTTP_200_OK,tags=["User"],dependencies=list_dependencies)
def get_user_by_id(data:depend_data,id:int = Path()) -> List[UserResponse]:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = UserActions()
    user = actions.get_user_by_id(id=id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not Found")
        
    return JSONResponse(content=user.model_dump(),status_code=status.HTTP_200_OK)

