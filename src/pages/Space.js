import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import ProcessingSimulator from '../components/ProcessingSimulator';
import './Space.css';

function Space() {
  const [logo, setLogo] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [showProcessing, setShowProcessing] = useState(false);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImages = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    setShowProcessing(true);
  };

  return (
    <div className="main-container">
      <NavBar />
      <div className="main-content">
        <div className="space-container">
          <div className="form-group">
            <label>Brand Name:</label>
            <input type="text" className="input-field" />
          </div>

          <div className="form-group">
            <label>Brief Intro:</label>
            <textarea className="input-field textarea" />
          </div>

          <div className="form-group">
            <label>Visual Style:</label>
            <input type="text" className="input-field" />
          </div>

          <div className="form-group">
            <label>Logo:</label>
            <div className="upload-section">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoUpload}
                className="file-input"
              />
              {logo && (
                <div className="image-preview">
                  <img src={logo} alt="Logo preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Additional Images:</label>
            <div className="upload-section">
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleAdditionalImages}
                className="file-input"
              />
              <div className="image-grid">
                {additionalImages.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image} alt={`Additional image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="submit-button" onClick={handleSubmit}>Submit</button>
          
          {showProcessing && <ProcessingSimulator variant="creative" />}
        </div>
      </div>
    </div>
  );
}

export default Space;
