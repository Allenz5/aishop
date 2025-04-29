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
  import profileImage from '../components/Images/profile.png';
  // Import special product image
  import keyboardImage from '../components/Images/img3.jpg';
  import mouseImage from '../components/Images/img2.jpg';
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
    const [virtualSpaceOffset, setVirtualSpaceOffset] = useState(0);
    const scrollSpeed = 20; // Pixels to move per key press
    const maxUnits = 20; // Maximum number of units (keypresses) allowed in each direction
    const maxDistance = maxUnits * scrollSpeed; // Maximum pixel distance in each direction
  
    // Handle keyboard navigation
    useEffect(() => {
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
    const [showAgentHighlight, setShowAgentHighlight] = useState(false);
    const [highlightedProductId, setHighlightedProductId] = useState(null);
    const chatMessagesRef = useRef(null);

  
    // Define the missing productReplies array
    const productReplies = [
      "Looks cool, I'll get it.",
      "Hmm, tell me a bit more?",
      "Nah, not feeling this one."
    ];
  
    // Initial message with delay and typing effect
    useEffect(() => {
      // First, smoothly scroll the space to center the agent
      let scrollAmount = 0;
      const targetScroll = -20 * scrollSpeed; // 20 units to the right (negative value)
      
      const scrollInterval = setInterval(() => {
        scrollAmount -= 3; // Move 3px at a time for smooth animation
        setVirtualSpaceOffset(scrollAmount);
        
        // Stop when we reach target scroll amount
        if (scrollAmount <= targetScroll) {
          clearInterval(scrollInterval);
          setVirtualSpaceOffset(targetScroll);
          
          // After the scene movement is complete, start the greeting
          setTimeout(() => {
            // Turn on the agent highlight permanently (no timeout to remove it)
            setShowAgentHighlight(true);
            
            // Now show the greeting
            setIsTyping(false);
            
            // Set the message text to be typed
            const initialMessage = "Yo. You found me. I'm Nyxbyte. What do you need?";
            setIsTypingMessage(true);
            
            let charIndex = 0;
            const fullText = initialMessage;
            
            const typingInterval = setInterval(() => {
              if (charIndex < fullText.length) {
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
                setShowProductReplies(false);
              }
            }, typingSpeed);
          }, 1000); // Wait 1 second after the scrolling completes before greeting
        }
      }, 8); // ~60fps animation
    }, []);
  
    // Quick reply options
    const [quickReplies, setQuickReplies] = useState([
      "Introduce me to the products.",
      "Just looking around, thanks.",
      "Tell me more about the brand."
    ]);
  
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

    const scrollToBottom = () => {
      if (chatMessagesRef.current) {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages, isTyping, isTypingMessage]); 
  
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
  
    // Initialize with predefined products and agent
    useEffect(() => {
      const initialItems = [
        // Predefined products with hardcoded positions
        {
          id: `product-${Date.now()}-1`,
          type: 'product',
          item: predefinedProducts[0], // Dry Studio PETBRICK 65
          x: 1350,
          y: 800,
          relativeX: 0.2,
          relativeY: 0.3
        },
        {
          id: `product-${Date.now()}-2`,
          type: 'product',
          item: predefinedProducts[1], // AM INFINITY MOUSE
          x: 1700,
          y: 920,
          relativeX: 0.35,
          relativeY: 0.5
        },
        {
          id: `product-${Date.now()}-3`,
          type: 'product',
          item: predefinedProducts[2], // CYBERBOARD Novel Project
          x: 1742,
          y: 800,
          relativeX: 0.5,
          relativeY: 0.35
        },
        {
          id: `product-${Date.now()}-4`,
          type: 'product',
          item: predefinedProducts[3], // CYBERBOARD R2
          x: 690,
          y: 890,
          relativeX: 0.65,
          relativeY: 0.6
        },
        {
          id: `product-${Date.now()}-5`,
          type: 'product',
          item: predefinedProducts[4], // AM RGB 65
          x: 990,
          y: 710,
          relativeX: 0.3,
          relativeY: 0.7
        },
        {
          id: `product-${Date.now()}-6`,
          type: 'product',
          item: predefinedProducts[5], // AM AFA R2
          x: 1350,
          y: 630,
          relativeX: 0.8,
          relativeY: 0.4
        },
        {
          id: `product-${Date.now()}-7`,
          type: 'product',
          item: predefinedProducts[6], // AM Emptiness Phone Case
          x: 1035,
          y: 910,
          relativeX: 0.45,
          relativeY: 0.65
        },
        // Agent
        {
          id: `agent-${Date.now()}`,
          type: 'agent',
          item: nyxbyteAgent,
          x: 2030,
          y: 875,
          relativeX: 0.55,
          relativeY: 0.75
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
          // Larger size for products (150px)
          img.style.width = '150px';
          img.style.height = '150px';
        } else {
          // Larger size for agents (200px)
          img.style.width = '215px';
          img.style.height = '215px';
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
              scrollToBottom(); // Scroll while typing
            } else {
              clearInterval(typingInterval);
              setIsTypingMessage(false);
              scrollToBottom(); // Scroll while typing
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
              scrollToBottom(); // Scroll while typing
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
  <p>This is the Petbrick 65 – the world’s first pettable keyboard.</p>
  <img src="${keyboardImage}"/>
  <p>It's wrapped in soft faux fur, inspired by every cat owner’s daily struggle: a furry friend sprawled across the keys.</p>
  <p>Fully customizable, wireless, and seriously one-of-a-kind—this one's made to steal your desk space and your heart.</p>`;
  
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

          const petbrickItem = droppedItems.find(item => 
            item.type === 'product' && item.item.name === 'Dry Studio PETBRICK 65'
          );
          
          // Begin moving as the typing starts
          // Move 25 units to the left (positive value increases the offset)
          const newOffset = virtualSpaceOffset + (25 * scrollSpeed);
          
          // Smoothly animate the movement - slower to match typing duration
          let currentOffset = virtualSpaceOffset;
          const targetOffset = newOffset;
          
          // Calculate number of steps based on typing duration
          // Assuming typing will take about 4 seconds for the product intro message
          const totalAnimationTime = 4000; // ms
          const frameRate = 16; // ms (60fps)
          const totalSteps = totalAnimationTime / frameRate;
          const moveStep = (targetOffset - currentOffset) / totalSteps;
          
          const moveInterval = setInterval(() => {
            currentOffset = currentOffset + moveStep;
            setVirtualSpaceOffset(currentOffset);
            
            // Stop when we reach or exceed the target offset
            if ((moveStep > 0 && currentOffset >= targetOffset) || 
                (moveStep < 0 && currentOffset <= targetOffset)) {
              clearInterval(moveInterval);
              setVirtualSpaceOffset(targetOffset);
            }
          }, frameRate);
          
          // Remove glow from NPC and add to the product
          setShowAgentHighlight(false);
          setQuickReplies([
            "Introduce me to the products.",
            "Just looking around, thanks.",
            "Tell me more about the brand."
          ]);
          
          // Set the highlighted product if we found it
          if (petbrickItem) {
            setHighlightedProductId(petbrickItem.id);
          }
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
  

    const mouseReplies = [
      "That looks awesome. How much?",
      "Does it come in other colors?",
      "Tell me about the battery life."
    ];

    // Handle click in virtual space - now does nothing
    const handleVirtualSpaceClick = () => {
      // Find the mouse product ID
      const mouseProduct = droppedItems.find(item => 
        item.type === 'product' && item.item.name === 'AM INFINITY MOUSE'
      );
      
      // 1. Transfer the glowing effect to the mouse product
      setShowAgentHighlight(false);
      setHighlightedProductId(mouseProduct ? mouseProduct.id : null);
      
      // 2. Show loading/typing indicator, hide customer choice responses
      setShowQuickReplies(false);
      setShowProductReplies(false);
      setIsTyping(true);
      
      // 3. After a short delay, show the new message about the mouse
      setTimeout(() => {
        setIsTyping(false);
        
        // The new message text with HTML formatting for better presentation
        const mouseMessageHtml = `<p>Nice taste.</p>
    <p>This is the AM Infinity Mouse – Angry Miao's debut into gaming mice, and it doesn't miss.</p>
    <img src="${mouseImage}"/>
    <p>Skeletonized magnesium-alloy shell, inspired by the Lotus Type 79 F1 car. Ultra-light at 49g, with a magnetic hot-swappable battery so you never have to plug in.</p>
    <p>30,000 DPI PixArt sensor, 8K polling rate, and TTC Orange Dot Optical V2 switches—built to dominate your game and your setup.</p>`;
        
        // Highlight the product image
        if (mouseProduct) {
          // Start typing effect for HTML content
          simulateTyping(mouseMessageHtml, true).then(typedText => {
            // Add the completed message to the chat with HTML flag
            const mouseMessage = {
              id: messages.length + 1,
              text: typedText,
              sender: 'agent',
              timestamp: new Date(),
              hasHtml: true  // Note that this is HTML content
            };
            
            setMessages(prev => [...prev, mouseMessage]);

            setShowQuickReplies(true);
      
            // Update the quick replies with mouse-specific options
            // We'll use the existing quick replies state, but change its content
            // This is a bit of a hack but keeps the component simpler
            setQuickReplies(mouseReplies);
          });
        }
      }, 1500); // 1.5 second typing indicator delay
    };
  
    return (
      <>
        {/* Top Banner */}
        <div className="top-banner">
          <h1 className="banner-title">MyCompanyName x Angry Miao</h1>
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
                  <div className="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <p>No comments yet</p>
                    <button className="btn-outline">Add Comment</button>
                  </div>
                </div>
              </div>
  
              {/* Center containers - Virtual space only (expanded) */}
              <div className="center-side">
                <div className="virtual-space-container">
  
                  <div 
                    className="virtual-space"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
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
                            zIndex: 10
                          }}
                        >
                          <img 
                            src={item.type === 'agent' ? agentImage : item.item.images[0]}
                            alt={item.item.name}
                            className={
                              (item.type === 'agent' && showAgentHighlight) || 
                              (item.type === 'product' && item.id === highlightedProductId) 
                                ? 'agent-highlight' 
                                : ''
                            }
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
                    <div className="chat-messages" ref={chatMessagesRef}>
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
                                <div className="agent-name">Nyxbyte</div>
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
                              <div className="agent-name">Nyxbyte</div>
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
                              <div className="agent-name">Nyxbyte</div>
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