import React, { useState, useCallback, useEffect } from 'react';
import NavBar from '../components/NavBar';
import './Agent.css';
import ProcessingSimulator from '../components/ProcessingSimulator';
// Import the agent image
import agentImage from '../components/Images/agent.gif';
import favicon from '../components/Images/favicon.png'


function Agent() {
  const [showForm, setShowForm] = useState(false);
  const [sortOption, setSortOption] = useState('time');
  const [agents, setAgents] = useState([]);
  const [showProcessing, setShowProcessing] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [simulatorImage, setSimulatorImage] = useState(null);
  const [processingKey, setProcessingKey] = useState('initial');
  const [currentAgent, setCurrentAgent] = useState({
    name: '',
    description: '',
    role: 'sales',
    knowledge: null,
    knowledgeFileName: ''
  });

  // Add class to body when component mounts to prevent outer scrolling
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
    // Add the class when component mounts
    document.body.classList.add('agent-page-active');
    
    // Remove the class when component unmounts
    return () => {
      document.body.classList.remove('agent-page-active');
    };
  }, []);

  const handleKnowledgeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file is a text file or PDF
      if (file.type === 'text/plain' || 
          file.type === 'application/pdf') {
        setCurrentAgent(prev => ({
          ...prev,
          knowledge: file,
          knowledgeFileName: file.name
        }));
      } else {
        alert('Please upload a text file (.txt) or PDF (.pdf)');
      }
    }
  };

  const handleProcessingComplete = useCallback(() => {
    setIsProcessingComplete(true);
  }, []);

  const handleSimulatorImage = useCallback((imageUrl) => {
    setSimulatorImage(imageUrl);
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentAgent.name) {
      if (!showProcessing) {
        // Generate a unique key for the processing simulator to ensure it remounts
        setProcessingKey(`agent-sim-${Date.now()}`);
        setShowProcessing(true);
      } else if (isProcessingComplete) {
        const agentToSave = {
          ...currentAgent,
          image: agentImage // Use the imported agent.gif image
        };
        
        // Update agents state
        const updatedAgents = [...agents, agentToSave];
        setAgents(updatedAgents);
        
        // Store variables for Main page to react
        localStorage.setItem('agentsGenerated', 'true');
        localStorage.setItem('agentCount', updatedAgents.length.toString());
        
        setShowForm(false);
        setShowProcessing(false);
        setIsProcessingComplete(false);
        setSimulatorImage(null);
        setCurrentAgent({
          name: '',
          description: '',
          role: 'sales',
          knowledge: null,
          knowledgeFileName: ''
        });
      }
    }
  }, [currentAgent, showProcessing, isProcessingComplete, simulatorImage, agents]);

  // Function to handle closing the form
  const handleCloseForm = () => {
    setShowForm(false);
    setShowProcessing(false);
    setIsProcessingComplete(false);
    setCurrentAgent({
      name: '',
      description: '',
      role: 'sales',
      knowledge: null,
      knowledgeFileName: ''
    });
  };

  return (
    <div className="agent-page-container">
      <NavBar />
      <div className="agent-page-content">
        <div className="agent-container">
          <h2 className="agent-title">MANAGE YOUR AGENTS</h2>
          
          <div className="agent-filter-section">
            <div className="agent-sort-options">
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="time"
                  checked={sortOption === 'time'}
                  onChange={(e) => setSortOption(e.target.value)}
                />
                TIME
              </label>
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="az"
                  checked={sortOption === 'az'}
                  onChange={(e) => setSortOption(e.target.value)}
                />
                A-Z
              </label>
            </div>
          </div>

          <div className="agent-list">
            {agents.map((agent, index) => (
              <div key={index} className="agent-item" onClick={() => setShowForm(true)}>
                <img src={agentImage} alt={agent.name} className="agent-item-thumbnail" />
                <div className="agent-info">
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-role">{agent.role.toUpperCase()}</span>
                  {agent.knowledgeFileName && (
                    <span className="agent-knowledge-file">Doc: {agent.knowledgeFileName}</span>
                  )}
                </div>
              </div>
            ))}
            
            <div className="add-agent-bar" onClick={() => setShowForm(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>ADD NEW AGENT</span>
            </div>
          </div>

          {showForm && (
            <div className="agent-form">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 className="agent-form-title">AGENT DETAILS</h3>
                <button 
                  onClick={handleCloseForm}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div className="agent-form-group">
                <label>NAME</label>
                <input 
                  type="text" 
                  className="agent-input-field"
                  placeholder="Agent name"
                  value={currentAgent.name}
                  onChange={(e) => setCurrentAgent(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              
              <div className="agent-form-group">
                <label>DESCRIPTION</label>
                <input 
                  type="text" 
                  className="agent-input-field"
                  placeholder="Describe the agent's purpose"
                  value={currentAgent.description}
                  onChange={(e) => setCurrentAgent(prev => ({...prev, description: e.target.value}))}
                />
              </div>
              
              <div className="agent-form-group">
                <label>ROLE</label>
                <div className="agent-role-options">
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="sales"
                      checked={currentAgent.role === 'sales'}
                      onChange={(e) => setCurrentAgent(prev => ({...prev, role: e.target.value}))}
                    />
                    SALES
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="customer service"
                      checked={currentAgent.role === 'customer service'}
                      onChange={(e) => setCurrentAgent(prev => ({...prev, role: e.target.value}))}
                    />
                    CUSTOMER SERVICE
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="kol"
                      checked={currentAgent.role === 'kol'}
                      onChange={(e) => setCurrentAgent(prev => ({...prev, role: e.target.value}))}
                    />
                    KOL
                  </label>
                </div>
              </div>
              
              <div className="agent-divider"><span>UPLOAD DOCUMENT</span></div>
              
              <div className="agent-form-group">
                <label>KNOWLEDGE BASE</label>
                <div className="agent-upload-section">
                  <div className="agent-file-input-container">
                    <label className="agent-file-input-label">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      SELECT DOCUMENT
                      <input 
                        type="file"
                        accept=".txt,.pdf,text/plain,application/pdf"
                        onChange={handleKnowledgeUpload}
                        className="agent-file-input"
                      />
                    </label>
                    {currentAgent.knowledgeFileName && (
                      <div className="agent-file-name">
                        Selected file: {currentAgent.knowledgeFileName}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {showProcessing && (
                <div className="agent-processing-simulator">
                  {/* Using the stored key to ensure proper remounting */}
                  <ProcessingSimulator 
                    key={processingKey}
                    variant="training" 
                    onComplete={handleProcessingComplete}
                    onImageReady={handleSimulatorImage}
                    duration={1.68} // 168 seconds for agent training
                  />
                </div>
              )}

              <button className="agent-submit-button" onClick={handleSubmit}>
                {!showProcessing ? 'SUBMIT AGENT' : (isProcessingComplete ? 'SAVE AGENT' : 'SUBMIT AGENT')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Agent;