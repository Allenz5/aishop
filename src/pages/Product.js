import React, { useState, useCallback } from 'react';
import NavBar from '../components/NavBar';
import './Product.css';
import ProcessingSimulator from '../components/ProcessingSimulator';

function Product() {
  const [showForm, setShowForm] = useState(false);
  const [sortOption, setSortOption] = useState('time');
  const [products, setProducts] = useState([]);
  const [showProcessing, setShowProcessing] = useState(false);
  const [isProcessingComplete, setIsProcessingComplete] = useState(false);
  const [simulatorImage, setSimulatorImage] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    link: '',
    images: []
  });

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
        setShowProcessing(true);
      } else if (isProcessingComplete) {
        const productToSave = {
          ...currentProduct,
          images: simulatorImage ? [simulatorImage, ...currentProduct.images] : currentProduct.images
        };
        
        setProducts(prev => [...prev, productToSave]);
        setShowForm(false);
        setShowProcessing(false);
        setIsProcessingComplete(false);
        setSimulatorImage(null);
        setCurrentProduct({
          name: '',
          description: '',
          category: '',
          price: '',
          link: '',
          images: []
        });
      }
    }
  }, [currentProduct, showProcessing, isProcessingComplete, simulatorImage]);

  return (
    <div className="main-container">
      <NavBar />
      <div className="main-content">
        <div className="product-container">
          <div className="product-list">
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
                <label>
                  <input
                    type="radio"
                    name="sort"
                    value="popularity"
                    checked={sortOption === 'popularity'}
                    onChange={(e) => setSortOption(e.target.value)}
                  />
                  Popularity
                </label>
              </div>
            </div>

            {products.map((product, index) => (
              <div key={index} className="product-item" onClick={() => setShowForm(true)}>
                {product.images[0] && (
                  <img src={product.images[0]} alt={product.name} className="product-thumbnail" />
                )}
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">${product.price}</span>
                  {product.link && (
                    <span className="product-link">
                      <a href={product.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                        View Link
                      </a>
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div className="add-product-bar" onClick={() => setShowForm(true)}>
              <span className="add-icon">+</span>
              <span>Add New Product</span>
            </div>
          </div>

          {showForm && (
            <div className="product-form">
              <div className="form-group">
                <label>Name:</label>
                <input 
                  type="text" 
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct(prev => ({...prev, name: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct(prev => ({...prev, description: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input 
                  type="text" 
                  value={currentProduct.category}
                  onChange={(e) => setCurrentProduct(prev => ({...prev, category: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input 
                  type="number" 
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct(prev => ({...prev, price: e.target.value}))}
                />
              </div>
              <div className="form-group">
                <label>Link:</label>
                <input 
                  type="url" 
                  value={currentProduct.link}
                  onChange={(e) => setCurrentProduct(prev => ({...prev, link: e.target.value}))}
                  placeholder="https://example.com"
                />
              </div>
              <div className="form-group">
                <label>Images:</label>
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                <div className="image-grid">
                  {currentProduct.images.map((image, index) => (
                    <div key={index} className="image-preview-container">
                      <img src={image} alt={`Preview ${index + 1}`} className="image-preview" />
                    </div>
                  ))}
                </div>
              </div>
              
              {showProcessing && (
                <div className="processing-section">
                  <ProcessingSimulator 
                    variant="analysis" 
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

export default Product;
