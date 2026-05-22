"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { signupAction } from '@/app/(auth)/actions';
import { toast } from 'sonner';

// Validasi Form sesuai kolom umkm_profiles
const signupSchema = z.z.object({
  businessName: z.string().min(2, "Nama usaha minimal 2 karakter"),
  ownerName: z.string().min(2, "Nama pemilik minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
  phoneNumber: z.string().min(10, "Nomor WhatsApp tidak valid"),
  city: z.string().min(2, "Kota wajib diisi"),
  businessCategory: z.string().min(2, "Kategori wajib diisi"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  activeTab: 'masuk' | 'daftar';
  setActiveTab: (tab: 'masuk' | 'daftar') => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ activeTab, setActiveTab }) => {
  const isDaftar = activeTab === 'daftar';
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      businessName: "",
      ownerName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      city: "",
      businessCategory: ""
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const result = await signupAction(data);
      if (result.error) {
        setError("root", { message: result.error });
        toast.error(result.error);
      } else {
        toast.success("Akun UMKM berhasil dibuat!");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-[760px] transition-transform duration-500 ease-in-out ${
      isDaftar ? "translate-x-0 pointer-events-auto relative" : "translate-x-[150vw] pointer-events-none absolute"
    }`}>
      <div className="w-full bg-[#E2E8FF]/80 backdrop-blur-md rounded-[16px] shadow-[0_16px_32px_rgba(15,23,42,0.16)] border border-white/40 p-[30px] flex flex-col items-center relative overflow-hidden">
        
        <div className="absolute inset-0 border border-white/20 rounded-[16px] pointer-events-none shadow-[inset_0_4px_16px_rgba(255,255,255,0.4)]" />

        {/* Logo App */}
        <div className="w-[100px] h-[100px] bg-white rounded-2xl shadow-sm flex items-center justify-center mb-[15px] border border-slate-100/60">
          <div className="w-[64px] h-[64px] rounded-full border-4 border-[#1e5eff] flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e5eff] to-[#60a5fa] rounded-lg rotate-45 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm -rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="bg-[#FFFFFF]/60 p-1 rounded-2xl flex items-center w-[300px] h-11 mb-[15px] shadow-sm border border-white/40">
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

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-[30px] gap-y-[15px] text-left items-start mb-[15px]">
            {/* Column 1: Informasi Usaha */}
            <div className="space-y-[10px] w-full">
              <h3 className="text-[11px] font-extrabold text-[#0F172A] tracking-wider uppercase pl-0.5 border-b border-[#0F172A]/10 pb-1">
                1. Profil UMKM
              </h3>
              <div>
                <input
                  {...register("businessName")}
                  type="text"
                  placeholder="Nama Usaha"
                  className="w-full h-10 px-4 bg-[#FFFFFF] border border-white/60 rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 text-[#0F172A] shadow-sm transition-all"
                />
                {errors.businessName && <p className="text-[10px] text-red-500 mt-1 pl-1 font-bold">{errors.businessName.message}</p>}
              </div>
              <div>
                <input
                  {...register("ownerName")}
                  type="text"
                  placeholder="Nama Pemilik"
                  className="w-full h-10 px-4 bg-[#FFFFFF] border border-white/60 rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 text-[#0F172A] shadow-sm transition-all"
                />
                {errors.ownerName && <p className="text-[10px] text-red-500 mt-1 pl-1 font-bold">{errors.ownerName.message}</p>}
              </div>
              <div>
                <input
                  {...register("phoneNumber")}
                  type="tel"
                  placeholder="No. WhatsApp (08...)"
                  className="w-full h-10 px-4 bg-[#FFFFFF] border border-white/60 rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 text-[#0F172A] shadow-sm transition-all"
                />
                {errors.phoneNumber && <p className="text-[10px] text-red-500 mt-1 pl-1 font-bold">{errors.phoneNumber.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-[10px]">
                <input
                  {...register("city")}
                  type="text"
                  placeholder="Kota"
                  className="w-full h-10 px-4 bg-[#FFFFFF] border border-white/60 rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 text-[#0F172A] shadow-sm transition-all"
                />
                <input
                  {...register("businessCategory")}
                  type="text"
                  placeholder="Kategori"
                  className="w-full h-10 px-4 bg-[#FFFFFF] border border-white/60 rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 text-[#0F172A] shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Column 2: Keamanan Akun */}
            <div className="space-y-[10px] w-full">
              <h3 className="text-[11px] font-extrabold text-[#0F172A] tracking-wider uppercase pl-0.5 border-b border-[#0F172A]/10 pb-1">
                2. Keamanan Akun
              </h3>
              <div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email Login"
                  className="w-full h-10 px-4 bg-[#FFFFFF] border border-white/60 rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 text-[#0F172A] shadow-sm transition-all"
                />
                {errors.email && <p className="text-[10px] text-red-500 mt-1 pl-1 font-bold">{errors.email.message}</p>}
              </div>
              <div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="w-full h-10 px-4 bg-[#FFFFFF] border border-white/60 rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 text-[#0F172A] shadow-sm transition-all"
                />
                {errors.password && <p className="text-[10px] text-red-500 mt-1 pl-1 font-bold">{errors.password.message}</p>}
              </div>
              <div>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Konfirmasi Password"
                  className="w-full h-10 px-4 bg-[#FFFFFF] border border-white/60 rounded-xl text-xs placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1e5eff]/20 text-[#0F172A] shadow-sm transition-all"
                />
                {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 pl-1 font-bold">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>

          {errors.root && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-center">
              <p className="text-xs text-red-600 font-bold">{errors.root.message}</p>
            </div>
          )}

          {/* Primary CTA Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-gradient-to-r from-[#1A56DB] via-[#1E5EFF] to-[#3B82F6] text-white font-bold tracking-widest uppercase rounded-xl shadow-[0_10px_20px_rgba(30,94,255,0.35)] hover:opacity-95 active:scale-[0.99] transition-all text-[11px] flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Daftar Akun UMKM"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default SignupForm;
