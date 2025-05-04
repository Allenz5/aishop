import React, { useState, useCallback, useEffect } from 'react';
import NavBar from '../components/NavBar';
import ProcessingSimulator from '../components/ProcessingSimulator';
import './Product.css';
// Import the product images directly
import prod1Image from '../components/Images/prod1.png';
import prod2Image from '../components/Images/prod2.png';
import prod3Image from '../components/Images/prod3.png';
import prod4Image from '../components/Images/prod4.png';
import prod5Image from '../components/Images/prod5.png';
import prod6Image from '../components/Images/prod6.png';
import prod7Image from '../components/Images/prod7.png';
import favicon from '../components/Images/favicon.png'


function Product() {
  const [showForm, setShowForm] = useState(false);
  const [sortOption, setSortOption] = useState('time');
  const [products, setProducts] = useState([]);
  const [showProcessing, setShowProcessing] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [simulatorImage, setSimulatorImage] = useState(null);
  const [processingKey, setProcessingKey] = useState('initial');
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    link: '',
    images: []
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
    document.body.classList.add('product-page-active');
    
    // Remove the class when component unmounts
    return () => {
      document.body.classList.remove('product-page-active');
    };
  }, []);

  // Add key combination listener for preloaded products
  useEffect(() => {
    // Define the predefined products
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

    // Key sequence array to track pressed keys
    let keySequence = [];
    const targetSequence = ['y', 'c']; // Simplified key combo to "yc"

    const handleKeyDown = (event) => {
      // Add the key to the sequence
      keySequence.push(event.key.toLowerCase());
      
      // Only keep the last 2 keys pressed
      if (keySequence.length > 2) {
        keySequence = keySequence.slice(-2);
      }
      
      // Check if the sequence matches
      const sequenceMatches = targetSequence.every((key, index) => key === keySequence[index]);
      
      if (sequenceMatches && keySequence.length === 2) {
        // Load the predefined products
        setProducts(predefinedProducts);
        
        // Set local storage variables for Main page to react
        localStorage.setItem('productsLoaded', 'true');
        localStorage.setItem('productCount', '7');
        
        keySequence = []; // Reset the sequence
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleProcessingComplete = useCallback(() => {
    setIsProcessingComplete(true);
  }, []);

  const handleSimulatorImage = useCallback((imageUrl) => {
    setSimulatorImage(imageUrl);
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentProduct.name && currentProduct.price) {
      if (!showProcessing) {
        // Generate a unique key for the processing simulator to ensure it remounts
        setProcessingKey(`product-sim-${Date.now()}`);
        setShowProcessing(true);
      } else if (isProcessingComplete) {
        // For the first product, use the imported image
        const isFirstProduct = products.length === 0;
        let productImages = currentProduct.images;
        
        if (isFirstProduct) {
          productImages = [prod1Image]; // Use the imported image
        } else if (simulatorImage) {
          productImages = [simulatorImage, ...currentProduct.images];
        }
        
        const productToSave = {
          ...currentProduct,
          images: productImages
        };
        
        setProducts(prev => [...prev, productToSave]);
        setShowForm(false);
        setShowProcessing(false);
        setIsProcessingComplete(false);
        setSimulatorImage(null);
        setCurrentProduct({
          name: '',
          description: '',
          price: '',
          link: '',
          images: []
        });
      }
    }
  }, [currentProduct, showProcessing, isProcessingComplete, simulatorImage, products.length]);

  // Function to handle closing the form
  const handleCloseForm = () => {
    setShowForm(false);
    setShowProcessing(false);
    setIsProcessingComplete(false);
    setCurrentProduct({
      name: '',
      description: '',
      price: '',
      link: '',
      images: []
    });
  };

  return (
    <div className="product-page-container">
      <NavBar />
      <div className="product-page-content">
        <div className="product-container">
          <h2 className="product-title">MANAGE YOUR PRODUCTS</h2>
          
          <div className="product-filter-section">
            <div className="product-sort-options">
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
              <label>
                <input
                  type="radio"
                  name="sort"
                  value="popularity"
                  checked={sortOption === 'popularity'}
                  onChange={(e) => setSortOption(e.target.value)}
                />
                POPULARITY
              </label>
            </div>
          </div>

          <div className="product-list">
            {products.map((product, index) => (
              <div key={index} className="product-item" onClick={() => setShowForm(true)}>
                {product.images[0] && (
                  <img src={product.images[0]} alt={product.name} className="product-item-thumbnail" />
                )}
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">${product.price}</span>
                  {product.link && (
                    <span className="product-link">
                      <a href={product.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                        VIEW LINK
                      </a>
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            <div className="add-product-bar" onClick={() => setShowForm(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>ADD NEW PRODUCT</span>
            </div>
          </div>

          {showForm && (
            <div className="product-form">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 className="product-form-title">PRODUCT DETAILS</h3>
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
              
              <div className="product-form-group">
                <label>NAME</label>
                <input 
                  type="text" 
                  className="product-input-field"
                  placeholder="Product name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              
              <div className="product-form-group">
                <label>DESCRIPTION</label>
                <textarea 
                  className="product-input-field product-textarea"
                  placeholder="Describe your product..."
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct(prev => ({...prev, description: e.target.value}))}
                />
              </div>
              
              <div className="product-form-group">
                <label>PRICE</label>
                <input 
                  type="number" 
                  className="product-input-field"
                  placeholder="0.00"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct(prev => ({...prev, price: e.target.value}))}
                />
              </div>
              
              <div className="product-form-group">
                <label>LINK</label>
                <input 
                  type="url" 
                  className="product-input-field"
                  placeholder="https://example.com"
                  value={currentProduct.link}
                  onChange={(e) => setCurrentProduct(prev => ({...prev, link: e.target.value}))}
                />
              </div>
              
              <div className="product-divider"><span>PRODUCT IMAGES</span></div>
              
              <div className="product-form-group">
                <label>UPLOAD IMAGES</label>
                <div className="product-upload-section">
                  <div className="product-file-input-container">
                    <label className="product-file-input-label">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      SELECT IMAGES
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="product-file-input"
                      />
                    </label>
                    {currentProduct.images.length > 0 && (
                      <span className="product-file-name">
                        {currentProduct.images.length} {currentProduct.images.length === 1 ? 'file' : 'files'} selected
                      </span>
                    )}
                  </div>
                  
                  {currentProduct.images.length > 0 && (
                    <div className="product-image-grid">
                      {currentProduct.images.map((image, index) => (
                        <div key={index} className="product-image-preview">
                          <img 
                            src={image} 
                            alt={`Product image ${index + 1}`} 
                            style={{objectFit: 'contain'}}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {showProcessing && (
                <div className="product-processing-simulator">
                  {/* Using the stored key to ensure proper remounting */}
                  <ProcessingSimulator 
                    key={processingKey}
                    variant="analysis" 
                    onComplete={handleProcessingComplete}
                    onImageReady={handleSimulatorImage}
                    duration={19} // 19 seconds for product processing
                  />
                </div>
              )}

              <button className="product-submit-button" onClick={handleSubmit}>
                {!showProcessing ? 'SUBMIT PRODUCT' : (isProcessingComplete ? 'SAVE PRODUCT' : 'SUBMIT PRODUCT')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;