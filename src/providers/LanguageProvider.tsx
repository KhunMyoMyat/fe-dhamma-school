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

  const t = (path: string): string => {
    const keys = path.split(".");
    let current = translations[language];

    for (const key of keys) {
      if (current[key] === undefined) {
        // Fallback to English if key missing in current language
        let fallback = translations["en"];
        for (const fallbackKey of keys) {
          if (fallback[fallbackKey] === undefined) return path;
          fallback = fallback[fallbackKey];
        }
        return typeof fallback === "string" ? fallback : path;
      }
      current = current[key];
    }

    return typeof current === "string" ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {/* Prevent hydration mismatch by only rendering after mount if needed, 
          but usually we want the layout to be there immediately. 
          For simplicity in this step, we just provide the context. */}
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
