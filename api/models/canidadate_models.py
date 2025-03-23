from pydantic import BaseModel,validator
from re import fullmatch
from fastapi import status,UploadFile,File,Form,HTTPException
import json

class CandidateRequest(BaseModel):
    name: str
    lastname: str
    starname: str
    gender: str
    
    @validator("name",)
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
    
    @validator("starname")
    def validate_starname(cls, value:str):
        value = value.upper()
        if not fullmatch(r"^[A-Za-zñÑ][A-Za-z0-9ñÑ ]*$",value):
            raise ValueError("Invalid Starname")
        return value.upper()
    
    @validator("gender")
    def validate_gender(cls, value:str):
        value = value.upper()
        if value != "M" and value != "F" and value!="O":
            raise ValueError("Invalid Gender")
        return value
    
    class Config:
        arbitrary_types_allowed= True
        

class CandidateForm:
    def __init__(self,
        name: str = Form(...),
        lastname: str = Form(...),
        starname: str = Form(...),
        gender: str = Form(...),
        image: UploadFile=File(...)):
        
        self.image = image
        
        self.create_candidate(name,lastname,starname,gender)
    
    def create_candidate(self,name,lastname,starname,gender):
        try:
            self.candidate = CandidateRequest(name=name,lastname=lastname,starname=starname,gender=gender)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,detail=json.loads(e.json())[0])
        

class CandidateResponse(BaseModel):
    id: int
    name: str
    lastname: str
    starname: str
    gender: str
    image_url: str
    

class CandidateUpdate(CandidateRequest):
    name: str = None
    lastname: str = None
    starname: str = None
    gender: str = None
    
class CandidateFormUpdate(CandidateForm):
    def __init__(self, 
                    id: int = Form(gt=0),
                    name = Form(""), 
                    lastname = Form(""), 
                    starname = Form(""), 
                    gender = Form(""), 
                    image: UploadFile=File(None)):
        self.id = id
        super().__init__(name, lastname, starname, gender, image)
    
    def create_candidate(self,name,lastname,starname,gender):
        try:
            candidate_data = {
                "name": name,
                "lastname": lastname,
                "starname": starname,
                "gender": gender
            }
            
            processed_data = {
                key: value.upper() 
                for key, value in candidate_data.items() 
                if value
            }
            self.candidate = CandidateUpdate(**processed_data)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,detail=json.loads(e.json())[0])
        