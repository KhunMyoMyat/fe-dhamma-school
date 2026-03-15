"use client";

import { useTranslation } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  const locales = [
    { code: "en", label: "EN", flag: "🇺🇸" },
    { code: "mm", label: "MM", flag: "🇲🇲" },
    { code: "th", label: "TH", flag: "🇹🇭" },
  ] as const;

  return (
    <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-full border border-gold/20 shadow-sm">
      <div className="size-8 rounded-full bg-cream flex items-center justify-center border border-gold/10 ml-1">
        <Globe className="size-4 text-maroon" />
      </div>
      <div className="flex items-center">
        {locales.map((loc) => (
          <button
            key={loc.code}
            onClick={() => setLanguage(loc.code)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[10px] font-black transition-all cursor-pointer",
              language === loc.code 
                ? "bg-maroon text-white shadow-md shadow-maroon/20" 
                : "text-navy/40 hover:text-maroon hover:bg-cream"
            )}
          >
            {loc.label}
          </button>
        ))}
      </div>
    </div>
  );
}
