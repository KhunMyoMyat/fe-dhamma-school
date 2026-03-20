"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { useTranslation } from "@/providers/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  if (pathname?.startsWith("/admin")) return null;

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/courses", label: t("nav.courses") },
    { href: "/events", label: t("nav.events") },
    { href: "/teachings", label: t("nav.teachings") },
    { href: "/monthly-donors", label: t("nav.monthlyDonors") },
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

        <div className="hidden lg:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-bold tracking-widest uppercase transition-all relative group",
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
