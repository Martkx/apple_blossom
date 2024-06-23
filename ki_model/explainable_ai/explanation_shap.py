import shap
from matplotlib import pyplot as plt
from typing import Any
import numpy as np


def create_shap(model: Any, preprocessed_img_array: np.ndarray):
    """This function creates a shap explanation as plot and saves it.

    Args:
        model (Any): keras model
        preprocessed_img_array (np.ndarray): converted image as array

    Returns:
        None
    """

    # Definieren der Vorhersagefunktion
    def f(x):
        tmp = x.copy()
        return model(tmp)

    # Erstellen des SHAP Explainers mit Maskierung
    masker_blur = shap.maskers.Image("blur(32,32)", preprocessed_img_array[0].shape)
    explainer = shap.Explainer(f, masker_blur, output_names=list(range(10)))

    # Berechnen und Visualisieren der SHAP Werte
    ind = [0]  # Index des zu erklärenden Bildes
    shap_values_ = explainer(preprocessed_img_array[ind], max_evals=100, batch_size=20)
    
    # was für Bild hier erzeugt???
    shap.image_plot(shap_values_, labels=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], show=False)
    plt.savefig("ki_model/images/shap/shap_image.jpg", bbox_inches="tight")


