"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Sprout, Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("အီးမေးလ် ပုံစံ မှန်ကန်စွာ ရိုက်ထည့်ပါ"),
  password: z.string().min(6, "စကားဝှက် အနည်းဆုံး ၆ လုံး ရှိရပါမည်"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်။"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream/30 p-4 font-sans">
      <div className="absolute inset-0 lotus-pattern opacity-5 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-maroon/5 border-4 border-gold/20 overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-2 gradient-gold" />
          
          <div className="p-10 md:p-12">
            <div className="flex flex-col items-center mb-10">
              <div className="size-20 gradient-maroon rounded-3xl flex items-center justify-center mb-6 shadow-xl border-2 border-gold rotate-3">
                <Sprout className="text-gold size-10" />
              </div>
              <h1 className="text-3xl font-black text-maroon tracking-tighter uppercase mb-2">
                Admin Gateway
              </h1>
              <p className="text-gold font-myanmar text-sm font-bold tracking-[0.2em]">
                စီမံခန့်ခွဲသူ ဝင်ပေါက်
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100 font-myanmar"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-navy/30 group-focus-within:text-maroon transition-colors">
                    <Mail className="size-5" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="admin@dhammaschool.mm"
                    className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl pl-14 pr-6 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy shadow-sm"
                  />
                </div>
                {errors.email && (
                  <p className="text-[10px] text-red-500 font-myanmar ml-4 font-bold">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-navy/40 uppercase tracking-widest ml-4">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-navy/30 group-focus-within:text-maroon transition-colors">
                    <Lock className="size-5" />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-16 bg-cream/50 border-2 border-gold/10 rounded-2xl pl-14 pr-14 focus:border-maroon focus:bg-white outline-none transition-all font-medium text-navy shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-maroon"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-red-500 font-myanmar ml-4 font-bold">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 bg-maroon hover:bg-gold text-white hover:text-navy rounded-2xl transition-all font-black text-xl shadow-lg shadow-maroon/20 relative group"
              >
                {isLoading ? (
                  <Loader2 className="size-6 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-12 text-center text-navy/30">
              <p className="text-[10px] uppercase font-bold tracking-[0.3em]">
                Secure Access Only
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
