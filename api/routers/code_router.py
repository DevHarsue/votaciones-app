from fastapi import APIRouter,status,HTTPException
from fastapi.responses import JSONResponse
from ..actions.code_actions import CodeActions
from ..models.code_models import CodeRequest
from ..utils.emails import SenderEmail
from .token import list_dependencies,depend_data

code_router = APIRouter()

def send_code(receiver,code) -> bool:
    try:
        sender = SenderEmail()
        sender.send_email_validate(receiver=receiver,code=code)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Email not send, error:"+str(e))
    
    return True

@code_router.post("/generate_code",status_code=status.HTTP_201_CREATED)
def generate_code(code: CodeRequest):
    code_actions = CodeActions()
    
    # Eliminar codigo en caso de existir
    code_actions.delete_code(email=code.email)
    code_response = code_actions.create_code(code)
    if not code:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Code not keeped")
    
    send_code(receiver=code.email,code=code_response.code)

    
    return JSONResponse(content=code_response.model_dump(),status_code=status.HTTP_201_CREATED)
    

@code_router.delete("/delete_codes",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def delete_codes(data:depend_data) -> JSONResponse:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    
    actions = CodeActions()
    
    if not actions.delete_codes():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Codes not deleted")
    
    return JSONResponse(content={"message":"Codes deleted"},
                        status_code=status.HTTP_200_OK)
    