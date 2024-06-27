import tensorflow as tf
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import matplotlib.pyplot as plt
from typing import Any
import cv2

model = tf.keras.models.load_model("ki_model/2.model_developing/model_mobileNet_apples.keras")

def get_img_array(img_path_gradcam:str, img_size_gradcam:tuple):
    """This function convert a image to a numpy array.
    Args:
        img_path_gradcam (str): path of the saved image
        img_size_gradcam (tuple): target size in pixel

    Returns:
        img_array (np.array): converted image as array
    """
    img_array = image.img_to_array(image.load_img(img_path_gradcam, target_size=img_size_gradcam))
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.mobilenet.preprocess_input(img_array)

    return img_array

def make_gradcam_heatmap(img_array:np.ndarray, model:Any, last_conv_layer_name:str, pred_index=None):
    """This function creates a np.ndarray for a grad cam image.

    Args:
        img_array (np.ndarray): converted image as array
        model (Any): keras model
        last_conv_layer_name (str): last layer in model
        pred_index (_type_, optional): set the pred_index to the highest predicted probability

    Returns:
        heatmap (np.ndarray): array
    """
    grad_model = tf.keras.models.Model(
        inputs=model.input, 
        outputs=[model.get_layer(last_conv_layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        last_conv_layer_output, preds = grad_model(img_array)
        if pred_index is None:
            pred_index = tf.argmax(preds[0])
        class_channel = preds[:, pred_index]

    grads = tape.gradient(class_channel, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1))

    last_conv_layer_output = last_conv_layer_output[0]
    heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    return heatmap.numpy()

def save_gradcam(img_path:str, heatmap:np.ndarray, alpha=0.4):
    """This function save the grad cam image .

    Args:
        img_path (str): path to the input image
        heatmap (np.ndarray): grad cam array
        alpha (float, optional): percentage of transparency
    """
    img = cv2.imread(img_path)
    # Umwandlung in RGB für matplotlib
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  

    # Debugging: Ausgabe der Heatmap
    plt.figure(figsize=(10, 10))
    plt.subplot(1, 3, 1)
    plt.imshow(img_rgb)
    plt.title("Original Bild")
    plt.axis('off')

    plt.subplot(1, 3, 2)
    plt.imshow(heatmap)
    plt.title("GradCam Heatmap")
    plt.axis('off')

    heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    superimposed_img = cv2.addWeighted(img, 1-alpha, heatmap, alpha, 0)
    # Umwandlung in RGB für matplotlib
    superimposed_img_rgb = cv2.cvtColor(superimposed_img, cv2.COLOR_BGR2RGB)  

    plt.subplot(1, 3, 3)
    plt.imshow(superimposed_img_rgb)
    plt.title("Überlagertes Bild")
    plt.axis('off')
    plt.savefig("ki_model/images/grad_cam/grad_cam.jpg", bbox_inches="tight")

