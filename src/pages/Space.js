import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ProcessingSimulator from '../components/ProcessingSimulator';
// Import the images directly
import logoImage from '../components/Images/logo.png';
import img1 from '../components/Images/img1.jpg';
import img2 from '../components/Images/img2.jpg';
import img3 from '../components/Images/img3.jpg';
import './Space.css';

function Space() {
  const navigate = useNavigate();
  // Use the imported images
  const defaultLogoPath = logoImage;
  const defaultReferenceImages = [
    img1,
    img2,
    img3
  ];
  
  // Create immediate previews with actual images
  const [logo, setLogo] = useState(defaultLogoPath);
  const [logoName, setLogoName] = useState('logo.png');
  const [logoPreview, setLogoPreview] = useState(defaultLogoPath);
  const [referenceImages, setReferenceImages] = useState(defaultReferenceImages);
  const [imageNames, setImageNames] = useState(['img1.jpg', 'img2.jpg', 'img3.jpg']);
  const [referencePreviews, setReferencePreviews] = useState(defaultReferenceImages);
  const [showProcessing, setShowProcessing] = useState(false);
  const [brandName, setBrandName] = useState('Angry Miao');
  const [description, setDescription] = useState('Angry Miao is a design-forward tech brand founded in 2019, known for crafting high-end mechanical keyboards, audio gear, and gaming peripherals that blend futuristic aesthetics with cutting-edge engineering. Positioning itself as a "Future Art Community," the brand emphasizes community-driven innovation and limited-edition releases that push the boundaries of form and function.');
  const [visualStyle, setVisualStyle] = useState('Futuristic, Artistic, Luxurious');

  // Update useEffect to log the images that are being used
  // Check if store has already been generated
  useEffect(() => {
    const storeGenerated = localStorage.getItem('storeGenerated');
    if (storeGenerated === 'true') {
      // If coming back to this page and store was already generated
      // You could potentially navigate to main or show different content
      console.log('Store was already generated');
    }
  }, [navigate]);

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferenceImages = (event) => {
    const files = Array.from(event.target.files);
    const newNames = files.map(file => file.name);
    setImageNames(prev => [...prev, ...newNames]);
    
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setReferenceImages(prev => [...prev, ...newPreviews]);
          setReferencePreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    setShowProcessing(true);
    // Store that the user has started generating a store
    localStorage.setItem('storeGenerationStarted', 'true');
  };

  const clearLogo = () => {
    setLogo(defaultLogoPath);
    setLogoPreview(defaultLogoPath);
    setLogoName('logo.png');
  };

  const clearImages = () => {
    setReferenceImages(defaultReferenceImages);
    setReferencePreviews(defaultReferenceImages);
    setImageNames(['img1.jpg', 'img2.jpg', 'img3.jpg']);
  };

  return (
    <div className="main-container">
      <NavBar />
      <div className="main-content">
        <div className="space-container">
          <h2 className="container-title">CUSTOMIZE YOUR VIRTUAL STORE</h2>

          <div className="form-group">
            <label>BRAND NAME</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Your brand name" 
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>BRAND DESCRIPTION</label>
            <textarea 
              className="input-field textarea" 
              placeholder="Provide a brief description of your brand and what makes it unique..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>VISUAL STYLE (OPTIONAL)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Minimalist, Vibrant, Luxury, etc."
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
            />
          </div>

          <div className="divider"><span>BRAND ASSETS</span></div>

          <div className="form-group">
            <label>LOGO UPLOAD</label>
            <div className="upload-section">
              <div className="file-input-container">
                <label className="file-input-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  SELECT LOGO
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    className="file-input"
                  />
                </label>
                {logoName && <span className="file-name">{logoName}</span>}
              </div>
              
              {logoPreview && (
                <div className="image-preview">
                  <img src={logoPreview} alt="Logo preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>REFERENCE IMAGES (OPTIONAL)</label>
            <div className="upload-section">
              <div className="file-input-container">
                <label className="file-input-label">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  SELECT IMAGES
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleReferenceImages}
                    className="file-input"
                  />
                </label>
                {imageNames.length > 0 && (
                  <span className="file-name">
                    {imageNames.length} {imageNames.length === 1 ? 'file' : 'files'} selected
                  </span>
                )}
              </div>
              
              {referencePreviews.length > 0 && (
                <>
                  <div className="image-grid">
                    {referencePreviews.map((image, index) => (
                      <div key={index} className="image-preview">
                        <img 
                          src={image} 
                          alt={`Reference image ${index + 1}`} 
                          style={{objectFit: 'contain'}}
                        />
                      </div>
                    ))}
                  </div>
                  <button 
                    className="btn-outline" 
                    onClick={clearImages} 
                    style={{marginTop: '16px'}}
                  >
                    RESET IMAGES
                  </button>
                </>
              )}
            </div>
          </div>

          <button className="submit-button" onClick={handleSubmit}>GENERATE STORE SPACE</button>
          
          {showProcessing && (
            <div className="processing-simulator-container">
              <ProcessingSimulator variant="creative" />
            </div>
          )}

          <div className="bottom-spacer"></div>
        </div>
      </div>
    </div>
  );
}

export default Space;