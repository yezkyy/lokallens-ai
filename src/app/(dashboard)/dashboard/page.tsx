"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  Plus,
  Search,
  BarChart3,
  Target,
  RefreshCw,
  AlertCircle,
  Tag,
  DollarSign
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
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { getUMKMProfile } from "./actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TrendData {
  trendScore: number;
  trendChartData: { name: string; value: number }[];
  marketInsights: string[];
  recommendations: string[];
  popularHashtags: string[];
  competitorPricing: {
    average: number;
    min: number;
    max: number;
    status: "Cheap" | "Fair" | "Expensive";
    reasoning: string;
  };
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const data = await getUMKMProfile();
      setProfile(data);
      setIsLoadingProfile(false);
      
      // Ensure trendData is null on mount
      setTrendData(null);
    }
    loadProfile();
  }, []);

  const handleAnalyze = async (query: string) => {
    if (!query) {
      toast.error("Masukkan nama produk terlebih dahulu");
      return;
    }
    
    setIsAnalyzing(true);
    setTrendData(null); // Clear previous data
    
    try {
      const response = await fetch("/api/ai/analyze-market-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focusArea: query }),
      });
      
      const rawText = await response.text();
      let result;
      try {
        result = JSON.parse(rawText);
      } catch (e) {
        console.error("Failed to parse API response as JSON:", rawText);
        throw new Error("Server mengembalikan respons yang tidak valid.");
      }
      
      if (!response.ok) {
        console.error("AI Analysis API Error Response:", result);
        const errorMsg = result.error || "Gagal memuat tren pasar dari server";
        const errorDetail = result.details ? `\nDetail: ${result.details}` : "";
        throw new Error(`${errorMsg}${errorDetail}`);
      }
      
      setTrendData(result);
      toast.success(`Analisis untuk "${query}" berhasil dimuat`);
    } catch (error: any) {
      console.error("Error in handleAnalyze:", error);
      toast.error(error.message, {
        duration: 10000,
      });
      
      // Keep trendData null so we don't show broken/dummy analysis if it failed
      setTrendData(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Search Header - Centered & Prominent */}
      <div className="max-w-3xl mx-auto text-center space-y-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-black text-brand-950 tracking-tight">
            Intelijen Pasar <span className="text-brand-600">Samarinda</span>
          </h1>
          <p className="text-brand-900/40 font-medium text-lg">
            Ketik nama produk untuk memata-matai tren dan harga kompetitor.
          </p>
        </motion.div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-brand-400 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-brand-400 group-focus-within:text-brand-600 transition-colors" />
            <Input 
              placeholder="Masukkan produk (contoh: Nasi Kuning, Amplas, Batik...)" 
              className="pl-16 h-20 bg-white border-brand-100 shadow-2xl rounded-[1.8rem] focus:ring-brand-600 font-bold text-xl placeholder:text-brand-900/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(searchQuery)}
            />
            <Button 
              onClick={() => handleAnalyze(searchQuery)}
              disabled={isAnalyzing || !searchQuery}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-14 px-8 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-600/20 transition-all"
            >
              {isAnalyzing ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Analisis AI"}
            </Button>
          </div>
        </div>
        
        {!trendData && !isAnalyzing && (
          <div className="flex flex-wrap justify-center gap-3 pt-4">
             {["Nasi Kuning", "Sarung Samarinda", "Kopi Etam", "Ikan Pepes"].map(tag => (
               <Badge 
                 key={tag} 
                 onClick={() => {
                   setSearchQuery(tag);
                   handleAnalyze(tag);
                 }}
                 className="bg-white hover:bg-brand-50 text-brand-900/40 border-brand-100 px-4 py-2 rounded-xl cursor-pointer transition-all hover:scale-105"
               >
                 + {tag}
               </Badge>
             ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {trendData ? (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Side: Trends & Competitor Analysis */}
            <div className="lg:col-span-8 space-y-8">
              {/* Trend Section */}
              <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden p-8 relative">
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h3 className="text-2xl font-black text-brand-950 flex items-center gap-3">
                         <TrendingUp className="w-7 h-7 text-brand-600" />
                         Analisis Tren Pasar
                      </h3>
                      <p className="text-brand-900/40 text-sm font-medium mt-1">Volume pencarian & minat konsumen untuk <span className="text-brand-600 font-bold">"{searchQuery}"</span></p>
                   </div>
                   <Badge className="bg-brand-600/10 text-brand-600 border-none px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-widest">
                      Skor: {trendData.trendScore}/100
                   </Badge>
                </div>

                <div className="w-full h-[350px] relative">
                  {trendData && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData.trendChartData}>
                        <defs>
                          <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2354FF" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#2354FF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }}
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#2354FF" 
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorTrend)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              {/* Competitor Price Monitor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm rounded-[2rem] bg-white p-6 relative overflow-hidden">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                         <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="font-black text-brand-950">Mata-mata Harga</h4>
                         <p className="text-[10px] text-brand-900/40 font-bold uppercase tracking-widest">Kompetitor Samarinda</p>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex items-end justify-between">
                         <p className="text-3xl font-black text-brand-950">Rp {trendData.competitorPricing.average.toLocaleString()}</p>
                         <Badge className={cn(
                           "mb-1 px-3 py-1 rounded-lg text-[10px] font-black uppercase",
                           trendData.competitorPricing.status === "Cheap" ? "bg-green-100 text-green-600" :
                           trendData.competitorPricing.status === "Fair" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                         )}>
                            {trendData.competitorPricing.status === "Cheap" ? "MURAH" : 
                             trendData.competitorPricing.status === "Fair" ? "KOMPETITIF" : "MAHAL"}
                         </Badge>
                      </div>
                      <p className="text-xs text-brand-900/60 leading-relaxed font-medium">
                         {trendData.competitorPricing.reasoning}
                      </p>
                      <div className="pt-2 border-t border-slate-50 flex justify-between">
                         <span className="text-[10px] font-bold text-brand-900/30 uppercase tracking-tighter">Min: Rp {trendData.competitorPricing.min.toLocaleString()}</span>
                         <span className="text-[10px] font-bold text-brand-900/30 uppercase tracking-tighter">Max: Rp {trendData.competitorPricing.max.toLocaleString()}</span>
                      </div>
                   </div>
                </Card>

                <Card className="border-none shadow-sm rounded-[2rem] bg-white p-6">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                         <Tag className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="font-black text-brand-950">Kata Kunci Viral</h4>
                         <p className="text-[10px] text-brand-900/40 font-bold uppercase tracking-widest">Optimasi Pencarian</p>
                      </div>
                   </div>
                   
                   <div className="flex flex-wrap gap-2">
                      {trendData.popularHashtags.map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-slate-50 text-brand-900/60 border-none hover:bg-brand-50 hover:text-brand-600 transition-colors cursor-pointer rounded-lg text-[10px] font-bold">
                           {tag}
                        </Badge>
                      ))}
                   </div>
                </Card>
              </div>
            </div>

            {/* Right Side: AI Golden Insights & Recommendations */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-2xl rounded-[2.5rem] bg-brand-950 text-white overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/20 rounded-full blur-3xl" />
                 
                 <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                       </div>
                       <Badge className="bg-brand-600/20 text-brand-400 border-none">AI GOLDEN INSIGHT</Badge>
                    </div>
                    <CardTitle className="text-xl font-bold">Saran Strategi UMKM</CardTitle>
                    <CardDescription className="text-brand-200/50">Langkah taktis memenangkan pasar</CardDescription>
                 </CardHeader>
                 
                 <CardContent className="space-y-6">
                    <div className="space-y-6">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-sm text-brand-100 leading-relaxed font-medium italic">
                             "{trendData.marketInsights[0]}"
                          </p>
                       </div>
                       
                       <div className="space-y-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400">Rekomendasi Aksi</p>
                          <div className="space-y-3">
                             {trendData.recommendations.map((rec, i) => (
                               <div key={i} className="flex gap-3 items-start group cursor-default">
                                  <div className="w-6 h-6 rounded-full bg-brand-600/30 flex items-center justify-center flex-shrink-0 text-brand-400 font-black text-[10px]">
                                     {i + 1}
                                  </div>
                                  <p className="text-xs text-brand-100/70 group-hover:text-white transition-colors">{rec}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                       
                       <Button 
                          onClick={() => handleAnalyze(searchQuery)}
                          className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-2xl py-7 font-bold text-md shadow-xl shadow-brand-600/20 group"
                       >
                          Segarkan Analisis
                          <RefreshCw className="ml-2 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                       </Button>
                    </div>
                 </CardContent>
              </Card>

              {/* Quick Stats Summary */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-2">
                    <h4 className="text-sm font-black text-brand-950 uppercase tracking-widest">Status UMKM</h4>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                 </div>
                 <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-brand-50 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-medium text-brand-900/40">Loyalitas Pelanggan</span>
                       <span className="text-xs font-bold text-brand-950">Tinggi (84%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                       <div className="w-[84%] h-full bg-brand-600" />
                    </div>
                    <p className="text-[10px] text-brand-900/40 italic font-medium leading-tight">
                       *Data ini disinkronkan dengan profil bisnis {profile?.business_name} Anda.
                    </p>
                 </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-6"
          >
             <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-sm flex items-center justify-center relative">
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-600/30">
                   <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <BarChart3 className="w-12 h-12 text-brand-200" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-brand-950 uppercase tracking-tighter">Siap Menghadapi Pasar?</h3>
                <p className="text-brand-900/40 font-medium max-w-sm">
                   Gunakan pencarian di atas untuk mendapatkan laporan intelijen produk Anda di Samarinda.
                </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
