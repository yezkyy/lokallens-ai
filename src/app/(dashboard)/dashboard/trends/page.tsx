"use client";

import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieIcon,
  Globe,
  MapPin,
  Sparkles,
  Info,
  ChevronRight,
  TrendingDown,
  LineChart as LineIcon
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
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const trendData = [
  { month: "Jan", volume: 400, price: 240 },
  { month: "Feb", volume: 300, price: 139 },
  { month: "Mar", volume: 600, price: 980 },
  { month: "Apr", volume: 800, price: 390 },
  { month: "May", volume: 500, price: 480 },
  { month: "Jun", volume: 900, price: 380 },
];

const categoryDistribution = [
  { name: "Samarinda Seberang", value: 400, color: "#2354FF" },
  { name: "Samarinda Kota", value: 300, color: "#447CFF" },
  { name: "Sungai Kunjang", value: 200, color: "#679FFF" },
  { name: "Palaran", value: 100, color: "#92C3FF" },
];

export default function TrendsPage() {
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
          <Button className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl">
            Download Report
          </Button>
        </div>
      </div>

      {/* Top Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <Badge className="bg-orange-100 text-orange-600 border-orange-200">+42% Viral</Badge>
            </div>
            <h3 className="text-lg font-bold text-brand-950 mb-1">Keywords Populer</h3>
            <p className="text-sm text-brand-900/40 mb-4">"Oleh-oleh khas Samarinda", "Cemilan gurih"</p>
            <div className="flex flex-wrap gap-2">
               <Badge variant="outline" className="rounded-full">#SamarindaHits</Badge>
               <Badge variant="outline" className="rounded-full">#KulinerEtam</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                <Target className="w-6 h-6" />
              </div>
              <Badge className="bg-brand-100 text-brand-600 border-brand-200">Stabil</Badge>
            </div>
            <h3 className="text-lg font-bold text-brand-950 mb-1">Benchmark Harga</h3>
            <p className="text-sm text-brand-900/40 mb-4">Rata-rata kompetitor menjual di Rp 35.000 - Rp 45.000</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
               <div className="h-full bg-brand-200 w-[30%]" />
               <div className="h-full bg-brand-600 w-[40%]" />
               <div className="h-full bg-brand-200 w-[30%]" />
            </div>
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
            <p className="text-sm text-brand-100/60 leading-relaxed">
              Permintaan produk 'Craft' meningkat tajam jelang akhir pekan di area Samarinda Kota.
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
              <CardDescription>Pergerakan minat konsumen 6 bulan terakhir</CardDescription>
            </div>
            <Tabs defaultValue="vol" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2 rounded-xl h-10">
                <TabsTrigger value="vol" className="rounded-lg text-xs font-bold">Volume</TabsTrigger>
                <TabsTrigger value="price" className="rounded-lg text-xs font-bold">Harga</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="h-[400px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2354FF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2354FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8" }} />
                <Tooltip 
                   contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Area type="monotone" dataKey="volume" stroke="#2354FF" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Regional Distribution */}
        <Card className="lg:col-span-4 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Distribusi Wilayah</CardTitle>
            <CardDescription>Area dengan permintaan tertinggi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
               {categoryDistribution.map((item) => (
                 <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-sm font-medium text-brand-900/70">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-brand-950">{item.value}%</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Analysis Table Mock */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Analisis Kompetitor Langsung</CardTitle>
          <CardDescription>Berdasarkan kategori produk yang sama di Samarinda</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                       <th className="px-6 py-4 text-xs font-bold text-brand-900/40 uppercase tracking-widest">Kompetitor</th>
                       <th className="px-6 py-4 text-xs font-bold text-brand-900/40 uppercase tracking-widest">Rata-rata Harga</th>
                       <th className="px-6 py-4 text-xs font-bold text-brand-900/40 uppercase tracking-widest">Sentimen Pelanggan</th>
                       <th className="px-6 py-4 text-xs font-bold text-brand-900/40 uppercase tracking-widest">Keunggulan Utama</th>
                       <th className="px-6 py-4 text-xs font-bold text-brand-900/40 uppercase tracking-widest">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {[
                      { name: "Toko Amplas Sejahtera", price: "Rp 32.500", sentiment: "Positif", edge: "Harga Murah" },
                      { name: "Keripik Mahakam Jaya", price: "Rp 45.000", sentiment: "Sangat Positif", edge: "Packaging Mewah" },
                      { name: "UMKM Berkah", price: "Rp 28.000", sentiment: "Netral", edge: "Lokasi Strategis" },
                    ].map((comp, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-4 font-bold text-brand-950">{comp.name}</td>
                         <td className="px-6 py-4 text-brand-900/70 font-medium">{comp.price}</td>
                         <td className="px-6 py-4">
                            <Badge className="bg-green-50 text-green-600 border-green-100">{comp.sentiment}</Badge>
                         </td>
                         <td className="px-6 py-4 text-brand-900/70">{comp.edge}</td>
                         <td className="px-6 py-4">
                            <Button variant="ghost" size="sm" className="text-brand-600 font-bold hover:bg-brand-50 rounded-lg">Analisis Detail</Button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
