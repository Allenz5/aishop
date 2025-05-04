/* Add these CSS styles to your Store.css file for typing animations */
  /*
  .typing-dots {
    display: inline-block;
    animation: typingDots 1.5s infinite;
  }
  
  .typing-cursor {
    display: inline-block;
    animation: blinkCursor 0.8s infinite;
    color: #000;
    font-weight: normal;
    margin-left: 2px;
  }
  
  @keyframes typingDots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
  }
  
  @keyframes blinkCursor {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
  */import React, { useState, useEffect, useRef } from 'react';
  import { useLocation, useNavigate } from 'react-router-dom';
  import './Store.css';
    // Import agent image
  import agentImage from '../components/Images/agent.gif';
  // Import profile image
  import profileImage from '../components/Images/Profile4.png';
  // Import special product image
  import keyboardImage from '../components/Images/img1.jpg';
  // Import video
  import bgVideo from '../components/Images/bg4.mp4';
  import ttLogo from '../components/Images/tt.svg'
  import favicon from '../components/Images/favicon.png'
  
  function Store() {
    const location = useLocation();
    const navigate = useNavigate();
    const fromScratch = location.state?.fromScratch || false;
    
    const [isDragging, setIsDragging] = useState(false);
    const [droppedItems, setDroppedItems] = useState([]);
    const dragImageRef = useRef(null);
    const virtualSpaceRef = useRef(null);
    const [virtualSpaceOffset, setVirtualSpaceOffset] = useState(0);
    const scrollSpeed = 20; // Pixels to move per key press
    const maxUnits = 3; // Maximum number of units (keypresses) allowed in each direction
    const maxDistance = maxUnits * scrollSpeed; // Maximum pixel distance in each direction
  
    // Sample comments data for the comment section
    const [comments, setComments] = useState([
      {
        id: 1,
        username: "Customer",
        text: "top came in today, sooo cute 🥹",
        reply: {
          username: "Admin",
          text: "Yay! So happy you loved it 💖 thanks for the support!"
        }
      },
      {
        id: 2,
        username: "Customer",
        text: "took a week to ship but worth it",
        reply: {
          username: "Admin",
          text: "Thanks for your patience! We're working on faster shipping 💌"
        }
      },
      {
        id: 3,
        username: "Customer",
        text: "fabric is soft but the bow was a bit loose",
        reply: {
          username: "Admin",
          text: "So sorry about that! Feel free to DM us, we’ll help sort it out 💕"
        }
      },
      {
        id: 4,
        username: "Customer",
        text: "wore the lace set to a party n got 3 compliments 😭",
        reply: {
          username: "Admin",
          text: "Yesss we love to hear it!! You probably looked 🔥"
        }
      },
      {
        id: 5,
        username: "Customer",
        text: "pls restock the heart mesh top 🙏",
        reply: {
          username: "Admin",
          text: "It’s coming back soon! Keep an eye on our IG stories 👀"
        }
      }
    ]);
    
    
    // Handle keyboard navigation
    useEffect(() => {
      document.title = "Miss Lala – Storia";
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = favicon; // Place the icon in `public/`
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = favicon;
        document.head.appendChild(newLink);
      }
      const handleKeyDown = (e) => {
        // Don't move virtual space if currently focused on the chat input
        if (document.activeElement && document.activeElement.className === 'chat-input-field') {
          return;
        }
        
        if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
          // Move left (up to 20 units)
          setVirtualSpaceOffset(prev => Math.min(prev + scrollSpeed, maxDistance));
        } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
          // Move right (up to 20 units)
          setVirtualSpaceOffset(prev => Math.max(prev - scrollSpeed, -maxDistance));
        }
      };
  
      // Add event listeners
      window.addEventListener('keydown', handleKeyDown);
      
      // Cleanup on unmount
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, []); // No dependencies needed since we're using fixed constants
  
    // Define products and agent at component level
    const nyxbyteAgent = {
      name: 'Miss Lala',
      description: 'AI sales assistant specialized in digital products',
      role: 'sales',
      knowledgeFileName: 'sales_manual.pdf',
      image: agentImage
    };
  
  
    // Chat related state
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(true); // Start with typing indicator
    const [replyIndex, setReplyIndex] = useState(0);
    const [showQuickReplies, setShowQuickReplies] = useState(false);
    const [hasShownSpecialReply, setHasShownSpecialReply] = useState(false);
    // Add the missing state variables
    const [showProductReplies, setShowProductReplies] = useState(false);
    
    // State for typing effect
    const [currentTypingMessage, setCurrentTypingMessage] = useState("");
    const [isTypingMessage, setIsTypingMessage] = useState(false);
    const [fullMessageText, setFullMessageText] = useState("");
    // Slow down typing speed for more natural effect
    const [typingSpeed, setTypingSpeed] = useState(40); // milliseconds per character - increased from 30 to 40
  
    // Define the missing productReplies array
    const productReplies = [
      "Looks cool, I'll get it.",
      "Hmm, tell me a bit more?",
      "Nah, not feeling this one."
    ];
  
    // Initial message with delay and typing effect
    useEffect(() => {
      // Show typing indicator first
      setTimeout(() => {
        setIsTyping(false);
        
        // Set the message text to be typed
        const initialMessage = "Hey sugar! Welcome to Miss Lala’s Diner Delights — where vintage vibes meet modern sparkle! I’ve got just the thing to sweeten your day. So, what’s cookin’ in your cart today?";
        setIsTypingMessage(true);
        
        // Instead of appending characters one by one to the state,
        // track character index in a ref to avoid state batching issues
        let charIndex = 0;
        const fullText = initialMessage;
        
        const typingInterval = setInterval(() => {
          if (charIndex < fullText.length) {
            // Set the entire substring from start to current index
            // This ensures we always have exactly the right characters
            setCurrentTypingMessage(fullText.substring(0, charIndex + 1));
            charIndex++;
          } else {
            clearInterval(typingInterval);
            setIsTypingMessage(false);
            
            // Add the completed greeting message to the chat
            setMessages([{
              id: 1,
              text: initialMessage,
              sender: 'agent',
              timestamp: new Date()
            }]);
            
            // Show quick replies after the message appears
            setShowQuickReplies(true);
            // Make sure product replies are hidden initially
            setShowProductReplies(false);
          }
        }, typingSpeed);
        
        // Smoothly scroll the space 20 units to the right
        let scrollAmount = 0;
        const targetScroll = -0 * scrollSpeed; // 20 units to the right (negative value)
        const scrollInterval = setInterval(() => {
          scrollAmount -= 3; // Move 3px at a time for smooth animation
          setVirtualSpaceOffset(scrollAmount);
          
          // Stop when we reach target scroll amount
          if (scrollAmount <= targetScroll) {
            clearInterval(scrollInterval);
            setVirtualSpaceOffset(targetScroll);
          }
        }, 16); // ~60fps animation
        
      }, 3500); // 3.5 second delay
    }, []);
  
    // Quick reply options
    const quickReplies = [
      "Introduce me to the products.",
      "Just looking around, thanks.",
      "Tell me more about the brand."
    ];
  
    // TODO: Replace with actual predefined replies
    const predefinedReplies = {
      "Introduce me to the products.": "We've got some sick mechanical keyboards and accessories. The Dry Studio PETBRICK 65 is our entry model at $159, but if you want the premium experience, check out the CYBERBOARD Novel Project at $748.",
      
      "Just looking around, thanks.": "Cool, take your time. You can move around this space with A/D or arrow keys. If you want to see any product up close, just let me know.",
      
      "Tell me more about the brand.": "Angry Miao is all about pushing boundaries in tech design. We're known for our innovative mechanical keyboards with unique aesthetics and premium build quality. Started in 2019, we've built a strong community of tech enthusiasts.",
  
      "Looks cool, I'll get it.": "Excellent choice! The Gold Paisley edition is one of our most popular limited runs. I'll set one aside for you. Want to check out with just that, or should I show you some matching accessories first?",
      
      "Hmm, tell me a bit more?": "Sure thing. It runs on a custom PCB with hot-swappable switches, so you can change the typing feel without soldering. The case is CNC aluminum with that signature gold paisley etching. Battery lasts about 3 weeks, and you can customize every key and the LED matrix through our app.",
      
      "Nah, not feeling this one.": "No worries, different keyboards suit different people. We've got other styles in the lineup. How about the more minimalist CYBERBOARD R2 or the ultra-compact AM RGB 65? Or I can show you something completely different.",
      
      "default": [
        "What else do you want to know about our products?",
        "The CYBERBOARD R2 is pretty popular right now - solid aluminum frame, customizable RGB.",
        "Our phone cases are minimalist but offer great protection. The Emptiness case is only $25.99.",
        "You can drag and drop products from our catalog into this virtual space to check them out.",
        "Let me know if you want more details on any specific product.",
        "Each keyboard has different switch options. What kind of typing feel do you prefer?",
        "Our products ship worldwide with express delivery options.",
        "The AM RGB 65 has some of the best RGB lighting effects I've seen.",
        "We also offer bundle discounts if you're looking to get multiple items.",
        "All our keyboards come with a 1-year warranty and excellent customer support."
      ]
    };
  
    // Handle navigate to home
    const handleCreateYourOwn = () => {
      navigate('/');
    };
  
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
  
  
    // Function to simulate typing effect - improved for smoother display
    const simulateTyping = (text, hasHtml = false) => {
      if (hasHtml) {
        // For HTML content, we extract the text content for typing
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        
        setIsTypingMessage(true);
        setFullMessageText(text); // Store the full HTML
        setCurrentTypingMessage("");
        
        return new Promise((resolve) => {
          let i = 0;
          const typingInterval = setInterval(() => {
            if (i < textContent.length) {
              i++;
              // Show partial text, but keep track of the progress percentage
              const progress = i / textContent.length;
              // Use the progress to show a proportional amount of the HTML
              const htmlLength = text.length;
              const partialHtml = text.substring(0, Math.floor(htmlLength * progress));
              setCurrentTypingMessage(partialHtml);
            } else {
              clearInterval(typingInterval);
              setIsTypingMessage(false);
              resolve(text);
            }
          }, typingSpeed);
        });
      } else {
        setIsTypingMessage(true);
        setFullMessageText(text);
        setCurrentTypingMessage("");
        
        return new Promise((resolve) => {
          let i = 0;
          const typingInterval = setInterval(() => {
            if (i < text.length) {
              // Use substring instead of appending characters
              setCurrentTypingMessage(text.substring(0, i + 1));
              i++;
            } else {
              clearInterval(typingInterval);
              setIsTypingMessage(false);
              resolve(text);
            }
          }, typingSpeed);
        });
      }
    };
  
    // Handle sending message with typing effect
    const handleSendMessage = (text = inputMessage) => {
      if (!text.trim()) return;
  
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: text,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
      
      // Hide quick replies after user sends a message
      setShowQuickReplies(false);
      // Hide product replies (now defined at the component level)
      setShowProductReplies(false);
  
      // Show typing indicator and get reply
      setIsTyping(true);
      
      // If this is the first user message and we haven't shown the special reply yet
      if (messages.length === 1 && !hasShownSpecialReply) {
        // Longer delay (3.5 seconds) for the special keyboard message
        setTimeout(() => {
          setIsTyping(false);
          
          // HTML content to display
          const specialMessageHtml = `<p>Alright, let's start strong.</p>
  <p>This is the Cyberboard R3 – Gold Paisley edition.</p>
  <img src="${keyboardImage}" alt="Cyberboard R3 Gold Paisley Edition" />
  <p>It's got a bold gold paisley pattern, inspired by traditional East Asian art, paired with a retro-futuristic LED matrix up top.</p>
  <p>Fully customizable, wireless, and seriously limited—this one's made to stand out on your desk and your feed.</p>`;
  
          // Start typing effect for HTML content
          simulateTyping(specialMessageHtml, true).then(typedText => {
            // Add the message after typing is complete
            const specialMessage = {
              id: messages.length + 2,
              text: typedText,
              sender: 'agent',
              timestamp: new Date(),
              hasHtml: true
            };
            
            setMessages(prev => [...prev, specialMessage]);
            setHasShownSpecialReply(true);
            
            // Show product-specific reply options
            setShowProductReplies(true);
          });
        }, 3500); // 3.5 second delay for the keyboard product message
        
        return;
      }
      
      // For regular messages (non-keyboard product), use standard delay
      setTimeout(() => {
        setIsTyping(false);
        
        let replyText;
        
        // Check if we have a specific reply for this message
        if (predefinedReplies[text]) {
          replyText = predefinedReplies[text];
        } else {
          // Use the default replies array
          replyText = predefinedReplies.default[replyIndex];
          // Update reply index for next time
          setReplyIndex((prevIndex) => (prevIndex + 1) % predefinedReplies.default.length);
        }
        
        // Start typing effect
        simulateTyping(replyText).then(typedText => {
          // Add agent reply after typing is complete
          const agentMessage = {
            id: messages.length + 2,
            text: typedText,
            sender: 'agent',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, agentMessage]);
        });
      }, 1500);
    };
  
    // Handle quick reply selection
    const handleQuickReply = (reply) => {
      handleSendMessage(reply);
    };
    
    // Handle product reply selection - properly defined function
    const handleProductReply = (reply) => {
      handleSendMessage(reply);
    };
  
    // Handle Enter key press
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    };
  
    // Handle click in virtual space - now does nothing
    const handleVirtualSpaceClick = () => {
      // No behavior on click - removed the chat response functionality
      // This function is kept as a placeholder in case we want to add functionality later
    };

    // Function to handle adding a new comment
    const handleAddComment = () => {
      // This would typically open a comment form, but for simplicity
      // we'll just add a placeholder comment
      const newComment = {
        id: comments.length + 1,
        username: "Visitor",
        text: "Just joined the glow gang! Can't wait to get my hands on these keyboards."
      };
      
      setComments([newComment, ...comments]);
    };
  
    return (
      <>
        {/* Top Banner */}
        <div className="top-banner">
          <h1 className="banner-title">Storia x Miss Lala</h1>
          <a href="http://localhost:3000" className="create-button">Create Your Own</a>
        </div>
        
        <div className="store-container">
          <div className="store-content">
            <div className="store-content-container">
              {/* Left side containers */}
              <div className="left-side">
                <div className="social-media-bar">
                  <h3 className="section-title">SOCIAL MEDIA</h3>
                  
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
                        <img src={ttLogo} alt="TikTok" width="24" height="24" />
                        <span>TikTok</span>
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
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                        <span>Instagram</span>
                      </div>
                    </>
                  )}
                </div>
  
                <div className="comment-section">
                  <h3 className="section-title">COMMENTS</h3>
                  {comments.length > 0 ? (
                    <div className="comments-list">
                      {comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-username">{comment.username}</span>
                          </div>
                          <p className="comment-text">{comment.text}</p>
                          {comment.reply && (
                            <div className="comment-reply">
                              <div className="comment-header">
                                <span className="comment-username">{comment.reply.username}</span>
                              </div>
                              <p className="comment-text">{comment.reply.text}</p>
                            </div>
                          )}
                          <div className="comment-footer">
                            <button className="comment-reply-btn">Reply</button>
                          </div>
                        </div>
                      ))}
                      <button className="btn-outline add-comment-btn" onClick={handleAddComment}>
                        Add Comment
                      </button>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      <p>No comments yet</p>
                      <button className="btn-outline">Add Comment</button>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Center containers - Virtual space only (expanded) */}
              <div className="center-side">
                <div className="virtual-space-container">
  
                  <div 
                    className="virtual-space"
                    onClick={handleVirtualSpaceClick}
                  >
                    <div 
                      ref={virtualSpaceRef}
                      className="virtual-space-content"
                      style={{ transform: `translateX(${virtualSpaceOffset}px)` }}
                    >
                      <video
                        src={bgVideo}
                        autoPlay
                        loop
                        muted
                        className="virtual-space-video"
                      />
                      
                      {/* Render dropped items - now the items move with the scene */}
                      {droppedItems.map(item => (
                        <div
                          key={item.id}
                          style={{
                            position: 'absolute',
                            left: `${item.x - (item.type === 'agent' ? 100 : 75)}px`, // Adjusted offsets for larger images
                            top: `${item.y - (item.type === 'agent' ? 100 : 75)}px`, // Adjusted offsets for larger images
                            zIndex: 10,
                            transform: `translateX(${0}px)` // Items move with the parent container
                          }}
                        >
                          <img 
                            src={item.type === 'agent' ? agentImage : item.item.images[0]}
                            alt={item.item.name}
                            style={{
                              width: item.type === 'agent' ? '200px' : '150px', // Increased from 139px/105px
                              height: item.type === 'agent' ? '200px' : '150px', // Increased from 139px/105px
                              objectFit: item.type === 'agent' ? 'contain' : 'cover'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Navigation hint */}
                    <div className="navigation-hint">
                      Use A/D or ←/→ keys to navigate
                    </div>
                  </div>
                </div>
              </div>
  
              {/* Right side container - Chat */}
              <div className="right-side">
                <div className="tabs-container">
                  <h3 className="section-title">CHAT</h3>
                  
                  <div className="chat-container">
                    {/* Messages */}
                    <div className="chat-messages">
                      {messages.map(message => (
                        <div
                          key={message.id}
                          className={`message ${message.sender === 'user' ? 'user-message' : 'agent-message'}`}
                        >
                          {message.sender === 'agent' ? (
                            <div className="message-with-avatar">
                              <div className="avatar-container">
                                <img src={profileImage} alt="Agent" className="avatar-image" />
                              </div>
                              <div>
                                <div className="agent-name">Miss Lala</div>
                                {message.hasHtml ? (
                                  <div 
                                    className="message-bubble"
                                    dangerouslySetInnerHTML={{ __html: message.text }}
                                  />
                                ) : (
                                  <div className="message-bubble">
                                    {message.text}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="message-bubble">
                              {message.text}
                            </div>
                          )}
                        </div>
                      ))}
                      {isTyping ? (
                        <div className="message agent-message">
                          <div className="message-with-avatar">
                            <div className="avatar-container">
                              <img src={profileImage} alt="Agent" className="avatar-image" />
                            </div>
                            <div>
                              <div className="agent-name">Miss Lala</div>
                              <div className="message-bubble typing">
                                <span className="typing-dots">...</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : isTypingMessage ? (
                        <div className="message agent-message">
                          <div className="message-with-avatar">
                            <div className="avatar-container">
                              <img src={profileImage} alt="Agent" className="avatar-image" />
                            </div>
                            <div>
                              <div className="agent-name">Miss Lala</div>
                              {fullMessageText.includes('<') ? (
                                <div 
                                  className="message-bubble"
                                  dangerouslySetInnerHTML={{ __html: currentTypingMessage }}
                                />
                              ) : (
                                <div className="message-bubble">
                                  {currentTypingMessage}
                                  <span className="typing-cursor">|</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
  
                    <div className="chat-input">
                      {/* Initial quick replies */}
                      {showQuickReplies && (
                        <div className="quick-replies">
                          {quickReplies.map((reply, index) => (
                            <button
                              key={index}
                              className="quick-reply-button"
                              onClick={() => handleQuickReply(reply)}
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {/* Product-specific quick replies */}
                      {showProductReplies && (
                        <div className="quick-replies">
                          {productReplies.map((reply, index) => (
                            <button
                              key={`product-${index}`}
                              className="quick-reply-button"
                              onClick={() => handleProductReply(reply)}
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <div className="chat-input-row">
                        <input
                          type="text"
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="chat-input-field"
                        />
                        <button
                          onClick={() => handleSendMessage()}
                          className="chat-send-button"
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
      </>
    );
  }
  
  export default Store;