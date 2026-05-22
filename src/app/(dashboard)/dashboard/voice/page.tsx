"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  History, 
  Settings,
  HelpCircle,
  Play,
  Pause,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState([
    { role: "user", text: "Berapa penjualan saya hari ini?", time: "10:00 AM" },
    { role: "assistant", text: "Penjualan Anda hari ini adalah Rp 1.250.000, naik 15% dari kemarin.", time: "10:00 AM" },
    { role: "user", text: "Apa tren produk di Samarinda Seberang?", time: "10:05 AM" },
    { role: "assistant", text: "Tren saat ini adalah 'Cemilan Pedas Gurih'. Banyak konsumen mencari Amplas varian baru.", time: "10:05 AM" },
  ]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-black text-brand-950">LokalLens Voice Assistant</h1>
        <p className="text-brand-900/40 font-medium text-lg">Tanyakan apa saja tentang bisnis Anda melalui suara.</p>
      </div>

      {/* Main Assistant UI */}
      <div className="relative flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] shadow-2xl shadow-brand-600/5 border border-brand-100 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 -z-10">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-50 rounded-full blur-[100px]" />
        </div>

        {/* Waveform Animation */}
        <div className="h-32 flex items-center justify-center gap-1.5 mb-12">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: isListening ? [20, Math.random() * 80 + 20, 20] : 20,
                backgroundColor: isListening ? "#2354FF" : "#E2E8F0"
              }}
              transition={{ 
                duration: 0.5, 
                repeat: Infinity, 
                delay: i * 0.05,
                ease: "easeInOut"
              }}
              className="w-1.5 rounded-full"
            />
          ))}
        </div>

        {/* Mic Button */}
        <div className="relative">
           <AnimatePresence>
             {isListening && (
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1.5, opacity: 1 }}
                 exit={{ scale: 0.8, opacity: 0 }}
                 className="absolute inset-0 bg-brand-600/20 rounded-full blur-2xl"
               />
             )}
           </AnimatePresence>
           
           <button 
             onClick={toggleListening}
             className={cn(
               "relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl",
               isListening 
                 ? "bg-red-500 scale-110 shadow-red-500/40" 
                 : "bg-brand-600 hover:scale-105 shadow-brand-600/40"
             )}
           >
             {isListening ? (
               <MicOff className="w-12 h-12 text-white" />
             ) : (
               <Mic className="w-12 h-12 text-white" />
             )}
           </button>
        </div>

        <div className="mt-12 text-center">
           <h3 className="text-xl font-bold text-brand-950 mb-2">
             {isListening ? "Mendengarkan..." : "Klik untuk Berbicara"}
           </h3>
           <p className="text-brand-900/40 font-medium">
             Coba katakan: "Berapa stok Amplas saya?"
           </p>
        </div>

        {/* Suggestions */}
        <div className="mt-16 flex flex-wrap justify-center gap-3 px-6">
           {[
             "Update stok produk",
             "Cek penjualan hari ini",
             "Analisis tren Samarinda",
             "Buat caption promosi"
           ].map((s, i) => (
             <Button key={i} variant="outline" className="rounded-full border-brand-100 bg-white/50 backdrop-blur-sm text-sm font-bold text-brand-900/60 hover:text-brand-600 hover:border-brand-600 transition-all">
                {s}
             </Button>
           ))}
        </div>
      </div>

      {/* History Section */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
           <div>
             <CardTitle className="text-xl font-bold">Riwayat Percakapan</CardTitle>
             <CardDescription>Interaksi terakhir Anda dengan asisten.</CardDescription>
           </div>
           <Button variant="ghost" size="icon" className="rounded-xl">
             <History className="w-5 h-5 text-brand-400" />
           </Button>
        </CardHeader>
        <CardContent className="space-y-6">
           {history.map((msg, i) => (
             <div key={i} className={cn(
               "flex flex-col gap-2",
               msg.role === "user" ? "items-end" : "items-start"
             )}>
                <div className={cn(
                  "max-w-[80%] p-4 rounded-2xl text-sm font-medium",
                  msg.role === "user" 
                    ? "bg-brand-600 text-white rounded-tr-none" 
                    : "bg-slate-50 text-brand-950 rounded-tl-none border border-slate-100"
                )}>
                   {msg.text}
                </div>
                <span className="text-[10px] font-bold text-brand-900/20 uppercase tracking-widest">{msg.time}</span>
             </div>
           ))}
        </CardContent>
      </Card>
    </div>
  );
}
