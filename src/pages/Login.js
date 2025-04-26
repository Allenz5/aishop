import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [resumeId, setResumeId] = useState('');

  const handleNavigation = (fromScratch) => {
    navigate('/main', { state: { fromScratch } });
  };

  const handleResume = () => {
    // You can later send resumeId to backend here
    navigate('/main', { state: { resumeId, fromScratch: false } });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-brand">VIRTUAL STORE</h1>
        <p className="login-tagline">Rebuild presence. Pixel by pixel.</p>

        <input
          type="text"
          placeholder="https://yourstore.com"
          className="login-input"
        />
        <button
          className="btn-primary"
          onClick={() => handleNavigation(false)}
        >
          ↳ Convert Site
        </button>

        <div className="divider"><span>or</span></div>

        <button
          className="btn-outline"
          onClick={() => handleNavigation(true)}
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
          <button className="btn-outline" onClick={handleResume}>
            Open Existing Store
          </button>

        </div>
      </div>
    </div>
  );
}

export default Login;
