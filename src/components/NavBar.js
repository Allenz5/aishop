import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace('/', '') || 'main';

  const handleButtonClick = (buttonName) => {
    const path = buttonName.toLowerCase();
    navigate(`/${path}`);
  };

  return (
    <div className="top-bars">
      <div className="logo-bar">
        <div className="logo-placeholder"></div>
      </div>
      <div className="nav-bar">
        <div className="nav-buttons">
          <button 
            className={currentPath === 'main' ? 'active' : ''} 
            onClick={() => handleButtonClick('main')}
          >
            Main
          </button>
          <button 
            className={currentPath === 'space' ? 'active' : ''} 
            onClick={() => handleButtonClick('space')}
          >
            Space
          </button>
          <button 
            className={currentPath === 'product' ? 'active' : ''} 
            onClick={() => handleButtonClick('product')}
          >
            Product
          </button>
          <button 
            className={currentPath === 'agent' ? 'active' : ''} 
            onClick={() => handleButtonClick('agent')}
          >
            Agent
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
