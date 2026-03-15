"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

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
    
    // If we are on login page, we don't need to check token globally here
    // but we can redirect to dashboard if token exists
    if (pathname === "/admin/login") {
      if (token) {
        router.push("/admin/dashboard");
      } else {
        setIsAuthorized(true);
        setIsLoading(false);
      }
      return;
    }

    // Protection for other admin routes
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuthorized(true);
      setIsLoading(false);
    }
  }, [pathname, router]);

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

  return <>{children}</>;
}
