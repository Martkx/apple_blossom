import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing import image
from lime import lime_image
from skimage.segmentation import mark_boundaries
from typing import Any
import numpy as np


def create_lime(model:Any, image_array: np.ndarray, path_input_image: str, image_size: tuple):
    """This function creates a lime explanation as plot and saves it.

    Args:
        model (Any): keras model
        image_array (np.ndarray): vonverted image as array
        path_input_image (str): path of the saved image
        image_size (tuple): target size in pixel

    Returns:
        None
    """
    
    # LIME Erklärung erzeugen
    explainer = lime_image.LimeImageExplainer()
    explanation = explainer.explain_instance(
        image_array[0].astype('double'), 
        model.predict, 
        top_labels=1, 
        hide_color=0, 
        num_samples=250
    )

    # Darstellung der LIME Erklärung
    temp, mask = explanation.get_image_and_mask(
        explanation.top_labels[0], 
        positive_only=True, 
        num_features=10, 
        hide_rest=False
    )

    plt.figure(figsize=(10, 5))

    # Originalbild
    plt.subplot(1, 2, 1)
    plt.imshow(image.load_img(path_input_image, target_size=image_size))
    plt.title('Original Bild')

    # LIME Bild
    plt.subplot(1, 2, 2)
    plt.imshow(mark_boundaries(temp, mask, color=(165,255,0)))
    plt.title('LIME Erklärung')

    plt.savefig("ki_model/images/lime/lime_image.jpg", bbox_inches="tight")