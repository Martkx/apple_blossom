import keras
import tensorflow as tf
import numpy as np
from typing import Any
import json

# mapping for BBCH-Stage
map_bbch = {
    0: 53,
    1: 54,
    2: 56,
    3: 57,
    4: 59,
    5: 61,
    6: 65,
    7: 67,
    8: 69,
    9: 71,
}
# informations aboout BBCH-stages
with open("/code/ki_model/BBCH_informations.json", "r") as file:
    bbch_informations = json.load(file)


def load_model():
    return keras.saving.load_model(
        "ki_model/2.model_developing/model_mobileNet_apples.keras"
    )


def load_and_convert_image(
    img_path: str, img_height: int, img_width: int
) -> np.ndarray:
    """This function loads a image and converted it into a np.ndarray
    Args:
        img_path (str): image location
        img_height (int): number of pixel height
        img_width (int): number of pixel width

    Returns:
        np.ndarray: converted image-array
    """

    img = tf.keras.utils.load_img(
        img_path, target_size=(img_height, img_width), color_mode="rgb"
    )
    img_array = tf.keras.utils.img_to_array(img)
    # img_array = img_array.reshape((-1, img_height*img_width))
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.mobilenet.preprocess_input(img_array)

    return img_array


def predict(model: Any, img_array: np.ndarray) -> tuple[int, str, int, str]:
    """This function crates a prediction of a given np.ndarray

    Args:
        model (Any): ML model
        img_array (_type_): converted image_array

    Returns:
        tuple containing

        - bbch_class (int): class number
        - probability (str): probability of the class
        - bbch_name (str): name of the class
        - bbch_definition (str): definition of the class
    """
    pred = model.predict(img_array)

    score = tf.nn.softmax(pred[0])
    predicted_class = int([np.argmax(score)][0])
    probability = round(float(score[predicted_class]) * 100, 2)

    bbch_class = map_bbch[predicted_class]
    bbch_name = bbch_informations[str(bbch_class)]["name"]
    bbch_definition = bbch_informations[str(bbch_class)]["definition"]

    return bbch_class, f"{probability} %", bbch_name, bbch_definition
