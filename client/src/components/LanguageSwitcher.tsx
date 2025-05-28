import React from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage, t, languageSettings, isRTL } = useLanguage();

  if (!languageSettings) {
    return null;
  }

  // Parse available languages if it's a string
  const availableLanguages = typeof languageSettings.availableLanguages === 'string' 
    ? JSON.parse(languageSettings.availableLanguages) 
    : languageSettings.availableLanguages || [];

  // Parse RTL languages if it's a string  
  const rtlLanguages = typeof languageSettings.rtlLanguages === 'string'
    ? JSON.parse(languageSettings.rtlLanguages)
    : languageSettings.rtlLanguages || [];

  if (!availableLanguages.length) {
    return null;
  }

  const getLanguageDisplay = (code: string) => {
    switch (code) {
      case 'en':
        return t('common.english', 'English');
      case 'ar':
        return t('common.arabic', 'Arabic');
      default:
        return code;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
          <Globe className="h-4 w-4" />
          <span className={`text-sm ${isRTL ? 'font-arabic' : ''}`}>{getLanguageDisplay(currentLanguage)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lang: string) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`${currentLanguage === lang ? 'font-medium' : ''} ${
              rtlLanguages.includes(lang) ? 'font-arabic text-right' : ''
            }`}
          >
            {getLanguageDisplay(lang)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;