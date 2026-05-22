"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Zap, 
  Download, 
  Share2, 
  RefreshCw,
  Layers,
  Check,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock Themes
const themes = [
  { id: "cafe", name: "Modern Café", image: "☕" },
  { id: "nature", name: "Green Nature", image: "🌿" },
  { id: "studio", name: "Minimal Studio", image: "📸" },
  { id: "beach", name: "Summer Beach", image: "🏖️" },
  { id: "wood", name: "Rustic Wood", image: "🪵" },
  { id: "abstract", name: "AI Abstract", image: "🎨" },
];

export default function VisualizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themes[0].id);
  const [sliderPosition, setSliderPosition] = useState(50);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsDone(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setIsDone(false);
    }
  };

  const processImage = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
    }, 3500);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setIsDone(false);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-950 flex items-center gap-3">
            <Camera className="w-8 h-8 text-brand-600" />
            AI Background Visualizer
          </h1>
          <p className="text-brand-900/40 font-medium">Ubah latar belakang produk Anda menjadi profesional secara instan.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-brand-50 text-brand-600 border-brand-100 rounded-lg px-3 py-1.5 flex gap-2">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold">12 Kredit Tersisa</span>
          </Badge>
          <Button variant="outline" className="rounded-xl border-brand-100">
            <Info className="w-4 h-4 mr-2" />
            Bantuan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Editor */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-[2rem] overflow-hidden bg-white min-h-[500px] flex flex-col">
            <CardContent className="p-0 flex-grow flex flex-col">
              {!preview ? (
                /* Upload Area */
                <div 
                  className="flex-grow flex flex-col items-center justify-center p-12 cursor-pointer border-4 border-dashed border-brand-50 m-6 rounded-[1.5rem] hover:bg-brand-50/50 hover:border-brand-200 transition-all group"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-950 mb-2">Unggah Foto Produk</h3>
                  <p className="text-brand-900/40 text-center max-w-xs mb-8 font-medium">
                    Seret dan lepas gambar di sini, atau klik untuk memilih file dari komputer Anda.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-brand-900/20 uppercase tracking-widest">
                    <span>JPG</span>
                    <span>PNG</span>
                    <span>WEBP</span>
                    <span>MAX 10MB</span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              ) : (
                /* Editor/Processing Area */
                <div className="relative flex-grow flex flex-col">
                  {/* Toolbar */}
                  <div className="absolute top-4 left-4 right-4 z-20 flex justify-between">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="rounded-full bg-white/80 backdrop-blur-md shadow-sm border-white"
                      onClick={reset}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Ganti Foto
                    </Button>
                    <div className="flex gap-2">
                       {isDone && (
                         <>
                           <Button size="sm" className="rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/20">
                             <Download className="w-4 h-4 mr-2" />
                             Simpan HD
                           </Button>
                           <Button size="sm" variant="secondary" className="rounded-full bg-white/80 backdrop-blur-md shadow-sm border-white">
                             <Share2 className="w-4 h-4" />
                           </Button>
                         </>
                       )}
                    </div>
                  </div>

                  {/* Main Preview */}
                  <div className="flex-grow flex items-center justify-center bg-slate-50 p-8 relative overflow-hidden min-h-[400px]">
                    <AnimatePresence mode="wait">
                      {isProcessing ? (
                        /* Scanning Effect */
                        <motion.div 
                          key="processing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl"
                        >
                          <img src={preview} alt="Processing" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-brand-600/10" />
                          <motion.div 
                            initial={{ top: "0%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-brand-600 shadow-[0_0_20px_2px_rgba(35,84,255,0.8)] z-10"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-xl border border-white">
                               <RefreshCw className="w-5 h-5 text-brand-600 animate-spin" />
                               <span className="font-bold text-brand-950">AI sedang memproses...</span>
                            </div>
                          </div>
                        </motion.div>
                      ) : isDone ? (
                        /* Before/After Comparison */
                        <motion.div 
                          key="done"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative w-full max-w-2xl aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-white"
                        >
                          {/* After (With AI Background) */}
                          <div className="absolute inset-0 bg-brand-50 flex items-center justify-center overflow-hidden">
                             {/* Mock AI Background */}
                             <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-br from-brand-200 to-brand-500" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <img src={preview} alt="Result" className="w-[80%] h-[80%] object-contain drop-shadow-2xl" />
                             </div>
                             {/* Theme indicators */}
                             <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
                                <Badge className="bg-white/80 backdrop-blur-md text-brand-600 border-white">Tema: {themes.find(t => t.id === selectedTheme)?.name}</Badge>
                             </div>
                          </div>

                          {/* Before (Original) Overlay with clipping */}
                          <div 
                            className="absolute inset-0 pointer-events-none border-r-2 border-white shadow-xl"
                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                          >
                             <img src={preview} alt="Original" className="w-full h-full object-cover grayscale-[0.5] opacity-80" />
                             <div className="absolute top-6 left-6">
                                <Badge variant="outline" className="bg-black/20 backdrop-blur-sm text-white border-white/20">ORIGINAL</Badge>
                             </div>
                          </div>

                          {/* Slider Control */}
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={sliderPosition} 
                            onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                          />
                          
                          {/* Visible Slider Handle */}
                          <div 
                            className="absolute inset-y-0 z-20 pointer-events-none"
                            style={{ left: `${sliderPosition}%` }}
                          >
                            <div className="h-full w-1 bg-white shadow-lg relative">
                               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-brand-50">
                                  <div className="flex gap-0.5">
                                     <div className="w-1 h-3 bg-brand-200 rounded-full" />
                                     <div className="w-1 h-3 bg-brand-200 rounded-full" />
                                  </div>
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        /* Static Preview Before Processing */
                        <motion.div 
                          key="preview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl"
                        >
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom Action Bar */}
                  {!isDone && !isProcessing && (
                    <div className="p-6 bg-white border-t border-brand-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-brand-600" />
                         </div>
                         <div>
                            <p className="text-sm font-bold text-brand-950">Siap diproses</p>
                            <p className="text-xs text-brand-900/40">AI akan menghapus background & menambah pencahayaan.</p>
                         </div>
                      </div>
                      <Button 
                        size="lg" 
                        className="bg-brand-600 hover:bg-brand-700 text-white rounded-2xl px-8 shadow-xl shadow-brand-600/20 group"
                        onClick={processImage}
                      >
                        Proses Sekarang
                        <Sparkles className="ml-2 w-5 h-5 group-hover:scale-125 transition-transform" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings & Themes */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-brand-950 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  Pilih Tema Visual
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group",
                        selectedTheme === theme.id 
                          ? "border-brand-600 bg-brand-50/50" 
                          : "border-slate-50 hover:border-brand-200"
                      )}
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{theme.image}</div>
                      <p className={cn(
                        "text-sm font-bold",
                        selectedTheme === theme.id ? "text-brand-600" : "text-brand-900/60"
                      )}>
                        {theme.name}
                      </p>
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center">
                           <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50">
                <h3 className="text-sm font-bold text-brand-950 mb-4 uppercase tracking-widest opacity-30">Pengaturan Tambahan</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                     <span className="text-sm font-medium text-brand-900/70">Pencahayaan AI</span>
                     <div className="w-10 h-5 bg-brand-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                     </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                     <span className="text-sm font-medium text-brand-900/70">HD Upscaling</span>
                     <div className="w-10 h-5 bg-brand-200 rounded-full relative">
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" />
                     </div>
                  </div>
                </div>
              </div>

              <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100">
                 <p className="text-xs text-brand-900/60 leading-relaxed">
                   <span className="font-bold text-brand-600">Tips:</span> Untuk hasil terbaik, gunakan foto produk dengan pencahayaan yang cukup dan latar belakang yang kontras.
                 </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Creations */}
          <div>
             <h3 className="text-sm font-bold text-brand-950 mb-4 uppercase tracking-widest opacity-30 px-2">Hasil Terakhir</h3>
             <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-white rounded-xl border border-brand-100 overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                     <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Camera } from "lucide-react";
