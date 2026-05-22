"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  User, 
  Store, 
  MapPin, 
  Tag, 
  Save, 
  RefreshCw,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getUMKMProfile, updateUMKMProfile } from "../actions";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  
  const [formData, setFormData] = useState({
    business_name: "",
    owner_name: "",
    city: "Samarinda",
    category: "Umum"
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  useEffect(() => {
    async function loadProfile() {
      const data = await getUMKMProfile();
      if (data) {
        setFormData({
          business_name: data.business_name || "",
          owner_name: data.owner_name || "",
          city: data.city || "Samarinda",
          category: data.category || "Umum"
        });
      }
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateUMKMProfile(formData);
    setIsSaving(false);

    if (result.success) {
      toast.success("Profil UMKM berhasil diperbarui!");
    } else {
      toast.error(result.error || "Gagal memperbarui profil");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    
    setIsChangingPassword(true);
    // Simulate API call for password change
    setTimeout(() => {
      setIsChangingPassword(false);
      toast.success("Password berhasil diubah!");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#2354FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full relative">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{ 
             background: `linear-gradient(to bottom, #B8D3FF 50%, #F1F6FF 80%, #FFFFFF 100%)`
           }} 
      />

      <div className="relative z-10 max-w-6xl mx-auto space-y-10 pb-20 pt-6">
        <div className="px-4">
          <h1 className="text-4xl font-black text-[#2354FF] tracking-tight">Pengaturan Akun</h1>
          <p className="text-[#2354FF]/60 font-bold text-lg">Kelola profil bisnis dan keamanan akun Anda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
          {/* Section 1: UMKM Profile */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white/80 backdrop-blur-md overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-100 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#2354FF]">
                        <Store size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-black text-brand-950">Informasi UMKM</CardTitle>
                        <CardDescription className="font-bold text-brand-900/40">Data operasional bisnis Anda yang tersimpan di database.</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Nama Bisnis</label>
                      <div className="relative">
                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                        <Input 
                          value={formData.business_name}
                          onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                          placeholder="Nama Toko/Usaha Anda"
                          className="pl-12 h-14 bg-white border-brand-100 rounded-2xl font-bold focus-visible:ring-[#2354FF]/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Nama Pemilik</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                        <Input 
                          value={formData.owner_name}
                          onChange={(e) => setFormData({...formData, owner_name: e.target.value})}
                          placeholder="Nama Lengkap Pemilik"
                          className="pl-12 h-14 bg-white border-brand-100 rounded-2xl font-bold focus-visible:ring-[#2354FF]/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Kota Operasional</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                        <Input 
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          placeholder="Samarinda"
                          className="pl-12 h-14 bg-white border-brand-100 rounded-2xl font-bold focus-visible:ring-[#2354FF]/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Kategori Produk</label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
                        <Input 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          placeholder="Contoh: Kuliner, Fashion, dll"
                          className="pl-12 h-14 bg-white border-brand-100 rounded-2xl font-bold focus-visible:ring-[#2354FF]/20"
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full bg-[#2354FF] hover:bg-[#1a44cc] text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all group"
                  >
                    {isSaving ? <RefreshCw className="animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    Simpan Perubahan Profil
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Section 2: Security / Password */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white/80 backdrop-blur-md overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-100 bg-white/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                      <Lock size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black text-brand-950">Ganti Password</CardTitle>
                      <CardDescription className="font-bold text-brand-900/40">Amankan akun Anda dengan password yang kuat.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-5">
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Password Sekarang</label>
                        <Input 
                          type={showPasswords ? "text" : "password"}
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                          placeholder="••••••••"
                          className="h-12 bg-white border-brand-100 rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Password Baru</label>
                        <Input 
                          type={showPasswords ? "text" : "password"}
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                          placeholder="••••••••"
                          className="h-12 bg-white border-brand-100 rounded-xl font-bold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-brand-950 uppercase tracking-widest pl-1">Konfirmasi Password Baru</label>
                        <Input 
                          type={showPasswords ? "text" : "password"}
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                          placeholder="••••••••"
                          className="h-12 bg-white border-brand-100 rounded-xl font-bold"
                        />
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-2 mb-2 cursor-pointer select-none" onClick={() => setShowPasswords(!showPasswords)}>
                      {showPasswords ? <EyeOff size={16} className="text-brand-400" /> : <Eye size={16} className="text-brand-400" />}
                      <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">{showPasswords ? "Sembunyikan" : "Tampilkan"} Password</span>
                   </div>

                   <Button 
                    onClick={handlePasswordChange} 
                    disabled={isChangingPassword || !passwordData.new_password}
                    className="w-full bg-brand-950 hover:bg-black text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl transition-all"
                  >
                    {isChangingPassword ? <RefreshCw className="animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <Card className="border-none shadow-xl rounded-[2.5rem] bg-brand-950 text-white p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2354FF]/20 rounded-full blur-3xl transition-transform group-hover:scale-110" />
              <div className="relative z-10 space-y-2">
                <h4 className="text-lg font-black tracking-tight">Tips Keamanan</h4>
                <p className="text-sm text-brand-200/60 font-medium">Gunakan kombinasi huruf, angka, dan simbol untuk password yang lebih aman.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
