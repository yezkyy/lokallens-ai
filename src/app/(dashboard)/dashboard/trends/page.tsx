"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Sparkles,
  RefreshCw,
  Info
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TrendData {
  trendScore: number;
  trendChartData: { name: string; value: number }[];
  marketInsights: string[];
  recommendations: string[];
  popularHashtags: string[];
}

export default function TrendsPage() {
  const [data, setData] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/analyze-market-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focusArea: "Samarinda UMKM & Kuliner" }),
      });
      
      if (!response.ok) throw new Error("Gagal memuat tren pasar");
      
      const trendData = await response.json();
      setData(trendData);
    } catch (error: any) {
      console.error("Error fetching trends:", error);
      toast.error(error.message || "Gagal memuat data tren");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const categoryDistribution = [
    { name: "Samarinda Seberang", value: 40, color: "#2354FF" },
    { name: "Samarinda Kota", value: 30, color: "#447CFF" },
    { name: "Sungai Kunjang", value: 20, color: "#679FFF" },
    { name: "Palaran", value: 10, color: "#92C3FF" },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-950 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-brand-600" />
            AI Competitor & Trend Analyzer
          </h1>
          <p className="text-brand-900/40 font-medium">Data real-time untuk strategi bisnis UMKM yang lebih cerdas.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchTrends} 
            disabled={isLoading}
            variant="outline" 
            className="rounded-xl border-brand-100"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            Update Data
          </Button>
          <Button className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-600/20">
            Download Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1, 2, 3].map(i => (
             <Card key={i} className="border-none shadow-sm rounded-3xl bg-white animate-pulse">
                <div className="h-48" />
             </Card>
           ))}
        </div>
      ) : (
        <>
          {/* Top Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <Badge className="bg-orange-100 text-orange-600 border-orange-200">
                    Score: {data?.trendScore || 0}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-brand-950 mb-1">Hashtag Populer</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                   {data?.popularHashtags.slice(0, 5).map(tag => (
                     <Badge key={tag} variant="outline" className="rounded-full">{tag}</Badge>
                   ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <Badge className="bg-brand-100 text-brand-600 border-brand-200">AI Verified</Badge>
                </div>
                <h3 className="text-lg font-bold text-brand-950 mb-1">Rekomendasi Strategi</h3>
                <p className="text-xs text-brand-900/40 line-clamp-2">{data?.recommendations[0]}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-3xl bg-brand-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-brand-200" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-1">AI Golden Insight</h3>
                <p className="text-sm text-brand-100/80 leading-relaxed line-clamp-2">
                  {data?.marketInsights[0]}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Trend Chart */}
            <Card className="lg:col-span-8 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Tren Volume Pasar</CardTitle>
                  <CardDescription>Analisis AI untuk pergerakan minat konsumen</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.trendChartData}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2354FF" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2354FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8" }} />
                    <Tooltip 
                       contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#2354FF" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Insights List */}
            <Card className="lg:col-span-4 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Insights Detail</CardTitle>
                <CardDescription>Temuan AI terbaru</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                   {data?.marketInsights.slice(0, 4).map((insight, i) => (
                     <div key={i} className="flex gap-3 items-start p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 text-brand-600 font-bold text-xs">
                           {i + 1}
                        </div>
                        <p className="text-xs text-brand-900/70 leading-relaxed font-medium">
                           {insight}
                        </p>
                     </div>
                   ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
