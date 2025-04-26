import React, { useState, useEffect, useCallback, useRef } from 'react';
// Import the video file directly
import bgVideo from '../components/Images/bg.mp4';
// Import the product and agent images
import prod1Image from '../components/Images/prod1.png';
import agentImage from '../components/Images/agent.gif';
import './ProcessingSimulator.css';

function ProcessingSimulator({ variant = 'default', onComplete, onImageReady, duration }) {
  const [currentStep, setCurrentStep] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0);
  const loadingBarRef = useRef(null);
  
  const variants = {
    default: {
      steps: [
        "INITIALIZING SYSTEM",
        "LOADING CONFIGURATIONS",
        "SCANNING RESOURCES",
        "PREPARING ENVIRONMENT",
        "OPTIMIZING ASSETS",
        "FINALIZING SETUP",
        "PROCESS COMPLETE"
      ],
      media: bgVideo,
      type: "video",
      defaultDuration: 2.00 // 200 seconds
    },
    analysis: {
      steps: [
        "ANALYZING PRODUCT DATA",
        "EXTRACTING METADATA",
        "PROCESSING SPECIFICATIONS",
        "VALIDATING INFORMATION",
        "CATEGORIZING PRODUCT",
        "ANALYSIS COMPLETE"
      ],
      media: prod1Image, // Use prod1Image for product analysis
      type: "image", 
      defaultDuration: 1.9 // 19 seconds for product analysis
    },
    creative: {
      steps: [
        "INITIALIZING CREATIVE ENGINE",
        "GATHERING BRAND ASSETS",
        "ANALYZING BRAND IDENTITY",
        "EXPLORING CREATIVE DIRECTIONS",
        "BUILDING COLOR SCHEMES",
        "GENERATING LAYOUT OPTIONS",
        "OPTIMIZING FOR USER EXPERIENCE",
        "CREATING VIRTUAL ARCHITECTURE",
        "ASSEMBLING PRODUCT CATALOG",
        "RENDERING 3D ELEMENTS",
        "APPLYING LIGHTING EFFECTS",
        "IMPLEMENTING INTERACTIVE FEATURES",
        "FINALIZING STORE DETAILS",
        "OPTIMIZING PERFORMANCE",
        "CREATION COMPLETE"
      ],
      media: bgVideo,
      type: "video",
      defaultDuration: 2.00 // 200 seconds for space creation
    },
    training: {
      steps: [
        "LOADING TRAINING DATA",
        "PREPARING DATASETS",
        "INITIALIZING MODEL",
        "CONFIGURING PARAMETERS",
        "ANALYZING BASELINE METRICS",
        "TRAINING IN PROGRESS",
        "PROCESSING BATCH 1/4",
        "PROCESSING BATCH 2/4",
        "PROCESSING BATCH 3/4",
        "PROCESSING BATCH 4/4",
        "FINE-TUNING PARAMETERS",
        "OPTIMIZING WEIGHTS",
        "VALIDATING RESULTS",
        "PERFORMING FINAL CALIBRATION",
        "TRAINING COMPLETE"
      ],
      media: agentImage, // Use agent.gif for training
      type: "image", // Changed to image type since it's a GIF
      defaultDuration: 1.68 // Updated to 168 seconds for agent training
    }
  };

  // Memoize the callbacks to prevent unnecessary re-renders
  const memoizedOnComplete = useCallback(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  const memoizedOnImageReady = useCallback((media) => {
    if (onImageReady) onImageReady(media);
  }, [onImageReady]);

  useEffect(() => {
    // Reset state when variant changes
    setCurrentStep('');
    setIsProcessing(true);
    setIsComplete(false);

    const currentVariant = variants[variant];
    const steps = currentVariant.steps;
    
    // Use provided duration or default from variant
    const totalDuration = (duration || currentVariant.defaultDuration);
    
    // Set animation duration for CSS animation
    setAnimationDuration(totalDuration);
    
    // Set the initial step
    setCurrentStep(steps[0]);
    
    // Define step durations as percentages of total time
    const stepDurations = [];
    let remainingPercentage = 1.0;
    
    // Create variable durations for each step
    for (let i = 0; i < steps.length; i++) {
      // Last step is always quick
      if (i === steps.length - 1) {
        stepDurations.push(0.05);
        remainingPercentage -= 0.05;
      } else {
        // Create variable durations - some steps take longer than others
        const baseValue = remainingPercentage / (steps.length - i);
        const variationFactor = 0.7; // 70% variation
        
        // Generate a value between baseValue*(1-variationFactor) and baseValue*(1+variationFactor)
        let rand = Math.random();
        rand = Math.pow(rand, 1.5); // Bias toward slower steps
        
        const duration = baseValue * (1 - variationFactor + 2 * variationFactor * rand);
        stepDurations.push(duration);
        remainingPercentage -= duration;
      }
    }
    
    // Normalize step durations to ensure they sum to 1.0
    const durationSum = stepDurations.reduce((sum, val) => sum + val, 0);
    const normalizedDurations = stepDurations.map(d => d / durationSum);
    
    // Calculate when each step should start (as a percentage of total progress)
    const stepStartPoints = normalizedDurations.reduce((acc, duration, index) => {
      if (index === 0) return [0];
      return [...acc, acc[index - 1] + normalizedDurations[index - 1]];
    }, [0]);
    
    // Schedule the step changes
    let currentStepIndex = 0;
    const stepTimers = [];
    
    // For each step, schedule when to change to that step
    for (let i = 1; i < steps.length; i++) {
      const delay = stepStartPoints[i] * totalDuration * 1000; // convert to milliseconds
      const timer = setTimeout(() => {
        setCurrentStep(steps[i]);
        currentStepIndex = i;
      }, delay);
      stepTimers.push(timer);
    }
    
    // Schedule completion
    const completionTimer = setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      memoizedOnComplete();
      if (currentVariant.media) {
        memoizedOnImageReady(currentVariant.media);
      }
      
      // Only set localStorage for creative variant to not affect product page
      if (variant === 'creative') {
        localStorage.setItem('storeGenerated', 'true');
      }
    }, totalDuration * 1000); // convert to milliseconds
    
    // Cleanup function
    return () => {
      stepTimers.forEach(timer => clearTimeout(timer));
      clearTimeout(completionTimer);
    };
  }, [variant, duration, memoizedOnComplete, memoizedOnImageReady]);

  useEffect(() => {
    // Apply CSS animation to the loading bar directly
    if (loadingBarRef.current && animationDuration > 0) {
      // Remove any existing animation first
      loadingBarRef.current.style.animation = 'none';
      
      // Force a reflow to ensure the animation restarts
      // eslint-disable-next-line no-unused-expressions
      loadingBarRef.current.offsetHeight;
      
      // Apply the animation with the correct duration
      loadingBarRef.current.style.animation = `loading-bar-fill ${animationDuration}s linear forwards`;
    }
  }, [animationDuration, loadingBarRef]);

  // Adjust header text based on variant
  const getHeaderText = () => {
    switch(variant) {
      case 'analysis':
        return 'PROCESSING PRODUCT';
      case 'creative':
        return 'GENERATING YOUR STORE SPACE';
      case 'training':
        return 'TRAINING YOUR AGENT';
      default:
        return 'PROCESSING';
    }
  };

  // Adjust completion message based on variant
  const getCompletionMessage = () => {
    switch(variant) {
      case 'analysis':
        return 'PRODUCT READY';
      case 'creative':
        return 'YOUR STORE SPACE IS READY';
      case 'training':
        return 'TRAINING COMPLETE';
      default:
        return 'PROCESS COMPLETE';
    }
  };

  return (
    <div className="simulator-container">
      <div className="simulator-content">
        <div className="simulator-header">{getHeaderText()}</div>
        
        <div className="loading-container">
          <div className="loading-bar-container">
            <div 
              ref={loadingBarRef}
              className={`loading-bar ${isComplete ? 'loading-bar-complete' : ''}`}
              data-duration={animationDuration}
            ></div>
          </div>
          <div className="loading-step">{currentStep}</div>
        </div>
        
        {isComplete && (
          <div className="simulator-result">
            <div className="completion-message">{getCompletionMessage()}</div>
            
            {variants[variant].media && (
              <div className="simulator-image-container">
                <div className="simulator-image">
                  {variants[variant].type === "video" ? (
                    <video 
                      src={variants[variant].media} 
                      autoPlay 
                      loop 
                      muted 
                      style={{
                        width: '100%',
                        height: '100%',
                        aspectRatio: '2/1',
                        objectFit: 'cover',
                        objectPosition: 'center'
                      }}
                    />
                  ) : (
                    <img 
                      src={variants[variant].media} 
                      alt="Generated result" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(ProcessingSimulator);