import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@shared/translations';
import { getTranslation } from '@shared/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: ReturnType<typeof getTranslation>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load language preference from localStorage
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && ['en', 'hi', 'gu'].includes(saved)) {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: getTranslation(language) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return a default context if not within provider
    return { language: 'en' as Language, setLanguage: () => {}, t: getTranslation('en') };
  }
  return context;
}
