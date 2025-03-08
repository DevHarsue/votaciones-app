from pydantic import BaseModel,validator
from re import fullmatch,findall

class VoterRequest(BaseModel):
    nationality: str
    ci: int
    name: str
    lastname: str
    gender: str
    email: str
    
    @validator("nationality")
    def validate_nationality(cls, value:str):
        value = value.upper()
        if value != "V" and value != "E":
            raise ValueError("Invalid Nationality")
        return value
    
    @validator("ci")
    def validate_ci(cls, value:int):
        if not fullmatch(r"\d{7,8}",str(value)):
            raise ValueError("Invalid CI")
        return value
    
    @validator("name")
    def validate_name(cls, value:str):
        value = value.upper()
        if not fullmatch(r"[A-Z\s]+",value):
            raise ValueError("Invalid Name")
        return value
    
    @validator("lastname")
    def validate_lastname(cls, value:str):
        value = value.upper()
        if not fullmatch(r"[A-Z\s]+",value):
            raise ValueError("Invalid Lastname")
        return value
    
    @validator("gender")
    def validate_gender(cls, value:str):
        value = value.upper()
        if value != "M" and value != "F":
            raise ValueError("Invalid Gender")
        return value
    
    @validator("email")
    def validate_email(cls,value:str):
        regex = r"^[^@]+@[^@]+\.[^@]+$"
        value = value.upper()
        if (not fullmatch(regex,value) or len(findall(r"\+\d\@",value)) > 0):
            raise ValueError("Invalid Email")
        
        return value

class VoterUpdate(VoterRequest):
    nationality: str = None
    ci: int = None
    name: str = None
    lastname: str = None
    gender: str = None
    email: str = None
    
class VoterResponse(BaseModel):
    id: int
    nationality: str
    ci: int
    name: str
    lastname: str
    gender: str
    email: str
    validated: bool