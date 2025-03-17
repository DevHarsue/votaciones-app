from fastapi import APIRouter,status,Depends,HTTPException,Path
from fastapi.responses import JSONResponse
from typing import Annotated,List
import os
import uuid
from .token import list_dependencies
from ..actions.user_actions import UserActions
from ..actions.candidate_actions import CandidateActions
from ..models.canidadate_models import CandidateForm,CandidateResponse,CandidateFormUpdate
from ..utils.depends import depend_data

candidate_router = APIRouter()

async def create_image(image):
    file_name = f"{uuid.uuid4()}{os.path.splitext(image.filename)[1]}"
    file_path = os.path.join("uploads", file_name)

    with open(file_path, "wb") as buffer:
        contenido = await image.read()
        buffer.write(contenido)
        
    return file_path

@candidate_router.post("/create_candidate",status_code=status.HTTP_201_CREATED,dependencies=list_dependencies)
async def create_candidate(form_data: Annotated[CandidateForm,Depends()],data: depend_data) -> CandidateResponse:
    actions_user = UserActions()
    user_id = actions_user.validate_user_by_username(username=data["username"])
    if not user_id:
        raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED,detail="User not Exists")
    
    actions = CandidateActions()
    candidate_exists = actions.get_candidate_by_starname(starname=form_data.candidate.starname)
    if candidate_exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Starname already exists")

    candidate = actions.create_candidate(candidate=form_data.candidate,user_id=user_id)
    
    if not candidate:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Candidate not created")
    
    
    file_path = await create_image(form_data.image)
    actions.assign_image(image_url=file_path,id=candidate.id)
    candidate.image_url = file_path

    return JSONResponse(content=candidate.model_dump(),status_code=status.HTTP_201_CREATED)

@candidate_router.get("/get_candidates",status_code=status.HTTP_200_OK)
def get_candidates() -> List[CandidateResponse]:
    actions = CandidateActions()
    candidates = actions.get_candidates()
    return JSONResponse(content=[candidate.model_dump() for candidate in candidates],
                        status_code=status.HTTP_200_OK)
    
@candidate_router.put("/update_candidate",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
async def update_candidate(form_data: Annotated[CandidateFormUpdate,Depends()]) -> CandidateResponse:
    actions = CandidateActions()
    candidate_exists = actions.get_candidate_by_starname(starname=form_data.candidate.starname)
    if candidate_exists and candidate_exists.id!=form_data.id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Starname already exists")

    path_image = actions.get_candidate(id=form_data.id).image_url
    candidate = actions.update_candidate(id=form_data.id,candidate=form_data.candidate)
    if form_data.image:
        if os.path.exists(path_image):
            try:
                os.remove(path_image)
            except Exception as e:
                print(f"Error al borrar: {e}")
        file_path = await create_image(form_data.image)
        actions.assign_image(image_url=file_path,id=candidate.id)
        candidate.image_url = file_path
        
    if not candidate:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error updating candidate")
    return JSONResponse(content=candidate.model_dump(),
                        status_code=status.HTTP_200_OK)

@candidate_router.delete("/delete_candidate/{id}",status_code=status.HTTP_200_OK,dependencies=list_dependencies)
def delete_candidate(data: depend_data,id: int = Path(gt=0)) -> JSONResponse:
    if data["rol"]!="ADMIN":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Unauthorized")
    actions = CandidateActions()
    candidate = actions.delete_candidate(id=id)
    if not candidate:
        return JSONResponse(content={"message":"Candidate not found"},
                            status_code=status.HTTP_404_NOT_FOUND)
    return JSONResponse(content={"message":"Candidate deleted"},
                        status_code=status.HTTP_200_OK)
    
    
@candidate_router.get("/get_candidate_by_id/{id}",status_code=status.HTTP_200_OK)
def get_candidate_by_id(id: int = Path(gt=0)) -> CandidateResponse:
    actions = CandidateActions()
    candidate = actions.get_candidate(id=id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Candidate not Found")
    
    return JSONResponse(content=candidate.model_dump(),status_code=status.HTTP_200_OK)

@candidate_router.get("/get_candidates_filter/{text_filter}",status_code=status.HTTP_200_OK)
def get_candidates_filter(text_filter: str = Path()) -> List[CandidateResponse]:
    actions = CandidateActions()
    
    candidates = actions.get_candidates_filter(text_filter)
    candidates = [] if not candidates else candidates
    
    return JSONResponse(content=[c.model_dump() for c in candidates],status_code=status.HTTP_200_OK)
    