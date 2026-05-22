"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Sparkles, 
  Download, 
  RefreshCw,
  Palette,
  Home,
  Sun,
  Type,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ReactCompareImage from "react-compare-image";

const visualStyles = [
  { id: "Cinematic", name: "Cinematic", icon: "🎬" },
  { id: "Minimalist", name: "Minimalist", icon: "⚪" },
  { id: "Vibrant", name: "Vibrant", icon: "🌈" },
  { id: "Vintage", name: "Vintage", icon: "🎞️" },
];

const studioStyles = [
  { id: "Luxury Marble", name: "Marble", icon: "🏛️" },
  { id: "Modern Cafe", name: "Cafe", icon: "☕" },
  { id: "Rustic Wood", name: "Wood", icon: "🪵" },
  { id: "Nature Garden", name: "Garden", icon: "🌿" },
  { id: "Professional Studio", name: "Studio", icon: "📸" },
];

const lightingStyles = [
  { id: "Soft Studio", name: "Soft", icon: "💡" },
  { id: "Warm Sunlight", name: "Warm", icon: "☀️" },
  { id: "Neon Purple", name: "Neon", icon: "🔮" },
  { id: "Natural Window", name: "Natural", icon: "🪟" },
];

export default function VisualizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualStyle, setVisualStyle] = useState(visualStyles[0].id);
  const [studioStyle, setStudioStyle] = useState(studioStyles[0].id);
  const [lighting, setLighting] = useState(lightingStyles[0].id);
  const [customInstruction, setCustomInstruction] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [rawError, setRawError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResultImage(null);
      setRawError(null);
    }
  };

  const processImage = async () => {
    if (!file) {
      toast.error("Unggah foto produk terlebih dahulu!");
      return;
    }
    
    setIsProcessing(true);
    setRawError(null);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("quality", "standard");
    formData.append("aspectRatio", "1:1");
    formData.append("visualStyle", visualStyle);
    formData.append("studioStyle", studioStyle);
    formData.append("lighting", lighting);
    formData.append("customInstruction", customInstruction);

    try {
      const response = await fetch("/api/ai/enhance-product-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        setRawError(JSON.stringify(data, null, 2));
        throw new Error(data.error || "Gagal memproses gambar. Cek detail error di bawah.");
      }

      const finalUrl = data.base64 ? `data:image/png;base64,${data.base64}` : data.url;
      
      if (finalUrl) {
        setResultImage(finalUrl);
        setCooldown(15);
        toast.success("Magic Gemini Berhasil!");
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 500);
      } else {
        setRawError(JSON.stringify(data, null, 2));
        throw new Error("AI Berhasil tapi tidak ada gambar. Klik 'Debug JSON' untuk melihat isi respon.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-950 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-brand-600" />
            Gemini Visualizer <span className="text-brand-600">2.5</span>
          </h1>
          <p className="text-brand-900/40 font-medium text-lg">Menggunakan Gemini 2.5 Flash Image untuk hasil super realistis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden sticky top-24">
            <CardContent className="p-8 space-y-8">
              {/* Gaya Visual */}
              <section className="space-y-4">
                 <div className="flex items-center gap-2 text-brand-950 font-bold">
                    <Palette className="w-5 h-5 text-brand-600" />
                    <h3>Gaya Visual</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    {visualStyles.map(s => (
                      <button key={s.id} onClick={() => setVisualStyle(s.id)} className={cn("flex items-center gap-2 p-3 rounded-xl border-2 transition-all", visualStyle === s.id ? "border-brand-600 bg-brand-50" : "border-slate-50 hover:border-brand-100")}>
                        <span>{s.icon}</span>
                        <span className="text-xs font-bold">{s.name}</span>
                      </button>
                    ))}
                 </div>
              </section>

              {/* Gaya Studio */}
              <section className="space-y-4">
                 <div className="flex items-center gap-2 text-brand-950 font-bold">
                    <Home className="w-5 h-5 text-brand-600" />
                    <h3>Studio</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    {studioStyles.map(s => (
                      <button key={s.id} onClick={() => setStudioStyle(s.id)} className={cn("flex items-center gap-2 p-3 rounded-xl border-2 transition-all", studioStyle === s.id ? "border-brand-600 bg-brand-50" : "border-slate-50")}>
                        <span>{s.icon}</span>
                        <span className="text-xs font-bold">{s.name}</span>
                      </button>
                    ))}
                 </div>
              </section>

              <Button size="lg" disabled={isProcessing || !file || cooldown > 0} className="w-full h-16 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-brand-600/30" onClick={processImage}>
                {isProcessing ? <RefreshCw className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                {cooldown > 0 ? `Tunggu ${cooldown}s` : "Transformasikan"}
              </Button>

              {rawError && (
                <Button variant="ghost" size="sm" className="w-full text-red-500 hover:bg-red-50 font-mono text-[10px]" onClick={() => console.log(rawError)}>
                  <Code className="w-3 h-3 mr-2" /> DEBUG JSON ERROR (Check Console)
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <Card className="border-none shadow-sm rounded-[3rem] bg-white overflow-hidden min-h-[400px] flex items-center justify-center">
             {!preview ? (
               <div className="flex flex-col items-center justify-center p-20 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 bg-brand-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                    <Upload className="w-10 h-10 text-brand-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-950">Unggah Foto Produk</h3>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
               </div>
             ) : (
                <div className="relative p-10">
                   <div className="w-full max-w-md aspect-square rounded-[2.5rem] overflow-hidden border-[12px] border-slate-50 shadow-2xl">
                      <img src={preview} className="w-full h-full object-cover" alt="Original" />
                   </div>
                   <Badge className="absolute top-14 left-14 bg-white/90 text-brand-600 font-bold">ASLI</Badge>
                </div>
             )}
          </Card>

          <AnimatePresence>
            {(isProcessing || resultImage) && (
              <motion.div ref={resultRef} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="border-none shadow-2xl rounded-[3.5rem] bg-slate-950 overflow-hidden relative">
                   <CardContent className="p-0 min-h-[600px] flex items-center justify-center">
                      {isProcessing ? (
                        <div className="flex flex-col items-center text-white space-y-6">
                           <div className="relative w-24 h-24">
                              <div className="absolute inset-0 border-4 border-brand-600 rounded-full border-t-transparent animate-spin" />
                           </div>
                           <p className="text-xl font-bold">Gemini 2.5 sedang merancang visual...</p>
                        </div>
                      ) : resultImage && (
                        <div className="w-full h-full p-8 md:p-12">
                           <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10">
                              <ReactCompareImage leftImage={preview!} rightImage={resultImage} leftImageLabel="ASLI" rightImageLabel="GEMINI AI" sliderLineWidth={4} handleSize={50} />
                           </div>
                           <Button size="lg" className="mt-8 bg-white text-slate-950 rounded-2xl w-full h-16 font-bold" onClick={() => { const link = document.createElement("a"); link.href = resultImage; link.download = "LokalLens-Gemini.png"; link.click(); }}>
                             <Download className="mr-2" /> Simpan Hasil PRO
                           </Button>
                        </div>
                      )}
                   </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {rawError && (
             <div className="p-6 bg-red-50 border border-red-100 rounded-3xl space-y-3">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                   <AlertCircle className="w-5 h-5" />
                   <h4>Detail Kegagalan Teknis</h4>
                </div>
                <pre className="p-4 bg-white rounded-xl text-[10px] text-red-400 overflow-x-auto border border-red-50">
                   {rawError}
                </pre>
                <p className="text-xs text-red-900/40 italic">Silakan salin teks merah di atas dan kirimkan ke saya untuk diperbaiki.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
