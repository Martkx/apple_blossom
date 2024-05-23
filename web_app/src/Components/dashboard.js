
import './dashboard.css';
import React, { useState, useRef } from 'react';
import axios from "axios"

function Dashboard() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleButtonClick = async () => {
    try {
      const response = await axios.get('https://model/uploadfile');
      console.log(response.data);
    } catch (error) {
      console.error('Error making the request', error);
    }
  };

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

  return (
    <div>
      <div className='card'>
        <h2 className='disclaimer'>Disclaimer: Only the BBCH stages from 57 to 71 can be detected</h2>
      </div>
      <div className='card'>
        <h2>Upload your File</h2>
        <div
          className={`drag-area ${dragging ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file && <><img src={URL.createObjectURL(file)} alt="uploaded" style={{ width: 'auto', maxHeight: '80%' }}/>
                      <button className='removeButton' onClick={handleRemoveImage}>Remove</button></>} 
          {!file && (
            <>
              <div className='header'>Drag & Drop to Upload File</div>
              <button onClick={() => {handleButtonClick(); inputRef.current.click()}}>Or click to select file</button>
              <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} style={{ display: 'none' }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;



  