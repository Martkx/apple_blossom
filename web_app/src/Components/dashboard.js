import './dashboard.css';
import Chatbot from './chatbot/chatbot.js';
import React, { useState, useRef } from 'react';
import axios from 'axios';

function Dashboard() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [gradCamImage, setGradCamImage] = useState(null); 
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
      console.log('Prediction response:', response.data.result);
      setPrediction(response.data.result); 
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
  };

  return (
    <div>
      {isOpen && (
        <div className='disclaimer'>
          <div className='icon'>
            <button onClick={handleClose}>x</button>
          </div>
          <p>DISCLAIMER: Only the BBCH stages from 57 to 71 can be detected</p>
        </div>
      )}
      <div className='container'>
        <div className='card'>
          <h3>Upload your File</h3>
          <div
            className={`drag-area ${dragging ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file && (
              <>
                <img src={URL.createObjectURL(file)} alt="uploaded" style={{ width: 'auto', maxHeight: '80%' }} />
                <button className='removeButton' onClick={handleRemoveImage}>Remove</button>
                <button onClick={handleFileUpload}>Prediction</button>
              </>
            )}
            {!file && (
              <>
                <div className='header'>Drag & Drop to Upload File</div>
                <button onClick={() => inputRef.current.click()}>Or click to select file</button>
                <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} style={{ display: 'none' }} />
              </>
            )}
          </div>
        </div>
        <div className='card'>
          <h3>
            BBCH stage: 
            {prediction && ` ${prediction}`}
          </h3>
          {gradCamImage && (
            <img src={gradCamImage} alt="Grad-CAM" style={{ width: '100%', maxHeight: '400px', marginTop: '10px' }} />
          )}
        </div>
      </div>
      <div className='card'>
        <Chatbot />
      </div>
    </div>
  );
}

export default Dashboard;
