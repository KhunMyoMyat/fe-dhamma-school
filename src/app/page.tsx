"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  BookOpen,
  ArrowRight,
  Heart,
  Sprout,
  Star,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { data: courses } = useQuery({
    queryKey: ["courses-active"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/courses/active");
        return data;
      } catch (e) {
        return [];
      }
    },
  });

  const { data: events } = useQuery({
    queryKey: ["events-upcoming"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/events/upcoming");
        return data;
      } catch (e) {
        return [];
      }
    },
  });

  return (
    <div className="flex flex-col gap-0 pb-32 bg-cream/20">
      {/* Hero Section - Redesigned for Premium Feel */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-navy/60 to-transparent z-10" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-linear-to-t from-cream/20 to-transparent z-10" />
          <Image
            src="/images/hero/pagoda-main.png"
            alt="Myanmar Golden Pagoda"
            fill
            className="object-cover scale-105 animate-pulse-slow"
            priority
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-gold" />
              <span className="text-gold font-bold tracking-[0.2em] uppercase text-sm">
                Sacred Knowledge
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tight">
              Path to <span className="text-gradient-gold">Enlightenment</span>{" "}
              <br />& Inner <span className="text-saffron">Peace</span>
            </h1>

            <p className="text-xl md:text-2xl text-cream/90 mb-12 leading-relaxed font-myanmar max-w-2xl text-balance">
              ဗုဒ္ဓမြတ်စွာဘုရား၏ ဓမ္မတရားတော်များကို လေ့လာသင်ယူရင်း
              ပိုမိုအဓိပ္ပာယ်ရှိသော ဘဝတစ်ခုကို အတူတကွ တည်ဆောက်ကြပါစို့။
            </p>

            <div className="flex flex-wrap gap-6">
              <Link href="/courses">
                <Button
                  size="lg"
                  className="gradient-maroon text-white h-16 px-10 text-xl border-2 border-gold shadow-2xl shadow-maroon/40 hover:scale-105 transition-all rounded-full group"
                >
                  Start Learning{" "}
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/teachings">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass-card text-gold h-16 px-10 text-xl border-2 border-gold/50 hover:bg-gold hover:text-navy transition-all rounded-full"
                >
                  Read Dhamma
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/40 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Scroll
          </span>
          <div className="w-px h-12 bg-linear-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      {/* Featured Statistics/Values */}
      <section className="relative z-30 -mt-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: Sprout, label: "Growth", text: "Spiritual Development" },
            { icon: ShieldCheck, label: "Pure", text: "Authentic Teachings" },
            { icon: Users, label: "Sangha", text: "Global Community" },
            { icon: Heart, label: "Dana", text: "Generous Support" },
          ].map((v, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-gold/20 shadow-xl flex flex-col items-center text-center group"
            >
              <div className="size-12 rounded-2xl bg-maroon/5 flex items-center justify-center mb-4 group-hover:bg-maroon transition-colors">
                <v.icon className="size-6 text-maroon group-hover:text-gold transition-colors" />
              </div>
              <h3 className="font-bold text-maroon mb-1">{v.label}</h3>
              <p className="text-xs text-navy/50">{v.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Courses - Redesigned Card */}
      <section className="container mx-auto px-4 py-32 lotus-pattern">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <Badge className="bg-maroon/10 text-maroon hover:bg-maroon/20 mb-4 px-4 py-1">
              Dhamma Education
            </Badge>
            <h2 className="text-5xl font-black text-maroon mb-2 tracking-tight">
              Featured <span className="text-gold">Studies</span>
            </h2>
            <p className="text-lg text-gold-dark font-myanmar">
              သင်ကြားနိုင်သော ဓမ္မသင်တန်းများ
            </p>
          </div>
          <Link href="/courses">
            <Button
              variant="ghost"
              className="text-maroon hover:text-gold group font-bold text-lg"
            >
              View All Courses{" "}
              <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {courses?.map((course: any) => (
            <motion.div key={course.id} variants={item}>
              <Card className="h-full group hover:shadow-2xl hover:shadow-maroon/10 border-ornament transition-all duration-700 overflow-hidden bg-white/70 backdrop-blur-md rounded-[2.5rem]">
                <div className="aspect-4/3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-maroon/20 group-hover:bg-transparent transition-colors z-10" />
                  <Image
                    src={
                      course.image ||
                      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070"
                    }
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <Badge className="absolute top-6 left-6 z-20 bg-white/90 text-maroon backdrop-blur-md border border-gold/30 font-bold px-4 py-1 rounded-full uppercase text-[10px] tracking-widest">
                    {course.level}
                  </Badge>
                </div>
                <CardContent className="p-10">
                  <h3 className="text-2xl font-bold text-maroon mb-2 group-hover:text-gold transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-sm font-myanmar text-gold-dark mb-8 font-medium">
                    {course.titleMm}
                  </p>

                  <div className="flex flex-col gap-4 text-sm text-navy/70 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-cream flex items-center justify-center border border-gold/20">
                        <BookOpen className="size-4 text-maroon" />
                      </div>
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-cream flex items-center justify-center border border-gold/20">
                        <Users className="size-4 text-maroon" />
                      </div>
                      <span className="font-semibold text-navy/90">
                        {course.teacher?.name || "Venerable Monk"}
                      </span>
                    </div>
                  </div>

                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full bg-cream hover:bg-gold hover:text-navy text-maroon border-2 border-gold/30 transition-all font-black py-6 rounded-2xl shadow-sm">
                      Enroll Course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Upcoming Events - With a Vertical Timeline Look */}
      <section className="bg-navy py-32 text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 lotus-pattern pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              Spiritual <span className="text-gold">Events</span>
            </h2>
            <div className="h-1.5 w-24 gradient-gold mx-auto mb-6" />
            <p className="font-myanmar text-gold-light text-xl">
              နောင်လာမည့် သာသနာရေးဆိုင်ရာ အခမ်းအနားများ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events?.map((event: any, i: number) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                key={event.id}
                className="bg-white/5 border border-white/10 p-2 flex flex-col md:flex-row group hover:bg-white/10 hover:border-gold/30 transition-all rounded-[2rem] overflow-hidden"
              >
                <div className="relative w-full md:w-2/5 aspect-4/3 md:aspect-auto">
                  <Image
                    src={
                      event.image ||
                      "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070"
                    }
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 bg-maroon text-white font-black px-4 py-2 rounded-xl text-center shadow-lg border border-gold/30">
                    <span className="block text-2xl leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="block text-[10px] uppercase">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex-1 p-8 flex flex-col justify-center">
                  <Badge className="w-fit bg-gold/20 text-gold hover:bg-gold/30 mb-4 tracking-widest uppercase text-[10px] py-1 px-3">
                    {event.location}
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-gold transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-base font-myanmar text-cream/70 mb-6">
                    {event.titleMm}
                  </p>
                  <Button
                    variant="outline"
                    className="w-fit border-white/20 hover:border-gold text-white hover:bg-gold hover:text-navy rounded-full transition-all"
                  >
                    Event Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Redesigned for Maximum 'Wow' */}
      <section className="container mx-auto px-4 pt-32">
        <div className="gradient-hero rounded-[4rem] p-12 md:p-32 flex flex-col items-center text-center relative overflow-hidden text-white border-8 border-gold/30 shadow-[0_50px_100px_rgba(128,0,32,0.4)]">
          <div className="absolute inset-0 opacity-10 animate-pulse-slow">
            <div className="absolute top-10 left-10 size-40 border border-gold/20 rounded-full spin-slow" />
            <div className="absolute bottom-20 right-20 size-64 border border-gold/20 rounded-full animate-spin-slow" />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="size-20 gradient-gold rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
              <Star className="size-10 text-maroon" />
            </div>

            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              Support the <br />{" "}
              <span className="text-gradient-gold">Gift of Dhamma</span>
            </h2>

            <p className="text-xl md:text-2xl text-cream/80 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
              Your dana helps us provide free Buddhist education and maintain
              this online sanctuary. Help us keep the light of wisdom burning
              for all.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-gold text-navy h-20 px-12 text-2xl font-black hover:bg-white hover:scale-105 transition-all rounded-full border-4 border-gold shadow-2xl group"
              >
                Donate Now{" "}
                <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
              <span className="text-cream/50 font-bold uppercase tracking-widest text-sm">
                Every donation counts
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Elegant Footer Signature */}
      <footer className="mt-32 pt-20 pb-10 border-t border-gold/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="size-12 gradient-maroon rounded-full flex items-center justify-center border-2 border-gold shadow-lg">
              <Sprout className="text-gold size-6" />
            </div>
            <span className="text-3xl font-black text-maroon tracking-tighter uppercase">
              Dhamma School
            </span>
          </div>
          <p className="text-navy/40 font-myanmar text-sm italic max-w-lg mx-auto mb-10">
            "သဗ္ဗဒါနံ ဓမ္မဒါနံ ဇိနာတိ" - အလှူအားလုံးတွင် တရားအလှူသည် အမြတ်ဆုံး
            ဖြစ်၏။
          </p>
          <div className="h-px w-20 bg-gold/30 mx-auto mb-8" />
          <p className="text-navy/30 text-[10px] uppercase tracking-[0.3em] font-bold">
            © {new Date().getFullYear()} Dhamma School Myanmar. All Rights
            Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
