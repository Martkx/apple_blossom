from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import ki_model.model_execution as model_execution
from typing import Any
from fastapi.responses import FileResponse
import ki_model.explainable_ai.explanation_gradcam as gradcam
import ki_model.explainable_ai.explanation_shap as shap
import ki_model.explainable_ai.explanation_lime as lime

FILE_PATHS: list = []
app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:8070",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    # Allows CORS requests from these origins
    allow_origins=origins,
    allow_credentials=True,
    # Allows all HTTP methods
    allow_methods=["*"],
    # Allows all HTTP headers
    allow_headers=["*"],
)

model = model_execution.load_model()


@app.get("/")
async def read_root():
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
        file_path = f"ki_model/images/uploads/{file.filename}"
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        FILE_PATHS.append(file_path)
        return {"message": "File saved successfully"}

    except Exception as e:
        return {"message": e.args}


@app.get("/prediction")
async def get_prediction() -> dict[str, Any]:
    """API-Endpoint to get a prediction
    Returns:
        dict[str, Any]: prediction
    """
    try:
        img_array = model_execution.load_and_convert_image(FILE_PATHS[-1], 224, 224)
        predicted_class, probability, bbch_name, bbch_defintion = (
            model_execution.predict(model, img_array)
        )

    except Exception as e:
        return {"message": e}

    else:
        return {
            "predicted_class": predicted_class,
            "probability": probability,
            "name": bbch_name,
            "definition": bbch_defintion,
        }


@app.get("/gradcam")
async def get_gradcam():
    """API-Endpoint to get a gradcam image for the prediction
    Returns:
        .jpg
    """
    img_path_save = "ki_model/images/grad_cam/grad_cam.jpg"
    last_conv_layer_name = "conv_pw_13_relu"
    img_size = (224, 224)
    try:
        img_array = gradcam.get_img_array(
            img_path_gradcam=FILE_PATHS[-1], img_size_gradcam=img_size
        )
        heatmap = gradcam.make_gradcam_heatmap(img_array, model, last_conv_layer_name)
        gradcam.save_gradcam(img_path=FILE_PATHS[-1], heatmap=heatmap)
        return FileResponse(
            img_path_save, media_type="image/jpg", filename="grad_cam.png"
        )
    except Exception as e:
        return {"message": e.args}

@app.get("/shap")   
async def get_shap():
    """API-Endpoint to get a shap image for the prediction
    Returns:
        .jpg
    """
    img_path_save = "ki_model/images/shap/shap_image.jpg"
    img_size = (224, 224)
    try:
        img_array = gradcam.get_img_array(
            img_path_gradcam=FILE_PATHS[-1], img_size_gradcam=img_size
        )
        shap.create_shap(model,img_array)
        return FileResponse(
            img_path_save, media_type="image/jpeg", filename="shap_image.jpg"
        )
    except Exception as e:
        return {"message": e.args}
    

@app.get("/lime")   
async def get_lime():
    """API-Endpoint to get a lime image for the prediction
    Returns:
        .jpg
    """
    img_path_save = "ki_model/images/lime/lime_image.jpg"
    img_size = (224, 224)
    try:
        img_array = gradcam.get_img_array(
            img_path_gradcam=FILE_PATHS[-1], img_size_gradcam=img_size
        )
        lime.create_lime(model, img_array, FILE_PATHS[-1], img_size)
        return FileResponse(
            img_path_save, media_type="image/jpeg", filename="lime_image.jpg"
        )
    except Exception as e:
        return {"message": e.args}
    
