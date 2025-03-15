from pydantic import BaseModel,validator
from re import fullmatch,findall

class UserRequest(BaseModel):
    email: str
    username: str
    password: str
    rol: str
    code: int
    
    @validator("email")
    def validate_email(cls,value:str):
        regex = r"^[^@]+@[^@]+\.[^@]+$"
        value = value.upper()
        if (not fullmatch(regex,value) or len(findall(r"\+\d\@",value)) > 0):
            raise ValueError("Invalid Email")
        
        return value
    
    @validator("username")
    def validate_username(cls,value:str):
        value = value.upper()
        if len(value) < 4:
            raise ValueError("Username must have at least 4 characters")
        if value.isnumeric():
            raise ValueError("Username must have at least one letter")
        if " " in value:
            raise ValueError("Username cannot have spaces")
        
        return value
    
    @validator("password")
    def validate_password(cls, value: str):
        regex = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$'
        if not fullmatch(regex, value):
            raise ValueError(
                "Password must have at least one number, one special character, "
                "one uppercase letter, one lowercase letter, and be at least 8 characters long"
            )
        
        return value
    
    @validator("rol")
    def validate_rol(cls,value:str):
        value = value.upper()
        if value not in ["ADMIN","USER"]:
            raise ValueError("Invalid Rol")
        
        return value
    
    @validator("code")
    def validate_code(cls,value:int):
        value_str = str(value)
        if len(value_str)!=6:
            raise ValueError("Invalid Code")
        
        return value

    
class UserUpdate(UserRequest):
    email: str = None
    username: str = None
    password: str = None
    rol: str = None

class UserDelete(BaseModel):
    email: str
    username: str
    
    @validator("email")
    def validate_email(cls,value:str):
        value = value.upper()
        return value
    
    @validator("username")
    def validate_username(cls,value:str):
        value = value.upper()
        return value
    
class UserResponse(BaseModel):
    username: str
    email: str
    rol: str
    
    @validator("email")
    def validate_email(cls,value:str):
        value = value.upper()
        return value
    
    @validator("username")
    def validate_username(cls,value:str):
        value = value.upper()
        return value
    
    @validator("rol")
    def validate_rol(cls,value:str):
        value = value.upper()
        return value