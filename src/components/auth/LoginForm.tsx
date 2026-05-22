"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { loginAction } from "@/app/(auth)/actions";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    
    // Create a FormData object as the loginAction expects it
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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-brand-950 mb-2">Selamat Datang Kembali</h2>
        <p className="text-brand-900/60 font-medium">Masuk untuk mengelola bisnis UMKM Anda.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-brand-950">Email Bisnis</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
            <Input 
              {...register("email")}
              placeholder="contoh@bisnis.com" 
              className="pl-10 h-12 rounded-xl border-brand-100 focus:border-brand-600 focus:ring-brand-600 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
             <label className="text-sm font-bold text-brand-950">Kata Sandi</label>
             <Link href="#" className="text-xs font-bold text-brand-600 hover:text-brand-800">Lupa sandi?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
            <Input 
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••" 
              className="pl-10 pr-10 h-12 rounded-xl border-brand-100 focus:border-brand-600 focus:ring-brand-600 bg-slate-50 focus:bg-white transition-colors"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 font-medium mt-1">{errors.password.message}</p>
          )}
        </div>

        {errors.root && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-center">
            <p className="text-sm text-red-600 font-bold">{errors.root.message}</p>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-xl shadow-brand-600/20"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Masuk ke Dashboard"
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-brand-900/60">
          Belum punya akun?{" "}
          <Link href="/signup" className="text-brand-600 font-bold hover:underline">
            Daftar Gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
