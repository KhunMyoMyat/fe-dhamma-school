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
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Active Students", value: "1,280", icon: Users, color: "blue" },
  { label: "Online Courses", value: "24", icon: BookOpen, color: "maroon" },
  { label: "Future Events", value: "12", icon: Calendar, color: "gold" },
  { label: "Dhamma Teachings", value: "450", icon: Sprout, color: "bodhi" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [counts, setCounts] = useState({ 
    courses: 0, 
    events: 0, 
    teachings: 0, 
    inquiries: 0, 
    unreadInquiries: 0,
    pendingDonors: 0 
  });
  const [recentCourses, setRecentCourses] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/admin/login");
    } else {
      setAdminUser(JSON.parse(user));
    }

    const fetchStats = async () => {
      try {
        const [coursesRes, eventsRes, teachingsRes, contactRes, donorsRes] = await Promise.all([
          api.get("/courses"),
          api.get("/events"),
          api.get("/teachings"),
          api.get("/contact"),
          api.get("/donations/monthly-donor-subscriptions")
        ]);

        const contactData = contactRes.data.data || contactRes.data || [];
        const unreadInquiries = contactData.filter((i: any) => !i.isRead).length;

        const donorsData = donorsRes.data.data || donorsRes.data || [];
        const pendingDonors = donorsData.filter((d: any) => d.status === "pending").length;

        setCounts({
          courses: coursesRes.data.meta?.total || coursesRes.data.length || 0,
          events: eventsRes.data.meta?.total || eventsRes.data.length || 0,
          teachings: teachingsRes.data.meta?.total || teachingsRes.data.length || 0,
          inquiries: contactData.length || 0,
          unreadInquiries,
          pendingDonors
        });
        setRecentCourses((coursesRes.data.data || coursesRes.data || []).slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, [router]);

  const totalNotifications = counts.unreadInquiries + counts.pendingDonors;

  const dashboardStats = [
    { label: "Online Courses", value: counts.courses, icon: BookOpen, color: "maroon" },
    { label: "Future Events", value: counts.events, icon: Calendar, color: "gold" },
    { label: "New Messages", value: counts.unreadInquiries, icon: Bell, color: "navy" },
    { label: "Pending Donors", value: counts.pendingDonors, icon: Users, color: "bodhi" },
  ];

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
            <div className="relative group">
              <button className="relative size-12 rounded-2xl bg-white border border-gold/20 flex items-center justify-center text-navy/40 hover:text-maroon transition-colors shadow-sm cursor-pointer">
                <Bell className="size-6 group-hover:rotate-12 transition-transform" />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce-slow">
                    {totalNotifications}
                  </span>
                )}
              </button>
              
              {/* Notification Popover on Hover */}
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gold/20 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all z-50 overflow-hidden">
                <div className="p-4 border-b border-gold/5 bg-cream/30">
                  <p className="text-xs font-black text-maroon uppercase tracking-widest">Notifications</p>
                </div>
                <div className="p-2">
                  <Link href="/admin/inquiries" className="flex items-center justify-between p-3 rounded-xl hover:bg-cream/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-gold/10 flex items-center justify-center">
                        <MessageSquare className="size-4 text-gold-dark" />
                      </div>
                      <span className="text-sm font-bold text-navy/70">Messages</span>
                    </div>
                    {counts.unreadInquiries > 0 && (
                      <Badge className="bg-gold text-white text-[10px]">{counts.unreadInquiries}</Badge>
                    )}
                  </Link>
                  <Link href="/admin/monthly-donors" className="flex items-center justify-between p-3 rounded-xl hover:bg-cream/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-bodhi/10 flex items-center justify-center">
                        <Users className="size-4 text-bodhi" />
                      </div>
                      <span className="text-sm font-bold text-navy/70">Pending Donors</span>
                    </div>
                    {counts.pendingDonors > 0 && (
                      <Badge className="bg-bodhi text-white text-[10px]">{counts.pendingDonors}</Badge>
                    )}
                  </Link>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-12 border-maroon/20 text-maroon hover:bg-maroon hover:text-white rounded-xl font-bold px-6 shadow-sm"
            >
              <LogOut className="size-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardStats.map((stat, i) => (
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
            {/* Recent Courses/Content Section */}
            <section className="bg-white rounded-[3rem] border border-gold/10 p-10 shadow-xl shadow-maroon/5">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-maroon uppercase tracking-tight">
                  Recent Content
                </h2>
                <Link href="/admin/courses">
                  <Button variant="ghost" className="text-gold hover:text-maroon font-bold">
                    View All <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-6 rounded-2xl bg-cream/30 border border-gold/5 hover:border-gold/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-maroon/10 flex items-center justify-center">
                        <BookOpen className="size-6 text-maroon" />
                      </div>
                      <div>
                        <p className="font-bold text-navy">{course.title}</p>
                        <p className="text-xs text-navy/40">Updated {new Date(course.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge color="gold">{course.isActive ? "Active" : "Draft"}</Badge>
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
              <QuickButton href="/admin/courses/new" label="Add New Course" icon={Plus} color="maroon" />
              <QuickButton href="/admin/events/new" label="Schedule Event" icon={Calendar} color="gold" />
              <QuickButton href="/admin/teachings/new" label="Post Teaching" icon={Sprout} color="bodhi" />
              <QuickButton href="/admin/dashboard" label="View Analytics" icon={TrendingUp} color="navy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickButton({ label, icon: Icon, color, href }: any) {
  return (
    <Link href={href || "#"}>
      <button className="w-full h-20 bg-white hover:bg-cream rounded-[1.5rem] border border-gold/10 hover:border-gold/50 transition-all p-6 flex items-center justify-between group shadow-sm mb-4">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-maroon transition-colors">
            <Icon className="size-5 text-navy group-hover:text-white transition-colors" />
          </div>
          <span className="font-bold text-navy group-hover:text-maroon transition-colors">{label}</span>
        </div>
        <ArrowRight className="size-5 text-gold group-hover:translate-x-1 transition-transform" />
      </button>
    </Link>
  );
}
