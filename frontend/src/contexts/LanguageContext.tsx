import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import en from '@/locales/en.json';
import hi from '@/locales/hi.json';
import ta from '@/locales/ta.json';
import te from '@/locales/te.json';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te';

const translations: Record<LanguageCode, typeof en> = {
  en, hi, ta, te
};

const languageMap: Record<string, LanguageCode> = {
  'en': 'en', 'hi': 'hi', 'ta': 'ta', 'te': 'te'
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof en;
  detectedLanguage: LanguageCode;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const detectLanguage = (): LanguageCode => {
    const browserLang = navigator.language.split('-')[0];
    return languageMap[browserLang] || 'en';
  };

  const [detectedLanguage] = useState<LanguageCode>(detectLanguage);
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('spendwise-language');
    return (saved as LanguageCode) || detectLanguage();
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('spendwise-language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Deep merge utility to ensure fallback to English for missing keys
  const deepMerge = (base: any, override: any): any => {
    const output = { ...base };
    for (const key in override) {
      if (typeof override[key] === 'object' && override[key] !== null && !Array.isArray(override[key])) {
        output[key] = deepMerge(output[key] || {}, override[key]);
      } else {
        output[key] = override[key];
      }
    }
    return output;
  };

  const currentTranslation = deepMerge(en, translations[language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: currentTranslation, detectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
