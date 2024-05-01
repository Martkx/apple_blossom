from fastapi import FastAPI, UploadFile
import model_container.model_execution as model_execution
from typing import Any
import os


FILE_PATHS: list = []
app = FastAPI()


@app.get("/")
def reed_root():
    return {"message": "Model API"}


@app.post("/uploadfile")
async def create_upload_file(file: UploadFile) -> dict[str, Any]:
    """API-Endpoint to upload a file

    Args:
        file (UploadFile): file uploaded in a request

    Returns:
        dict[str, Any]: information about the upload status
    """
    try:
        file_path = f"model_container/images/{file.filename}"
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        FILE_PATHS.append(file_path)
        return {"message": "File saved successfully"}

    except Exception as e:
        return {"message": e.args, "path": file_path}


@app.get("/prediction")
def get_prediction() -> dict[str, Any]:
    """API-Endpoint to get a prediction
    Returns:
        dict[str, Any]: prediction
    """
    try:
        model = model_execution.load_model()
        img_array = model_execution.load_and_convert_image(FILE_PATHS[-1], 8, 8)
        result = model_execution.predict(model, img_array)

        return {"result": result}

    except Exception as e:
        return {"message": e.args, "Path": str(os.getcwd)}
