"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sprout, ChevronDown, Menu, Heart } from "lucide-react";
import { useTranslation } from "@/providers/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const mainLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/teachings", label: t("nav.teachings") },
    { href: "/monthly-donors", label: t("nav.monthlyDonors") },
  ];

  const infoLinks = [
    { href: "/about", label: t("nav.about") },
    { href: "/events", label: t("nav.events") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const allLinks = [...mainLinks, ...infoLinks];

  return (
    <nav className="sticky top-0 z-50 bg-cream border-b border-gold/20 shadow-sm">
      <div className="container mx-auto h-20 flex items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95 shrink-0"
        >
          <div className="size-10 sm:size-12 gradient-maroon rounded-full flex items-center justify-center border-2 border-gold shadow-lg shadow-maroon/20 group-hover:shadow-gold/30 transition-all duration-500">
            <Sprout className="text-gold size-6 sm:size-7" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-maroon font-black text-lg sm:text-2xl tracking-tighter leading-none mb-1 sm:mb-2 text-nowrap">
              {t("common.dhammaSchool")}
            </h1>
            <p className="text-gold font-myanmar text-[10px] sm:text-xs font-bold leading-none tracking-widest opacity-80 whitespace-nowrap">
              ဓမ္မစာသင်ကျောင်း
            </p>
          </div>
        </Link>

        {/* Desktop Links - Adjusted breakpoint to XL for Myanmar text */}
        <div className="hidden xl:flex items-center gap-6 2xl:gap-10">
          {mainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[13px] font-bold tracking-widest uppercase transition-all relative group py-2 whitespace-nowrap",
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
                "text-[13px] font-bold tracking-widest uppercase transition-all flex items-center gap-1 py-4 whitespace-nowrap",
                infoLinks.some((l) => pathname === l.href)
                  ? "text-maroon"
                  : "text-navy/50 hover:text-maroon",
              )}
            >
              {t("nav.info")}
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-300",
                  isInfoOpen && "rotate-180",
                )}
              />
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
                        "block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap",
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

        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />

          <Link
            href="/donate"
            className={cn(
              buttonVariants({ variant: "default" }),
              "gradient-maroon text-white border-2 border-gold px-4 py-2 sm:px-8 h-10 sm:h-auto rounded-full shadow-lg shadow-maroon/20 hover:shadow-maroon/40 hover:-translate-y-0.5 transition-all font-bold tracking-tight hidden lg:flex items-center gap-2",
            )}
          >
            <Heart className="size-4 hidden sm:block" />
            <span className="whitespace-nowrap">{t("nav.donate")}</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "xl:hidden size-10 rounded-xl hover:bg-maroon/5 text-maroon flex items-center justify-center",
              )}
            >
              <Menu className="size-6" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] bg-cream sm:w-[400px] p-0 border-l border-gold/20"
            >
              <SheetHeader className="p-8 border-b border-gold/10 bg-white/50">
                <SheetTitle className="flex items-center gap-3">
                  <div className="size-10 gradient-maroon rounded-full flex items-center justify-center border-2 border-gold shadow-lg">
                    <Sprout className="text-gold size-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-maroon font-black text-xl leading-none mb-1">
                      {t("common.dhammaSchool")}
                    </div>
                    <div className="text-gold font-myanmar text-[10px] font-bold uppercase tracking-[0.2em]">
                      ဓမ္မစာသင်ကျောင်း
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col p-6 gap-2">
                {allLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
                      pathname === link.href
                        ? "bg-maroon text-white shadow-xl shadow-maroon/20"
                        : "text-navy/60 hover:bg-maroon/5 hover:text-maroon",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 space-y-4 bg-white/50 border-t border-gold/10">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xs font-black text-gold uppercase tracking-widest">
                    {t("common.language")}
                  </p>
                  <LanguageSwitcher />
                </div>
                <Link
                  href="/donate"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full h-14 gradient-maroon text-white border-2 border-gold rounded-2xl shadow-xl shadow-maroon/20 font-black text-lg",
                  )}
                >
                  {t("nav.donate")}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
