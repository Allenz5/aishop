import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../components/NavBar';
import { useLocation, useNavigate } from 'react-router-dom';
import './Store.css';
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

function Store() {
  const location = useLocation();
  const navigate = useNavigate();
  const fromScratch = location.state?.fromScratch || false;
  
  const [isDragging, setIsDragging] = useState(false);
  const [droppedItems, setDroppedItems] = useState([]);
  const dragImageRef = useRef(null);
  const virtualSpaceRef = useRef(null);

  // TODO: Replace with actual comments
  const sampleComments = [
    {
      id: 1,
      text: "The virtual store looks amazing! I love how the products are displayed.",
      author: "John Doe",
      replies: [
        {
          id: 11,
          text: "Thank you! We've put a lot of effort into the design.",
          author: "Store Admin",
          replies: [
            {
              id: 111,
              text: "The layout is really intuitive. Great job!",
              author: "Sarah Smith"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      text: "Is there a way to customize the background?",
      author: "Alice Johnson",
      replies: [
        {
          id: 21,
          text: "Yes, you can change it in the store settings.",
          author: "Store Admin"
        }
      ]
    },
    {
      id: 3,
      text: "The AI agent is very helpful in answering questions about products.",
      author: "Mike Wilson",
      replies: []
    }
  ];

  // Define products and agent at component level
  const nyxbyteAgent = {
    name: 'Nyxbyte',
    description: 'AI sales assistant specialized in digital products',
    role: 'sales',
    knowledgeFileName: 'sales_manual.pdf',
    image: agentImage
  };

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

  // Chat related state
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI sales assistant. How can I help you today?",
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);

  // TODO: Replace with actual predefined replies
  const predefinedReplies = [
    "Welcome to our virtual store! Feel free to explore our products.",
    "You can drag and drop products to arrange them as you like.",
    "Our Dry Studio PETBRICK 65 keyboard is our bestseller at $159.00.",
    "The AM INFINITY MOUSE features ergonomic design and high precision tracking.",
    "We also offer premium phone cases starting at $25.99.",
    "Would you like to know more about any specific product?",
    "Our products range from $25.99 to $748.00.",
    "The virtual store is designed to give you a hands-on experience with our products.",
    "You can interact with the AI agent for more information about any product.",
    "Thank you for visiting our store! How can I assist you today?"
  ];

  // Effects for handling drag image creation
  useEffect(() => {
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

  // Pre-populate the virtual space with products and agents
  useEffect(() => {
    // Pre-populate the virtual space with items
    const initialItems = [                        // TODO: Replace with actual position
      // Add agent in the center
      {
        id: 'agent-1',
        type: 'agent',
        item: nyxbyteAgent,
        x: 400, // Center x position
        y: 300  // Center y position
      },
      // Add products in a grid layout
      {
        id: 'product-1',
        type: 'product',
        item: predefinedProducts[0],
        x: 200,
        y: 200
      },
      {
        id: 'product-2',
        type: 'product',
        item: predefinedProducts[1],
        x: 400,
        y: 200
      },
      {
        id: 'product-3',
        type: 'product',
        item: predefinedProducts[2],
        x: 600,
        y: 200
      },
      {
        id: 'product-4',
        type: 'product',
        item: predefinedProducts[3],
        x: 200,
        y: 400
      },
      {
        id: 'product-5',
        type: 'product',
        item: predefinedProducts[4],
        x: 400,
        y: 400
      },
      {
        id: 'product-6',
        type: 'product',
        item: predefinedProducts[5],
        x: 600,
        y: 400
      }
    ];
    
    setDroppedItems(initialItems);
  }, []);

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
        img.style.width = '139px';
        img.style.height = '139px';
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

  // Handle drop in the virtual space
  const handleDrop = (e) => {
    e.preventDefault();
    
    // Get drop coordinates relative to the drop zone
    const dropZone = e.currentTarget;
    const rect = dropZone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
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
        droppedItem = predefinedProducts.find(p => p.name === data.id);
      } else if (data.type === 'agent') {
        droppedItem = nyxbyteAgent;
      }
      
      if (droppedItem) {
        // Add the item to our dropped items with position
        setDroppedItems(prev => [
          ...prev,
          {
            id: `${data.type}-${Date.now()}`,
            type: data.type,
            item: droppedItem,
            x,
            y
          }
        ]);
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

  // Render replies recursively
  const renderReplies = (replies, level = 0) => {
    return replies.map(reply => (
      <div key={reply.id} style={{ marginLeft: `${level * 20}px` }}>
        <div style={{
          padding: '8px',
          borderTop: '1px solid #ddd',
          marginTop: '8px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px'
          }}>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{reply.author}</span>
          </div>
          <p style={{ margin: '0', fontSize: '0.9rem' }}>{reply.text}</p>
        </div>
        {reply.replies && renderReplies(reply.replies, level + 1)}
      </div>
    ));
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Show typing indicator and get next reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // Add agent reply
      const agentMessage = {
        id: messages.length + 2,
        text: predefinedReplies[replyIndex],
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
      
      // Update reply index
      setReplyIndex((prevIndex) => (prevIndex + 1) % predefinedReplies.length);
    }, 1500);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Handle click in virtual space
  const handleVirtualSpaceClick = () => {
    // Show typing indicator
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      
      // Add agent message
      const agentMessage = {
        id: messages.length + 1,
        text: predefinedReplies[replyIndex],
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
      
      // Update reply index
      setReplyIndex((prevIndex) => (prevIndex + 1) % predefinedReplies.length);
    }, 1500);
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
              <h3 className="section-title">COMMENTS</h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                flex: 1,
                overflowY: 'auto',
                paddingRight: '8px'
              }}>
                {sampleComments.map(comment => (
                  <div key={comment.id}>
                    <div style={{
                      padding: '8px',
                      border: '1px solid #000',
                      marginBottom: '8px',
                      backgroundColor: '#f8f8f8'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{comment.author}</span>
                      </div>
                      <p style={{ margin: '0', fontSize: '0.9rem' }}>{comment.text}</p>
                      {comment.replies && renderReplies(comment.replies)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 'auto',
                paddingTop: '16px',
                borderTop: '1px solid #000'
              }}>
                <button className="btn-outline" style={{ width: '100%' }}>Add Comment</button>
              </div>
            </div>
          </div>

          {/* Center containers */}
          <div className="center-side">
            <div className="place-container">
              <div className="container-header">
                <h2 className="container-title">YOUR VIRTUAL STORE</h2>
              </div>
              <div 
                ref={virtualSpaceRef}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleVirtualSpaceClick}
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
                {droppedItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      position: 'absolute',
                      left: `${item.x - (item.type === 'agent' ? 75 : 52.5)}px`,
                      top: `${item.y - (item.type === 'agent' ? 75 : 52.5)}px`,
                      zIndex: 10
                    }}
                  >
                    <img 
                      src={item.type === 'agent' ? agentImage : item.item.images[0]}
                      alt={item.item.name}
                      style={{
                        width: item.type === 'agent' ? '139px' : '105px',
                        height: item.type === 'agent' ? '139px' : '105px',
                        objectFit: item.type === 'agent' ? 'contain' : 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="advertisement-container">
              <img 
                src="https://placehold.co/600x200/000/FFF?text=Advertisement"    // TODO: Replace with actual advertisement image
                alt="Advertisement"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>

          {/* Right side container - Chat */}
          <div className="right-side">
            <div className="tabs-container">
              <div className="tabs-header">
                <button className="tab-button active">Chat</button>
              </div>
              
              <div className="tabs-content">
                <div className="tab-content">
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
                    {/* Messages */}
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      padding: '0 16px',
                      overflowY: 'auto'
                    }}>
                      {messages.map(message => (
                        <div
                          key={message.id}
                          style={{
                            alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%'
                          }}
                        >
                          <div style={{
                            padding: '8px 12px',
                            backgroundColor: message.sender === 'user' ? '#000' : '#f0f0f0',
                            color: message.sender === 'user' ? '#fff' : '#000',
                            borderRadius: '12px',
                            fontSize: '0.9rem'
                          }}>
                            {message.text}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div style={{
                          alignSelf: 'flex-start',
                          maxWidth: '80%'
                        }}>
                          <div style={{
                            padding: '8px 12px',
                            backgroundColor: '#f0f0f0',
                            borderRadius: '12px',
                            fontSize: '0.9rem'
                          }}>
                            ...
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input field */}
                    <div style={{
                      padding: '16px',
                      borderTop: '1px solid #000',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          border: '1px solid #000',
                          borderRadius: '0',
                          fontSize: '0.9rem'
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#000',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Store;