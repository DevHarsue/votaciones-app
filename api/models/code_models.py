from pydantic import BaseModel,validator
from re import findall,fullmatch

class CodeRequest(BaseModel):
    email: str
    
    @validator("email")
    def validate_email(cls,value:str):
        regex = r"^[^@]+@[^@]+\.[^@]+$"
        value = value.upper()
        if (not fullmatch(regex,value) or len(findall(r"\+\d\@",value)) > 0):
            raise ValueError("Invalid Email")
        
        return value
    
    
    
class CodeResponse(CodeRequest):
    email: str
    code: int
