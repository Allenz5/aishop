import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import favicon from '../components/Images/favicon.png'

function Login() {
  const navigate = useNavigate();
  const [resumeId, setResumeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    document.title = "Storia";
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = favicon; // Place the icon in `public/`
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = favicon;
      document.head.appendChild(newLink);
    }
  }, []); 
  
  const handleSiteUrlChange = (e) => {
    setSiteUrl(e.target.value);
  };

  const handleNavigation = (fromScratch) => {
    localStorage.setItem('isExistingStore', 'false');
    if (!fromScratch) {
      // Start loading process for site conversion
      setIsLoading(true);
      
      // Navigate after 7 seconds
      setTimeout(() => {
        setIsLoading(false);
        navigate('/main', { state: { fromScratch, convertedUrl: siteUrl } });
      }, 7000);
    } else {
      // For "Start from Scratch", navigate immediately
      navigate('/main', { state: { fromScratch } });
    }
  };

  const handleResume = () => {
    // Set localStorage flag to indicate this is an existing store
    localStorage.setItem('isExistingStore', 'true');
    
    // Navigate to main with resumeId and fromScratch: false
    navigate('/main', { state: { resumeId, fromScratch: false } });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-brand">STORIA BUILDER</h1>
        <p className="login-tagline">e-commerce comes alive.</p>

        <input
          type="text"
          placeholder="https://yourstore.com"
          className="login-input"
          value={siteUrl}
          onChange={handleSiteUrlChange}
        />
        <button
          className={`btn-primary ${isLoading ? 'loading' : ''}`}
          onClick={() => handleNavigation(false)}
          disabled={isLoading}
        >
          {isLoading ? 'Converting...' : '↳ Convert Site'}
        </button>

        <div className="divider"><span>or</span></div>

        <button
          className="btn-outline"
          onClick={() => handleNavigation(true)}
          disabled={isLoading}
        >
          Start from Scratch
        </button>

        <div className="divider"><span>or</span></div>

        <div className="resume-container">
          <input
            type="text"
            placeholder="Enter your page ID"
            className="login-input"
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
          />
          <button 
            className="btn-outline" 
            onClick={handleResume}
            disabled={isLoading}
          >
            Open Existing Store
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;