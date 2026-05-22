"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  History, 
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VoiceAssistantPage() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([
    { role: "assistant", text: "Halo Etam! Saya asisten LokalLens AI. Ada yang bisa saya bantu hari ini?", time: "System" },
  ]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "id-ID";

        recognitionRef.current.onresult = (event: any) => {
          const currentTranscript = event.results[0][0].transcript;
          setTranscript(currentTranscript);
          handleVoiceAction(currentTranscript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          toast.error("Gagal mendengarkan suara. Pastikan mikrofon aktif.");
        };
      }
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleVoiceAction = async (text: string) => {
    setIsAnalyzing(true);
    
    // Add user message to history
    setHistory(prev => [...prev, { 
      role: "user", 
      text, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);

    try {
      const response = await fetch("/api/ai/voice-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });

      if (!response.ok) throw new Error("Gagal menganalisis perintah");

      const data = await response.json();
      
      // Add assistant response
      setHistory(prev => [...prev, { 
        role: "assistant", 
        text: `Saya mendeteksi niat Anda untuk: ${data.intent}. Mengalihkan...`, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);

      toast.success(`Mendeteksi: ${data.intent}`);

      // Redirect if intent found
      if (data.redirectTo) {
        setTimeout(() => {
          router.push(data.redirectTo);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error analyzing intent:", error);
      toast.error(error.message || "Gagal memproses suara");
    } finally {
      setIsAnalyzing(false);
    }
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
                height: isListening ? [20, Math.random() * 80 + 20, 20] : isAnalyzing ? [40, 60, 40] : 20,
                backgroundColor: isListening ? "#2354FF" : isAnalyzing ? "#FB923C" : "#E2E8F0"
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
             {(isListening || isAnalyzing) && (
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1.5, opacity: 1 }}
                 exit={{ scale: 0.8, opacity: 0 }}
                 className={cn(
                   "absolute inset-0 rounded-full blur-2xl",
                   isListening ? "bg-brand-600/20" : "bg-orange-600/20"
                 )}
               />
             )}
           </AnimatePresence>
           
           <button 
             onClick={toggleListening}
             disabled={isAnalyzing}
             className={cn(
               "relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl disabled:opacity-50",
               isListening 
                 ? "bg-red-500 scale-110 shadow-red-500/40" 
                 : isAnalyzing ? "bg-orange-500 shadow-orange-500/40" : "bg-brand-600 hover:scale-105 shadow-brand-600/40"
             )}
           >
             {isAnalyzing ? (
               <RefreshCw className="w-12 h-12 text-white animate-spin" />
             ) : isListening ? (
               <MicOff className="w-12 h-12 text-white" />
             ) : (
               <Mic className="w-12 h-12 text-white" />
             )}
           </button>
        </div>

        <div className="mt-12 text-center px-6">
           <h3 className="text-xl font-bold text-brand-950 mb-2">
             {isListening ? "Mendengarkan..." : isAnalyzing ? "AI Sedang Berpikir..." : "Klik untuk Berbicara"}
           </h3>
           <p className="text-brand-900/40 font-medium max-w-sm mx-auto">
             {transcript || "Coba katakan: 'Tolong buatkan caption jualan amplang'"}
           </p>
        </div>

        {/* Suggestions */}
        <div className="mt-16 flex flex-wrap justify-center gap-3 px-6">
           {[
             "Buka visualizer produk",
             "Lihat tren pasar",
             "Buat caption jualan",
             "Hitung strategi harga"
           ].map((s, i) => (
             <Button 
               key={i} 
               onClick={() => handleVoiceAction(s)}
               variant="outline" 
               className="rounded-full border-brand-100 bg-white/50 backdrop-blur-sm text-sm font-bold text-brand-900/60 hover:text-brand-600 hover:border-brand-600 transition-all"
             >
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
