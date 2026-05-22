"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  Plus,
  TrendingUp,
  Send,
  RefreshCw,
  Trash2,
  Edit2,
  X,
  CheckCircle2,
  Layout,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { GENERAL_STRATEGIES } from "@/lib/constants/strategies";

// Helper to get today's date in WITA (UTC+8) format YYYY-MM-DD
const getTodayWITA = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
};

// Helper to format any date string to WITA YYYY-MM-DD safely
const formatToWITA = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr.split('T')[0];
  
  // For ISO strings or Date objects, convert to WITA YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Makassar',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

interface AIStrategy {
  bestTime: string;
  timeReasoning?: string;
  platforms: string[];
  strategy: string;
  contentHooks?: string[];
  hashtags: string[];
}

interface Schedule {
  id: string;
  product_id: string | null;
  product_name: string | null;
  title: string | null;
  scheduled_date: string;
  scheduled_time: string;
  platform: string;
  status: string;
}

export default function SmartCalendarPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isDialogOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Memuat Strategi...");
  const [errorDetails, setErrorDetails] = useState<any>(null);
  
  const [currentStrategyIndex, setCurrentStrategyIndex] = useState(0);
  const [todaysSchedules, setTodaysSchedules] = useState<Schedule[]>([]);
  const [manualStrategyIndex, setManualStrategyIndex] = useState(0);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    product_id: "",
    scheduled_date: getTodayWITA(),
    scheduled_time: "09:00",
    platform: "Instagram"
  });

  const [aiTip, setAiTip] = useState<AIStrategy>({
    bestTime: "...",
    timeReasoning: "",
    strategy: "Menganalisis jadwal Anda...",
    platforms: [],
    hashtags: []
  });

  const updateRecommendationStrategy = (product: string) => {
    if (!product || product === "Belum Ada Jadwal") return;
    
    setIsGeneratingAI(true);
    // Simulate a brief analysis for better UX
    setTimeout(() => {
      // Cycle through strategies using manualStrategyIndex
      const strategy = GENERAL_STRATEGIES[manualStrategyIndex];
      
      setAiTip({
        bestTime: strategy.timeSlot,
        timeReasoning: strategy.timeReasoning,
        platforms: strategy.platforms,
        strategy: strategy.strategy,
        contentHooks: strategy.contentHooks,
        hashtags: strategy.hashtags
      });
      
      setFormData(prev => ({ ...prev, scheduled_time: strategy.timeSlot }));
      
      // Update index for next click
      setManualStrategyIndex((prev) => (prev + 1) % GENERAL_STRATEGIES.length);
      
      setIsGeneratingAI(false);
      if (product !== "Memuat Strategi..." && product !== "Produk") {
        toast.success(`Saran strategi diperbarui`);
      }
    }, 600);
  };

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/calendar");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setSchedules(data);
      
      const today = getTodayWITA();
      const filtered = data.filter((s: Schedule) => formatToWITA(s.scheduled_date) === today);
      setTodaysSchedules(filtered);
      
      if (filtered.length > 0) {
        const first = filtered[0];
        const productName = first.title || first.product_name || "Produk";
        setSelectedProduct(productName);
        updateRecommendationStrategy(productName);
        setCurrentStrategyIndex(0);
      } else if (data.length > 0) {
        const first = data[0];
        const productName = first.title || first.product_name || "Produk";
        setSelectedProduct(productName);
        updateRecommendationStrategy(productName);
      } else {
        setSelectedProduct("Belum Ada Jadwal");
        setAiTip({
          bestTime: "-",
          strategy: "Buat jadwal promosi pertama Anda untuk melihat strategi marketing di sini.",
          platforms: [],
          hashtags: []
        });
      }
    } catch (error) {
      toast.error("Gagal memuat jadwal");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openCreateDialog = () => {
    setIsEditing(false);
    setErrorDetails(null);
    setFormData({
      id: "",
      title: "",
      product_id: "",
      scheduled_date: getTodayWITA(),
      scheduled_time: "09:00",
      platform: "Instagram"
    });
    setIsOpen(true);
  };

  const openEditDialog = (schedule: Schedule) => {
    setIsEditing(true);
    setErrorDetails(null);
    const title = schedule.title || schedule.product_name || "Produk";
    setFormData({
      id: schedule.id,
      title,
      product_id: schedule.product_id || "",
      scheduled_date: formatToWITA(schedule.scheduled_date),
      scheduled_time: schedule.scheduled_time.slice(0, 5),
      platform: schedule.platform
    });
    setSelectedProduct(title);
    updateRecommendationStrategy(title);
    setIsOpen(true);
  };

  const handleSave = async () => {
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/calendar/${formData.id}` : "/api/calendar";
    
    setIsLoading(true);
    setErrorDetails(null);

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setErrorDetails(data);
        throw new Error(data.details || "Gagal menyimpan jadwal");
      }

      toast.success(isEditing ? "Jadwal diperbarui!" : "Jadwal berhasil dibuat!");
      setIsOpen(false);
      fetchSchedules();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus jadwal ini?")) return;
    try {
      const res = await fetch(`/api/calendar/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Jadwal dihapus");
        fetchSchedules();
      }
    } catch (error) {
      toast.error("Gagal menghapus jadwal");
    }
  };

  const calendarEvents = schedules.map(s => ({
    id: s.id,
    title: s.title || s.product_name || "Post",
    start: formatToWITA(s.scheduled_date),
    extendedProps: { platform: s.platform }
  }));

  return (
    <div className="min-h-full w-full relative">
      {/* Dynamic Background Gradient - Consistent with Dashboard */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{ 
             background: `linear-gradient(to bottom, #B8D3FF 50%, #F1F6FF 80%, #FFFFFF 100%)`
           }} 
      />

      <div className="relative z-10 space-y-6 lg:space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-brand-950 flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-brand-600" />
              Smart Scheduler
            </h1>
            <p className="text-brand-900/40 font-bold text-xs md:text-sm">Data dinamis dan strategi pemasaran terintegrasi.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={openCreateDialog} className="w-full md:w-auto h-12 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-600/20 font-bold">
               <Plus className="w-4 h-4 mr-2" />
               Buat Jadwal Baru
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: Dynamic Calendar */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-8 order-2 lg:order-1">
            <Card className="border-none shadow-sm rounded-[1.5rem] lg:rounded-[2rem] bg-white overflow-hidden p-4 lg:p-6 relative">
              {isLoading && !isDialogOpen && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                   <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
                </div>
              )}
              <div className="calendar-container overflow-x-auto">
                <div className="min-w-[600px] lg:min-w-0">
                  <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: 'prev,next',
                      center: 'title',
                      right: 'today'
                    }}
                    events={calendarEvents}
                    height="auto"
                    eventContent={(eventInfo) => (
                      <div className="p-1 bg-brand-50 border border-brand-100 rounded-md overflow-hidden">
                        <p className="text-[9px] font-black text-brand-700 truncate">{eventInfo.event.title}</p>
                      </div>
                    )}
                  />
                </div>
              </div>
            </Card>

            {/* Schedule Management List */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-lg font-black text-brand-950 uppercase tracking-widest opacity-40">Daftar Penjadwalan</h3>
                  <RefreshCw onClick={fetchSchedules} className={cn("w-4 h-4 text-brand-400 cursor-pointer", isLoading && "animate-spin")} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schedules.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white/40 rounded-[2rem] border border-dashed border-brand-200">
                       <p className="text-sm font-bold text-brand-900/20">Belum ada jadwal yang dibuat.</p>
                    </div>
                  ) : schedules.map((s) => (
                    <div key={s.id} className="bg-white p-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-sm border border-brand-50 flex items-center justify-between group hover:shadow-md transition-all">
                       <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-50 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-600 shrink-0">
                             <Layout className="w-5 h-5 md:w-6 md:h-6" />
                          </div>
                          <div className="min-w-0">
                             <p className="font-bold text-brand-950 text-sm md:text-base truncate">{s.title || s.product_name || "Tanpa Nama"}</p>
                             <div className="flex items-center gap-2 mt-0.5">
                                <Badge className="text-[9px] bg-slate-100 text-brand-900/60 border-none px-2">{s.platform}</Badge>
                                <span className="text-[9px] text-brand-900/40 font-bold truncate">{formatToWITA(s.scheduled_date)} • {s.scheduled_time.slice(0, 5)}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button onClick={() => openEditDialog(s)} size="icon" variant="ghost" className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-slate-50 text-brand-600">
                             <Edit2 className="w-3.5 h-3.5 md:w-4 h-4" />
                          </Button>
                          <Button onClick={() => handleDelete(s.id)} size="icon" variant="ghost" className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-red-50 text-red-500">
                             <Trash2 className="w-3.5 h-3.5 md:w-4 h-4" />
                          </Button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Right: Real-time AI Strategy */}
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <Card className="border-none shadow-2xl rounded-[1.5rem] lg:rounded-[2.5rem] bg-brand-950 text-white overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/20 rounded-full blur-3xl" />
               {isGeneratingAI && (
                  <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-4 p-6 text-center">
                     <Sparkles className="w-8 h-8 text-brand-400 animate-pulse" />
                     <p className="text-xs font-bold text-brand-200">Menganalisis strategi terbaik...</p>
                  </div>
               )}
               <CardHeader className="p-5 md:p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
                           <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <Badge className="bg-brand-600/20 text-brand-400 border-none text-[9px]">STRATEGI PILIHAN</Badge>
                     </div>
                     {todaysSchedules.length > 1 && (
                       <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-brand-400 hover:text-white hover:bg-white/10"
                            onClick={() => {
                              const newIndex = (currentStrategyIndex - 1 + todaysSchedules.length) % todaysSchedules.length;
                              setCurrentStrategyIndex(newIndex);
                              const nextSched = todaysSchedules[newIndex];
                              const pName = nextSched.title || nextSched.product_name || "Produk";
                              setSelectedProduct(pName);
                              updateRecommendationStrategy(pName);
                            }}
                          >
                             <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <span className="text-[9px] font-bold w-6 text-center">{currentStrategyIndex + 1}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-brand-400 hover:text-white hover:bg-white/10"
                            onClick={() => {
                              const newIndex = (currentStrategyIndex + 1) % todaysSchedules.length;
                              setCurrentStrategyIndex(newIndex);
                              const nextSched = todaysSchedules[newIndex];
                              const pName = nextSched.title || nextSched.product_name || "Produk";
                              setSelectedProduct(pName);
                              updateRecommendationStrategy(pName);
                            }}
                          >
                             <ChevronRight className="w-4 h-4" />
                          </Button>
                       </div>
                     )}
                  </div>
                  <CardTitle className="text-lg md:text-xl font-black">Rekomendasi Strategi</CardTitle>
                  <CardDescription className="text-brand-200/50 text-xs truncate">Menganalisis: <span className="text-brand-400 font-bold">{selectedProduct}</span></CardDescription>
               </CardHeader>
               <CardContent className="p-5 md:p-6 lg:p-8 pt-0 space-y-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <div className="flex items-start gap-3 mb-4">
                        <Clock className="w-5 h-5 text-brand-400 mt-0.5 shrink-0" />
                        <div>
                           <p className="text-[9px] font-black uppercase tracking-widest text-brand-400">Jam Posting Terbaik</p>
                           <p className="font-bold text-base md:text-lg">{aiTip.bestTime}</p>
                           {aiTip.timeReasoning && (
                             <p className="text-[9px] text-brand-200/60 mt-1 leading-tight">{aiTip.timeReasoning}</p>
                           )}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-400">Platform Prioritas</p>
                        <div className="flex flex-wrap gap-1.5">
                           {aiTip.platforms.map(p => (
                             <Badge key={p} variant="outline" className="text-[9px] border-white/20 text-white px-2 py-0.5">{p}</Badge>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-widest text-brand-400 flex items-center gap-2">
                          <Layout className="w-3 h-3" /> Strategi Visual
                        </p>
                        <p className="text-xs md:text-sm text-brand-100/70 leading-relaxed font-bold italic border-l-2 border-brand-600 pl-3">
                          "{aiTip.strategy}"
                        </p>
                     </div>

                     {aiTip.contentHooks && aiTip.contentHooks.length > 0 && (
                       <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-brand-400">Content Hooks</p>
                          <div className="space-y-2">
                             {aiTip.contentHooks.map((hook, i) => (
                               <div key={i} className="text-[10px] md:text-xs bg-white/5 p-2.5 rounded-xl border border-white/5 text-brand-100/80 font-bold">
                                  {hook}
                               </div>
                             ))}
                          </div>
                       </div>
                     )}

                     <div className="flex flex-wrap gap-1.5 pt-2">
                        {aiTip.hashtags.map(h => (
                          <span key={h} className="text-[9px] font-black text-brand-400 bg-brand-600/10 px-2 py-1 rounded-lg uppercase tracking-tight">{h}</span>
                        ))}
                     </div>
                  </div>

                  <Button 
                    onClick={() => updateRecommendationStrategy(selectedProduct)}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-2xl h-14 md:h-16 font-black uppercase tracking-widest shadow-xl shadow-brand-600/20 group text-[10px] md:text-xs"
                  >
                     Perbarui Strategi
                     <RefreshCw className="ml-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CRUD Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl p-8 bg-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-brand-950">
              {isEditing ? "Edit Jadwal" : "Buat Jadwal Baru"}
            </DialogTitle>
            <DialogDescription>
              Isi detail konten Anda. Waktu posting terbaik akan ditentukan secara otomatis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            {errorDetails && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 items-start">
                 <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                 <div className="space-y-1">
                    <p className="text-xs font-bold text-red-950">Terjadi Kesalahan Server</p>
                    <p className="text-[10px] text-red-600 leading-tight font-mono">{errorDetails.details}</p>
                 </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900/40 uppercase tracking-widest">Nama Konten / Produk</label>
              <Input 
                placeholder="Contoh: Promo Nasi Kuning Mantap"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                onBlur={() => {
                  if (formData.title) {
                    setSelectedProduct(formData.title);
                    updateRecommendationStrategy(formData.title);
                  }
                }}
                className="rounded-xl h-12 font-bold"
              />
              <p className="text-[10px] text-brand-600 font-medium italic">*Saran strategi akan muncul saat Anda selesai mengetik.</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900/40 uppercase tracking-widest">Tanggal Posting</label>
              <Input 
                type="date" 
                value={formData.scheduled_date}
                onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                className="rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-900/40 uppercase tracking-widest">Platform</label>
              <div className="grid grid-cols-3 gap-2">
                 {["Instagram", "TikTok", "WhatsApp"].map(p => (
                   <button
                    key={p}
                    onClick={() => setFormData({...formData, platform: p})}
                    className={cn(
                      "py-3 rounded-xl text-[10px] font-black uppercase transition-all border-2",
                      formData.platform === p ? "border-brand-600 bg-brand-50 text-brand-600" : "border-slate-50 text-brand-900/20"
                    )}
                   >
                     {p}
                   </button>
                 ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isLoading} onClick={handleSave} className="w-full h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-brand-600/20">
               {isLoading ? <RefreshCw className="animate-spin" /> : (isEditing ? "Perbarui Jadwal" : "Konfirmasi & Simpan")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        .fc { font-family: inherit; }
        .fc .fc-toolbar-title { font-size: 1.25rem; font-weight: 800; color: #020617; }
        .fc .fc-button-primary { background-color: #2354FF; border-color: #2354FF; border-radius: 16px; font-weight: 700; text-transform: capitalize; padding: 8px 16px; }
        .fc .fc-button-primary:hover { background-color: #1a44cc; border-color: #1a44cc; }
        .fc .fc-daygrid-day.fc-day-today { background-color: #f8faff !important; }
        .fc .fc-daygrid-day-number { font-size: 0.875rem; font-weight: 700; padding: 12px; color: #64748b; }
        .fc .fc-col-header-cell-cushion { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; padding: 16px 0; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #f1f5f9; }
        .fc .fc-event { border: none; background: transparent; }
      `}</style>
    </div>
  );
}
