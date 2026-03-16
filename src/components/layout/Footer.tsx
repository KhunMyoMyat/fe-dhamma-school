"use client";

import { Sprout } from "lucide-react";
import { useTranslation } from "@/providers/LanguageProvider";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { t } = useTranslation();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-navy pt-15 pb-10 border-t border-gold/10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="size-12 gradient-maroon rounded-full flex items-center justify-center border-2 border-gold shadow-lg">
            <Sprout className="text-gold size-6" />
          </div>
          <span className="text-3xl font-black text-gold tracking-tighter uppercase">
            {t("common.dhammaSchool")}
          </span>
        </div>
        <p className="text-white font-myanmar text-sm italic max-w-lg mx-auto mb-10">
          {t("footer.quote")}
        </p>
        <div className="h-px w-20 bg-gold/30 mx-auto mb-8" />
        <p className="text-white text-[10px] uppercase tracking-[0.3em] font-bold">
          © {new Date().getFullYear()} {t("common.dhammaSchool")}. {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}
