"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAction } from "@/app/(auth)/actions";

interface LoginFormProps {
  activeTab: 'masuk' | 'daftar';
  setActiveTab: (tab: 'masuk' | 'daftar') => void;
}

export function LoginForm({ activeTab, setActiveTab }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMasuk = activeTab === 'masuk';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    
    const result = await loginAction(formData);
    if (result.error) {
      setError("root", { message: result.error });
      setIsLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className={`w-full max-w-[400px] transition-transform duration-500 ease-in-out ${
      isMasuk ? "translate-x-0 pointer-events-auto relative" : "-translate-x-[150vw] pointer-events-none absolute"
    }`}>
      {/* Card Container Utama (Glassmorphism) - DESAIN ASLI DIJAGA PENUH */}
      <div className="w-full bg-[#E2E8FF]/80 backdrop-blur-md rounded-[32px] shadow-[0_20px_40px_rgba(30,94,255,0.15)] border border-white/40 p-6 sm:p-10 flex flex-col items-center">
        
        {/* LOGO APP */}
        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
          <div className="w-[52px] h-[52px] rounded-full border-4 border-[#1e5eff] flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1e5eff] to-[#60a5fa] rounded-lg rotate-45 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-sm -rotate-45"></div>
            </div>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div className="bg-[#FFFFFF]/60 p-1 rounded-2xl flex items-center w-full max-w-[220px] mb-8 border border-white/40 shadow-sm h-11">
          <button
            type="button"
            onClick={() => setActiveTab('masuk')}
            className={`flex-1 h-full text-[10px] font-extrabold tracking-widest uppercase rounded-xl transition-all duration-200 ${
              activeTab === 'masuk'
                ? 'bg-gradient-to-r from-[#1e5eff] to-[#3b82f6] text-white shadow-md'
                : 'text-[#94A3B8] hover:bg-white/40 hover:text-slate-600'
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('daftar')}
            className={`flex-1 h-full text-[10px] font-extrabold tracking-widest uppercase rounded-xl transition-all duration-200 ${
              activeTab === 'daftar'
                ? 'bg-gradient-to-r from-[#1e5eff] to-[#3b82f6] text-white shadow-md'
                : 'text-[#94A3B8] hover:bg-white/40 hover:text-slate-600'
            }`}
          >
            Daftar
          </button>
        </div>

        {/* FORM INPUT UTAMA */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 text-left">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-[#0F172A] tracking-widest uppercase pl-1">
              Email
            </label>
            <Input
              {...register("email")}
              type="email"
              placeholder="admin@gmail.com"
              className="w-full h-11 px-4 bg-[#f5f9ff] border-white rounded-xl text-xs placeholder-[#94a3b8] shadow-sm focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1e5eff]/20 transition-all"
            />
            {errors.email && (
              <p className="text-[11px] text-red-500 font-semibold pl-1 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center pl-1">
              <label className="block text-[10px] font-extrabold text-[#0F172A] tracking-widest uppercase">
                Password
              </label>
              <button type="button" className="text-[11px] font-bold text-[#1e5eff] hover:underline">
                Lupa sandi?
              </button>
            </div>
            <div className="relative">
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full h-11 pr-10 px-4 bg-[#f5f9ff] border-white rounded-xl text-xs placeholder-[#94a3b8] shadow-sm focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#1e5eff]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1e5eff] p-0.5 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 font-semibold pl-1 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
              <p className="text-xs text-red-600 font-bold">{errors.root.message}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 mt-2 bg-gradient-to-r from-[#1a56db] via-[#1e5eff] to-[#3b82f6] text-white font-bold tracking-widest uppercase rounded-xl shadow-[0_10px_25px_rgba(30,94,255,0.35)] hover:opacity-95 active:scale-[0.99] transition-all text-[11px]"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "MASUK SEKARANG"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs font-semibold text-slate-400">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => setActiveTab('daftar')}
              className="text-[#1e5eff] font-extrabold hover:underline pl-1"
            >
              Daftar Gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
