from pydantic import BaseModel,validator,field_validator
from fastapi import Form,HTTPException,UploadFile,File,status
import json
from re import fullmatch,findall

class UserRequest(BaseModel):
    nationality: str
    ci: int
    name: str
    lastname: str
    gender: str
    email: str
    password: str
    
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
        if value != "M" and value != "F" and value !="O":
            raise ValueError("Invalid Gender")
        return value
    
    @validator("email")
    def validate_email(cls,value:str):
        regex = r"^[^@]+@[^@]+\.[^@]+$"
        value = value.upper()
        if (not fullmatch(regex,value) or len(findall(r"\+\d\@",value)) > 0):
            raise ValueError("Invalid Email")
        
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

class UserForm:
    def __init__(self,
        nationality: str = Form(...),
        ci: int = Form(...),
        name: str = Form(...),
        lastname: str = Form(...),
        gender: str = Form(...),
        email: str = Form(...),
        password: str = Form(...),
        code: int = Form(gt=0),
        image: UploadFile=File(...)):
        
        self.code = code
        self.image = image
        
        self.create_user(nationality,ci,name,lastname,gender,email,password)
    
    def create_user(self,nationality,ci,name,lastname,gender,email,password):
        try:
            self.user = UserRequest(
                                        nationality=nationality,
                                        ci=ci,
                                        name=name,
                                        lastname=lastname,
                                        gender=gender,
                                        email=email,
                                        password=password
                                    )
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,detail=json.loads(e.json())[0])
        
    
class UserUpdate(UserRequest):
    nationality: str = None
    ci: int = None
    name: str = None
    lastname: str = None
    gender: str = None
    email: str = None
    code: int = None
    password: str = None
    
    
class UserPasswordUpdate(BaseModel):
    new_password: str 
    old_password: str
    
    @field_validator("new_password","old_password")
    def validate_password(cls, value: str):
        regex = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$'
        if not fullmatch(regex, value):
            raise ValueError(
                "Password must have at least one number, one special character, "
                "one uppercase letter, one lowercase letter, and be at least 8 characters long"
            )
        return value
        
    
    
class UserFormUpdate:
    def __init__(self, 
                    nationality: str = Form(""),
                    ci: int = Form(0),
                    name: str = Form(""),
                    lastname: str = Form(""),
                    gender: str = Form(""),
                    email: str = Form(""),
                    image: UploadFile=File(None)):
        self.image = image
        self.create_user(
                            nationality.upper(),
                            ci,
                            name.upper(),
                            lastname.upper(),
                            gender.upper(),
                            email.upper()
                        )
    
    def create_user(self,nationality,ci,name,lastname,gender,email):
        try:
            user_data = {
                "nationality":nationality,
                "ci":ci,
                "name":name,
                "lastname":lastname,
                "gender":gender,
                "email":email
            }
            
            processed_data = {
                key: value
                for key, value in user_data.items() 
                if value
            }
            self.user = UserUpdate(**processed_data)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,detail=json.loads(e.json())[0])
        
    
class UserResponse(BaseModel):
    id: int
    nationality: str
    ci: int
    name: str
    lastname: str
    gender: str
    email: str
    rol: str
    image_url: str = None