"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/admin/Sidebar";
import { cn } from "@/lib/utils";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (pathname === "/admin/login") {
      if (token) {
        router.push("/admin/dashboard");
      }
    } else {
      if (!token) {
        router.push("/admin/login");
      }
    }
    
    setIsAuthorized(true);
    setIsLoading(false);
  }, [pathname, router]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream/20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 text-maroon animate-spin" />
          <p className="text-maroon font-bold tracking-widest uppercase text-xs">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-cream/10">
      {!isLoginPage && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />
      )}
      <main className={cn(
        "min-h-screen transition-all duration-300",
        !isLoginPage && isSidebarOpen ? "lg:pl-72" : ""
      )}>
        {children}
      </main>
    </div>
  );
}
