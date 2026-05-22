"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Mail, Lock, Store, User, MapPin, Phone, Tag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { signupAction } from "@/app/(auth)/actions";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof SignupFormValues)[] = [];
    if (step === 1) fieldsToValidate = ["businessName", "ownerName", "businessCategory"];
    if (step === 2) fieldsToValidate = ["city", "phoneNumber"];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    const result = await signupAction(data);

    if (result.error) {
      setError("email", { message: result.error });
      setIsLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-brand-950 mb-2">Mulai Perjalanan Anda</h2>
        <p className="text-brand-900/60 font-medium">Buat akun untuk memodernisasi UMKM Anda dengan AI.</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
         <div className={`h-1.5 w-10 rounded-full ${step >= 1 ? "bg-brand-600" : "bg-slate-200"} transition-colors duration-300`} />
         <div className={`h-1.5 w-10 rounded-full ${step >= 2 ? "bg-brand-600" : "bg-slate-200"} transition-colors duration-300`} />
         <div className={`h-1.5 w-10 rounded-full ${step >= 3 ? "bg-brand-600" : "bg-slate-200"} transition-colors duration-300`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-950">Nama Bisnis (UMKM)</label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                  <Input 
                    {...register("businessName")}
                    placeholder="Contoh: Kopi Etam" 
                    className="pl-10 h-12 rounded-xl border-brand-100 focus:border-brand-600 focus:ring-brand-600 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>
                {errors.businessName && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.businessName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-950">Nama Pemilik</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                  <Input 
                    {...register("ownerName")}
                    placeholder="Nama Lengkap Anda" 
                    className="pl-10 h-12 rounded-xl border-brand-100 focus:border-brand-600 focus:ring-brand-600 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>
                {errors.ownerName && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.ownerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-950">Kategori Bisnis</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                  <Input 
                    {...register("businessCategory")}
                    placeholder="Contoh: Makanan & Minuman" 
                    className="pl-10 h-12 rounded-xl border-brand-100 focus:border-brand-600 focus:ring-brand-600 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>
                {errors.businessCategory && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.businessCategory.message}</p>
                )}
              </div>

              <Button type="button" onClick={nextStep} className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-xl">
                Lanjutkan
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-950">Kota Operasional</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                  <Input 
                    {...register("city")}
                    placeholder="Contoh: Samarinda" 
                    className="pl-10 h-12 rounded-xl border-brand-100 focus:border-brand-600 focus:ring-brand-600 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>
                {errors.city && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-brand-950">Nomor WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                  <Input 
                    {...register("phoneNumber")}
                    placeholder="081234567890" 
                    className="pl-10 h-12 rounded-xl border-brand-100 focus:border-brand-600 focus:ring-brand-600 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-1/3 h-12 border-brand-200 text-brand-900 rounded-xl font-bold">
                  Kembali
                </Button>
                <Button type="button" onClick={nextStep} className="w-2/3 h-12 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold">
                  Lanjutkan
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
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
                <label className="text-sm font-bold text-brand-950">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-400" />
                  <Input 
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 8 karakter" 
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

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="w-1/3 h-12 border-brand-200 text-brand-900 rounded-xl font-bold">
                  Kembali
                </Button>
                <Button type="submit" disabled={isLoading} className="w-2/3 h-12 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-xl">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Buat Akun"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm font-medium text-brand-900/60">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-brand-600 font-bold hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
