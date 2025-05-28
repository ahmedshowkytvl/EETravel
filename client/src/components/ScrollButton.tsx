import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ScrollDirection = 'up' | 'down';

interface ScrollButtonProps {
  /** Threshold in pixels from the top/bottom when button should appear */
  threshold?: number;
  /** Position of the button (default is bottom right) */
  position?: 'bottom-right' | 'bottom-left';
  /** Color/variant for the button */
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  /** Size of the button */
  size?: 'icon' | 'sm' | 'lg';
}

export function ScrollButton({
  threshold = 300,
  position = 'bottom-right',
  variant = 'secondary',
  size = 'icon',
}: ScrollButtonProps) {
  const [visible, setVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('up');
  const [userScrolling, setUserScrolling] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Check scroll position and update button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Determine if we should be showing the button (past threshold)
      const shouldBeVisible = scrollY > threshold;
      
      // Determine if we're closer to the top or bottom
      const scrollPercentage = scrollY / (documentHeight - windowHeight);
      const newDirection = scrollPercentage < 0.5 ? 'down' : 'up';
      
      setVisible(shouldBeVisible);
      setScrollDirection(newDirection);
      setUserScrolling(true);
      
      // Reset user scrolling flag after a delay
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      const newTimeoutId = setTimeout(() => {
        setUserScrolling(false);
      }, 1000);
      
      setTimeoutId(newTimeoutId);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Clean up timeout when component unmounts
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, timeoutId]);
  
  const handleClick = () => {
    if (scrollDirection === 'up') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ 
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  };
  
  // Determine position classes
  const positionClasses = position === 'bottom-right' 
    ? 'bottom-6 right-6'
    : 'bottom-6 left-6';
  
  if (!visible) return null;
  
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'fixed z-50 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-110 hover:opacity-100',
        positionClasses,
        userScrolling ? 'opacity-75' : 'opacity-100',
        'bg-opacity-90 backdrop-blur-sm'
      )}
      onClick={handleClick}
      aria-label={scrollDirection === 'up' ? 'Scroll to top' : 'Scroll to bottom'}
    >
      {scrollDirection === 'up' ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ArrowDown className="h-4 w-4" />
      )}
    </Button>
  );
}