"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Sprout, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Courses", icon: BookOpen, href: "/admin/courses" },
  { label: "Events", icon: Calendar, href: "/admin/events" },
  { label: "Teachings", icon: Sprout, href: "/admin/teachings" },
  { label: "Inquiries", icon: MessageSquare, href: "/admin/inquiries" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gold/10 hidden lg:flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-8 border-b border-gold/5 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="size-12 gradient-maroon rounded-2xl flex items-center justify-center mb-3 shadow-lg border border-gold/30">
            <Sprout className="text-gold size-6" />
          </div>
          <h2 className="text-xl font-black text-maroon tracking-tighter uppercase leading-none">
            Dhamma <span className="text-gold">Admin</span>
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2 mt-4">
        <p className="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em] mb-6 ml-4">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                isActive 
                  ? "bg-maroon text-white shadow-lg shadow-maroon/20" 
                  : "text-navy/60 hover:bg-cream/50 hover:text-maroon"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon className={cn("size-5 transition-colors", isActive ? "text-gold" : "group-hover:text-maroon")} />
                <span className="font-bold tracking-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="size-4 text-gold" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-gold/5 space-y-2">
        <Link 
          href="/admin/settings"
          className="flex items-center gap-4 p-4 rounded-2xl text-navy/60 hover:bg-cream/50 hover:text-maroon transition-all group"
        >
          <Settings className="size-5 group-hover:rotate-45 transition-transform duration-500" />
          <span className="font-bold tracking-tight">Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group"
        >
          <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold tracking-tight">Logout</span>
        </button>
      </div>
    </aside>
  );
}
