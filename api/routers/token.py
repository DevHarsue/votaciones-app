from fastapi.security import OAuth2PasswordBearer
from fastapi import HTTPException, status, Depends, Request
from typing import Annotated
from ..utils.security import verify_token
from ..actions.user_actions import UserActions
import json

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

def validate_token(request: Request,token: str = Depends(oauth2_scheme)) -> None:
    actions = UserActions()
    try:
        data = json.loads(verify_token(token))
        user_exist = actions.verify_email(email=data["email"])
        if not user_exist:
            raise Exception()
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
            )
    
    request.state.data = data
    
    return data

list_dependencies = [Depends(validate_token)]

def get_data(request: Request) -> dict:
    return request.state.data

depend_data = Annotated[dict,Depends(get_data)]
