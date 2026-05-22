"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  Zap,
  Clock,
  ChevronRight,
  Plus
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const data = [
  { name: "Sen", sales: 4000, trends: 2400 },
  { name: "Sel", sales: 3000, trends: 1398 },
  { name: "Rab", sales: 2000, trends: 9800 },
  { name: "Kam", sales: 2780, trends: 3908 },
  { name: "Jum", sales: 1890, trends: 4800 },
  { name: "Sab", sales: 2390, trends: 3800 },
  { name: "Min", sales: 3490, trends: 4300 },
];

const categoryData = [
  { name: "F&B", value: 45, color: "#2354FF" },
  { name: "Fashion", value: 30, color: "#447CFF" },
  { name: "Craft", value: 15, color: "#679FFF" },
  { name: "Others", value: 10, color: "#92C3FF" },
];

import { useState, useEffect } from "react";
import { getUMKMProfile } from "./actions";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const data = await getUMKMProfile();
      setProfile(data);
      setIsLoading(false);
    }
    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-950">
            Selamat Datang, {profile?.owner_name || 'Pengusaha'}! 👋
          </h1>
          <p className="text-brand-900/40 font-medium">
            Ini ringkasan bisnis {profile?.business_name || 'UMKM Anda'} di {profile?.city || 'Samarinda'} hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-brand-100 bg-white">
            <Clock className="w-4 h-4 mr-2 text-brand-400" />
            7 Hari Terakhir
          </Button>
          <Button className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-600/20">
            <Plus className="w-4 h-4 mr-2" />
            Produk Baru
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Penjualan", value: "Rp 12.4M", trend: "+12.5%", icon: ShoppingBag, color: "brand" },
          { title: "Pengunjung Baru", value: "2,840", trend: "+18.2%", icon: Users, color: "green" },
          { title: "Tingkat Konversi", value: "4.2%", trend: "-2.4%", icon: TrendingUp, color: "blue" },
          { title: "Skor AI", value: "92/100", trend: "+5.0%", icon: Sparkles, color: "purple" },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Badge className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold",
                    stat.trend.startsWith("+") ? "bg-green-100 text-green-600 border-green-200" : "bg-red-100 text-red-600 border-red-200"
                  )}>
                    {stat.trend.startsWith("+") ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-brand-900/40 mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-brand-950">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Performa Penjualan</CardTitle>
              <CardDescription>Visualisasi omzet harian Anda</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-brand-600 rounded-full" />
                <span className="text-xs font-medium text-brand-900/40">Sales</span>
              </div>
              <div className="flex items-center gap-1.5 ml-4">
                <div className="w-3 h-3 bg-brand-200 rounded-full" />
                <span className="text-xs font-medium text-brand-900/40">Target</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2354FF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2354FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94A3B8", fontSize: 12 }}
                  tickFormatter={(value) => `Rp ${value/1000}jt`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: "16px", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    padding: "12px"
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#2354FF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-none shadow-sm rounded-3xl bg-brand-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="w-5 h-5" />
              Rekomendasi AI
            </CardTitle>
            <CardDescription className="text-brand-100/60">Berdasarkan tren pasar hari ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { text: "Produk 'Amplas Gurih' sedang viral di Samarinda Seberang. Naikkan stok 20%.", icon: Zap },
              { text: "Optimasi visual produk 'Batik Kaltim' Anda. Gunakan tema 'Nature' untuk hasil terbaik.", icon: Camera },
              { text: "Waktu terbaik posting hari ini adalah pukul 19:30 WITA.", icon: Clock },
            ].map((rec, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors cursor-pointer group"
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    <rec.icon className="w-4 h-4 text-brand-300" />
                  </div>
                  <p className="text-sm font-medium text-brand-50 leading-tight group-hover:text-white transition-colors">
                    {rec.text}
                  </p>
                </div>
              </motion.div>
            ))}
            <Button variant="secondary" className="w-full mt-4 bg-white text-brand-600 hover:bg-brand-50 rounded-xl font-bold py-6">
              Lihat Semua Analisis
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Aktivitas Terkini</CardTitle>
            <Button variant="ghost" className="text-brand-600 font-bold p-0 hover:bg-transparent">
              Lihat Semua
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {[
                { user: "Hani", action: "membeli Amplas Mahakam", time: "2 menit yang lalu", amount: "+Rp 45.000" },
                { user: "AI Assistant", action: "mengoptimasi visual 'Kopi Etam'", time: "15 menit yang lalu", amount: null },
                { user: "Rudi", action: "meninggalkan ulasan bintang 5", time: "1 jam yang lalu", amount: null },
                { user: "System", action: "jadwal posting 'Promo Jumat' aktif", time: "3 jam yang lalu", amount: null },
              ].map((activity, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-brand-600">
                      {activity.user[0]}
                    </div>
                    <div>
                      <p className="text-sm text-brand-950 font-bold">
                        {activity.user} <span className="font-medium text-brand-900/60">{activity.action}</span>
                      </p>
                      <p className="text-xs text-brand-900/40">{activity.time}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-bold text-green-600">{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Kategori Terlaris</CardTitle>
            <CardDescription>Berdasarkan volume penjualan bulan ini</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: -20, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#101F56", fontWeight: 600, fontSize: 13 }} 
                />
                <Tooltip 
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper imports
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
