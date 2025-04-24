import React, { useState, useCallback } from 'react';
import NavBar from '../components/NavBar';
import './Agent.css';
import ProcessingSimulator from '../components/ProcessingSimulator';

function Agent() {
  const [showForm, setShowForm] = useState(false);
  const [sortOption, setSortOption] = useState('time');
  const [agents, setAgents] = useState([]);
  const [showProcessing, setShowProcessing] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [simulatorImage, setSimulatorImage] = useState(null);
  const [currentAgent, setCurrentAgent] = useState({
    name: '',
    description: '',
    role: 'sales',
    knowledge: null,
    knowledgeFileName: ''
  });

  const handleKnowledgeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file is a Word document
      if (file.type === 'application/msword' || 
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setCurrentAgent(prev => ({
          ...prev,
          knowledge: file,
          knowledgeFileName: file.name
        }));
      } else {
        alert('Please upload a Word document (.doc or .docx)');
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
        setShowProcessing(true);
      } else if (isProcessingComplete) {
        const agentToSave = {
          ...currentAgent,
          image: simulatorImage // Save the simulator image
        };
        
        setAgents(prev => [...prev, agentToSave]);
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
  }, [currentAgent, showProcessing, isProcessingComplete, simulatorImage]);

  return (
    <div className="main-container">
      <NavBar />
      <div className="main-content">
        <div className="agent-container">
          <div className="agent-list">
            <div className="filter-section">
              <div className="sort-options">
                <label>
                  <input
                    type="radio"
                    name="sort"
                    value="time"
                    checked={sortOption === 'time'}
                    onChange={(e) => setSortOption(e.target.value)}
                  />
                  Time
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

            {agents.map((agent, index) => (
              <div key={index} className="agent-item" onClick={() => setShowForm(true)}>
                {agent.image && (
                  <img src={agent.image} alt={agent.name} className="agent-thumbnail" />
                )}
                <div className="agent-info">
                  <span className="agent-name">{agent.name}</span>
                  <span className="agent-role">{agent.role}</span>
                  {agent.knowledgeFileName && (
                    <span className="agent-knowledge">Doc: {agent.knowledgeFileName}</span>
                  )}
                </div>
              </div>
            ))}
            <div className="add-agent-bar" onClick={() => setShowForm(true)}>
              <span className="add-icon">+</span>
              <span>Add New Agent</span>
            </div>
          </div>

          {showForm && (
            <div className="agent-form">
              <div className="form-group">
                <label>Name:</label>
                <input 
                  type="text" 
                  value={currentAgent.name}
                  onChange={(e) => setCurrentAgent(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input 
                  type="text"
                  value={currentAgent.description}
                  onChange={(e) => setCurrentAgent(prev => ({...prev, description: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <div className="role-options">
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="sales"
                      checked={currentAgent.role === 'sales'}
                      onChange={(e) => setCurrentAgent(prev => ({...prev, role: e.target.value}))}
                    />
                    Sales
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="customer service"
                      checked={currentAgent.role === 'customer service'}
                      onChange={(e) => setCurrentAgent(prev => ({...prev, role: e.target.value}))}
                    />
                    Customer Service
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
              <div className="form-group">
                <label>Knowledge (Word Document):</label>
                <div className="file-upload-container">
                  <input 
                    type="file"
                    accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleKnowledgeUpload}
                    className="file-input"
                  />
                  {currentAgent.knowledgeFileName && (
                    <div className="file-name">
                      Selected file: {currentAgent.knowledgeFileName}
                    </div>
                  )}
                </div>
              </div>

              {showProcessing && (
                <div className="processing-section">
                  <ProcessingSimulator 
                    variant="training" 
                    onComplete={handleProcessingComplete}
                    onImageReady={handleSimulatorImage}
                  />
                </div>
              )}

              <button className="save-button" onClick={handleSubmit}>
                {!showProcessing ? 'Submit' : (isProcessingComplete ? 'Save' : 'Submit')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Agent;
