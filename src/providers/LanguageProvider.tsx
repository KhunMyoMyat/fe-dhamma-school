"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import mm from "../locales/mm.json";
import th from "../locales/th.json";

type Language = "en" | "mm" | "th";
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const translations: Record<Language, any> = { en, mm, th };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang && ["en", "mm", "th"].includes(savedLang)) {
      setLanguageState(savedLang);
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("lang", lang);
  };

  const t = React.useCallback((path: string): string => {
    const keys = path.split(".");
    let current = (translations as any)[language];

    for (const key of keys) {
      if (!current || current[key] === undefined) {
        // Fallback to English if key missing in current language
        let fallback = translations["en"];
        for (const fallbackKey of keys) {
          if (!fallback || fallback[fallbackKey] === undefined) return path;
          fallback = fallback[fallbackKey];
        }
        return typeof fallback === "string" ? fallback : path;
      }
      current = current[key];
    }

    return typeof current === "string" ? current : path;
  }, [language]);

  const contextValue = React.useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
