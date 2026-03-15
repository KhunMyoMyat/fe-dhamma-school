"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Sprout, 
  TrendingUp, 
  LogOut,
  Bell,
  Search,
  Plus,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Active Students", value: "1,280", icon: Users, color: "blue" },
  { label: "Online Courses", value: "24", icon: BookOpen, color: "maroon" },
  { label: "Future Events", value: "12", icon: Calendar, color: "gold" },
  { label: "Dhamma Teachings", value: "450", icon: Sprout, color: "bodhi" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token) {
      router.push("/admin/login");
    } else if (user) {
      setAdminUser(JSON.parse(user));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  };

  if (!adminUser) return null;

  return (
    <div className="min-h-screen bg-cream/10 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-maroon tracking-tight mb-2 uppercase">
              Dashboard <span className="text-gold">Overview</span>
            </h1>
            <p className="text-navy/50 font-myanmar font-medium">
              မင်္ဂလာပါ {adminUser.name} - စီမံခန့်ခွဲရေး အနှစ်ချုပ်ကို ကြည့်ရှုနေပါသည်။
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="size-12 rounded-2xl bg-white border border-gold/20 flex items-center justify-center text-navy/40 hover:text-maroon transition-colors shadow-sm">
              <Bell className="size-6" />
            </button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-12 border-maroon/20 text-maroon hover:bg-maroon hover:text-white rounded-xl font-bold px-6"
            >
              <LogOut className="size-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-gold/10 shadow-xl shadow-maroon/5 flex items-center gap-6 group hover:border-gold transition-all"
            >
              <div className="size-16 rounded-2xl bg-cream flex items-center justify-center group-hover:bg-maroon transition-colors">
                <stat.icon className="size-8 text-maroon group-hover:text-gold transition-colors" />
              </div>
              <div>
                <p className="text-xs font-black text-navy/30 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-navy tracking-tight">
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Recent Courses/Content Section Placeholder */}
            <section className="bg-white rounded-[3rem] border border-gold/10 p-10 shadow-xl shadow-maroon/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-maroon uppercase tracking-tight">
                  Recent Content
                </h2>
                <Button variant="ghost" className="text-gold hover:text-maroon font-bold">
                  View All <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-6 rounded-2xl bg-cream/30 border border-gold/5 hover:border-gold/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-maroon/10 flex items-center justify-center">
                        <BookOpen className="size-6 text-maroon" />
                      </div>
                      <div>
                        <p className="font-bold text-navy">Sample Course Name #{item}</p>
                        <p className="text-xs text-navy/40">Last updated 2 hours ago</p>
                      </div>
                    </div>
                    <Badge color="gold">Active</Badge>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-black text-maroon uppercase tracking-tight ml-4">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <QuickButton label="Add New Course" icon={Plus} color="maroon" />
              <QuickButton label="Schedule Event" icon={Calendar} color="gold" />
              <QuickButton label="Post Teaching" icon={Sprout} color="bodhi" />
              <QuickButton label="View Analytics" icon={TrendingUp} color="navy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickButton({ label, icon: Icon, color }: any) {
  return (
    <button className="w-full h-20 bg-white hover:bg-cream rounded-[1.5rem] border border-gold/10 hover:border-gold/50 transition-all p-6 flex items-center justify-between group shadow-sm">
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-maroon transition-colors">
          <Icon className="size-5 text-navy group-hover:text-white transition-colors" />
        </div>
        <span className="font-bold text-navy group-hover:text-maroon transition-colors">{label}</span>
      </div>
      <ArrowRight className="size-5 text-gold group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

function Badge({ children, color }: any) {
  return (
    <span className="bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-gold/20">
      {children}
    </span>
  );
}
