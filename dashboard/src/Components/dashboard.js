
import './dashboard.css';
import Chatbot from './chatbot/chatbot.js';
import React, { useState, useRef } from 'react';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function Dashboard() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [setCopied] = useState(false);
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

  const [isOpen,setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };
  const copyText = (stage) => {
    const textToCopy = `What is ${stage} of an apple blossom?`
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });}

  // Beispiel für einen stage-Wert. Dies sollte in deiner tatsächlichen Implementierung dynamisch sein.
  const stage = "BBCH 59";
  const probability ="94%"

  return (
    <div>{isOpen && (
      <div className='disclaimer'>
        <div className='icon'>
          <button onClick={handleClose}>x</button>
     </div> 
      <p >DISCLAIMER: Only the BBCH stages from 57 to 71 can be detected</p>
          
        </div>)}
      <div className='container'>
      <div className='card'>
        <h3>Upload your File</h3>
        <div
          className={`drag-area ${dragging ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {file && <><img src={URL.createObjectURL(file)} alt="uploaded" style={{ width: 'auto', maxHeight: '80%', }}/>
                      <button className='removeButton' onClick={handleRemoveImage}>Remove</button></>} 
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
        <h3>BBCH stage</h3>
        <div className='container'><div className='prediction'><h4>The model predict: </h4><div className='stage'>{stage}<div
                            className="copy-icon"
                            onClick={() => copyText(stage)}>
                            <FontAwesomeIcon icon={faCopy} /></div></div></div>
                            <div className='probability'><h4>With a probalitiy of</h4><div className='stage'>{probability}</div>
                            </div>
              </div><img className='xai' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToHTRBgbXSF4IvRcDAVXoPgFbUEDs9caSlClkgmBxY4w&s' alt='heatmap'/>
              </div>
      </div><div className='card' ><Chatbot/></div>
    </div>
  );
}

export default Dashboard;



  