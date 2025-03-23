import uuid
import os

async def create_image(image):
    file_name = f"{uuid.uuid4()}{os.path.splitext(image.filename)[1]}"
    file_path = os.path.join("uploads", file_name)

    with open(file_path, "wb") as buffer:
        contenido = await image.read()
        buffer.write(contenido)
        
    return file_path