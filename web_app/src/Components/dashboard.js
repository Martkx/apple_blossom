import './dashboard.css';
import Chatbot from './chatbot/chatbot.js';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Dashboard() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [setCopied] = useState(false);
  const [predictedClass, setPredictedClass] = useState(null);
  const [probability, setProbability] = useState(null);
  const [gradCamImage, setGradCamImage] = useState(null); 
  const [shapImage, setShapImage] = useState(null); 
  const [limeImage, setLimeImage] = useState(null); 
  const [bbchName, setBbchName] = useState(null);
  const [bbchDefinition, setBbchDefinition] = useState(null);
  const [activeTab, setActiveTab] = useState('gradCam');
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    // upload image
    try {
      const response = await axios.post('http://localhost:8080/uploadfile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    // get prediction
    try {
      const response = await axios.get('http://localhost:8080/prediction');
      console.log('Prediction response:', response.data.predicted_class);
      // update variables
      setBbchName(response.data.name)
      setPredictedClass(response.data.predicted_class); 
      setProbability(response.data.probability)
      setBbchDefinition(
        `BBCH ${response.data.predicted_class} ist das Stadium: "${response.data.name}". 
        ${response.data.definition}`);
    } catch (error) {
      console.error('Error getting prediction:', error);
    }

    // get grad_cam image
    try {
      const response = await axios.get('http://localhost:8080/gradcam', { responseType: 'blob' });
      console.log('Grad-CAM response:', response);
      const imageUrl = URL.createObjectURL(response.data);
      setGradCamImage(imageUrl); 
    } catch (error) {
      console.error('Error getting Grad-CAM image:', error);
    }
    // get shap_image
    try {
      const response = await axios.get('http://localhost:8080/shap', { responseType: 'blob' });
      console.log('Shap response:', response);
      const imageUrl = URL.createObjectURL(response.data);
      setShapImage(imageUrl); 
    } catch (error) {
      console.error('Error getting Shap image:', error);
    }
    // get lime_image
    try {
      const response = await axios.get('http://localhost:8080/lime', { responseType: 'blob' });
      console.log('Shap response:', response);
      const imageUrl = URL.createObjectURL(response.data);
      setLimeImage(imageUrl); 
    } catch (error) {
      console.error('Error getting Shap image:', error);
    }
  };

  const copyText = (stage) => {
    const textToCopy = `What is ${stage} of an apple blossom?`
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000); 
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  }


  return (
    <div>
      {isOpen && (
        <div className='disclaimer'>
          <div className='icon'>
            <button onClick={handleClose}>x</button>
          </div>
          <p>DISCLAIMER: Es können nur die BBCH-Stufen von 53 bis 71 erkannt werden</p>
        </div>
      )}
      <div className='container'>
        <div className='card'>
          <h3>Laden Sie Ihr Bild hoch</h3>
          <div
            className={`drag-area ${dragging ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file && (
              <>
                <img src={URL.createObjectURL(file)} alt="uploaded" style={{ width: 'auto', maxHeight: '80%' }} />
                <button className='removeButton' onClick={handleRemoveImage}>Entfernen</button>
                <button onClick={handleFileUpload}>Prädiktion</button>
              </>
            )}
            {!file && (
              <>
                <div className='header'>Drag & Drop um ein Bild hoch zuladen</div>
                <button onClick={() => inputRef.current.click()}>Oder klicken Sie um ein Bild auszuwählen</button>
                <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} style={{ display: 'none' }} />
              </>
            )}
          </div>
        </div>
        <div className='card'>
          <h3>Ergebnis</h3>
          <div className='result-container'>
              <div className='predicted_class'><h4>Das Modell sagt das BBCH-Stadium voraus:</h4>
                  <div className='stage'>{predictedClass && ` ${predictedClass}`}</div>
              </div>
          </div>
          <div className='defintion'>
            <h3>Definition</h3>
            {bbchDefinition && ` ${bbchDefinition}`}
          </div>
          <div className='grad_cam'>
            <h3>XAI</h3>
            <div className="tab-buttons">
              <button className={activeTab === 'lime' ? 'active' : ''} onClick={() => setActiveTab('lime')}>LIME</button>
              <button className={activeTab === 'gradCam' ? 'active' : ''} onClick={() => setActiveTab('gradCam')}>GradCam</button>
              <button className={activeTab === 'shap' ? 'active' : ''} onClick={() => setActiveTab('shap')}>SHAP</button>
              
            </div>
          <div className="tab-content">
          {activeTab === 'lime' && limeImage && (
              <img src={limeImage} alt="LIME" style={{ width: '100%', maxHeight: '400px', marginTop: '10px' }} />
            )}
            {activeTab === 'gradCam' && gradCamImage && (
            <img src={gradCamImage} alt="GradCam" style={{ width: '100%', maxHeight: '400px', marginTop: '10px' }} />
            )}
            {activeTab === 'shap' &&  shapImage && (
              <img src={shapImage} alt="SHAP" style={{ width: '100%', maxHeight: '400px', marginTop: '10px' }} />
            )}
          </div>
          </div>
        </div>
      </div>
      <div className='card'>
        <Chatbot />
      </div>
    </div>
  );
}

export default Dashboard;
