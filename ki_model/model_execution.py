import keras
import tensorflow as tf
import numpy as np 
from typing import Any

def load_model():
    return keras.saving.load_model("ki_model/2.model_developing/model_mobileNet_apples.keras")

def load_and_convert_image(img_path:str, img_height:int, img_width:int) -> np.ndarray:
    """This function loads a image and converted it into a np.ndarray
    Args:
        img_path (str): image location
        img_height (int): number of pixel height
        img_width (int): number of pixel width

    Returns:
        np.ndarray: converted image-array
    """
    
    img = tf.keras.utils.load_img(
        img_path, 
        target_size=(img_height, img_width),
        color_mode="rgb"
    )
    img_array = tf.keras.utils.img_to_array(img)
    #img_array = img_array.reshape((-1, img_height*img_width))
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.mobilenet.preprocess_input(img_array)
    
    return img_array

def predict(model:Any, img_array: np.ndarray) -> tuple[int,float]:
    """This function crates a prediction of a given np.ndarray

    Args:
        model (Any): ML model
        img_array (_type_): converted image_array

    Returns:
        int: predicted class
    """
    pred = model.predict(img_array)
 
    score = tf.nn.softmax(pred[0])
    predicted_class = int([np.argmax(score)][0])
    probability = round(float(score[predicted_class]),2)

    return predicted_class, probability