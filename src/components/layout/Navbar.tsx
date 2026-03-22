"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sprout, ChevronDown } from "lucide-react";
import { useTranslation } from "@/providers/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const mainLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/courses", label: t("nav.courses") },
    { href: "/teachings", label: t("nav.teachings") },
    { href: "/monthly-donors", label: t("nav.monthlyDonors") },
  ];

  const infoLinks = [
    { href: "/about", label: t("nav.about") },
    { href: "/events", label: t("nav.events") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-xl border-b border-gold/20 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95 shrink-0"
        >
          <div className="size-12 gradient-maroon rounded-full flex items-center justify-center border-2 border-gold shadow-lg shadow-maroon/20 group-hover:shadow-gold/30 transition-all duration-500">
            <Sprout className="text-gold size-7" />
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-maroon font-black text-2xl tracking-tighter leading-none mb-2">
              {t("common.dhammaSchool")}
            </h1>
            <p className="text-gold font-myanmar text-xs font-bold leading-none tracking-widest opacity-80">
              ဓမ္မစာသင်ကျောင်း
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-bold tracking-widest uppercase transition-all relative group py-2",
                pathname === link.href
                  ? "text-maroon"
                  : "text-navy/50 hover:text-maroon",
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </Link>
          ))}

          {/* Info Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsInfoOpen(true)}
            onMouseLeave={() => setIsInfoOpen(false)}
          >
            <button
              className={cn(
                "text-sm font-bold tracking-widest uppercase transition-all flex items-center gap-1 py-4",
                infoLinks.some(l => pathname === l.href)
                  ? "text-maroon"
                  : "text-navy/50 hover:text-maroon",
              )}
            >
              {t("nav.info")}
              <ChevronDown className={cn("size-4 transition-transform duration-300", isInfoOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isInfoOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white border border-gold/20 rounded-2xl shadow-2xl p-2 py-3 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-gold to-maroon" />
                  {infoLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors",
                        pathname === link.href
                          ? "bg-maroon/5 text-maroon"
                          : "text-navy/60 hover:bg-gold/5 hover:text-maroon",
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/donate"
            className={cn(
              buttonVariants({ variant: "default" }),
              "gradient-maroon text-white border-2 border-gold px-8 rounded-full shadow-lg shadow-maroon/20 hover:shadow-maroon/40 hover:-translate-y-0.5 transition-all font-bold tracking-tight hidden md:flex",
            )}
          >
            {t("nav.donate")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
