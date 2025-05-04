import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import './Main.css';
// Import agent image
import agentImage from '../components/Images/agent.gif';
// Import product images
import prod1Image from '../components/Images/prod1.png';
import prod2Image from '../components/Images/prod2.png';
import prod3Image from '../components/Images/prod3.png';
import prod4Image from '../components/Images/prod4.png';
import prod5Image from '../components/Images/prod5.png';
import prod6Image from '../components/Images/prod6.png';
import prod7Image from '../components/Images/prod7.png';
// Import video
import bgVideo from '../components/Images/bg.mp4';
import favicon from '../components/Images/favicon.png'


function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromScratch = location.state?.fromScratch || false;
  
  const [activeTab, setActiveTab] = useState('products');
  const [storeStatus, setStoreStatus] = useState(fromScratch ? 'new' : 'converting');
  
  // State for the agents and products
  const [agents, setAgents] = useState([]);
  const [products, setProducts] = useState([]);
  const [storeGenerated, setStoreGenerated] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [droppedItems, setDroppedItems] = useState([]);
  const [isPublishEnabled, setIsPublishEnabled] = useState(false);
  const [publishStatus, setPublishStatus] = useState('idle'); // 'idle', 'processing', 'published'
  const [publishedUrl, setPublishedUrl] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      name: 'StoreAI',
      time: 'Today',
      content: 'Welcome to your new virtual store! I\'m StoreAI, your all-in-one AI business assistant. I analyze your store\'s performance, provide actionable advice, remind you of important events, and much more.'
    },
    {
      id: 2,
      name: 'StoreAI',
      time: 'Today',
      content: 'Would you like me to show you how to set up your store?',
      actions: [
        { label: 'Yes, please', value: 'yes' },
        { label: 'I\'ll explore myself', value: 'no' }
      ]
    }
  ]);
  const dragImageRef = useRef(null);
  const virtualSpaceRef = useRef(null);

  // Function to handle AI button actions
  const handleAiAction = (messageId, actionValue) => {
    // Create a copy of the current messages
    const updatedMessages = [...aiMessages];
    
    // Find the message with actions and remove the actions
    const messageIndex = updatedMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      // Clone the messages and update the one with action
      const messagesCopy = [...updatedMessages];
      
      // Instead of removing actions, mark which one was selected
      if (!messagesCopy[messageIndex].selectedAction) {
        messagesCopy[messageIndex] = {
          ...messagesCopy[messageIndex],
          selectedAction: actionValue
        };
        
        // Update the state immediately to show the selected button
        setAiMessages(messagesCopy);
        
        // Add response after a slight delay
        setTimeout(() => {
          if (actionValue === 'yes') {
            // Add detailed instructions when "Yes, please" is clicked
            setAiMessages([
              ...messagesCopy,
              {
                id: Date.now(),
                name: 'StoreAI',
                time: 'Just now',
                content: 'Here\'s how to set up your store:\n\n' +
                  '• **Add Products**: Select the Products tab on the right and add your items\n\n' +
                  '• **Create AI Agent**: Switch to the Agents tab to configure your store assistant\n\n' +
                  '• **Design Your Space**: Drag and drop both products and agents into your virtual store area\n\n' +
                  '• **Go Live**: Once everything is set up, click the Publish button above\n\n' +
                  'After publishing, I\'ll help analyze customer behavior and provide optimization recommendations.'
              }
            ]);
          } else {
            // Just acknowledge when "I'll explore myself" is clicked
            setAiMessages([
              ...messagesCopy,
              {
                id: Date.now(),
                name: 'StoreAI',
                time: 'Just now',
                content: 'Sounds good! '
              }
            ]);
          }
        }, 800); // 800ms delay for natural feel
      }
    }
  };

  // Effects for handling drag image creation
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
    // Create a hidden div for the drag image
    const dragImage = document.createElement('div');
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    dragImage.style.left = '-1000px';
    dragImage.style.width = '200px';
    dragImage.style.height = '200px';
    dragImage.style.pointerEvents = 'none';
    dragImage.style.display = 'flex';
    dragImage.style.justifyContent = 'center';
    dragImage.style.alignItems = 'center';
    dragImage.style.overflow = 'visible';
    dragImage.id = 'custom-drag-image';
    document.body.appendChild(dragImage);
    dragImageRef.current = dragImage;

    return () => {
      // Clean up the element when component unmounts
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    };
  }, []);

  // Read localStorage variables when component mounts
  useEffect(() => {
    const storeGeneratedValue = localStorage.getItem('storeGenerated');
    const productsLoaded = localStorage.getItem('productsLoaded');
    const agentsGenerated = localStorage.getItem('agentsGenerated');
    
    console.log('storeGenerated:', storeGeneratedValue);
    console.log('productsLoaded:', productsLoaded);
    console.log('agentsGenerated:', agentsGenerated);
    
    // Set storeGenerated state
    setStoreGenerated(storeGeneratedValue === 'true');
    
    // Check if all conditions are met to enable publish button
    setIsPublishEnabled(
      storeGeneratedValue === 'true' && 
      productsLoaded === 'true' && 
      agentsGenerated === 'true'
    );
    
    // If agentsGenerated is true, load the Nyxbyte agent
    if (agentsGenerated === 'true') {
      // Create Nyxbyte agent
      const nyxbyteAgent = {
        name: 'Nyxbyte',
        description: 'AI sales assistant specialized in digital products',
        role: 'sales',
        knowledgeFileName: 'sales_manual.pdf',
        image: agentImage // Using the imported image
      };
      
      setAgents([nyxbyteAgent]);
    }
    
    // If productsLoaded is true, load the predefined products
    if (productsLoaded === 'true') {
      const predefinedProducts = [
        {
          name: 'Dry Studio PETBRICK 65',
          description: 'Premium mechanical keyboard',
          price: '159.00',
          link: 'https://example.com/petbrick65',
          images: [prod1Image]
        },
        {
          name: 'AM INFINITY MOUSE',
          description: 'Ergonomic gaming mouse',
          price: '129.00',
          link: 'https://example.com/infinity-mouse',
          images: [prod2Image]
        },
        {
          name: 'CYBERBOARD Novel Project',
          description: 'Limited edition mechanical keyboard',
          price: '748.00',
          link: 'https://example.com/cyberboard-novel',
          images: [prod3Image]
        },
        {
          name: 'CYBERBOARD R2',
          description: 'Advanced mechanical keyboard',
          price: '432.00',
          link: 'https://example.com/cyberboard-r2',
          images: [prod4Image]
        },
        {
          name: 'AM RGB 65',
          description: 'RGB backlit mechanical keyboard',
          price: '568.00',
          link: 'https://example.com/rgb-65',
          images: [prod5Image]
        },
        {
          name: 'AM AFA R2',
          description: 'Premium keyboard with aluminum frame',
          price: '646.00',
          link: 'https://example.com/afa-r2',
          images: [prod6Image]
        },
        {
          name: 'AM Emptiness Phone Case',
          description: 'Minimalist phone case',
          price: '25.99',
          link: 'https://example.com/emptiness-case',
          images: [prod7Image]
        }
      ];
      
      setProducts(predefinedProducts);
    }
  }, []);

  // Load saved positions from localStorage
  useEffect(() => {
    if (storeGenerated && virtualSpaceRef.current && (products.length > 0 || agents.length > 0)) {
      try {
        const positionsJson = localStorage.getItem('itemPositions');
        if (positionsJson) {
          const positions = JSON.parse(positionsJson);
          
          // Create array of items to add
          const itemsToAdd = [];
          
          // Virtual space dimensions - needed to convert relative to absolute
          const vsRef = virtualSpaceRef.current;
          const rect = vsRef.getBoundingClientRect();
          const width = rect.width;
          const height = rect.height;
          
          // Process each saved position
          Object.values(positions).forEach(pos => {
            // Convert relative position to absolute for this container
            const x = pos.relativeX * width;
            const y = pos.relativeY * height;
            
            // Find the item by name
            let item;
            if (pos.type === 'product') {
              item = products.find(p => p.name === pos.name);
            } else if (pos.type === 'agent') {
              item = agents.find(a => a.name === pos.name);
            }
            
            if (item) {
              itemsToAdd.push({
                id: `${pos.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: pos.type,
                name: pos.name,
                item,
                x,
                y,
                relativeX: pos.relativeX,
                relativeY: pos.relativeY
              });
            }
          });
          
          if (itemsToAdd.length > 0) {
            setDroppedItems(itemsToAdd);
            console.log('Loaded items from localStorage:', itemsToAdd);
          }
        }
      } catch (error) {
        console.error('Error loading positions from localStorage:', error);
      }
    }
  }, [storeGenerated, products, agents, virtualSpaceRef.current]);

  // Simulate store data loading
  useEffect(() => {
    if (storeStatus === 'converting') {
      const timer = setTimeout(() => {
        setStoreStatus('ready');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [storeStatus]);

  // Function to handle publish action
  const handlePublish = () => {
    // Set to processing state
    setPublishStatus('processing');
    console.log('Publishing virtual store...');
    
    // Simulate processing time
    setTimeout(() => {
      // Store published state in localStorage
      localStorage.setItem('storePublished', 'true');
      
      // Use a fixed code with letters and numbers - "jx518" 
      // "jx" for "吉祥" (ji xiang) meaning "auspicious/lucky"
      // "518" sounds like "我要发" (wo yao fa) meaning "I will prosper"
      const url = `http://localhost:3000/store/jx518`;
      setPublishedUrl(url);
      
      // Update status to published
      setPublishStatus('published');
    }, 3000); // 3 seconds processing time
  };

  // Function to handle drag start for products and agents
  const handleDragStart = (e, item, type) => {
    setIsDragging(true);
    
    // Set drag data
    e.dataTransfer.setData('text/plain', JSON.stringify({
      id: item.name,
      type: type
    }));
    
    // Create custom drag image
    const dragImage = dragImageRef.current;
    if (dragImage) {
      dragImage.innerHTML = '';
      
      const img = document.createElement('img');
      img.src = type === 'product' ? item.images[0] : agentImage;
      
      if (type === 'product') {
        // 2.1x size for products (50px * 2.1 = 105px)
        img.style.width = '105px';
        img.style.height = '105px';
      } else {
        // 3.0x size for agents (50px * 3.0 = 150px)
        img.style.width = '150px';
        img.style.height = '150px';
        img.style.objectFit = 'contain'; // Use contain instead of cover to avoid cropping
      }
      
      dragImage.appendChild(img);
      
      // Set the drag image with offset to center it with cursor
      e.dataTransfer.setDragImage(dragImage, 100, 100);
      
      // Set allowed effects
      e.dataTransfer.effectAllowed = 'copy';
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Save item position to localStorage
  const saveItemPositionToLocalStorage = (type, name, relativeX, relativeY) => {
    try {
      // Get existing positions or initialize empty object
      const positionsJson = localStorage.getItem('itemPositions') || '{}';
      const positions = JSON.parse(positionsJson);
      
      // Update with new position
      positions[`${type}-${name}`] = { 
        type, 
        name, 
        relativeX, 
        relativeY 
      };
      
      // Save back to localStorage
      localStorage.setItem('itemPositions', JSON.stringify(positions));
      console.log(`Saved position for ${type} ${name}: x=${relativeX.toFixed(4)}, y=${relativeY.toFixed(4)}`);
    } catch (error) {
      console.error('Error saving position to localStorage:', error);
    }
  };

  // Handle drop in the virtual space
  const handleDrop = (e) => {
    e.preventDefault();
    
    // Get drop coordinates relative to the drop zone
    const dropZone = e.currentTarget;
    const rect = dropZone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate relative positions (0 to 1)
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;
    
    // Get the dropped item data
    try {
      const dataString = e.dataTransfer.getData('text/plain');
      if (!dataString) {
        console.error('No data was transferred');
        return;
      }
      
      const data = JSON.parse(dataString);
      
      // Find the actual item from our state
      let droppedItem;
      if (data.type === 'product') {
        droppedItem = products.find(p => p.name === data.id);
      } else if (data.type === 'agent') {
        droppedItem = agents.find(a => a.name === data.id);
      }
      
      if (droppedItem) {
        // Add the item to our dropped items with position
        const newItem = {
          id: `${data.type}-${Date.now()}`,
          type: data.type,
          name: data.id, // Store the name for identification
          item: droppedItem,
          x,
          y,
          relativeX,
          relativeY
        };
        
        // Add to state
        setDroppedItems(prev => [...prev, newItem]);
        
        // Save to localStorage
        saveItemPositionToLocalStorage(data.type, data.id, relativeX, relativeY);
      }
    } catch (error) {
      console.error('Error processing dropped item:', error);
    }
  };
  
  // Handle dragover to allow dropping
  const handleDragOver = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (e && e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    return false;
  };

  return (
    <div className="main-container">
      <NavBar />
      <div className="main-content">
        <div className="main-content-container">
          {/* Left side containers */}
          <div className="left-side">
            <div className="social-media-bar">
              <h3 className="section-title">CONNECT CHANNELS</h3>
              
              {fromScratch ? (
                <div className="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                  <p>No channels connected</p>
                  <button className="btn-outline">Connect Channel</button>
                </div>
              ) : (
                <>
                  <div className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    <span>Facebook</span>
                  </div>
                  
                  <div className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                    <span>YouTube</span>
                  </div>
                  
                  <div className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    <span>X</span>
                  </div>
                  
                  <div className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span>Instagram</span>
                  </div>
                  
                  <div className="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7"></path>
                    </svg>
                    <span>Twitch</span>
                  </div>
                </>
              )}
            </div>

            <div className="comment-section">
              <h3 className="section-title">
                <svg className="ai-title-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                  <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                  <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                STORE AI ASSISTANT
              </h3>
              <div className="ai-assistant-container">
                <div className="ai-messages">
                  {aiMessages.map(message => (
                    <div className="ai-message" key={message.id}>
                      <div className="ai-message-header">
                        <span className="ai-name">{message.name}</span>
                        <span className="message-time">{message.time}</span>
                      </div>
                      <div className="ai-message-content">
                        {message.content.split('\n\n').map((paragraph, index) => {
                          // Convert **text** to <strong>text</strong>
                          const formattedText = paragraph.replace(
                            /\*\*(.*?)\*\*/g, 
                            '<strong>$1</strong>'
                          );
                          
                          return (
                            <p 
                              key={index} 
                              dangerouslySetInnerHTML={{ __html: formattedText }}
                            />
                          );
                        })}
                        
                        {message.actions && (
                          <div className="ai-suggestion-actions">
                            {message.actions.map((action, index) => (
                              <button 
                                key={index}
                                className={`ai-action-button ${action.value === 'yes' ? 'accept' : 'reject'} ${message.selectedAction === action.value ? 'selected' : ''} ${message.selectedAction && message.selectedAction !== action.value ? 'not-selected' : ''}`}
                                onClick={() => handleAiAction(message.id, action.value)}
                                disabled={message.selectedAction !== undefined}
                              >
                                {action.label}
                                {message.selectedAction === action.value && (
                                  <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                
              </div>
            </div>
          </div>

          {/* Center containers */}
          <div className="center-side">
            <div className="place-container">
              <div className="container-header">
                <h2 className="container-title">YOUR VIRTUAL STORE</h2>
                <div className="publish-container">
                  <button 
                    className={`publish-button ${isPublishEnabled ? 'enabled' : 'disabled'} ${publishStatus === 'processing' ? 'processing' : ''}`}
                    disabled={!isPublishEnabled || publishStatus === 'processing'}
                    onClick={handlePublish}
                  >
                    {publishStatus === 'processing' ? 'Publishing...' : 'Publish'}
                  </button>
                  {publishStatus === 'published' && (
                    <div className="published-url">
                      <span className="url-label">Live at:</span>
                      <a href={publishedUrl} target="_blank" rel="noopener noreferrer">{publishedUrl}</a>
                    </div>
                  )}
                </div>
              </div>
              {storeGenerated ? (
                <div 
                  ref={virtualSpaceRef}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <video
                    src={bgVideo}
                    autoPlay
                    loop
                    muted
                    style={{
                      minWidth: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                  
                  {/* Render dropped items */}
                  {droppedItems.map(item => {
                    // For rendering, we use the absolute x,y values
                    const offsetX = item.type === 'agent' ? 75 : 52.5;
                    const offsetY = item.type === 'agent' ? 75 : 52.5;
                    
                    return (
                      <div
                        key={item.id}
                        style={{
                          position: 'absolute',
                          left: `${item.x - offsetX}px`,
                          top: `${item.y - offsetY}px`,
                          zIndex: 10
                        }}
                      >
                        <img 
                          src={item.type === 'agent' ? agentImage : item.item.images[0]}
                          alt={item.item.name}
                          style={{
                            width: item.type === 'agent' ? '150px' : '105px',
                            height: item.type === 'agent' ? '150px' : '105px',
                            objectFit: item.type === 'agent' ? 'contain' : 'cover'
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <p>No virtual space created yet</p>
                  <button className="btn-outline" onClick={() => navigate('/space')}>Create Space</button>
                </div>
              )}
            </div>
            
            <div className="advertisement-container">
              <h2 className="container-title">CAMPAIGNS</h2>
              <div className="ad-stats">
                <div className="stat-card">
                  <h4>VISITORS</h4>
                  <span className="stat-value">0</span>
                </div>
                <div className="stat-card">
                  <h4>ENGAGEMENT</h4>
                  <span className="stat-value">N/A</span>
                </div>
                <div className="stat-card">
                  <h4>CONVERSION</h4>
                  <span className="stat-value">N/A</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side container */}
          <div className="right-side">
            <div className="tabs-container">
              <div className="tabs-header">
                <button 
                  className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveTab('products')}
                >
                  Products
                </button>
                <button 
                  className={`tab-button ${activeTab === 'agents' ? 'active' : ''}`}
                  onClick={() => setActiveTab('agents')}
                >
                  Agents
                </button>
              </div>
              
              <div className="tabs-content">
                {activeTab === 'products' && (
                  <div className="tab-content">
                    {products.length > 0 ? (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        padding: '8px 0'
                      }}>
                        {products.map((product, index) => (
                          <div 
                            key={index} 
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, product, 'product')}
                            onDragEnd={handleDragEnd}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '16px',
                              border: '1px solid #000',
                              cursor: isDragging ? 'grabbing' : 'grab',
                              transition: 'all 0.15s ease-in'
                            }} 
                            onClick={() => navigate('/product')}
                          >
                            {product.images[0] && (
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  objectFit: 'cover',
                                  border: '1px solid #000',
                                  marginRight: '12px'
                                }}
                              />
                            )}
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}>
                              <span style={{
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                letterSpacing: '-0.02em'
                              }}>{product.name}</span>
                              <span style={{
                                fontWeight: '500',
                                fontSize: '0.85rem'
                              }}>${product.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
                          <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
                          <line x1="12" y1="22" x2="12" y2="13"></line>
                          <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
                        </svg>
                        <p>No products yet</p>
                        <button className="btn-outline" onClick={() => navigate('/product')}>Add Product</button>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'agents' && (
                  <div className="tab-content">
                    {agents.length > 0 ? (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        padding: '8px 0'
                      }}>
                        {agents.map((agent, index) => (
                          <div 
                            key={index} 
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, agent, 'agent')}
                            onDragEnd={handleDragEnd}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '16px',
                              border: '1px solid #000',
                              cursor: isDragging ? 'grabbing' : 'grab',
                              transition: 'all 0.15s ease-in'
                            }} 
                            onClick={() => navigate('/agent')}
                          >
                            <img 
                              src={agentImage} 
                              alt={agent.name} 
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                border: '1px solid #000',
                                marginRight: '12px'
                              }} 
                            />
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}>
                              <span style={{
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                letterSpacing: '-0.02em'
                              }}>{agent.name}</span>
                              <span style={{
                                fontWeight: '500',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase'
                              }}>{agent.role.toUpperCase()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zM6 15.5C6 13.6 7.6 12 9.5 12h5c1.9 0 3.5 1.6 3.5 3.5v1c0 1.4-1.1 2.5-2.5 2.5h-8C6.1 19 5 17.9 5 16.5v-1c0 0 1 0 1 0z"></path>
                        </svg>
                        <p>No agents yet</p>
                        <button className="btn-outline" onClick={() => navigate('/agent')}>Add Agent</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;