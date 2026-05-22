"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles, 
  Clock, 
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const initialEvents = [
  { title: "Promo Amplas Mahakam", date: "2026-05-22", color: "#2354FF" },
  { title: "New Product Launch", date: "2026-05-25", color: "#447CFF" },
  { title: "Testimoni Pelanggan", date: "2026-05-23", color: "#101F56" },
];

export default function CalendarPage() {
  const [events, setEvents] = useState(initialEvents);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-950 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-brand-600" />
            Smart Marketing Calendar
          </h1>
          <p className="text-brand-900/40 font-medium">Atur jadwal posting dan dapatkan rekomendasi waktu terbaik dari AI.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-600/20">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Jadwal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Section */}
        <Card className="lg:col-span-8 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-6">
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek",
                }}
                height="auto"
                eventClassNames="rounded-lg px-2 py-1 text-xs font-bold border-none shadow-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl bg-brand-950 text-white overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/20 rounded-full blur-3xl" />
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                   <Sparkles className="w-5 h-5 text-brand-400" />
                   Rekomendasi Posting
                </CardTitle>
                <CardDescription className="text-brand-200/40">Berdasarkan engagement tertinggi di Samarinda</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                {[
                  { day: "Jumat", time: "19:30 WITA", platform: "Instagram", trend: "High" },
                  { day: "Sabtu", time: "10:00 WITA", platform: "TikTok", trend: "Medium" },
                  { day: "Minggu", time: "20:00 WITA", platform: "WhatsApp", trend: "High" },
                ].map((rec, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer group">
                     <div className="flex justify-between items-start mb-2">
                        <Badge className={cn(
                           "rounded-full text-[10px] font-bold px-2 py-0",
                           rec.trend === "High" ? "bg-green-500 text-white" : "bg-orange-500 text-white"
                        )}>
                           {rec.trend} Engagement
                        </Badge>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{rec.platform}</span>
                     </div>
                     <p className="font-bold text-lg mb-1">{rec.day}, {rec.time}</p>
                     <p className="text-xs text-brand-200/60 leading-relaxed">Waktu terbaik untuk memposting konten F&B di wilayah Samarinda Kota.</p>
                  </div>
                ))}
                <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold py-6 mt-2">
                   Jadwalkan Sekarang
                </Button>
             </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
             <CardHeader>
                <CardTitle className="text-lg font-bold">Daftar Tugas</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                {[
                  { task: "Siapkan foto Amplas Mahakam", done: true },
                  { task: "Generate caption untuk IG", done: true },
                  { task: "Balas DM pelanggan", done: false },
                  { task: "Update stok di Dashboard", done: false },
                ].map((task, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className={cn(
                           "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                           task.done ? "bg-green-500 border-green-500" : "border-slate-200 group-hover:border-brand-300"
                        )}>
                           {task.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <span className={cn(
                           "text-sm font-medium",
                           task.done ? "text-slate-400 line-through" : "text-brand-950"
                        )}>{task.task}</span>
                     </div>
                     {!task.done && <Badge variant="secondary" className="text-[10px] bg-slate-100">Penting</Badge>}
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
