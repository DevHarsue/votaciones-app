from fastapi import Request,Depends
from typing import Annotated

def get_data(request: Request) -> dict:
    return request.state.data

depend_data = Annotated[dict,Depends(get_data)]