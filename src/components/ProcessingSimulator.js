import React, { useState, useEffect, useCallback } from 'react';
import './ProcessingSimulator.css';

function ProcessingSimulator({ variant = 'default', onComplete, onImageReady }) {
  const [lines, setLines] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);

  const variants = {
    default: {
      lines: [
        "Initializing system...",
        "Loading configurations...",
        "Setting up environment...",
        "Process complete"
      ],
      image: null
    },
    analysis: {
      lines: [
        "Analyzing product data...",
        "Processing specifications...",
        "Validating information...",
        "Analysis complete"
      ],
      image: "/images/creative.png"
    },
    creative: {
      lines: [
        "Gathering inspiration...",
        "Exploring creative directions...",
        "Generating concepts...",
        "Refining ideas...",
        "Creation complete"
      ],
      image: "/images/creative.png"
    },
    training: {
      lines: [
        "Loading training data...",
        "Initializing model...",
        "Training in progress...",
        "Fine-tuning parameters...",
        "Validating results...",
        "Training complete"
      ],
      image: "/images/training.png"
    }
  };

  // Memoize the callbacks to prevent unnecessary re-renders
  const memoizedOnComplete = useCallback(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  const memoizedOnImageReady = useCallback((image) => {
    if (onImageReady) onImageReady(image);
  }, [onImageReady]);

  useEffect(() => {
    // Reset state only when variant changes
    setLines([]);
    setIsProcessing(true);

    const currentVariant = variants[variant];
    let currentIndex = 0;
    let timeoutId = null;
    
    const showNextLine = () => {
      if (currentIndex < currentVariant.lines.length) {
        setLines(prevLines => [...prevLines, currentVariant.lines[currentIndex]]);
        currentIndex++;
        
        if (currentIndex < currentVariant.lines.length) {
          const nextInterval = Math.random() * 1500 + 500;
          timeoutId = setTimeout(showNextLine, nextInterval);
        } else {
          setIsProcessing(false);
          memoizedOnComplete();
          if (currentVariant.image) {
            memoizedOnImageReady(currentVariant.image);
          }
        }
      }
    };

    showNextLine();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [variant, memoizedOnComplete, memoizedOnImageReady]); // Only depend on variant changes

  return (
    <div className="simulator-container">
      <div className="simulator-content">
        <div className="simulator-text">
          {lines.map((line, index) => (
            <div key={index} className="simulator-line">
              {`> ${line}`}
            </div>
          ))}
        </div>
        {!isProcessing && variants[variant].image && (
          <div className="simulator-image">
            <img src={variants[variant].image} alt="Process result" />
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(ProcessingSimulator); // Add memo to prevent unnecessary re-renders
