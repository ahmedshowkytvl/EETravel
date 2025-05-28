import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Translation type definition
export interface Translation {
  id: number;
  key: string;
  enText: string;
  arText: string | null;
  context: string | null;
  category: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

// Language settings type definition
export interface LanguageSettings {
  id?: number;
  defaultLanguage: string;
  availableLanguages: string[] | string;
  rtlLanguages: string[] | string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

// Context type definition
interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  translations: Translation[];
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  loading: boolean;
  languageSettings: LanguageSettings | null;
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  setLanguage: () => {},
  translations: [],
  isRTL: false,
  t: (key: string, defaultText?: string) => defaultText || key,
  loading: true,
  languageSettings: null,
});

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get stored language from localStorage or default to 'en'
  const getInitialLanguage = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  };

  const [currentLanguage, setCurrentLanguageState] = useState<string>(getInitialLanguage);
  const queryClient = useQueryClient();

  // Fetch translations
  const { 
    data: translations = [], 
    isLoading: translationsLoading 
  } = useQuery({ 
    queryKey: ['translations'], 
    queryFn: () => apiRequest<Translation[]>('/api/translations'), 
  });

  // Fetch language settings
  const { 
    data: languageSettings, 
    isLoading: settingsLoading 
  } = useQuery({ 
    queryKey: ['languageSettings'], 
    queryFn: () => apiRequest<LanguageSettings>('/api/translations/settings'), 
  });

  // Set language and save to localStorage
  const setLanguage = (lang: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
    setCurrentLanguageState(lang);
    
    // Update document attributes for RTL
    const isRTL = languageSettings?.rtlLanguages?.includes(lang) || false;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Add/remove RTL class to body
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  };

  // Update document attributes on language settings change
  useEffect(() => {
    if (languageSettings) {
      // Parse RTL languages if it's a string
      const rtlLanguages = typeof languageSettings.rtlLanguages === 'string'
        ? JSON.parse(languageSettings.rtlLanguages)
        : languageSettings.rtlLanguages || [];
        
      const isRTL = rtlLanguages.includes(currentLanguage);
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLanguage;
      
      // Add/remove RTL class to body
      if (isRTL) {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    }
  }, [languageSettings, currentLanguage]);

  // Translation function
  const t = (key: string, defaultText?: string): string => {
    const translation = translations.find(t => t.key === key);
    
    if (!translation) {
      return defaultText || key;
    }
    
    if (currentLanguage === 'ar' && translation.arText) {
      return translation.arText;
    }
    
    return translation.enText || defaultText || key;
  };

  // Check if current language is RTL
  const rtlLanguages = typeof languageSettings?.rtlLanguages === 'string' 
    ? JSON.parse(languageSettings.rtlLanguages as string) 
    : languageSettings?.rtlLanguages || [];
  const isRTL = rtlLanguages.includes(currentLanguage) || false;
  
  // Determine if we're still loading
  const loading = translationsLoading || settingsLoading;

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        translations,
        isRTL,
        t,
        loading,
        languageSettings: languageSettings || null,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = () => useContext(LanguageContext);

export default useLanguage;