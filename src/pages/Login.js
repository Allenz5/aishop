import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/main');
  };

  return (
    <div className="login-container">
      <div className="left-section">
        {/* Image placeholder */}
      </div>
      <div className="right-section">
        <div className="login-content">
          <p className="start-text">Start with existing website</p>
          <input 
            type="text" 
            placeholder="Enter website URL" 
            className="url-input"
          />
          <button onClick={handleNavigation}>Go</button>
          <div className="separator">
            <span>or</span>
          </div>
          <button onClick={handleNavigation}>Start from scratch</button>
        </div>
      </div>
    </div>
  );
}

export default Login; 