from fastapi import APIRouter,status
from fastapi import Depends,Form,Request
from typing import Annotated
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from ..models.user_models import UserRequest,UserResponse
from ..actions.user_actions import UserActions
from ..utils.emails import Email
from ..utils.security import generate_token_validate,verify_token,hash_password,generate_token_user

user_router = APIRouter()

@user_router.post("/register_user",status_code=status.HTTP_201_CREATED)
def register_user(user: UserRequest) -> UserResponse:
    """
    Register a new user and send a validation email.

    Args:
        user (UserRequest): The user information for registration.

    Returns:
        UserResponse: The response containing the registered user's information.
    """
    actions = UserActions()
    user.password = hash_password(user.password)
    print(len(user.password))
    id = actions.create_user(user=user)
    if id==0:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="id is 0")
    token = generate_token_validate(id)
    
    sender = Email()
    # sender.send_email_validate_user(user.email,token)
    
    return JSONResponse(content=UserResponse(email=user.email,username=user.username,rol=user.rol).model_dump(),
                        status_code=status.HTTP_201_CREATED)

@user_router.get("/validate_user/{token}",status_code=status.HTTP_200_OK)
def validate_user(token: str) -> JSONResponse:
    """
    Validate a user with a token.

    Args:
        token (str): The token for user validation.

    Returns:
        JSONResponse: The response containing the validation status.
    """
    id = int(verify_token(token))
    if id==0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Invalid token")
    
    actions = UserActions()
    validate = actions.validate_user(id)
    if not validate:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="User not validated")
    
    return JSONResponse(content={"message":"User validated"},
                        status_code=status.HTTP_200_OK)
    

class CustomOAuth2PasswordRequestForm:
    def __init__(self, username: str = Form(...), password: str = Form(...)):
        self.username = username.upper()
        self.password = password

        
@user_router.post("",status_code=status.HTTP_200_OK)
async def login(form_data: Annotated[CustomOAuth2PasswordRequestForm,Depends()]) -> JSONResponse:
    """
    Login a user.

    Args:
        form_data (Annotated[CustomOAuth2PasswordRequestForm,Depends()]): The form data for user login.

    Returns:
        JSONResponse: The response containing the access token.
    """
    actions = UserActions()
    user = actions.get_user(form_data.username,form_data.password)
    if not bool(user):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"})
        
    token = generate_token_user(user)
    return JSONResponse(content={"access_token": token},status_code=status.HTTP_200_OK)