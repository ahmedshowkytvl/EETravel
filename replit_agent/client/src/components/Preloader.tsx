import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import animationData from '../assets/animations/travel-animation.json';

interface PreloaderProps {
  isVisible: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ isVisible }) => {
  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const lottieInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (lottieContainerRef.current && !lottieInstanceRef.current) {
      // Initialize Lottie with our local animation data
      try {
        lottieInstanceRef.current = lottie.loadAnimation({
          container: lottieContainerRef.current!,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: animationData // Using the travel animation with globe and plane
        });
      } catch (error) {
        console.error('Error loading Lottie animation:', error);
      }
    }

    return () => {
      if (lottieInstanceRef.current) {
        lottieInstanceRef.current.destroy();
        lottieInstanceRef.current = null;
      }
    };
  }, []);

  // Show/hide animation based on visibility
  useEffect(() => {
    if (lottieInstanceRef.current) {
      if (isVisible) {
        lottieInstanceRef.current.play();
      } else {
        lottieInstanceRef.current.pause();
      }
    }
  }, [isVisible]);

  return (
    <div 
      id="loader" 
      className={`fixed top-0 left-0 w-full h-full bg-white bg-opacity-95 z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      <div id="lottie-loader" ref={lottieContainerRef} className="w-80 h-80" />
      <div className="loader-text mt-4 text-primary font-medium text-xl">
        Preparing your journey...
      </div>
    </div>
  );
};

export default Preloader;