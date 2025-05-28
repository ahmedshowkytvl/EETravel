import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';

interface NavigationContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [location] = useLocation();

  // Show loader on location change
  useEffect(() => {
    setIsLoading(true);
    
    // Hide loader after a short delay to simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Adjust timing as needed
    
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <NavigationContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </NavigationContext.Provider>
  );
};