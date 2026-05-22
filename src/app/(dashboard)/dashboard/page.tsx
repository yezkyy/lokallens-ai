"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Sparkles, 
  Search, 
  RefreshCw, 
  DollarSign, 
  Tag, 
  Layout,
  Calendar
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";
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
    setTrendData(null);
    
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
        throw new Error(result.error || "Gagal memuat tren pasar");
      }
      
      setTrendData(result);
      toast.success(`Analisis untuk "${query}" berhasil dimuat`);
    } catch (error: any) {
      console.error("Error in handleAnalyze:", error);
      toast.error(error.message, { duration: 10000 });
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
    <div className="min-h-full w-full relative">
      {/* Dynamic Background Gradient - Exact spec from user */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{ 
             background: `linear-gradient(to bottom, #B8D3FF 50%, #F1F6FF 80%, #FFFFFF 100%)`
           }} 
      />

      <div className="relative z-10 space-y-8 md:space-y-10 pb-20 pt-4 md:pt-6 px-2 md:px-0 max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] flex flex-col">
        
        {/* Search Section */}
        <div className={cn(
          "w-full transition-all duration-700 ease-in-out flex flex-col items-center justify-center px-1",
          trendData ? "mt-2 md:mt-4" : "flex-grow"
        )}>
          {!trendData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 md:space-y-8 mb-8 md:mb-12 text-center w-full"
            >
              <div className="flex flex-col items-center justify-center gap-4 md:gap-6 px-2">
                <h1 className="text-xl sm:text-4xl md:text-5xl lg:text-[64px] font-black tracking-tight text-[#2354FF] leading-tight">
                  Intelijen Pasar Samarinda
                </h1>
              </div>
              <p className="text-[#2354FF]/60 font-bold text-[10px] sm:text-sm md:text-lg lg:text-xl max-w-2xl mx-auto px-6">
                Cari nama produk untuk melihat tren dan harga yang ada di pasaran
              </p>
            </motion.div>
          )}

          <div className="relative group w-full max-w-3xl mx-auto">
            <div className="absolute -inset-2 bg-[#2354FF]/5 rounded-full blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center">
              <div className="absolute left-4 md:left-8 text-[#2354FF]/40">
                <Calendar className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              <Input 
                placeholder="Cari Nama Produk" 
                className="pl-10 md:pl-16 pr-14 md:pr-16 h-14 md:h-20 bg-white shadow-[0_20px_50px_rgba(35,84,255,0.1)] border-none rounded-full text-xs sm:text-base md:text-xl font-bold placeholder:text-[#2354FF]/20 focus-visible:ring-2 focus-visible:ring-[#2354FF]/30 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(searchQuery)}
              />
              <Button 
                onClick={() => handleAnalyze(searchQuery)}
                disabled={isAnalyzing}
                className="absolute right-1.5 md:right-3 w-11 h-11 md:w-14 md:h-14 bg-[#2354FF] hover:bg-[#1a44cc] text-white rounded-full shadow-lg p-0 flex items-center justify-center transition-transform active:scale-95 shrink-0"
              >
                {isAnalyzing ? <RefreshCw className="w-4 h-4 md:w-6 md:h-6 animate-spin" /> : <Search className="w-4 h-4 md:w-6 md:h-6" />}
              </Button>
            </div>
          </div>

          {!trendData && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-8 md:mt-10">
               {["Nasi Kuning", "Sarung Samarinda", "Kopi Etam", "Ikan Pepes"].map(tag => (
                 <Badge 
                   key={tag} 
                   onClick={() => {
                     setSearchQuery(tag);
                     handleAnalyze(tag);
                   }}
                   className="bg-white/40 backdrop-blur-md hover:bg-[#2354FF] hover:text-white text-[#2354FF] border border-white/50 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full cursor-pointer transition-all hover:scale-105 shadow-lg font-black text-[9px] md:text-xs"
                 >
                   + {tag}
                 </Badge>
               ))}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {trendData && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 w-full px-2 md:px-6"
            >
              {/* TOP ROW: Trend Analysis & AI strategy */}
              <div className="lg:col-span-8">
                <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-[2rem] bg-[#2354FF] text-white overflow-hidden p-5 md:p-8 h-full relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/10" />
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-sm sm:text-base md:text-xl font-black uppercase tracking-[0.2em] opacity-90">Analisis Tren Pasar</h3>
                  </div>

                  <div className="w-full h-[200px] sm:h-[240px] md:h-[280px] bg-white rounded-[1.2rem] md:rounded-[1.5rem] p-4 md:p-6 shadow-inner relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData.trendChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "#94A3B8", fontSize: 8, fontWeight: 800 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94A3B8", fontSize: 8, fontWeight: 800 }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '8px', fontSize: '10px' }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#22C55E" 
                          strokeWidth={2} 
                          fillOpacity={0.15} 
                          fill="#22C55E" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-4">
                <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-[2rem] bg-[#2E68FF] text-white overflow-hidden p-5 md:p-8 h-full relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl transition-transform group-hover:scale-110" />
                  <div className="relative z-10 space-y-4 md:space-y-6">
                    <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                       <Sparkles size={12} className="text-white" />
                       <span className="text-[9px] md:text-[10px] font-black tracking-widest uppercase">AI INSIGHT</span>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black leading-tight tracking-tight">Saran Strategi UMKM</h3>
                    
                    <div className="space-y-3 md:space-y-4">
                      {trendData.recommendations.slice(0, 3).map((rec, i) => (
                        <div key={i} className="flex gap-3 items-start">
                           <div className="w-5 h-5 md:w-6 md:h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 text-white font-black text-[9px] md:text-[10px]">
                              {i + 1}
                           </div>
                           <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-white/90 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* BOTTOM ROW: Price & Keywords */}
              <div className="lg:col-span-8">
                <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-[2rem] bg-[#3EE79B] p-5 md:p-8 h-full relative overflow-hidden group">
                  <div className="absolute -top-16 -left-16 w-48 h-48 bg-black/5 rounded-full blur-3xl" />
                  <div className="flex flex-col h-full justify-between gap-6 md:gap-8 relative z-10">
                    <div>
                      <Badge className="bg-black/10 text-[#0F172A] border-none px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center w-fit gap-2 rounded-full">
                        <DollarSign size={12} /> Mata-mata Harga
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tighter leading-none break-all">
                        Rp. {trendData.competitorPricing.average.toLocaleString('id-ID')}
                      </h2>
                    </div>

                    <p className="text-[#0F172A]/70 text-xs sm:text-sm md:text-base font-bold leading-relaxed max-w-2xl">
                      {trendData.competitorPricing.reasoning || "Berdasarkan analisis real-time pasar Samarinda, harga ini merupakan titik temu kompetitif."}
                    </p>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-4">
                <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-[2rem] bg-[#FFA93E] p-5 md:p-8 h-full relative overflow-hidden group">
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mb-20 blur-3xl transition-transform group-hover:scale-125" />
                  <div className="relative z-10 space-y-4 md:space-y-6">
                    <Badge className="bg-black/10 text-[#0F172A] border-none px-3 md:px-4 py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center w-fit gap-2 rounded-full">
                      <Tag size={12} /> Kata Kunci Viral
                    </Badge>
                    
                    <div className="flex flex-wrap gap-2">
                      {trendData.popularHashtags.map(tag => (
                        <span key={tag} className="bg-white/30 backdrop-blur-md hover:bg-white/50 text-[#0F172A] px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black transition-all cursor-default shadow-sm uppercase tracking-tight">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
